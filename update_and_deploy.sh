#!/bin/bash
set -e

DIR="/Users/petekeating/ai-jobs-directory"
echo "=== Starting Daily AI Jobs Directory Update: $(date) ==="

# 1. Fetch latest jobs via Exa API
python3 "$DIR/ingest_jobs.py"

# 2. Generate GEO feed (llms.txt & schema_jobs.json)
python3 "$DIR/generate_llm_feed.py"

# 3. Sync to Next.js app directory
cp "$DIR/seeded_jobs.json" "$DIR/web/data/jobs.json"
cp "$DIR/llms.txt" "$DIR/web/public/llms.txt"
cp "$DIR/schema_jobs.json" "$DIR/web/public/schema_jobs.json"

# 4. Deploy update to Vercel
cd "$DIR/web"
/Users/petekeating/.npm-global/bin/vercel --prod --yes

echo "=== Successfully updated and deployed AI Jobs Directory ==="
