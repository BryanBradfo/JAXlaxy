#!/usr/bin/env python3
"""Tests for the --apply rewrite logic in health_check.py.

Runnable two ways:
    python scripts/test_health_check.py     # dependency-free self-check
    pytest scripts/test_health_check.py     # if pytest is installed

Focus is the README-mutating path (downgrade_target + rewrite_status_line),
since that is the only logic that edits the product by hand rather than
regenerating a derived artifact.
"""
from __future__ import annotations

import datetime as dt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from health_check import (  # noqa: E402
    ACTIVE,
    LEGACY,
    STABLE,
    Entry,
    RepoState,
    apply_downgrades,
    downgrade_target,
    parse_readme,
    rewrite_status_line,
    suggest,
)

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 7, 1, tzinfo=UTC)


def _months_ago(months: float) -> dt.datetime:
    return NOW - dt.timedelta(days=months * 30.44)


# --- rewrite_status_line -------------------------------------------------

def test_rewrite_green_to_yellow_keeps_rest_of_line():
    line = '* 🟢 **[jax](https://github.com/jax-ml/jax)** — Autograd + XLA. <img src="https://img.shields.io/github/stars/jax-ml/jax?style=flat">'
    out = rewrite_status_line(line, STABLE)
    assert out == '* 🟡 **[jax](https://github.com/jax-ml/jax)** — Autograd + XLA. <img src="https://img.shields.io/github/stars/jax-ml/jax?style=flat">'
    assert "🟢" not in out


def test_rewrite_only_touches_first_emoji():
    # Defensive: even if a status emoji appears inside the description, only the
    # leading badge is rewritten.
    line = "* 🟢 **[x](u)** — mentions 🟢 in prose"
    assert rewrite_status_line(line, LEGACY) == "* 🔴 **[x](u)** — mentions 🟢 in prose"


# --- downgrade_target ----------------------------------------------------

def _entry(current: str) -> Entry:
    return Entry(user="o", repo="r", current=current, line_no=1)


def test_archived_active_downgrades_to_legacy():
    e = _entry(ACTIVE)
    st = RepoState(stars=10, pushed_at=_months_ago(1), archived=True)
    assert downgrade_target(e, st, suggest(st, NOW)) == LEGACY


def test_stale_push_downgrades_active_to_stable():
    e = _entry(ACTIVE)
    st = RepoState(stars=10, pushed_at=_months_ago(24))  # >18mo, <36mo
    assert downgrade_target(e, st, suggest(st, NOW)) == STABLE


def test_recent_active_no_change():
    e = _entry(ACTIVE)
    st = RepoState(stars=10, pushed_at=_months_ago(2))
    assert downgrade_target(e, st, suggest(st, NOW)) is None


def test_never_promotes():
    # Legacy entry on a freshly-pushed repo would *suggest* 🟢, but downgrade_target
    # must refuse to upgrade — promotions are a manual call.
    e = _entry(LEGACY)
    st = RepoState(stars=10, pushed_at=_months_ago(1))
    assert downgrade_target(e, st, suggest(st, NOW)) is None


def test_errored_repo_skipped():
    # A rate-limited / 404 repo must never trigger a rewrite.
    e = _entry(ACTIVE)
    st = RepoState(error="HTTP 403 — rate limited")
    assert downgrade_target(e, st, suggest(st, NOW)) is None


# --- apply_downgrades (end-to-end file rewrite) --------------------------

def test_apply_downgrades_rewrites_file_and_mutates_entries():
    import tempfile

    readme = (
        "## Section\n"
        '* 🟢 **[jax](https://github.com/jax-ml/jax)** — stale one <img src="https://img.shields.io/github/stars/jax-ml/jax?x">\n'
        '* 🟢 **[flax](https://github.com/google/flax)** — fresh one <img src="https://img.shields.io/github/stars/google/flax?x">\n'
    )
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "README.md"
        path.write_text(readme, encoding="utf-8")
        entries = parse_readme(path)
        states = {
            ("jax-ml", "jax"): RepoState(stars=1, pushed_at=_months_ago(24)),   # stale → 🟡
            ("google", "flax"): RepoState(stars=1, pushed_at=_months_ago(2)),   # fresh → no change
        }
        changes = apply_downgrades(path, entries, states, NOW)

        # Exactly the stale entry was rewritten, in both the file and the model.
        assert [(e.user, old, new) for e, old, new in changes] == [("jax-ml", ACTIVE, STABLE)]
        out = path.read_text(encoding="utf-8")
        assert "🟡 **[jax]" in out
        assert "🟢 **[flax]" in out          # untouched
        assert out.endswith("\n")            # trailing newline preserved
        jax_entry = next(e for e in entries if e.user == "jax-ml")
        assert jax_entry.current == STABLE   # galaxy.json will now serialize 🟡


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for t in tests:
        t()
        print(f"  ok  {t.__name__}")
    print(f"\n{len(tests)} passed")
