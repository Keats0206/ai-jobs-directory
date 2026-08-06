#!/usr/bin/env python3
import json
import re

def clean_company_name(job):
    """Clean company names: fix corrupted entries and extract from URL when needed"""
    company = job.get("company", "")
    title = job.get("title", "")
    apply_url = job.get("apply_url", "")
    description = job.get("description", "")
    
    def sanitize_name(name):
        """Remove HTML, newlines, and excessive whitespace from name"""
        if not name:
            return ""
        # Take only first line if there are newlines
        if '\n' in name:
            name = name.split('\n')[0].strip()
        name = re.sub(r'[<>].*?[<>]', '', name)  # Remove HTML tags
        name = re.sub(r'  +', ' ', name)  # Collapse multiple spaces
        name = name.strip()
        # Remove common artifacts
        for artifact in ["Skip to main content", "Back to Careers", "Team", "Role", "Location", "Careers", "Contact", "New", "Create a Job Alert", "Back to Jobs"]:
            if artifact.lower() in name.lower():
                return ""
        return name
    
    # Fix specific corrupted patterns
    if company.startswith("AI Agents (Remote") or company.startswith("Remote"):
        # Extract from Ashby URL
        match = re.search(r"ashbyhq\.com/([a-z\-]+)/", apply_url)
        if match:
            return match.group(1).title()
    
    if "ES/UK only)" in company or "Remote Europe @" in company:
        # Extract company from title or URL
        match = re.search(r"@\s*([A-Za-z0-9\s]+?)(?:\s|$|,)", title)
        if match:
            return match.group(1).strip()
        match = re.search(r"ashbyhq\.com/([a-z\-]+)/", apply_url)
        if match:
            return match.group(1).title()
    
    if any(x in company for x in ["@", ")", "|", "only"]) and len(company) > 40:
        # Corrupted, try URL extraction
        match = re.search(r"(?:ashbyhq|lever|greenhouse)\.com/([a-z\-]+)/", apply_url)
        if match:
            slug = match.group(1)
            return " ".join(word.title() for word in slug.split("-"))
    
    # Extract from title if company is a title-like thing
    if company in title or any(x in company.lower() for x in ["engineer", "manager", "senior", "staff"]):
        # Company name is in title, extract it
        match = re.search(r"@\s*([A-Za-z][A-Za-z0-9\s]+?)(?:\s*$|\s*\(|\.)", title)
        if match:
            extracted = match.group(1).strip()
            if len(extracted) < 50 and extracted.count(" ") < 5:
                return extracted
    
    # If still looks corrupted, try URL
    if not company or company == "AI Startup" or len(company) > 60 or company.count(" ") > 8:
        # First try ashby slug
        match = re.search(r"ashbyhq\.com/([a-z0-9\%\-]+)/", apply_url)
        if match:
            slug = match.group(1).replace("%20", " ")
            company_name = " ".join(
                word.upper() if word.lower() in ["ai", "llm", "rag", "ml", "nlp"] else word.title()
                for word in slug.split("-") if word.strip()
            )
            if company_name and company_name != "AI Startup":
                return company_name
        
        # Try lever or greenhouse
        match = re.search(r"(?:lever|greenhouse)\.com/companies/([a-z0-9\%\-]+)/", apply_url)
        if match:
            slug = match.group(1).replace("%20", " ")
            company_name = " ".join(
                word.upper() if word.lower() in ["ai", "llm", "rag", "ml", "nlp"] else word.title()
                for word in slug.split("-") if word.strip()
            )
            if company_name and company_name != "AI Startup":
                return company_name
        
        # Try extracting from description (look for "About Us" section with company name)
        if description:
            # Look for company names in **Bold** format in description
            match = re.search(r"\*\*([A-Za-z0-9\s\-\.]+?)\*\*", description)
            if match:
                name = sanitize_name(match.group(1).strip())
                if len(name) < 50 and len(name) > 2 and name.lower() not in ["ai", "ml", "about us"]:
                    return name
            
            # Look for common company intro patterns
            patterns = [
                r"(?:^|[^\w])([A-Z][A-Za-z0-9\s\-\.]{2,40}) is the",
                r"Welcome to ([A-Z][A-Za-z0-9\s\-\.]{2,40})",
                r"(?:About )?([A-Z][A-Za-z0-9\s\-\.]{2,40})(?:\n|#)",
            ]
            for pattern in patterns:
                match = re.search(pattern, description)
                if match:
                    name = sanitize_name(match.group(1).strip())
                    if len(name) < 50 and len(name) > 2 and name.lower() not in ["ai", "ml"]:
                        return name
        
        # Try title extraction
        if title and "@" in title:
            match = re.search(r"@\s*([A-Za-z0-9\s\-\.]+?)(?:\s*$|\s*\(|\s*\||,)", title)
            if match:
                name = sanitize_name(match.group(1).strip())
                if len(name) < 50 and len(name) > 2 and name.count(" ") < 4:
                    return name
    
    return company

def main():
    # Load jobs
    with open("/Users/petekeating/ai-jobs-directory/web/data/jobs.json", "r") as f:
        jobs = json.load(f)
    
    print(f"Processing {len(jobs)} jobs...")
    
    # Count issues before
    ai_startup_count = sum(1 for j in jobs if j.get("company") == "AI Startup")
    corrupted_count = sum(1 for j in jobs if any(x in j.get("company", "") for x in ["@", ")", "|", "Remote", "only", "ES/UK"]))
    print(f"'AI Startup' entries: {ai_startup_count}")
    print(f"Corrupted entries: {corrupted_count}")
    
    fixed_count = 0
    for job in jobs:
        original = job.get("company", "")
        job["company"] = clean_company_name(job)
        # Also sanitize any corrupted entries
        if "\n" in job["company"]:
            job["company"] = job["company"].split("\n")[0].strip()
            if job["company"].lower() in ["team", "role", "location", "about", "careers", "back to careers"]:
                # Can't salvage, extract from URL
                match = re.search(r"ashbyhq\.com/([a-z\-]+)/", job.get("apply_url", ""))
                if match:
                    job["company"] = " ".join(word.title() for word in match.group(1).split("-"))
        if job["company"] != original:
            fixed_count += 1
    
    # Count after
    ai_startup_after = sum(1 for j in jobs if j.get("company") == "AI Startup")
    print(f"Fixed: {fixed_count} entries")
    print(f"'AI Startup' remaining: {ai_startup_after}")
    
    # Save back
    with open("/Users/petekeating/ai-jobs-directory/web/data/jobs.json", "w") as f:
        json.dump(jobs, f, indent=2)
    
    print("✓ Cleaned jobs.json saved")
    
    # Show top companies
    from collections import Counter
    companies = [j.get("company", "") for j in jobs if j.get("company") != "AI Startup"]
    print("\nTop companies (excluding 'AI Startup'):")
    for company, count in Counter(companies).most_common(15):
        print(f"  {count:3d}x {company}")

if __name__ == "__main__":
    main()
