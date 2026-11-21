#!/bin/bash
# Daily micro1 refresh, run by launchd on Pete's Mac (micro1 returns 403 to GitHub's runners).
# Works in its own clone so it never touches the working copy on the Desktop.
# Install: see docs/local-refresh.md
set -euo pipefail
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
CLONE="$HOME/.local/share/artificialjobs-refresh"
[ -d "$CLONE/.git" ] || git clone https://github.com/Keats0206/ai-jobs-directory "$CLONE"
cd "$CLONE"
# Wait up to 5 minutes for the network after wake, so a 7:20 run after sleep doesn't die on DNS.
for i in $(seq 1 30); do curl -s -m 5 -o /dev/null https://github.com && break; sleep 10; done
git fetch -q origin master
git reset -q --hard origin/master
echo "$(date -u +%FT%TZ) refreshing"
MICRO1_REFERRAL_CODE=f6cf7f5c-2a5b-4156-ac3e-e6dc8329426d python3 scripts/fetch_micro1_jobs.py
MERCOR_REFERRAL_CODE=cf493234-3d21-4e51-ad35-fdd15975e716 python3 scripts/fetch_mercor_jobs.py || echo "mercor refresh failed"
git add web/data/jobs.json web/data/data-partnerships.json
if ! git diff --cached --quiet; then
  git -c user.name='artificialjobs-refresh' -c user.email='keats0206@gmail.com' commit -qm 'Refresh micro1 and Mercor roles'
  git push -q origin HEAD:master
  echo "pushed $(git rev-parse --short HEAD)"
else
  echo "no changes"
fi
