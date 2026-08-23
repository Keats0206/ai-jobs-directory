import json
import re
from pathlib import Path
from urllib.parse import urlparse

# Known URL-to-company mappings (domain → company name)
URL_COMPANY_MAP = {
    "anthropic.com": "Anthropic",
    "openai.com": "OpenAI",
    "cohere.ai": "Cohere",
    "cohere.com": "Cohere",
    "documents.cohere": "Cohere",
    "docs.cohere": "Cohere",
    "dashboard.cohere": "Cohere",
    "dynatrace.com": "Dynatrace",
    "nvidia.com": "Nvidia",
    "apple.com": "Apple",
    "mutualofomaha.com": "Mutual of Omaha",
    "workable.com": "Workable",
    "huggingface.co": "Hugging Face",
    "stability.ai": "Stability AI",
    "replit.com": "Replit",
    "figma.com": "Figma",
    "samsara.com": "Samsara",
    "instacart.com": "Instacart",
    "databricks.com": "Databricks",
    "airbnb.com": "Airbnb",
    "spotify.com": "Spotify",
    "klaviyo.com": "Klaviyo",
    "microsoft.ai": "Microsoft",
    "accenture.com": "Accenture",
    "netapp.com": "NetApp",
    "scale.com": "Scale AI",
    "unitedhealthgroup.com": "UnitedHealth Group",
    "qualcomm.com": "Qualcomm",
    "toyota.com": "Toyota",
    "snowflake.com": "Snowflake",
    "hitachienergy.com": "Hitachi Energy",
    "hexagon.com": "Hexagon",
    "cognizant.com": "Cognizant",
    "bnsf.com": "BNSF Railway",
    "elastic.co": "Elastic",
    "crossover.com": "Crossover",
    "yahooinc.com": "Yahoo",
    "wellfound.com": "Wellfound",
    "gevernova.com": "GE Vernova",
    "builtinsf.com": "Built In SF",
    "builtin.com": "Built In",
    "glassdoor.com": "Glassdoor",
    "naukri.com": "Naukri",
    "tealhq.com": "Teal",
    "calls9.com": "Calls9",
    "nalantis.be": "Nalantis",
    "sudhanva.me": None,  # personal site
    "hevcode.com": None,
    "zanwenfu.com": None,
    "luisenriquemartinez.com": None,
    "khairallah.onrender.com": None,
    "subash-pandey.com": None,
    "odeeb.dev": None,
    "hassantahir.com": None,
    "hardeep.cv": None,
    "l1r1.ai": "L1R1",
    "onrender.com": None,
    "zya.me": None,
    "totalh.net": None,
    "10001mb.com": None,
    "social-networking.me": None,
    "synergize.co": None,
    "infinityfree.me": None,
    "pragatishilclasses.org": None,
    "dejobs.org": None,
    "remoteai.io": None,  # aggregator
    "jobera.com": None,   # aggregator
    "hiretik.com": None,  # aggregator
    "winstargroup.org": "Winstar Group",
}

# Ashby known company name mappings
ASHBY_MAP = {
    "hatch": "Hatch",
    "cerebras": "Cerebras",
    "perplexity": "Perplexity",
    "baseten": "Baseten",
    "scale%20Army%20Careers": "Scale AI",
    "langchain": "LangChain",
    "litellm": "LiteLLM",
    "eloquentai": "Eloquent AI",
    "eloquent-ai": "Eloquent AI",
    "field-ai": "Field AI",
    "credal": "Credal",
    "tryjeeves": "Jeeves",
    "levelai": "Level AI",
    "jerry.ai": "Jerry.ai",
    "dnb": "Dun & Bradstreet",
    "plaud": "Plaud",
    "ctgt": "CTGT",
    "matchii": "Matchii",
    "elastix": "ElastixAI",
    "ifm-us": "Institute of Foundation Models",
    "appliedintuition": "Applied Intuition",
    "andurilindustries": "Anduril Industries",
}

# Greenhouse known company name mappings
GREENHOUSE_MAP = {
    "aloyoga": "ALO",
    "andurilindustries": "Anduril Industries",
    "blacksky": "BlackSky",
    "opswat": "OPSWAT",
    "flagshippioneeringinc": "Flagship Pioneering",
    "phdata": "Phdata",
    "figureai": "Figure AI",
    "abnormalsecurity": "Abnormal Security",
    "wayve": "Wayve",
    "cribl": "Cribl",
    "recogni": "Recogni",
    "formlabs": "Formlabs",
    "wargamingen": "Wargaming",
    "nurix": "Nurix",
    "avepoint": "AvePoint",
    "sertis": "Sertis",
    "simplepractice55": "SimplePractice",
    "brightai": "BrightAI",
    "c3iot": "C3 IoT",
    "crunchyroll": "Crunchyroll",
    "spacex": "SpaceX",
    "faire": "Faire",
    "airbnb": "Airbnb",
}

