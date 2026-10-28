#!/bin/bash
# Daily micro1 refresh, run by launchd on Pete's Mac (micro1 returns 403 to GitHub's runners).
# Works in its own clone so it never touches the working copy on the Desktop.
# Install: see docs/local-refresh.md
set -euo pipefail
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
CLONE="$HOME/.local/share/artificialjobs-refresh"
[ -d "$CLONE/.git" ] || git clone https://github.com/Keats0206/ai-jobs-directory "$CLONE"
cd "$CLONE"
git fetch -q origin master
git reset -q --hard origin/master
echo "$(date -u +%FT%TZ) refreshing"
MICRO1_REFERRAL_CODE=f6cf7f5c-2a5b-4156-ac3e-e6dc8329426d python3 scripts/fetch_micro1_jobs.py
git add web/data/jobs.json web/data/data-partnerships.json
if ! git diff --cached --quiet; then
  git -c user.name='artificialjobs-refresh' -c user.email='keats0206@gmail.com' commit -qm 'Refresh micro1 roles'
  git push -q origin HEAD:master
  echo "pushed $(git rev-parse --short HEAD)"
else
  echo "no changes"
fi
