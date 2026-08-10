#!/usr/bin/env python3
"""
Batch load jobs into Supabase using REST API
"""
import json
import os
import sys
import urllib.request
import urllib.error
import ssl
import time

ssl_context = ssl._create_unverified_context()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://pfpnpgmblszljcshztgk.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

def load_jobs_from_file(filepath):
    """Load jobs JSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def batch_insert_jobs(jobs, batch_size=50):
    """Insert jobs in batches"""
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/jobs"
    
    inserted = 0
    failed = 0
    
    for i in range(0, len(jobs), batch_size):
        batch = jobs[i:i+batch_size]
        
        # Transform jobs for DB insert
        payload = []
        for job in batch:
            payload.append({
                "title": job["title"][:200],
                "slug": job["title"][:50].lower().replace(" ", "-"),
                "location": job["location"][:100],
                "is_remote": job.get("is_remote", True),
                "job_type": job.get("job_type", "Full-time"),
                "salary_min": job.get("salary_min", 140000),
                "salary_max": job.get("salary_max", 220000),
                "tags": job.get("tags", ["AI"])[:5],
                "description": job["description"][:5000],
                "apply_url": job["apply_url"][:500],
                "company_id": None  # Will be NULL for now, can link later
            })
        
        # POST batch
        req = urllib.request.Request(
            url, 
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, context=ssl_context) as resp:
                result = resp.read()
                inserted += len(batch)
                print(f"  ✓ Batch {i//batch_size + 1}: Inserted {len(batch)} jobs")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"  ✗ Batch {i//batch_size + 1} failed: {e.code} - {error_body[:200]}")
            failed += len(batch)
        except Exception as e:
            print(f"  ✗ Batch {i//batch_size + 1} error: {e}")
            failed += len(batch)
        
        time.sleep(0.5)  # Rate limit
    
    return inserted, failed

def main():
    filepath = "/Users/petekeating/code/ai-jobs-directory/seeded_jobs.json"
    
    print(f"Loading jobs from {filepath}...")
    jobs = load_jobs_from_file(filepath)
    print(f"Loaded {len(jobs)} jobs")
    
    print(f"\nInserting into Supabase ({SUPABASE_URL})...")
    inserted, failed = batch_insert_jobs(jobs, batch_size=50)
    
    print(f"\nResults:")
    print(f"  Inserted: {inserted}")
    print(f"  Failed: {failed}")
    print(f"  Total: {len(jobs)}")

if __name__ == "__main__":
    main()
