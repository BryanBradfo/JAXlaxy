#!/usr/bin/env python3
"""JAXlaxy health check — audit each entry's 🟢/🟡/🔴 badge against GitHub state.

Parses ../README.md for list items that carry a status emoji (🟢/🟡/🔴) AND a
shields.io stars badge, fetches the linked repo's metadata from the GitHub API,
and flags entries whose status looks stale.

Usage:
    python scripts/health_check.py                 # stdout report
    python scripts/health_check.py --output health_report.md
    GITHUB_TOKEN=ghp_... python scripts/health_check.py  # higher rate limit
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

ACTIVE, STABLE, LEGACY = "🟢", "🟡", "🔴"
STATUS_RANK = {ACTIVE: 3, STABLE: 2, LEGACY: 1}

STATUS_RE = re.compile(r"(🟢|🟡|🔴)")
BADGE_RE = re.compile(r"shields\.io/github/stars/([^/?\s]+)/([^/?\s]+)\?")
ENTRY_RE = re.compile(r"^\s*\*\s")

# Thresholds (months since last push) — tuned to match the CONTRIBUTING.md status legend.
STALE_MONTHS = 18
ABANDONED_MONTHS = 36


@dataclass
class Entry:
    user: str
    repo: str
    current: str
    line_no: int


@dataclass
class RepoState:
    stars: int | None = None
    pushed_at: dt.datetime | None = None
    archived: bool = False
    error: str | None = None


def parse_readme(path: Path) -> list[Entry]:
    entries: list[Entry] = []
    for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not ENTRY_RE.match(line):
            continue
        status_m = STATUS_RE.search(line)
        badge_m = BADGE_RE.search(line)
        if status_m and badge_m:
            entries.append(
                Entry(
                    user=badge_m.group(1),
                    repo=badge_m.group(2),
                    current=status_m.group(1),
                    line_no=i,
                )
            )
    return entries


def fetch_repo(user: str, repo: str, token: str | None) -> RepoState:
    url = f"https://api.github.com/repos/{user}/{repo}"
    req = urllib.request.Request(url, headers={"User-Agent": "JAXlaxy-health-check"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.load(resp)
        pushed = data.get("pushed_at")
        return RepoState(
            stars=data.get("stargazers_count"),
            pushed_at=dt.datetime.fromisoformat(pushed.replace("Z", "+00:00")) if pushed else None,
            archived=bool(data.get("archived")),
        )
    except urllib.error.HTTPError as e:
        if e.code == 403:
            return RepoState(error="HTTP 403 — rate limited (set GITHUB_TOKEN)")
        if e.code == 404:
            return RepoState(error="HTTP 404 — repo moved or deleted")
        return RepoState(error=f"HTTP {e.code}")
    except Exception as e:
        return RepoState(error=str(e))


def suggest(state: RepoState, now: dt.datetime) -> str:
    if state.error or state.pushed_at is None:
        return "?"
    if state.archived:
        return LEGACY
    months = (now - state.pushed_at).days / 30.44
    if months > ABANDONED_MONTHS:
        return LEGACY
    if months > STALE_MONTHS:
        return STABLE
    return ACTIVE


def months_since(d: dt.datetime | None, now: dt.datetime) -> str:
    if d is None:
        return "—"
    return f"{(now - d).days / 30.44:.1f}mo"


def flag_for(entry: Entry, state: RepoState, sug: str) -> str:
    if state.error:
        # Broken links matter more than staleness — surface them first.
        return f"⚠️ {state.error}"
    if state.archived and entry.current != LEGACY:
        return "📦 archived — move to 🔴"
    if sug == "?":
        return ""
    # Only flag downgrades; a generous classification deserves a manual call,
    # not an automatic "upgrade" that ignores e.g. a library's declared EOL.
    if STATUS_RANK.get(sug, 0) < STATUS_RANK.get(entry.current, 0):
        return f"❗ suggest {entry.current} → {sug}"
    return ""


def render_report(entries: list[Entry], states: dict[tuple[str, str], RepoState]) -> tuple[str, int]:
    now = dt.datetime.now(dt.timezone.utc)
    lines = [
        "# JAXlaxy Health Report",
        "",
        f"_Generated: {now.isoformat(timespec='minutes')}_",
        "",
        f"Entries scanned: **{len(entries)}**  ·  Thresholds: 🟢→🟡 at {STALE_MONTHS}mo, 🟡→🔴 at {ABANDONED_MONTHS}mo.",
        "",
        "| Repo | Current | Last Push | Stars | Suggested | Flag |",
        "| --- | :---: | :---: | ---: | :---: | :--- |",
    ]
    flagged = 0
    for e in entries:
        state = states[(e.user, e.repo)]
        sug = suggest(state, now)
        flag = flag_for(e, state, sug)
        if flag:
            flagged += 1
        stars = str(state.stars) if state.stars is not None else "—"
        lines.append(
            f"| `{e.user}/{e.repo}` | {e.current} | {months_since(state.pushed_at, now)} "
            f"| {stars} | {sug} | {flag} |"
        )
    lines += ["", f"**Flagged: {flagged} / {len(entries)}**", ""]
    return "\n".join(lines), flagged


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Audit JAXlaxy entry classifications against GitHub state.")
    parser.add_argument("--readme", default="README.md", type=Path, help="Path to README.md")
    parser.add_argument("--output", type=Path, help="Write the Markdown report to this path")
    parser.add_argument("--delay", type=float, default=0.3, help="Seconds between API requests")
    args = parser.parse_args(argv)

    if not args.readme.exists():
        print(f"ERROR: README not found at {args.readme}", file=sys.stderr)
        return 2

    entries = parse_readme(args.readme)
    if not entries:
        print("No entries with status emoji + shields.io stars badge found.", file=sys.stderr)
        return 1

    token = os.environ.get("GITHUB_TOKEN")
    mode = "authenticated" if token else "anonymous — 60 req/hour limit"
    print(f"Scanning {len(entries)} entries ({mode})...", file=sys.stderr)

    states: dict[tuple[str, str], RepoState] = {}
    unique = sorted({(e.user, e.repo) for e in entries})
    for i, (user, repo) in enumerate(unique, 1):
        print(f"  [{i}/{len(unique)}] {user}/{repo}", file=sys.stderr)
        states[(user, repo)] = fetch_repo(user, repo, token)
        if i < len(unique):
            time.sleep(args.delay)

    report, flagged = render_report(entries, states)
    print(report)
    if args.output:
        args.output.write_text(report, encoding="utf-8")
        print(f"\nWrote: {args.output}  (flagged: {flagged})", file=sys.stderr)
    return 0 if flagged == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
