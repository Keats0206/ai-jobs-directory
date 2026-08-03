import json
import os

def build_llms_txt(jobs):
    lines = [
        "# AI Engineering & LLM Job Board",
        "> Curated directory of remote AI, LLM, Machine Learning, and GenAI roles at top startups and tech companies.",
        "",
        "## Active Featured Roles",
        ""
    ]

    for job in jobs[:15]:
        title = job.get("title")
        company = job.get("company")
        salary = f"${job.get('salary_min', 150000):,}-${job.get('salary_max', 250000):,}"
        tags = ", ".join(job.get("tags", []))
        location = job.get("location", "Remote")
        url = job.get("apply_url")

        lines.append(f"- [{title} at {company}]({url}): {location} | Salary: {salary} | Tech Stack: {tags}")

    lines.extend([
        "",
        "## Search Queries & Taxonomy",
        "- Machine Learning Engineer Jobs",
        "- LLM Ops & Infrastructure Careers",
        "- AI Agent & RAG Developers",
        "- Remote AI Startup Jobs",
        "",
        "## Employer Submissions",
        "- Post a Featured AI Job ($99/mo): /post-job",
        "- Claim & Verify Startup Profile: /verify"
    ])

    return "\n".join(lines)

def build_json_ld(jobs):
    schema_items = []
    for job in jobs:
        item = {
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": job.get("title"),
            "description": job.get("description"),
            "identifier": {
                "@type": "PropertyValue",
                "name": job.get("company")
            },
            "hiringOrganization": {
                "@type": "Organization",
                "name": job.get("company")
            },
            "jobLocation": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "US"
                }
            },
            "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "USD",
                "value": {
                    "@type": "QuantitativeValue",
                    "minValue": job.get("salary_min"),
                    "maxValue": job.get("salary_max"),
                    "unitText": "YEAR"
                }
            },
            "directApply": True,
            "url": job.get("apply_url")
        }
        schema_items.append(item)
    return schema_items

def main():
    jobs_path = "/Users/petekeating/ai-jobs-directory/seeded_jobs.json"
    if not os.path.exists(jobs_path):
        print("No seeded_jobs.json found.")
        return

    with open(jobs_path, "r") as f:
        jobs = json.load(f)

    # 1. Output llms.txt
    llms_content = build_llms_txt(jobs)
    with open("/Users/petekeating/ai-jobs-directory/llms.txt", "w") as f:
        f.write(llms_content)

    # 2. Output schema_jobs.json (JSON-LD)
    json_ld_data = build_json_ld(jobs)
    with open("/Users/petekeating/ai-jobs-directory/schema_jobs.json", "w") as f:
        json.dump(json_ld_data, f, indent=2)

    print("Generated llms.txt and schema_jobs.json for Generative Engine Optimization (GEO)")

if __name__ == "__main__":
    main()
