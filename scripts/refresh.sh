#!/usr/bin/env bash
# Refresh the JAXlaxy dataset in one shot: regenerate galaxy.json (the site's
# data), health_report.md (the human audit), and — with --apply — rewrite any
# flagged status downgrades (🟢→🟡→🔴) into README.md.
#
#   ./scripts/refresh.sh              # dry-run: refresh json + report, suggest only
#   ./scripts/refresh.sh --apply      # also rewrite downgrades into README.md
#
# After --apply, commit the changed README.md + galaxy.json; Vercel redeploys
# the Observatory on push, so the site (and its "Data updated" stamp) refreshes.
#
# Requires GITHUB_TOKEN — 75 repos exceed GitHub's 60 req/hour anonymous limit.
set -euo pipefail

# Run from the repo root regardless of where the script is invoked, so the
# README / galaxy.json / report paths below resolve correctly.
cd "$(dirname "$0")/.."

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN first (export GITHUB_TOKEN=ghp_...) — 75 repos exceed the anonymous rate limit}"

python scripts/health_check.py \
  --json observatory/public/galaxy.json \
  --output health_report.md \
  "$@"