# Lever known company name mappings
LEVER_MAP = {
    "egen": "Egen",
    "appzen": "AppZen",
    "kubra": "Kubra",
    "influur": "Influur",
    "collate": "Collate",
    "aifund": "AI Fund",
    "rivr": "RIVR",
    "hive": "Hive",
    "protolabs": "Protolabs",
    "tryjeeves": "Jeeves",
    "kumo": "Kumo AI",
    "curai": "Curai",
    "tri": "Toyota Research Institute",
    "zoox": "Zoox",
    "onit": "Onit",
    "infinitepl": "InfinitePL",
    "klearnow": "KlearNow.ai",
    "cscgeneration-2": "CSC Generation",
    "great-gray-group": "Great Gray Group",
    "bluesight": "Bluesight",
    "woven-by-toyota": "Woven by Toyota",
    "quantco-": "QuantCo",
    "eudia": "Eudia",
}


def extract_company_from_url(url):
    """Extract company name from apply URL patterns."""
    if not url:
        return None
    
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    
    # Strip www. and other common prefixes
    domain_base = re.sub(r'^(www\.|careers\.|jobs\.|boards\.)', '', domain)
    
    # Check known domain mappings (exact and substring)
    for known_domain, company in URL_COMPANY_MAP.items():
        if known_domain in domain or domain_base == known_domain:
            return company
    
    # Extract from Ashby (jobs.ashbyhq.com/<company>/...)
    if "ashbyhq.com" in domain:
        path_parts = [p for p in parsed.path.split("/") if p]
        if path_parts:
            company = path_parts[0]
            company = re.sub(r'[_-]inc\.?$', '', company, flags=re.IGNORECASE).strip('_-')
            if company.lower() in {k.lower(): k for k in ASHBY_MAP}:
                return ASHBY_MAP.get(company.lower(), company)
            if company and not any(c.isupper() for c in company[1:]):
                company = company.replace('-', ' ').replace('_', ' ')
                company = ' '.join(w.capitalize() if w.islower() else w for w in company.split())
            return company
    
    # Extract from Greenhouse
    if "greenhouse.io" in domain:
        path_parts = [p for p in parsed.path.split("/") if p]
        if path_parts:
            company = path_parts[0]
            if company.lower() in {k.lower(): k for k in GREENHOUSE_MAP}:
                return GREENHOUSE_MAP.get(company.lower(), company)
            return company.replace('-', ' ').title()
    
    # Extract from Lever
    if "lever.co" in domain:
        path_parts = [p for p in parsed.path.split("/") if p]
        if path_parts:
            company = path_parts[0]
            if company.lower() in {k.lower(): k for k in LEVER_MAP}:
                return LEVER_MAP.get(company.lower(), company)
            return company.replace('-', ' ').title()
    
    # Extract from Indeed
    if "indeed.com" in domain:
        return None
    
    # Extract from LinkedIn
    if "linkedin.com" in domain:
        path_parts = [p for p in parsed.path.split("/") if p]
        if "company" in path_parts:
            idx = path_parts.index("company")
            if idx + 1 < len(path_parts):
                return path_parts[idx + 1].replace('-', ' ').title()
        return None
    
    # Extract from Workable
    if "workable.com" in domain or "jobs.workable" in domain:
        path_parts = [p for p in parsed.path.split("/") if p]
        if path_parts and path_parts[0] not in ('en', 'view', 'job', 'apply'):
            return path_parts[0].replace('-', ' ').title()
    
    # Extract from Freshteam
    if "freshteam.com" in domain:
        path_parts = domain.split('.')
        if path_parts[0] not in ('www', 'jobs', 'careers', ''):
            return path_parts[0].replace('-', ' ').title()
    
    # For company career pages with subdomain
    if "careers." in domain or "/careers" in parsed.path or "/jobs" in parsed.path:
        subdomain = domain.split('.')[0]
        if subdomain not in ('www', 'careers', 'jobs', 'boards', 'jobs', ''):
            return subdomain.replace('-', ' ').title()
    
    # Y Combinator
    if "ycombinator.com" in domain:
        path_parts = [p for p in parsed.path.split("/") if p]
        if "companies" in path_parts:
            idx = path_parts.index("companies")
            if idx + 1 < len(path_parts):
                return path_parts[idx + 1].replace('-', ' ').title()
    
    return None


def clean_company_name(name, url=None):
    """Final cleanup of company names."""
    if not name or name == "AI Startup" or name == "AI Startups":
        return None
    
    # Remove common junk suffixes
    name = re.sub(r'\s*[-–|]\s*$', '', name)
    name = re.sub(r'\s*@\s*.*$', '', name)
    name = re.sub(r'\s*\(Remote[^)]*\)', '', name, flags=re.IGNORECASE)
    name = name.strip()
    
    # If too short or clearly not a company name
    if len(name) < 2 or name.lower() in ('at', 'in', 'the', 'a', 'an', 'is', 'open', 'jobs', 'careers', 'hiring'):
        return None
    
    # Filter out non-companies
    non_company = {
        'remote', 'remote / usa', 'remote usa', 'us', 'usa', 'uk', 'canada',
        'united states', 'worldwide', 'europe', 'fully remote',
        'apply now', 'hiring now', 'now hiring', 'click here',
        'flexgen',
    }
    if name.lower() in non_company:
        return None
    
    # Clean up suffixes
    name = re.sub(r'\s*(Inc|LLC|Ltd|Corp|Corporation)\.?\s*$', '', name, flags=re.IGNORECASE).strip()
    
    if re.match(r'^(job application for|careers at|jobs at|careers \|) ', name, re.IGNORECASE):
        return None
    
    return name


def extract_from_title(title):
    """Try to extract company name from job title."""
    if not title:
        return None
    
    # "Role at Company" pattern
    if ' at ' in title.lower():
        parts = title.split(' at ')
        if len(parts) >= 2:
            candidate = parts[-1].strip()
            candidate = re.sub(r'\s*[-–|@].*$', '', candidate)
            candidate = re.sub(r'\s*\([^)]*\)$', '', candidate)
            candidate = candidate.strip()
            if len(candidate) > 2 and candidate.lower() not in ('remote', 'us', 'uk', 'remote / usa'):
                return clean_company_name(candidate)
    
    # "@ Company" pattern  
    if ' @ ' in title:
        parts = title.split(' @ ')
        if len(parts) >= 2:
            candidate = parts[-1].strip()
            candidate = re.sub(r'\s*[-–|].*$', '', candidate)
            candidate = re.sub(r'\s*\([^)]*\)$', '', candidate)
            candidate = candidate.strip()
            if len(candidate) > 2:
                return clean_company_name(candidate)
    
    return None


def extract_from_description(desc):
    """Try to extract company name from description."""
    if not desc:
        return None
    
    # Try common patterns
    patterns = [
        r'(?:at|with|join)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s*(?:is|are|,|\.|\(|in|from|we|our|they|the|currently))',
        r'([A-Z][A-Za-z0-9\s&.]+)\s+is\s+(?:a|an|the)\s+(?:leading|hiring|looking)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, desc)
        if match:
            candidate = match.group(1).strip()
            skip_words = {'the', 'a', 'an', 'this', 'our', 'their', 'all', 'we', 'you', 'i'}
            if len(candidate) > 2 and candidate.lower() not in skip_words:
                cleaned = clean_company_name(candidate)
                if cleaned:
                    return cleaned
    
    return None


def main():
    jobs_path = Path(__file__).parent.parent / 'data' / 'jobs.json'
    
    with open(jobs_path, 'r') as f:
        jobs = json.load(f)
    
    print(f"Processing {len(jobs)} jobs...")
    
    cleaned = 0
    still_bad = 0
    
    for job in jobs:
        original = job['company']
        
        # Skip if company already looks legitimate
        if original and original != "AI Startup" and original != "AI Startups" and not re.match(r'^AI (Startup|Agent)', original):
            if not re.match(r'^https?://', original) and len(original) > 2:
                continue
        
        url = job.get('apply_url', '')
        company = extract_company_from_url(url)
        
        if company:
            company = clean_company_name(company, url)
        
        # Fallback: try to extract from title
        if not company:
            company = extract_from_title(job.get('title', ''))
        
        # Fallback: try to parse from description
        if not company:
            company = extract_from_description(job.get('description', ''))
        
        if company:
            job['company'] = company
            cleaned += 1
        else:
            still_bad += 1
    
    # Write back
    with open(jobs_path, 'w') as f:
        json.dump(jobs, f, indent=2)
    
    print(f"✓ Cleaned {cleaned} company names")
    print(f"⚠ {still_bad} jobs still have 'AI Startup' or bad company names")
    print(f"Total jobs: {len(jobs)}")


if __name__ == '__main__':
    main()