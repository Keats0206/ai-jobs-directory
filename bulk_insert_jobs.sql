
INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer', 
  'ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'Jobs

- Hatch
- Back to Hatch’s Job Listings

# Job not found

The job you requested was not found.

View all open positions

Jobs
* [Hatch
](https://usehatchapp.com)
* [](/hatch)
*
# Job not found
The job you requested was not found.
[ View all open positions](/hatch)',
  'https://jobs.ashbyhq.com/hatch/302d3f5d-2d99-4962-8ce3-4480cd4330d5'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer Backend (Remote', 
  'ai-engineer-backend-(remote',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['RAG', 'Agent'],
  'AI Engineer Backend (Remote - ES/UK only) @ Quadrivia
* [![Quadrivia](https://app.ashbyhq.com/api/images/org-theme-wordmark/8f2b1aa4-f7dd-4aa1-a2a9-3d28c1796a9d/7f011008-73a6-4cd8-9b79-8b8a9bd84487/a92c9340-d1bf-490e-a385-0daa90caa876.png)](https://quadrivia.ai/)
* [](https://jobs.ashbyhq.com/quadrivia)
*
# AI Engineer Backend (Remote - ES/UK only)
## Location
Remote; Barcelona; London
## Employment Type
Full time
## Location Type
Remote
## Department
Technical
# About Us
Quadrivia is the health technology company behind Q, a comprehensive, controllable, and customizable assistant AI built by clinicians, for clinicians. Addressing the urgent shortage of healthcare professionals, Q provides real-time, personal, and reliable support for clinical tasks across the care continuum. Designed for providers, payers, and pharmaceutical companies, Q is easy to customize and integrates seamlessly into workflows, delivering precise assistance across the care spectrum.
## The Role
You''ll build and r...',
  'https://jobs.ashbyhq.com/quadrivia/3b40be91-27fc-4148-a1a3-565d8211dd5c'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer', 
  'ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'AI Engineer - Remote Europe @ Reedsy
* [![Reedsy](https://app.ashbyhq.com/api/images/org-theme-wordmark/5d5163cc-460a-4be6-9a3f-b98517044e8d/f7452e18-19d3-4888-aa76-149e219ff16d/f913d3ab-60f2-4d86-8610-e923d73f457a.png)](https://reedsy.com/)
* [](https://jobs.ashbyhq.com/reedsy)
*
# AI Engineer - Remote Europe
## Location
United Kingdom; France; Netherlands; Poland; Portugal; Remote; Spain; United Kingdom
## Employment Type
Full time
## Location Type
Remote
## Department
Engineering
## Compensation
* €70K – €120K • 0% – 0.2%
**About Reedsy**
We’re here to give authors the tools and resources they need to create beautiful books. Our marketplace gathers the industry''s best publishing professionals — the likes of Neil Gaiman''s editor, Nora Roberts'' book marketer, and GRRM’s cover designer.
We’ve grown to a community of 5,000,000 authors, and transformed the way people write and publish their book. Want to hop on board and help us get to our next destination? Cool, keep reading!
**Responsi...',
  'https://jobs.ashbyhq.com/reedsy/b043b550-02b7-416f-8969-5db8fd9dc8ee'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Sr. Staff AI Engineer (Remote) @ Rula', 
  'sr.-staff-ai-engineer-(remote)-@-rula',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'Sr. Staff AI Engineer (Remote) @ Rula

- Back to Rula’s Job Listings

# Sr. Staff AI Engineer (Remote)

## Location

Remote - United States

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## Compensation

- $229,169 – $283,800 • Offers Equity

The range above represents the minimum and maximum for starting total cash in this role. The total cash offered is based on a combination of factors such as individual proficiency, pay equity, and experience level.

We believe that mental health is just as important as physical health. We recognize that mental health issues can be complex and multifaceted, and we are dedicated to treating the whole person, not just the symptoms.

We aim to create a world where mental health is no longer stigmatized or marginalized, but rather is embraced as an integral part of one''s overall well-being.

We believe that by providing quality care that is both evidence-based and compassionate, we can empower individuals to take ...',
  'https://jobs.ashbyhq.com/rula/f2424794-c819-4f53-a8af-83322e617acb'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior AI Engineer @ DualEntry', 
  'senior-ai-engineer-@-dualentry',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'Rust'],
  '# Senior AI Engineer @ DualEntry

**Location:** Remote (EU, LATAM)
**Type:** FullTime
**Compensation:** $140K – $200K • $45K – $65K Equity

## About DualEntry

Founded in 2024, DualEntry is one of the world’s fastest-growing AI startups.

 At DualEntry, the future of finance is being written today. ERP is one of the largest fintech markets in the world ($220,000,000,000+). Yet, tens of thousands of companies are still using on-premise systems, and the industry has not seen new entrants in more than 30 years.

 Our AI-native ERP lets accounting teams achieve more in less time. $5M-ARR businesses to NYSE-listed companies trust DualEntry to automate away manual data entry work with AI. We’re finally making the one-person finance team a reality and putting the pain of legacy ERPs from the 1990’s in the past.

 We operate with urgency and ownership. We move fast.

 
## Why This Role Matters Now

Since starting 18 months ago, we’ve raised $100,000,0000+ from world-class investors such as Lig...',
  'https://jobs.ashbyhq.com/dualentry/7acbe603-8fbc-4249-942a-ee45eb273ea6'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Staff AI Engineer', 
  'staff-ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'Staff AI Engineer - AI Platform @ ClickUp

Staff AI Engineer - AI Platform @ ClickUp',
  'https://jobs.ashbyhq.com/clickup/143d20ff-cc53-4dc0-bc8b-09a7c1bddf87?embed=js'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Full Stack AI Engineer @ Infinity', 
  'full-stack-ai-engineer-@-infinity',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Agent', 'Python'],
  '# Full Stack AI Engineer @ Infinity

**Location:** Remote
**Type:** FullTime
**Workplace:** Remote

### AI Engineer (Contract-to-Hire)

**Location:** Remote (Global, EST working hours)
**Start Date:** Rolling

Please apply using the provided form, candidates who directly email will not be considered.

#### About The Project

We''re building AI-native engineering team within **Infinity**, a holding company building full-stack AI businesses. We support portfolio companies by:

- Rapidly prototyping new product ideas to validate markets

- Providing flex capacity during high-growth phases

- Maintaining and evolving the **Gravity **our in house software factory and agent hub that we use to build all software.

We’re not a dev shop. We’re a surgical team of builders who move fast, reduce ambiguity, and create leverage across a network of founders building with AI at the core.

#### The Role

We’re looking for **scrappy, sharp, execution-focused engineers** who thrive in high-autonomy enviro...',
  'https://jobs.ashbyhq.com/infinity-constellation/30fac65e-bcd7-4ecc-9477-fc7c8c8a9f52'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Lead AI Engineer @ Sierra Studio', 
  'lead-ai-engineer-@-sierra-studio',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Agent'],
  'Lead AI Engineer @ Sierra Studio

- Back to Sierra Studio’s Job Listings

# Lead AI Engineer

## Location

Brazil (Remote)

## Employment Type

Full time

## Location Type

Remote

## Department

Sierra Studio Jobs

Lead AI Engineer

🏔️ About Sierra Studio

Sierra Studio is an AI engineering studio and startup incubator – we turn our customers'' ideas into reality! We''re based in Los Angeles, but our teammates live all around the world. We create products across all areas of software — from web and mobile apps to cutting-edge work at the forefront of AI and large language models.

💼 About The Role

As a Lead AI Engineer, you''ll lead engineering for one or more AI initiatives at Sierra. You''ll architect the stack, prompt engineer LLMs to solve real world problems, and work with your teammates to ship great products you''re proud of. You''ll work closely with product managers, designers, and other engineers to take products from idea to production. As an early employee at a startup, you''ll ...',
  'https://jobs.ashbyhq.com/sierra-studio/81770149-3a94-4e22-8678-dac4a7a6d9ba'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Forward Deployed AI Engineer @ Sardine', 
  'forward-deployed-ai-engineer-@-sardine',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Agent', 'Rust'],
  'Forward Deployed AI Engineer @ Sardine

- Back to Sardine’s Job Listings

# Forward Deployed AI Engineer

## Location

United States; Canada

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## Compensation

- USEstimated base salary $160K – $220K • Offers Equity
- CanadaEstimated base salary CA$180K – CA$260K • Offers Equity

The compensation offered for this role will depend on various factors, including the candidate''s location, qualifications, work history, and interview performance, and may differ from the stated range.

Who we are:

Sardine is the leading agentic risk platform for fighting financial crime. Our integrated solution unifies data across risk teams to help organizations stop fraud in real time, prevent AI-driven attacks, and automate fraud and AML operations. Sardine’s platform is strengthened by one of the fastest-growing fraud consortiums in the market, spanning more than 6 billion profiled devices, 800 million consumers, and 3 mi...',
  'https://jobs.ashbyhq.com/sardine/4ff32b5d-13c6-4024-826c-04ed2881d688'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Applied AI Engineer – Systems & Reliability (remote/Berlin', 
  'applied-ai-engineer-–-systems-&-reliability-(remot',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Rust'],
  '# Applied AI Engineer – Systems & Reliability (remote/Berlin-based) @ HiPeople

**Location:** World
**Type:** FullTime
**Workplace:** Remote

[HiPeople](https://www.hipeople.io/) is the AI Hiring Platform that takes care of screening, interviews, assessments, and references. So recruiting teams can focus on what matters most. People.

We work with some of the world''s leading brands, including the NFL, Zapier, Celonis, and DAZN. and are backed by leading investors and operators such as: Moonfire founder Mattias Ljungman, Capnamic, Cherry, André Christ (LeanIX, an SAP company), Mirko Novakovic (Founder Instana/Dash0), Micha Hernandez (Fiberplane), and others.

We’re hiring an **Applied AI Engineer** to build the backbone of how we ensure quality, reliability, and trust in our AI systems as we scale toward **$10M ARR and beyond**.

You’ll work directly with founders and play a central role in making sure our AI products are robust, measurable, and enteprise-production-ready. This role is ...',
  'https://jobs.ashbyhq.com/hipeople-official/6c330d7b-7c6d-4993-8893-b58b5289d442'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'LLM Engineer III', 
  'llm-engineer-iii',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Agent'],
  'Job Application for LLM Engineer III at Crunchyroll, LLC
![Banner](https://recruiting.cdn.greenhouse.io/job_board_renderer/job_board_configurations/banners/000/001/007/original/GH_Banner_(1).png?1743471281)
![Crunchyroll, LLC Logo](https://recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/000/000/394/original/CR-LOGO-RGB-HORIZONTAL-REGISTERED_Orange_(1).png?1743471405)
[Back to jobs](https://www.crunchyroll.com/about/work/index.html)
# LLM Engineer III
Hyderabad, Telangana, India
Apply
## About Crunchyroll
Founded by fans, Crunchyroll delivers the art and culture of anime to a passionate community. We super-serve over 100 million anime and manga fans across 200+ countries and territories, and help them connect with the stories and characters they crave. Whether that experience is online or in-person, streaming video, theatrical, games, merchandise, events and more, it’s powered by the anime content we all love.
Join our team, and help us shape the future of anime!
## **...',
  'https://boards.greenhouse.io/crunchyroll/jobs/7014513?gh_jid=7014513'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Mission Integration Engineer, Applied Computing (Starshield)', 
  'job-application-for-mission-integration-engineer,-',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Fine-tuning'],
  'Job Application for Mission Integration Engineer, Applied Computing (Starshield) at SpaceX

# Mission Integration Engineer, Applied Computing (Starshield)

Hawthorne, CA

Apply

SpaceX was founded under the belief that a future where humanity is out exploring the stars is fundamentally more exciting than one where we are not. Today SpaceX is actively developing the technologies to make this possible, with the ultimate goal of enabling human life on Mars.

MISSION INTEGRATION ENGINEER (STARSHIELD)

Special Programs leverages technology and launch capability to support national security efforts. Starshield, within Special Programs, is designed for government use, with an initial focus on earth observation, communications, and hosted payloads.

The data applications team is building highly reliable mission-critical AI solutions supporting Starshield use-cases. You will drive the development and enhancement of core applications while collaborating cross-functionally to deliver end-to-end p...',
  'https://boards.greenhouse.io/spacex/jobs/8320099002?gh_jid=8320099002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Machine Learning Engineer, Customer Support ...', 
  'senior-machine-learning-engineer,-customer-support',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Fine-tuning', 'Rust'],
  'Senior Machine Learning Engineer, Customer Support Engineering - Careers at Airbnb

# Senior Machine Learning Engineer, Customer Support Engineering

China

Role overview Application

Airbnb was born in 2007 when two hosts welcomed three guests to their San Francisco home, and has since grown to over 5 million hosts who have welcomed over 2 billion guest arrivals in almost every country across the globe. Every day, hosts offer unique stays and experiences that make it possible for guests to connect with communities in a more authentic way.

Your Location:

This position is CHINA BASED. The role may include occasional work at an Airbnb office or attendance at offsites, as agreed to with your manager. Your recruiter will inform you what cities you are able to work from depending on your personal legal working identity and Airbnb internal policies.

The Community You Will Join:

Machine Learning and Artificial Intelligence are at the heart of the Airbnb product. From Trust to Payments, an...',
  'https://boards.greenhouse.io/airbnb/jobs/7975743'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Principal Applied AI / ML Engineer', 
  'job-application-for-principal-applied-ai-/-ml-engi',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Agent', 'Fine-tuning'],
  'Job Application for Principal Applied AI / ML Engineer at Faire

# Principal Applied AI / ML Engineer

San Francisco, CA

Apply

About Faire

Faire is a technology wholesale platform built on the belief that the future is local. Independent retailers around the globe collectively represent a multi-hundred-billion-dollar wholesale market that has historically been fragmented and offline. At Faire, we''re using the power of tech, data, and machine learning to connect this thriving community of entrepreneurs across the globe. Picture your favorite boutique in town — we help them discover the best products from around the world to sell in their stores. With the right tools and insights, we believe that we can level the playing field so businesses can grow and local communities can thrive.

We’re looking for smart, resourceful and passionate people to join us as we power the shop local movement. If you believe in community, come join ours.

### About this role:

We are seeking a Principal AI...',
  'https://boards.greenhouse.io/faire/jobs/8456064002?gh_jid=8456064002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Sr. Software Engineer (Platform Team)', 
  'job-application-for-sr.-software-engineer-(platfor',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Infrastructure', 'Rust'],
  'Job Application for Sr. Software Engineer (Platform Team) at SpaceX

# Sr. Software Engineer (Platform Team)

Hawthorne, CA

Apply

SpaceX was founded under the belief that a future where humanity is out exploring the stars is fundamentally more exciting than one where we are not. Today SpaceX is actively developing the technologies to make this possible, with the ultimate goal of enabling human life on Mars.

SR. SOFTWARE ENGINEER (PLATFORM TEAM)

The Platform Team builds the foundational tooling and security infrastructure that empowers every team at SpaceX to harness AI effectively. This team creates secure, scalable gateways and proxy systems that allow engineers and operators across the company to write code faster, perform advanced data analysis, connect AI to their daily tools and problems, and turn ideas into deployed solutions with confidence. By onboarding new frontier models, expanding compute capacity, optimizing proxy efficiency for logging and control, and building shared...',
  'https://boards.greenhouse.io/spacex/jobs/8495853002?gh_jid=8495853002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Staff Software Engineer - AI Assistant', 
  'job-application-for-staff-software-engineer---ai-a',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'Job Application for Staff Software Engineer - AI Assistant at Harness

Back to jobs

# Staff Software Engineer - AI Assistant

Bengaluru, Karnataka, India

Apply

Harness is the AI Software Delivery Platform company, led by technologist and entrepreneur Jyoti Bansal (founder of AppDynamics, acquired by Cisco for $3.7B). Harness has raised approximately $570M in funding and is valued at $5.5B, backed by leading investors including Goldman Sachs, Menlo Ventures, IVP, Unusual Ventures, Citi Ventures, and more. As AI accelerates code creation, the real bottleneck has shifted to everything after the code – testing, deployments, application security, reliability, compliance, and cost optimization. Harness brings AI and automation to this “outer loop,” helping teams ship software faster while maintaining security and governance throughout the entire software delivery lifecycle.

Powered by Harness AI and the Software Delivery Knowledge Graph, the Harness Platform applies deep context and inte...',
  'https://boards.greenhouse.io/embed/job_app?for=harnessinc&token=4497718007'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Back', 
  'back',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['RAG', 'Agent'],
  'Skip to content

Neo4j to acquire GraphAware, launch new open-standards intelligence analysis solutions | Read more

 Menu

 Search Close Menu

- Products FULLY-MANAGED AuraDB Store and query connected data at scale Virtual Graph Create and query a knowledge graph on existing data Aura Graph Analytics Run graph algorithms on any data, any cloud Aura Agent Build and deploy context-aware agents fast SELF-MANAGED Graph Database Store connected data with a graph database Graph Data Science Run graph algorithms on connected data Enterprise Studio Securely query, explore, and visualize data Fleet Manager Manage all your Neo4j deployments from one place AI CAPABILITIES Knowledge layer AI systems GraphRAG 
- Solutions INDUSTRIES Financial services Healthcare & life sciences Retail Telecommunications US federal government TECHNICAL PATTERNS Digital twin Knowledge graphs Metadata management Pattern matching USE CASES AI systems Customer experiences Data privacy, risk, & compliance Fraud Identify...',
  'https://boards.greenhouse.io/neo4j/jobs/4626134006?gh_jid=4626134006'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for ML Engineering Intern - Nebula', 
  'job-application-for-ml-engineering-intern---nebula',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG'],
  'Job Application for ML Engineering Intern - Nebula at Symbl.ai

# ML Engineering Intern - Nebula

at Symbl.ai(View all jobs)

United States

Elevating the quality of human life through every conversation

About the Team:At Symbl.ai, we are a trailblazing force in the world of artificial intelligence, committed to pushing the boundaries of technology. Our latest breakthrough - the Nebula LLM - represents the cutting edge of innovation, and we''re looking for dedicated Machine Learning Engineering Interns to be part of this journey.About the Role:As a Machine Learning Engineering Intern at Symbl.ai, you will immerse yourself in the dynamic world of Nebula, our pioneering large language model (LLM). You will work at the forefront of machine learning, tackling real-world challenges and developing innovative solutions that shape the future of AI and language technology.

Highlights of the ML Engineering Intern Role at Symbl.ai:

Join a collaborative, agile environment that fosters innovation...',
  'https://boards.greenhouse.io/embed/job_app?for=symblai47&token=5026823004'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Senior ML Engineer (AI Research)', 
  'job-application-for-senior-ml-engineer-(ai-researc',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['RAG', 'Agent', 'Infrastructure'],
  'Job Application for Senior ML Engineer (AI Research) at Nebius

# Senior ML Engineer (AI Research)

Amsterdam, Netherlands; Israel; Remote - Europe; United Kingdom

Apply

About Nebius:

Nebius is leading a new era in cloud infrastructure for the global AI economy. We are building a full-stack AI cloud platform that supports developers and enterprises from data and model training through to production deployment, without the cost and complexity of building large in-house AI/ML infrastructure.

Built by engineers, for engineers. From large-scale GPU orchestration to inference optimization, we own the hard problems across compute, storage, networking and applied AI.

Listed on Nasdaq (NBIS) and headquartered in Amsterdam, we have a global footprint with R&D hubs across Europe, the UK, North America and Israel. Our team of 1,500+ includes hundreds of engineers with deep expertise across hardware, software and AI R&D.

### The role

This role is for Nebius AI R&D, a team focused on applied...',
  'https://boards.greenhouse.io/embed/job_app?for=nebius&token=4704805101'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Deployed AI Engineer', 
  'job-application-for-deployed-ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Infrastructure'],
  'Job Application for Deployed AI Engineer at Helsing

# Deployed AI Engineer

Berlin; London; Munich; Paris; Stockholm; Tallinn

Apply

## Who we are

Helsing is a defence AI company. Our mission is to protect our democracies. We aim to achieve technological leadership, so that open societies can continue to make sovereign decisions and control their ethical standards.

As democracies, we believe we have a special responsibility to be thoughtful about the development and deployment of powerful technologies like AI. We take this responsibility seriously.

We are an ambitious and committed team of engineers, AI specialists and customer-facing programme managers. We are looking for mission-driven people to join our European teams – and apply their skills to solve the most complex and impactful problems. We embrace an open and transparent culture that welcomes healthy debates on the use of technology in defence, its benefits, and its ethical implications.

## The role

Software only matters...',
  'https://boards.greenhouse.io/embed/job_app?token=4516967101'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Sanctuary AI', 
  'sanctuary-ai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'Sanctuary AI - Machine Learning Engineer

## Machine Learning Engineer

Vancouver, BC

AI/Machine Learning – AI/Automation /

Full-Time /

On-site

apply for this job

Your New Role and Team

Sanctuary AI, a world leader in building dexterity-driven Physical AI for general purpose robots, is seeking Machine Learning (ML) Engineers to join our team of seasoned engineers, researchers, and scientists who are dedicated to tackling fundamental challenges in robotic perception, dexterous manipulation, planning, and reasoning.

As a member of the ML team, your role will focus on building robust systems for training and running ML policies on robots, and working closely with researchers to implement and deploy novel ML techniques into production. With access to our in-house robotic platforms, you’ll design, test, and refine software that connects state-of-the-art methods to real-world performance. This position offers a unique chance to contribute to both the engineering foundations and applie...',
  'https://jobs.lever.co/sanctuary/45642cfb-e812-4617-8de7-3cec19453a34'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Spotify', 
  'spotify',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Fine-tuning'],
  'Spotify - Machine Learning Engineer, Personalization, Minesweeper

## Machine Learning Engineer, Personalization, Minesweeper

New York, NY

Engineering – Personalization /

Remote

apply for this job

The Personalization team makes deciding what to play next on Spotify easier and more enjoyable for every listener. We seek to understand the world of music, podcasts, and audiobooks better than anyone else so that we can make great recommendations to every individual person and keep the world listening. Every day, hundreds of millions of people all over the world use the products we build which include destinations like “Home” and “Search” as well as original playlists such as “Discover Weekly” and “Daily Mix.”

Personalization’s Minesweeper squad produces Human Understandable Language Knowledge to enrich music and talk content understanding. We use AI and ML techniques, including Large Language Models, to understand music, podcasts and audiobooks, building reliable, scalable systems to ...',
  'https://jobs.lever.co/spotify/de3f6a47-4d75-4512-8351-b362f1d1c32e'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machina Labs', 
  'machina-labs',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Infrastructure'],
  'Machina Labs - Machine Learning Engineer

## Machine Learning Engineer

Chatsworth, CA

Engineering /

Full-time /

Hybrid

apply for this job

About Machina Labs

Engineering moves at software speed. Manufacturing doesn''t. Yet.

Machina Labs is changing that. We build intelligent, software-defined factories that produce complex metal structures directly from digital design. By integrating advanced metal forming, robotics, and automated production inside a flexible factory architecture, we enable customers to move from prototype to production in weeks, not years.

Backed by Lockheed Martin, Toyota, and NVIDIA, we''re building the manufacturing infrastructure that defense, aerospace, and advanced mobility programs will run on.

If you want to work on hard problems that matter and see them fly, drive, and defend, this is the place.

Job Description:

We are looking for a Machine Learning Engineer to join our team and help us push the boundaries of what’s possible in smart manufacturing. I...',
  'https://jobs.lever.co/MachinaLabs/418bef09-a753-422b-b2fc-9142d01f1139'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'FieldAI', 
  'fieldai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['PyTorch', 'Python'],
  'FieldAI - Senior Machine Learning Engineer

## Senior Machine Learning Engineer

Irvine, CA / Seattle, WA

Engineering – Autonomy /

Full time /

On-site

apply for this job

FieldAI’s Irvine team is where embodied AI meets real robots, real sensors, and real field deployments. Based in the heart of Southern California’s robotics ecosystem, we build risk-aware, reliable, field-ready AI systems that solve the hardest problems in robotics and unlock the full potential of embodied intelligence. If you want your work to ship, get tested on hardware, and improve through real deployments, Irvine is the place. We go beyond typical data-driven approaches or pure transformer-only architectures, combining rigorous engineering with learning systems proven in globally deployed solutions that deliver results today and get better every time our robots run in the field.

### What You’ll Get To Do

Machine Learning modeling

- Design, train, and deploy state-of-the-art machine learning models for end-...',
  'https://jobs.lever.co/field-ai/470926cb-38a1-4db8-b939-8ae8bde3b139'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer', 
  'machine-learning-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'AI'],
  'Institute of Foundation Models - Machine Learning Engineer

## Machine Learning Engineer

Sunnyvale, CA

Engineering /

Full-time /

On-site

apply for this job

About the Institute of Foundation Models

We are a dedicated research lab for building, understanding, using, and risk-managing foundation models. Our mandate is to advance research, nurture the next generation of AI builders, and drive transformative contributions to a knowledge-driven economy.

As part of our team, you’ll have the opportunity to work on the core of cutting-edge foundation model training, alongside world-class researchers, data scientists, and engineers, tackling the most fundamental and impactful challenges in AI development. You will participate in the development of groundbreaking AI solutions that have the potential to reshape entire industries. Strategic and innovative problem-solving skills will be instrumental in establishing MBZUAI as a global hub for high-performance computing in deep learning, drivi...',
  'https://jobs.lever.co/ifm-us/ca550f5b-8c13-4a8e-8b03-0300b113acce'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'zaimler', 
  'zaimler',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Agent', 'Infrastructure'],
  'zaimler - Machine Learning Engineer, ML Platform

## Machine Learning Engineer, ML Platform

San Mateo, CA

Machine Learning /

Full Time /

On-site

apply for this job

About zaimler

AI agents can''t reason over data they don''t understand. Enterprise data today is fragmented across dozens of systems with no shared context, meaning, or structure, and that''s why most enterprise AI is failing. The shift from copilots to autonomous agents is creating an entirely new infrastructure layer, and we''re building it.

zaimler is the context infrastructure for the agentic era: a platform that automatically discovers domain knowledge, maps relationships, and gives AI agents the semantic understanding to operate with precision at scale. Imagine knowledge graphs that support real-time inference, built for systems that need to reason, not just retrieve.

zaimler was founded by Biswajit Das (ex-VP Engineering, Truera), a Data Infra veteran and former Chief Architect at Visa, and Sofus Macskassy (ex-Di...',
  'https://jobs.lever.co/zaimler/c4932cc1-5fba-4a80-92e4-15c4d0f30f96'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'FieldAI', 
  'fieldai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Agent'],
  'FieldAI - Agentic AI/ML Engineer, Multimodal

## Agentic AI/ML Engineer, Multimodal

Irvine, CA

Engineering – Product Engineering /

Full time /

On-site

apply for this job

FieldAI’s Irvine team is where embodied AI meets real robots, real sensors, and real field deployments. Based in the heart of Southern California’s robotics ecosystem, we build risk-aware, reliable, field-ready AI systems that solve the hardest problems in robotics and unlock the full potential of embodied intelligence. If you want your work to ship, get tested on hardware, and improve through real deployments, Irvine is the place. We go beyond typical data-driven approaches or pure transformer-only architectures, combining rigorous engineering with learning systems proven in globally deployed solutions that deliver results today and get better every time our robots run in the field.

Who are We?

Field AI is transforming how robots interact with the real world. We are building risk-aware, reliable, and field-rea...',
  'https://jobs.lever.co/field-ai/28935a89-7c6b-4caf-abe7-b83b8a9958e1'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Whoop', 
  'whoop',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['Infrastructure'],
  'Whoop - Staff Machine Learning Engineer (Health)

## Staff Machine Learning Engineer (Health)

Boston, MA

Machine Learning & Research /

On-site

apply for this job

WHOOP is an advanced health and fitness wearable, on a mission to unlock human performance. WHOOP empowers its members to improve their health and perform at a higher level by providing a deep understanding of their bodies and daily lives.

The Health team is responsible for developing novel algorithms and features that expand our health sensing capabilities. Our work spans several key areas, including women''s health, software as a medical device, wellness monitoring, longevity research, and emerging health insights. We combine continuous physiological data with clinical research and expert knowledge to generate features that are both scientifically grounded and deeply impactful for members.

As a Staff Machine Learning Engineer on our Clinical Health team, you will design, build, and productionize ML systems that deliver...',
  'https://jobs.lever.co/whoop/44a1154e-9580-4ba6-8dc0-6f87684697ba'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer (Platform)', 
  'machine-learning-engineer-(platform)',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['PyTorch', 'Infrastructure', 'Python'],
  'Artera - Machine Learning Engineer (Platform)

## Machine Learning Engineer (Platform)

Remote-US

Tech – AI /

Full-Time /

Remote

apply for this job

About Us: Artera is an AI startup that develops medical artificial intelligence tests to personalize therapy for cancer patients. Artera is on a mission to personalize medical decisions for patients and physicians on a global scale.

As a Machine Learning Engineer at Artera, you’ll work on the AI Platform team with a focus on establishing scalable and efficient pipelines for model training, model evaluation, and data processing. You’ll work closely with AI model developers, fellow machine learning engineers, and our platform engineering team. You’ll ensure that Artera’s model developers can rely on highly efficient, large-scale training regimes and deploy optimized models to production environments.

### Essential Responsibilities:

Accountable for Artera’s ML compute infrastructure including scaling up Artera’s Foundation Model develo...',
  'https://jobs.lever.co/artera/d3c0ca46-28cd-4193-a678-ef95002dce01'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Principal Machine Learning Engineer (10189)', 
  'ai-principal-machine-learning-engineer-(10189)',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote / USA',
  true,
  'Full-time',
  160000,
  240000,
  ARRAY['LLM', 'RAG', 'Agent', 'Fine-tuning', 'Rust'],
  'Extreme Networks - AI Principal Machine Learning Engineer (10189)

## AI Principal Machine Learning Engineer (10189)

Seattle, Washington, United States

Products – Engineering /

Fulltime /

Remote

apply for this job

Over 50,000 customers globally trust our end-to-end, cloud-driven networking solutions. They rely on our top-rated services and support to accelerate their digital transformation efforts and deliver unprecedented progress. With double-digit growth year over year, no provider is better positioned to deliver scalable outcomes than Extreme.

Inclusion is one of our core values and in our DNA. We are committed to fostering an inclusive workplace that embraces our differences and creates an atmosphere where all our employees thrive because of their differences, not in spite of them.

Become part of Something big with Extreme! As a global networking leader, learn why there’s no better time to join the Extreme team.

Over 50,000 customers globally trust our end-to-end, cloud-d...',
  'https://jobs.lever.co/extremenetworks/f99032c4-6048-484d-b93e-f8dfbb62aa19'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Applied AI Engineer ( Remote', 
  'applied-ai-engineer-(-remote',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'New York, NY',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Infrastructure'],
  '# Applied AI Engineer ( Remote - North American Timezones) @ Mostest

**Location:** United States
**Other locations:** New York, Boulder
**Type:** FullTime
**Workplace:** Remote

**Location:** Boulder CO, NYC, or Remote (North America)

**Type:** Full-Time

**Stage:** Seed-stage, high-growth startup

**Comp:** Salary ($125k-200k) + equity + benifits

**Company:** Mostest

#### Help build the AI operating system for events.

We’re building the future of events: software that helps people plan extraordinary events, instantly source and book perfect vendors, and execute flawlessly with AI weaving the experience.

We recently raised our seed round and are growing quickly. This role, Applied AI Engineering, is a core function of the company, not a bolt-on specialty. We’re looking for an exceptional **Applied AI Engineer** to help architect and build intelligent systems at the heart of the product, laying the foundation for a continuously improving system.

This is a role for someone who likes shipping fast, thinking in systems, and turning emerging AI capabilities into durable product advantages.

### What you’ll do

You’ll work across product, infrastructure, and AI systems to build core experiences that power vendor discovery, planning/booking workflows, matching, recommendations, and automation.

You’ll design and ship:

- LLM-powered product workflows using retrieval, structured outputs, tools/function calling, and orchestration

- Search, matching, and recommendation systems across large vendor and event datasets

- Multi-step backend pipelines for ingestion, enrichment, ranking, and workflow automation

- Production-grade product features through to full-stack Next.js Applications.

- Multi-tenant permissions systems (RBAC, scoped access, authorization patterns)

- Observability and evaluation systems for AI reliability, quality, and cost balancing

- Internal engineering patterns for compounding engineer that make AI-assisted development faster and safer

### Must',
  'https://jobs.ashbyhq.com/mostest/68e436d6-b632-434e-93ab-9314a642dce5'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Full Stack AI Engineer (Data)', 
  'full-stack-ai-engineer-(data)',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Infrastructure', 'Python'],
  'Forward Deployed AI Engineer @ Techtorch

- Back to Techtorch’s Job Listings

# Forward Deployed AI Engineer

## Location

United States

## Employment Type

Full time

## Department

Data

Forward Deployed AI Engineer

Build end-to-end products on a solid data foundation, with AI as a force multiplier.

Data Practice | Remote (Global) | Senior

About TechTorch

At TechTorch, we’re building the future of intelligent work. Our mission is to help companies design, build, and deploy AI agents that automate complex, real-world workflows — delivering reliability, measurable ROI, and massive efficiency gains.

Here, you won’t just be playing with prompts or running endless proofs of concept. You’ll ship production-grade AI systems that solve real problems across industries.

You’ll join a hands-on, fast-moving, ownership-driven team that thrives on building quickly, iterating fast, and seeing results in days — not months.

About the Practice

TechTorch''s Data Practice sits at the intersection of enterprise data and applied AI. We design and build AI-native systems that don''t just analyze the past — they actively drive decisions. Our work spans data infrastructure and pipelines, intelligent automation, and full-stack AI applications across industries.

We work the way the best client-delivery teams now operate: small teams, deep ownership, no hand-offs at boundaries. We take problems from a client whiteboard to production, and we let AI do the heavy lifting wherever it earns its place.

The Role

We''re looking for an engineer who builds across the full stack and owns the data underneath it. You can sit in a client session, shape the architecture, design the data foundation, and ship the application that runs on top of it — without handing off at the boundaries.

The work spans client delivery and internal accelerator development. You map the problem, structure the solution, and own the outcome from end to end. AI coding agents are central to how we build — not a novelty, b',
  'https://jobs.ashbyhq.com/techtorch/916acee0-eb0e-4d4a-8e5f-9bc1b039f1e4'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Agentic AI Engineer @ Eigen Labs', 
  'senior-agentic-ai-engineer-@-eigen-labs',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['LLM', 'Agent', 'Infrastructure'],
  'Senior Agentic AI Engineer @ Eigen Labs

- Back to Eigen Labs’s Job Listings

# Senior Agentic AI Engineer

## Location

Remote

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## Who We Are & What We’re Building

Eigen Labs is a frontier lab building coordination technologies for the post-AGI world. AGI is completely reconfiguring power, and a few major labs are already consolidating this power. We believe that coordination through open networks is the only counterforce that lets individuals maximize their agency.

We are building open networks for many different layers shaping AI: agentic research, inference infrastructure, and capital formation. Recently, we showed how a community of scientists, amateurs, and agents can collaborate to surpass Google’s unpublished quantum breakthrough, showcasing the power of open coordination.

## What This Looks Like In Practice

A small number of companies are rapidly becoming gatekeepers to the most powerful systems ever created, trained on open internet, open research, and open-source software, now locked behind permission structures and centralized control.

The question isn''t whether AI will transform society. The question is who gets to participate.

We believe:

Scientific discovery should remain open.

Intelligence should not be controlled by a handful of institutions.

Individuals should be able to coordinate, build, and create without asking for permission.

AI should empower people, not make them dependent.

AI should expand individual agency, not concentrate power.

This isn''t a theoretical exercise. Darkbloom is already building distributed AI infrastructure from idle hardware around the world.

These are early examples of a much larger idea: open networks competing with centralized institutions.

We''re looking for researchers, engineers, founders, scientists, designers, and builders who see the same trend we do and want to help build the alternative. If you''re excited by open sc',
  'https://jobs.ashbyhq.com/eigen-labs/c02fa001-23c9-4d68-8c0a-e27a742d76a4'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior AI Software Engineer, Agent Systems @ Scale Army Careers', 
  'senior-ai-software-engineer,-agent-systems-@-scale',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['Agent', 'Rust'],
  '# Senior AI Software Engineer, Agent Systems @ Scale Army Careers

**Location:** Remote
**Type:** FullTime
**Workplace:** Remote
**Compensation:** $2.5K – $3K per month

***This role is open to candidates based in LATAM, Africa, and Eastern Europe. Please note that as this role supports U.S.-based clients, candidates must be available to work during U.S. business hours aligned with the client’s time zone.***

 **You build production agent systems that run themselves. Not prompts, loops. Not a single assistant, a coordinated swarm.**

**The role:
**We build and ship agent platforms that do real work in production. This role is for an engineer who designs self-running agent loops and multi-agent swarms, not someone who tweaks prompts one turn at a time. You will own systems that find work, do it, verify it, and report back, with humans at the gates rather than in every iteration.
This is a hands-on, ship-first engineering role. You write production code other engineers trust, and you treat agents as software systems that need triggers, budgets, stop conditions, verification, and observability like any other.

**What we mean by loop engineering:** designing an agent system as a control loop with an explicit trigger, scope, action, budget, stop condition, and report, plus a verifier that can reject bad work, so it runs unattended and knows when to stop or hand back to a human. Not a bigger prompt. A system that prompts the agents for you.
**What we mean by swarm agents:** a coordinated fleet of specialized agents (planner, builder, reviewer, verifier, scout, coordinator) with file and task ownership, shared state, quality gates, and clean handoffs, run by an orchestrator rather than one do-everything assistant.

**What you''ll do**

- **Design self-running loops.** Define the trigger, scope, action, budget, stop condition, and reporting so an agent runs unattended, stays inside cost and iteration limits, and knows when it is done versus when to escalate.

- **Build multi',
  'https://jobs.ashbyhq.com/scale%20Army%20Careers/c1aa7444-f7dc-4394-95f3-2fb75d931bdb'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer @ Blacksmith Agency', 
  'ai-engineer-@-blacksmith-agency',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Contract',
  140000,
  220000,
  ARRAY['LLM', 'LangChain', 'Agent', 'Python'],
  '# AI Engineer @ Blacksmith Agency

**Location:** Argentina
**Other locations:** Brazil, Mexico, Chile, South Africa, Colombia
**Type:** Contract
**Workplace:** Remote

**AI ENGINEER (LATAM, RSA)**

Blacksmith Agency | Full-Time Contract | Remote

**ABOUT BLACKSMITH AGENCY**

Blacksmith Agency (BSA) is a fully remote WordPress design and development agency of ~40 people headquartered in Phoenix, Arizona. We build high-performance websites for growth-focused companies across the US. We''re not a typical agency. We run a sales engine, a production system and a growing AI automation layer that we''re building into every part of how we work.

This role is a direct investment in that automation layer.

**THE ROLE**

We''re hiring an AI Engineer to own and ship our internal automation roadmap. This is a builder role, not a research role. You will not be training models. You will be building production systems on top of them.

You''ll work directly with our engineering and delivery leadership to take a well-documented roadmap of automation workflows (AI-assisted WordPress development, content generation, agentic pipelines) and turn them into shipped, working systems.

This role is for someone who has already built things with LLMs and can show it.

**WHAT YOU''LL BUILD**

- Agentic workflows using LangChain, LangGraph or equivalent frameworks

- Integrations with Anthropic and OpenAI APIs including tool use and function calling

- Internal tools that reduce manual hours across our design and development production process

- Automation pipelines that connect WordPress, Figma, Google Workspace and our internal CMS/component library

- MCP (Model Context Protocol) server integrations as part of our broader AI stack

**WHAT WE NEED**

Required:

- 2+ years building production software with Python or Node.js

- Hands-on experience with LangChain, LangGraph, CrewAI, AutoGen or similar agent frameworks

- Proven API integration work with OpenAI or Anthropic (function calling, tool use',
  'https://jobs.ashbyhq.com/Blacksmith%20Agency/5dfccfc8-a527-44b9-b3ec-eaee25fc3f0f?embed=js'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Software Engineer', 
  'software-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM'],
  'Software Engineer - AI Systems @ XBOW
* [![XBOW](https://app.ashbyhq.com/api/images/org-theme-wordmark/867624d5-fe59-46c3-8d95-ca85fb468e30/6a1c098d-21e2-4ccc-8f17-e18406f74e59/0471a00c-8efd-4c86-b3eb-7e8f7094f466.png)](https://xbow.com/)
* [](https://jobs.ashbyhq.com/xbowcareers)
*
# Software Engineer - AI Systems
## Location
Austria (Remote); Brazil (Remote); Denmark(Remote); Greece (Remote); Ireland (Remote); Malta (Remote); Remote Argentina; Spain (Remote); Sweden (Remote); Switzerland (Remote); United Kingdom (Remote); US East Coast
## Employment Type
Full time
## Location Type
Remote
## Department
Engineering
## Compensation
* Open to various levels: $100K – $350K • Offers Equity
## **About XBOW**
Build the future of offensive security with XBOW. Attackers are already using AI to move faster than defenders can react—we’re creating the platform that puts security ahead in the arms race. Our AI-powered system autonomously discovers, validates, and even exploits vulnerabilities, giving organizations proof-backed results in hours instead of weeks.
Founded by Oege de Moor, creator of GitHub Copilot, and backed by Sequoia, Altimeter, and other leading investors, XBOW is applying cutting-edge AI to one of the world’s most urgent problems. In just over a year, our AI, built by a world-class AI team and legendary security researchers — has uncovered thousands of real-world zero-days across the software billions rely on, and achieved the #1 ranking on HackerOne’s global leaderboard.
We’re a team of builders, hackers, and researchers who thrive on solving problems others think are impossible. If you want to push the boundaries of AI, reshape how security is done, and join the group defining this new era of defense — we’d love to talk.
## **Your Role**
We’re looking for a Software Engineer with deep expertise in LLM prompting, orchestration, and software engineering. In this role, you’ll design and implement systems that coordinate large language models with real-world ta',
  'https://jobs.ashbyhq.com/xbowcareers/304f9f4e-477e-4d29-a39a-7c212738a0c8'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Research Engineer', 
  'research-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['vLLM', 'CUDA', 'LLM', 'Infrastructure', 'Python'],
  'Research Engineer - AI Systems @ Yotta Labs

- Back to Yotta Labs’s Job Listings

# Research Engineer - AI Systems

## Location

United States; Canada; Hong Kong; Singapore

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

Location: Remote (Global)

Type: Full-time

Company: Yotta Labs

Apply: careers@yottalabs.ai

🧠 About Yotta Labs

Yotta Labs is building the next generation multi-silicon AI cloud and runtime platform to power the world’s most demanding AI workloads. We enable training and inference across NVIDIA GPUs, AMD GPUs, and AWS Trainium, helping AI companies achieve the best performance and economics across heterogeneous hardware. Our mission is to provide high-performance AI computing and Model API services, enabling AI companies, research labs, and enterprises to train, deploy and integrate cutting-edge models at scale.

🛠️ Role Overview

We are seeking a highly motivated AI Systems Research Engineer specializing in Trainium, GPU kernels, and LLM systems optimization. You will work at the intersection of AI Systems, Compiler and Runtime Optimization, Distributed Training & Inference, GPU/Accelerator Kernel Development, and Large Language Model Infrastructure. Your work will directly impact the scalability and performance of AI applications deployed on our platform.

🎯 Responsibilities

Design and implement high-performance kernels for Attention, MoE, GEMM, collective communication, and quantization.

Optimize kernels for NVIDIA, AMD, and AWS Trainium.

Develop custom operators and graph optimizations using Neuron SDK, PyTorch/XLA, Torch Dynamo, and Neuron Compiler.

Improve performance of vLLM, SGLang, TensorRT-LLM, and custom inference runtimes.

Design scalable distributed training and inference solutions across thousands of accelerators.

Contribute to open-source projects, publish technical findings and engage with the developer community.

✅ Qualifications

Proficiency in AI programming languages such as Python a',
  'https://jobs.ashbyhq.com/yotta/5ad886ff-a109-424e-910d-bb764a5201e9'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Applied AI Engineer', 
  'applied-ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Python'],
  'Applied AI Engineer - AI Neobank App (Germany) @ Bjak

- Back to Bjak ’s Job Listings

# Applied AI Engineer - AI Neobank App (Germany)

## Location

Germany

## Address

Germany, Germany

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## About BJAK

The original mission of BJAK is we believe people deserve smarter ways to plan, save and grow their money. This is the origin of our name.Started in 2019, we built the first mobile-first, insurance platform, enabling insurance to be accessible online by millions in the region. Today, its the leading insurance platform in Southeast Asia.Today, we are expanding ways to help people in the region — this includes spending, saving, investing, exchanging, travelling, and more. Our mission is help people get more from their money every day.We have teams working around the world, with over 20 nationalities from our offices and remotely, who truly enjoys their work. We are looking for the most talented and driven people we can find. We are looking for people who work for their passion, not counting hours. Who loves building great next-generation products, not status quo. Who cares about redefining how everyone around us can get the best financial applications, not for an exclusive few.If you''re this person, we''d love to talk to you.

## The Role

We are looking for applied AI engineers to build AI-native systems for BJAK''s AI Neobank app.This is not a research-only role. We need builders who can use AI to automate real workflows, improve products, reduce manual work and make financial services easier for users and teams.

## What You''ll Own

Build AI-powered workflows, assistants, agents and automation systems.

Apply AI across customer support, CRM, onboarding, claims, renewals, payments, operations and internal tools.

Work with product and engineering teams to turn manual processes into scalable AI-native systems.

Build integrations with LLMs, internal data, APIs, documents, knowledge bas',
  'https://jobs.ashbyhq.com/bjakcareer/4226ad7e-a43a-4a8c-b30f-80aadf39b69e'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI & Data Engineer @ Tern Travel', 
  'ai-&-data-engineer-@-tern-travel',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['Infrastructure', 'Rust'],
  'AI & Data Engineer @ Tern Travel

- Back to Tern Travel’s Job Listings

# AI & Data Engineer

## Location

United States

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## Compensation

- $175K – $200K

This role builds and owns the AI and data systems at the core of Tern''s product. You''ll set the standard on evals, pipeline reliability, and advisor reporting on a small team where the scope is real and the ownership is yours. If you''ve been waiting for AI problems worth owning, this is that job.

## ABOUT TERN

Tern is a venture-backed software company on a mission to reshape the $127B travel agency industry by giving power back to the entrepreneurs who built it.

Nearly 98% of travel agencies are small businesses. These businesses have been chronically underserved by technology. We''re here to change that. Our platform helps travel advisors run more efficient, professional, and profitable operations, giving them the modern infrastructure they need to lead the next chapter of travel.

But the impact goes beyond business. Travel advisors help clients move more intentionally through the world. When a traveler works with an advisor, they''re more likely to avoid overtouristed hotspots and more likely to spend their dollars in places where they can do real good. That''s the kind of travel we want more of.

At Tern, we believe in small business. We believe in the power of travel. And we''re building the future of both.

## AI & DATA ENGINEER

AI is becoming central to Tern''s product, and the quality of those AI features lives or dies on the data behind them. This role sits right at that intersection. You''ll be a senior builder on our data team, working closely with our Data / AI Lead, and your north star is making Tern''s AI features trustworthy. That''s an engineering problem, and you''ll solve it by building the systems those features run on, the eval harnesses that tell us whether they''re actually good, and the monitoring that catches qu',
  'https://jobs.ashbyhq.com/tern/587a90f9-8c2f-4a9d-b837-092bc887e016'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'ML Ops Engineer (EMEA Remote) @ Pragmatike', 
  'ml-ops-engineer-(emea-remote)-@-pragmatike',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['vLLM', 'LLM', 'RAG', 'Infrastructure'],
  'ML Ops Engineer (EMEA Remote) @ Pragmatike

- Back to Pragmatike’s Job Listings

# ML Ops Engineer (EMEA Remote)

## Location

Ukraine; Albania; Armenia; Bosnia & Herzegovina; Croatia; Czech Republic; Estonia; Greece; Italy; Latvia; Lithuania; Malta; Montenegro; Poland; Portugal; Romania; Serbia; Spain ; Türkiye

## Employment Type

Full time

## Location Type

Remote

## Department

Work with our ClientsEMEA

Location: Fully remote (EMEA timezone)Start date: ASAPLanguages: Fluent English requiredIndustry: Cloud Computing / AI / European Deep-Tech SaaS

## About the Role

Pragmatike is recruiting on behalf of a fast-scaling, well-funded distributed cloud infrastructure startup building next-generation AI-native cloud services. The company is redefining how compute is delivered by providing GPU-powered infrastructure for AI/ML workloads, secure storage, and high-speed data transfer through a decentralized architecture that significantly reduces environmental impact compared to traditional cloud providers.

We are seeking a ML Ops Engineer with strong experience in production-grade model serving and infrastructure for AI systems. This is a highly technical, hands-on role focused on building scalable, reliable, and efficient ML inference platforms powering real-time AI applications.

You will be responsible for designing and operating the core infrastructure that serves machine learning models at scale. You will work closely with infrastructure, platform, and applied AI teams to ensure high availability, low latency, and cost-efficient inference systems. Strong ownership, production mindset, and experience with distributed GPU systems are essential.

## Your Responsibilities

Build and operate production-grade model serving infrastructure using frameworks such as vLLM, TGI, Triton, or equivalent

Design and implement robust deployment pipelines with blue/green and canary rollout strategies for ML models

Develop and maintain auto-scaling systems, multi-model serving ar',
  'https://jobs.ashbyhq.com/pragmatike/f30e8f4c-96bb-46f1-9ee0-53bad61f0e4b'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ Sift', 
  'machine-learning-engineer-@-sift',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['Infrastructure', 'Python'],
  'Machine Learning Engineer @ Sift

- Sift
- Back to Sift’s Job Listings

# Machine Learning Engineer

## Location

San Francisco, California; Remote - USA; Seattle, Washington

## Employment Type

Full time

## Location Type

Hybrid

## Department

Engineering

## Compensation

- Estimated On Target Earnings $140K – $190K • Offers Equity

The anticipated starting on-target earnings range for this role is listed above. This role may also be eligible for equity and other benefits. Sift takes into account many factors in determining compensation, including level, location, transferable skills, work experience, business needs, and market demands. Therefore, the pay range / final offer may change or be modified in the future.

### The Role:

As a Machine Learning Engineer at Sift, you will bridge the gap between data science and large-scale distributed systems. You won’t just train models in isolation; you will build end-to-end pipelines that extract signals, train custom models per merchant, and serve predictions at production scale with low latency. You will work on an automated machine learning ecosystem that dynamically recalibrates models based on streaming global telemetry data.

### What You''ll Do:

Model Development & Refinement: Design, build, and deploy online machine learning models (including ensemble methods, deep learning, transformer architectures and graph-based models) to catch evolving fraud vectors in real time.

Feature Engineering at Scale: Engineer high-frequency time-series features from over 1 trillion behavioral events, optimizing for low-latency signal extraction and pattern recognition.

Production MLOps: Maintain and enhance our automated model training and deployment infrastructure, ensuring frictionless continuous integration and continuous deployment (CI/CD) of newly trained models.

System Optimization: Write high-performance code to minimize scoring latency at runtime, ensuring our core ML services scale seamlessly across distributed datab',
  'https://jobs.ashbyhq.com/sift/45b22605-1abb-483e-8ef7-5ceaf04f5868'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ Gray Swan AI', 
  'machine-learning-engineer-@-gray-swan-ai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['Agent', 'Python'],
  'Machine Learning Engineer @ Gray Swan AI

- Back to Gray Swan AI’s Job Listings

# Machine Learning Engineer

## Location

Pittsburgh

## Employment Type

Full time

## Location Type

On-site

## Department

Machine Learning

## Compensation

- Estimated Base Salary $160K – $257K • Offers Equity • Offers Bonus

## About Gray Swan

Gray Swan is on a mission to empower the world to use AI safely and securely. We evaluate AI models for the leading frontier labs along with building real-time threat detection and adaptive adversarial red teaming agents for teams deploying AI.

We''re a team of approximately 50 people, well-funded, growing quickly. Our work directly influences how the world deploys AI agents and systems at scale.

Learn more about how we work.

## The Role

As a Machine Learning Engineer at Gray Swan AI, you will play a pivotal role in shaping the future of AI safety solutions.

Research at Gray Swan AI is tightly tied to real-world impact. AI security is not a solved problem, and this role is a mix of applied research and system building: developing new approaches to adversarial testing, model evaluation, and robust inference that directly inform how secure AI systems are deployed in practice. You will work at the boundary between research and production, translating novel ideas into scalable AI systems that withstand adversarial pressure.

Your expertise in state-of-the-art deep learning architectures, distributed systems, and parallel computing will enable you to tackle complex challenges associated with resource-intensive models. You will be responsible for advancing our methodologies for controlling, monitoring, and analyzing these models, ensuring they meet the rigorous demands of production environments.

Join Gray Swan AI to work alongside leading minds in AI safety and apply your technical depth to problems that genuinely matter!

## What You’ll Do

Lead the design, development, and deployment of advanced machine learning models to enhance system ',
  'https://jobs.ashbyhq.com/Gray%20Swan%20AI/3d7e2604-92c1-4c93-b168-0683ed2990d1'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Hadrian Automation', 
  'hadrian-automation',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'AI'],
  'Machine Learning Engineer @ Hadrian Automation

Machine Learning Engineer @ Hadrian Automation',
  'https://jobs.ashbyhq.com/hadrian-automation/a4dd4748-9825-4090-885c-a79e475f8952'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ Sardine', 
  'machine-learning-engineer-@-sardine',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'New York, NY',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['Agent', 'Python', 'Rust'],
  'Machine Learning Engineer @ Sardine

- Back to Sardine’s Job Listings

# Machine Learning Engineer

## Location

North America

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## Compensation

- USEstimated base salary $175K – $220K • Offers Equity
- CanadaEstimated base salary CA$210K – CA$265K • Offers Equity

The compensation offered for this role will depend on various factors, including the candidate''s location, qualifications, work history, and interview performance, and may differ from the stated range.

Who we are:

Sardine is the leading agentic risk platform for fighting financial crime. Our integrated solution unifies data across risk teams to help organizations stop fraud in real time, prevent AI-driven attacks, and automate fraud and AML operations. Sardine’s platform is strengthened by one of the fastest-growing fraud consortiums in the market, spanning more than 6 billion profiled devices, 800 million consumers, and 3 million businesses worldwide. Leading companies including FIS, GoDaddy, Intuit, Edward Jones, ZoomInfo, and Checkout.com rely on Sardine to secure and grow trust in their products.

Our culture:

We have hubs in the Bay Area, NYC, Austin, Toronto, and São Paulo. However, we maintain a remote-first work culture. #WorkFromAnywhere

We hire talented, self-motivated individuals with extreme ownership and high growth orientation.

We value performance and not hours worked. We believe you shouldn''t have to miss your family dinner, your kid''s school play, friends get-together, or doctor''s appointments for the sake of adhering to an arbitrary work schedule.

Location:

Remote - United States or Canada

From Home / Beach / Mountain / Cafe / Anywhere!

We are a remote-first company with a globally distributed team. You can find your productive zone and work from there.

About The Role

As a Machine Learning Engineer, you’ll do more than build models - you’ll design the systems that make fraud detection possible',
  'https://jobs.ashbyhq.com/sardine/2c8f0342-b8af-4cc2-85cd-67bc48275568'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ Reducto', 
  'machine-learning-engineer-@-reducto',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'Agent', 'Python', 'Computer Vision'],
  '# Machine Learning Engineer @ Reducto

**Location:** San Francisco Office
**Type:** FullTime
**Compensation:** $150K – $300K • Offers Equity

#### About Reducto

Reducto is the agentic document platform for leading AI teams who demand enterprise performance at scale. We provide a comprehensive toolkit for working with documents the way a human would, combining custom in-house and leading frontier models to power efficient and accurate document workflows.

We’ve grown rapidly, increasing revenue 8x year over year and partnering with hundreds of companies, from leading AI teams like Harvey, Vanta, and Scale, to enterprise customers across FAANG and top trading firms.

Reducto has raised over $100M from world-class investors including a16z, Benchmark, and First Round Capital.

**We would love to meet you if you:**

- **Philosophy:** You are your own worst critic. You have a high bar for quality and don’t rest until the job is done right—no settling for 90%. We want someone who ships fast, with high agency, and who doesn''t just voice problems but actively jumps in to fix them.

- **Experience: **You have 2+ years of experience with training, fine tuning, and evaluating ML models used in production systems

- **Language/Skills:** You’re exceptional at Python or similar, and are well versed with both traditional computer vision and VLMs

- **Tools:** Build your own tools as needed—like a quick Streamlit app to test hypotheses or create a dataset.

- **Approach:** A quantitative approach to building products. Ability to debug, experiment, and iterate fast. You should be comfortable getting hands-on with the full development lifecycle, from ideation to shipping to users.

#### The core work will include:

- Training and deploying new state of the art models for parsing and interpreting unstructured data

- Experimenting with novel techniques to improve LLM accuracy

- Build data pipelines, evaluate model performance, and integrate models into the product

- Working directly',
  'https://jobs.ashbyhq.com/reducto/aac35219-c38c-4490-8050-cee52e7dcf6b'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ Krea', 
  'machine-learning-engineer-@-krea',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'AI'],
  'Machine Learning Engineer @ Krea

- Back to Krea’s Job Listings

# Machine Learning Engineer

## Location

San Francisco

## Employment Type

Full time

## Location Type

On-site

## Department

Research

About Krea

At Krea, we are building next-generation AI creative tools.

We are dedicated to making AI intuitive and controllable for creatives. Our mission is to build tools that empower human creativity, not replace it.

We believe AI is a new medium that allows us to express ourselves through various formats—text, images, video, sound, and even 3D. We''re building better, smarter, and more controllable tools to harness this medium.

This job

We''re looking for a machine learning engineers who can work on large-scale image and video models training experiments..

Some stuff you can do:

Train foundation diffusion models for image and video generation.

Train controllability modules such as IPAdapters or ControlNets.

Develop novel research techniques and put them into production.

Conducting large-scale experiments on high-performance computing clusters, optimizing data pipelines for massive image datasets

Example experience and skills we’re looking for

Proven track record in working with image or video models at scale (publications or open-source contributions a plus)

Strong background in deep learning frameworks and distributed training paradigms.

Ability to iterate rapidly, and propose creative research directions

A bit more about us

We’ve raised over $83M and are backed by world-class Silicon Valley investors such as Andreessen Horiwitz, and the cofounder of the Meta AI Research laboratory (FMK as Facebook AI Research) or founding members of OpenAI.

Apply for this Job',
  'https://jobs.ashbyhq.com/krea/06a135f6-fb4c-446c-ac99-be1af655b964'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ Hang', 
  'machine-learning-engineer-@-hang',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'New York, NY',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['TensorFlow', 'Python'],
  'Machine Learning Engineer @ Hang

- Back to Hang’s Job Listings

# Machine Learning Engineer

## Location

Remote, New York

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

# Hang is building the future of loyalty for brands.

Hang is the next generation brand loyalty & membership platform. By harnessing the power of personalization, gamification, and its integrations ecosystem, Hang provides brands with a radically new type of loyalty experience for their customers.

Today, they work with a variety of major brands (such as Ulta Beauty, Budweiser, Flipkart, and more), as well as multiple well-known, up-and-coming restaurant chains (Boba Guys, Roam Artisan Burger, and Williamsburg Pizza, among several others).

Hang draws from years of deep expertise in loyalty, game design, and finance with employees from leading companies like Google, Amazon, Apple, Meta, LinkedIn, Coinbase, Square, and Goldman Sachs.

Hang raised a $16 million Series A led by Paradigm last summer, with participation from Tiger Global, Howard Schultz, Kevin Durant, Mr. Beast, and the founders of Warby Parker, Allbirds, and Bombas, among others.

# About the Role

We are seeking a skilled and innovative Machine Learning Engineer to join our team. This person will implement and develop machine learning models to enhance our platform''s capabilities, making key contributions to our product development, and driving data-driven decision-making.

# What You’ll Do

Model Development: Design, build, and deploy machine learning models to improve various aspects of our platform, including customer personalization, predictive analytics, and automated decision-making.

Data Analysis: Analyze large datasets to identify trends and patterns, and use this information to inform model development and business strategies.

Algorithm Optimization: Continuously test and refine algorithms to improve accuracy and efficiency.

Collaborative Development: Work closely with software engine',
  'https://jobs.ashbyhq.com/Hang/7b899a89-ed68-4988-8c3b-27ee46d6eca3'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer', 
  'machine-learning-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'Infrastructure'],
  'Machine Learning Engineer - Core Signals @ Yobi

- Back to Yobi’s Job Listings

# Machine Learning Engineer - Core Signals

## Location

Remote (US + Canada Only)

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering & Science

## Compensation

- Base Salary Range $180K – $275K • Offers Equity

Yobi is a rapidly growing Behavioral AI company on a mission to ethically democratize the benefits of data and AI.

Since 2019, we have built one of the largest consented behavioral datasets in the United States, extending far beyond the walled gardens of Big Tech. Unlike traditional LLM companies, Yobi builds foundation models of human behavior grounded in real-world actions such as purchases and store visits.

Our private-by-design modeling enables state-of-the-art personalization and decisioning for leading brands and agencies while protecting privacy, safety, and ethics.

Today, we are focused on bringing the performance of closed-web user acquisition to the open web and connected TV, giving brands walled-garden results without the walls.

At our core, Yobi is building the behavioral intelligence layer for any system that makes a personalization decision.

Working at Yobi

We’re at an inflection point—customer adoption is accelerating, but there’s still room to shape the architecture and culture from the ground up. Engineers here own major surface areas, build 0→1 systems in large-scale data and model infrastructure, and help define how Behavioral AI scales ethically and effectively.

Highlights:

Partnerships with Microsoft and Databricks

Fully remote or hybrid from several hubs (SF Bay Area, Seattle, NYC)

World-class team of Machine Learning experts who worked on cutting edge infra and recommender systems @ Amazon, Uber, Twitter, Meta, etc.

Product and Go-To-Market teams who have taken ideas from concept to 9 figure revenue streams

Benefits:

Competitive Base Salary

Meaningful equity & financial upside - a real % of the company

Annua',
  'https://jobs.ashbyhq.com/yobi/52ba2d1d-8d12-4688-8f61-dc8eede6e25b'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer', 
  'machine-learning-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'AI'],
  'Machine Learning Engineer - Vision @ Hadrian Automation

- Back to Hadrian Automation’s Job Listings

# Machine Learning Engineer - Vision

## Location

Los Angeles, CA

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering, Product, Design

# Hadrian - Manufacturing the Future

Hadrian is building autonomous factories that help aerospace and defense companies manufacture rockets, satellites, jets, and ships up to 10x faster and up to 2x cheaper. By combining advanced software, robotics, and full-stack manufacturing, we are reinventing how America produces its most critical parts.

We’re accelerating our mission with the launch of Factory 3 in Mesa, Arizona, a 290,000-square-foot facility creating 350 new jobs. We are expanding rapidly to support thousands of future hires, launching Hadrian Maritime to expand into naval production, and introducing a Factory-as-a-Service model that delivers complete systems instead of individual parts.

Hadrian is backed by leading investors including T. Rowe Price, Lux Capital, Founders Fund, and Andreessen Horowitz, our fast-growing team is united around reindustrializing American manufacturing for the 21st century and beyond.

### The Role

Copilot is our system for automating Design for Manufacturing (DFM) analysis and generating manufacturing processes. We work directly with some of the best operators in the world to identify high-impact opportunities to automate and augment with software.

Our team owns problems end-to-end: we design the software, define the manufacturing processes, and ensure they can be executed reliably in our factories. The work spans computational geometry, CAD/CAM integrations, high-performance systems, and full-stack web tooling. We execute whatever is required to deliver a working solution and best serve our users.

The DFM team within Copilot is building the manufacturing data intelligence layer that serves as the tip of the spear for our automation stack. This platform i',
  'https://jobs.ashbyhq.com/hadrian-automation/94970f47-f88e-4e71-90ae-0e52b1d75c6b'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI & Machine Learning Engineer @ Lightspeed', 
  'ai-&-machine-learning-engineer-@-lightspeed',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['TensorFlow', 'Infrastructure', 'Computer Vision'],
  'AI & Machine Learning Engineer @ Lightspeed

- Back to Lightspeed’s Job Listings

# AI & Machine Learning Engineer

## Location

Northbrook, IL

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

## About LightSpeed

LightSpeed Build Technologies is revolutionizing the construction industry through AI-powered robotics. Our flagship systems—BRUTE for automated wall panel manufacturing and DEX for on-site collaborative construction—are addressing the global housing crisis by delivering unprecedented speed, precision, and affordability in homebuilding.

## Position Overview

As an AI & Machine Learning Engineer, you will design, build, and deploy the intelligent systems that make LightSpeed’s construction robots smarter, faster, and more autonomous. You will develop machine learning models for computer vision, predictive analytics, autonomous decision-making, and process optimization—all deployed in real-time production environments where precision and reliability are critical. This role sits at the intersection of cutting-edge AI research and practical industrial application.

## What you''ll work on:

Machine Learning Development

Design, train, and deploy ML models for robotic control, quality prediction, and process optimization

Develop reinforcement learning and imitation learning systems for robot task planning

Build predictive maintenance models using sensor data to anticipate equipment failures

Implement anomaly detection for real-time quality monitoring during automated assembly

Optimize model inference for edge deployment on GPU-accelerated hardware in production

Computer Vision & Perception

Develop deep learning pipelines for object detection, segmentation, and pose estimation

Build real-time vision systems for robotic guidance, workpiece tracking, and dimensional verification

Implement 3D point cloud processing for construction material recognition

Design and train models for visual quality inspection using depth c',
  'https://jobs.ashbyhq.com/lightspeed/0b8bb2c8-8049-4b53-b1d1-74397807ccf2'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer (Video Understanding & Segmentation) @ Maxinsights Corporation', 
  'machine-learning-engineer-(video-understanding-&-s',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'Agent', 'Infrastructure', 'Python', 'Computer Vision'],
  'Machine Learning Engineer (Video Understanding & Segmentation) @ Maxinsights Corporation

- Back to Maxinsights Corporation’s Job Listings

# Machine Learning Engineer (Video Understanding & Segmentation)

## Location

Santa Clara

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

### Job Description:

We are seeking a highly motivated Machine Learning Engineer to join our core research and development team, focused on video understanding and segmentation. In this role, you will build the systems that let us search, decompose, and describe massive volumes of egocentric and human-robot video at scale — turning raw, unstructured footage into structured, searchable, and richly annotated training data. You will work across video/image embedding models, LLM-based video understanding, and agentic pipelines that orchestrate multiple models into end-to-end workflows. This is a foundational role that directly shapes the data quality and scalability of our entire training data platform.

Responsibilities

Build and optimize video/image embedding pipelines using CLIP-style and other vision-language embedding models to power large-scale, multi-modal video search and retrieval.

Develop LLM-based video understanding systems for semantic indexing, summarization, and question-answering over long-form egocentric and third-person video.

Design and implement instruction-level and action-level video chunking/segmentation algorithms that decompose long videos into structured, temporally-aligned clips.

Build automated video captioning systems that combine vision-language models and LLMs to produce fine-grained, temporally-grounded descriptions of actions and scenes.

Architect agentic systems and orchestration pipelines that chain embedding, captioning, retrieval, and LLM reasoning steps into reliable, end-to-end video understanding workflows.

Develop and scale video search infrastructure (vector indexing, retrieval, ranking) to support semantic an',
  'https://jobs.ashbyhq.com/maxinsights/631ee3d8-07ca-455d-b6a2-dee4d3d33a72'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer, New Grad', 
  'machine-learning-engineer,-new-grad',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Rust', 'Generative AI'],
  'Machine Learning Engineer, New Grad - Quora (Remote) @ Quora

- Back to Quora’s Job Listings

# Machine Learning Engineer, New Grad - Quora (Remote)

## Location

Remote - Multiple Locations; Canada; United States

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

[Quora is a privately held, "remote-first" company. This position can be performed remotely from anywhere in Canada or the United States. Please visit careers.quora.com/eligible-countries for details regarding employment eligibility by country.]

## About Quora:

Quora’s mission is to grow the world''s collective intelligence. To do so, we have two platforms:

Quora: a global knowledge sharing platform with over 300M monthly unique visitors, bringing people together to share insights on various topics and providing a unique platform to learn and connect with others.

Poe: a platform providing millions of global users with one place to chat, explore and build with a wide variety of AI language models (bots), including Claude-Opus-4.7, Nano-Banana-2, GPT-Image-2, GPT-5.5, GPT-5.5-Pro, and more. As AI capabilities rapidly advance, Poe provides a single platform to instantly integrate and utilize these new models.

Behind these products are passionate, collaborative, and high-performing global teams. We have a culture rooted in transparency, idea-sharing, and experimentation that allows us to celebrate success and grow together through meaningful work. Join us on this journey to create a positive impact and make a significant change in the world.

This role will be working on our Quora product.

## About the Team and Role:

Our small engineering team works on challenging problems every day. We have a culture that''s rooted in constantly learning and improving, and our engineers are encouraged to think big and experiment with new ideas. Using continuous deployment, we quickly see our changes in the product and make fast iterations. Our engineers focus on creating polished produc',
  'https://jobs.ashbyhq.com/quora/3eb7e80e-6a0d-41b6-8ee4-f62421c486e4'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Machine Learning Engineer @ Bjak', 
  'senior-machine-learning-engineer-@-bjak',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['Python'],
  'Senior Machine Learning Engineer @ Bjak
* [![Bjak ](https://app.ashbyhq.com/api/images/org-theme-wordmark/cfdb13fd-7d62-4b21-a335-caf230b55bd2/50220d6f-75bd-4d17-9199-b4361604b1da/776b0d6d-b264-47fc-a116-7219811654b6.png)](https://bjak.my/en/about-us)
* [](https://jobs.ashbyhq.com/bjakcareer)
*
# Senior Machine Learning Engineer
## Location
Sweden
## Address
Sweden, Sweden
## Employment Type
Full time
## Location Type
Remote
## Department
A1 EngineeringA1
### **About A1**
There are over 5 billion users using basic applications today such email, notes, tasks that are not AI-native. Our mission is to build a proactive smart assistant for everyday users to bring intelligence to conversations, errands, organising and workflows, with minimal prompting.
Our product focuses on achieving high reliability for long-running workflows, persistent context, and real-world task completion. The system must handle multi-step reasoning, interact with external tools, and remain reliable despite non-deterministic model behavior. Our objective is to help users complete tasks daily enjoyable with over \~90%\* reduced time.
 
### Role
As a Senior Member of Technical Staff, Machine Learning, you are an independent owner of critical ML subsystems in production. You take ambiguous problems, design practical solutions, and ship systems that operate reliably at scale.
This is a hands-on, high-impact role focused on depth.
 
### **Focus**
* Build core ML systems that power a proactive, long-horizon AI product.
* Own work end-to-end: data preparation, training, evaluation, inference, and iteration.
* Turn research ideas into working systems that run reliably in production.
* Debug model failures and system issues using real production signals.
* Iterate quickly: ship, measure outcomes, refine, and repeat.
* Collaborate closely with research, product, and engineering to deliver real user impact.
* Mentor and review work from other ML engineers through example and technical judgment.
* Work under ',
  'https://jobs.ashbyhq.com/bjakcareer/01f383b8-bc47-4a76-9362-c6fddf2c1aad'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Machine Learning Engineer @ TensorWave', 
  'senior-machine-learning-engineer-@-tensorwave',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['Infrastructure', 'Python'],
  'Senior Machine Learning Engineer @ TensorWave

- Back to TensorWave’s Job Listings

# Senior Machine Learning Engineer

## Location

Las Vegas, Nevada; Remote

## Employment Type

Full time

## Location Type

On-site

## Department

EngineeringMachine Learning

About TensorWave

Our mission is simple: deliver seamless, secure, reliable, and resilient AI compute at scale. We''ve built a versatile cloud platform that eliminates infrastructure barriers, empowering builders to focus on innovation instead of fighting their stack. Because breakthrough AI should move at the speed of ideas, not infrastructure.

About the Role

We’re looking for a Senior Machine Learning Engineer to join our team during an exciting phase of growth. In this role, you’ll be responsible for building and operating the core systems that power large-scale ML training and inference across TensorWave’s GPU platform, working closely with cross-functional partners to support business objectives while upholding our standards for excellence, collaboration, and impact.

What You’ll Do

Design, operate, and improve ML infrastructure systems supporting distributed training and inference workloads

Build reliable, repeatable workload execution and orchestration patterns across shared GPU environments

Troubleshoot performance, reliability, and scalability issues across the ML stack

Partner with ML, systems, and platform teams to improve developer experience and operational efficiency

Who You Are

Required Qualifications

Bachelor of Science in Computer Science, Computer Engineering, or a related technical field, or equivalent practical experience

Expertise supporting production ML systems using SLURM and Kubernetes

Strong understanding of GPU-accelerated workloads and distributed systems concepts

Solid Linux fundamentals and experience debugging infrastructure-level issues

Ability to build automation and tooling - Python, Go, etc.

Preferred Qualifications

Experience working across schedulers, orchest',
  'https://jobs.ashbyhq.com/tensorwave/a8d30c84-6cda-4504-ae3d-f427b46d42c3'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer @ ClaimSorted', 
  'machine-learning-engineer-@-claimsorted',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'AI'],
  'Machine Learning Engineer @ ClaimSorted

Machine Learning Engineer @ ClaimSorted',
  'https://jobs.ashbyhq.com/claimsorted/d05bc30a-52cb-4203-b489-1b43d2d2552a'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Machine Learning Engineer', 
  'senior-machine-learning-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  180000,
  280000,
  ARRAY['LLM', 'RAG', 'Agent', 'Fine-tuning', 'Rust'],
  'Senior Machine Learning Engineer - 1 @ Parspec
* [![Parspec](https://app.ashbyhq.com/api/images/org-theme-wordmark/27f53ac8-d414-4cae-998a-73042c14a973/ed310636-9e5b-4e8e-a895-d4c4702010ac/44e867e2-a6f7-43fa-b7b1-0bebdaa678bc.png)](http://parspec.io)
* [](https://jobs.ashbyhq.com/parspec)
*
# Senior Machine Learning Engineer - 1
## Location
Hybrid - Bangalore, India
## Employment Type
Full time
## Department
Parspec India
## **About Parspec**
Founded in 2021, Parspec is revolutionizing material procurement for the $13 trillion USD construction industry by digitizing and organizing the industry''s product data. Our proprietary AI technology maintains a current and comprehensive catalogue of millions of products, enabling our customers to identify products that best meet their needs - instantly. Trusted by top designers, builders, distributors and sales agents and backed by leading venture investors, Parspec is paving the way for a more innovative, connected, and sustainable future in construction.
Join us in building transformative technology that reshapes one of the world’s oldest and largest industries.
## **The Opportunity**
We are seeking a talented and passionate Senior Machine Learning Engineer to join our AI team and play a driving role in developing cutting-edge AI systems. As a key member of the team, you will design, develop, and deploy state-of-the-art machine learning models, including LLM optimizations. You will work on challenging data science problems while collaborating closely with business, product, and engineering teams to deliver impactful AI-driven features. As a Senior ML Engineer, you''ll not only lead complex technical initiatives but also actively mentor junior team members and drive projects from ideation to deployment.
This is a unique opportunity to be at the forefront of innovation, leveraging advanced AI technologies to transform an industry ripe for digital disruption.
##
**What You Will Achieve and Key Responsibilities**
### **Research, ',
  'https://jobs.ashbyhq.com/parspec/e6ef5033-1497-4272-abee-5358ee6340c3'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior ML Engineer @ Datatonic', 
  'senior-ml-engineer-@-datatonic',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  180000,
  280000,
  ARRAY['RAG', 'Python', 'Rust', 'GenAI', 'Generative AI'],
  'Senior ML Engineer @ Datatonic

- Back to Datatonic’s Job Listings

# Senior ML Engineer

## Location

Stockholm

## Employment Type

Full time

## Location Type

Hybrid

## Department

Technical Delivery

Senior Machine Learning Engineer

### Shape the Future of AI & Data with Us

At Datatonic, we are Google Cloud''s premier partner in AI, driving transformation for world-class businesses. We push the boundaries of technology with expertise in machine learning, data engineering, and analytics on Google Cloud Platform.

By partnering with us, clients future-proof their operations, unlock actionable insights, and stay ahead of the curve in a rapidly evolving world.

### Your Mission

As a Senior Machine Learning Engineer, you''ll know how to engineer beautiful code in Python and take pride in what you produce.

You''ll be an advocate of high-quality engineering and best-practice in production software as well as rapid prototypes.

Whilst the position is a hands-on technical role, we''d be particularly interested to find candidates with a desire to lead projects and take an active role in leading client discussions.

Your responsibilities will involve building trusted relationships with prospects, finding creative ways to use machine learning to solve problems, scoping projects, and overseeing the delivery of these engagements.

To be successful, you will need strong ML & Data Science fundamentals and will know the right tools and approach for each ML use case. You''ll be comfortable with model optimisation and deployment tools and practices.

Furthermore, you''ll also need excellent communication and consulting skills, with the desire to meet real business needs and deliver innovative solutions using AI & Cloud.

### What You’ll Do

Translating Requirements: Interpret vague requirements and develop models to solve real-world problems.

Data Science: Conduct ML experiments using programming languages with machine learning libraries.

GenAI: Leverage generative AI to develop',
  'https://jobs.ashbyhq.com/datatonic/ecd70031-bb15-453b-8528-452f5f575b9c'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Staff Machine Learning Engineer, AI Generation Engine @ SandboxAQ', 
  'staff-machine-learning-engineer,-ai-generation-eng',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['RAG', 'Agent', 'Rust'],
  'Staff Machine Learning Engineer, AI Generation Engine @ SandboxAQ

- Back to SandboxAQ’s Job Listings

# Staff Machine Learning Engineer, AI Generation Engine

## Location

United States

## Employment Type

Full time

## Location Type

Remote

## Department

AI Generation Engine

## Compensation

- US Tier 1$196K – $294K
- US Tier 2$176.4K – $264.6K
- US Tier 3$156.8K – $235.2K

At SandboxAQ, we are committed to competitive, equitable, and transparent compensation; we continuously benchmark our salaries and total compensation to premium markets to ensure our competitiveness. Individual pay within the above range is determined by job-related skills, experience, education, and geographic location.

With a focus on pay equity and ensuring opportunity for future salary progression, our typical practice is to hire within the first half of the base salary range for a given role and level. This approach allows us to reward performance and increasing expertise consistently as your career develops with us.

We use geographic pay tiers to reflect the pay differences in local markets:For the US:

Tier 1: Applies to candidates within 50 miles of New York, San Francisco, San Jose, Seattle, Wash D.C., Boston

Tier 2: Applies to candidates within 50 miles of Portland, Boulder, Austin, Denver, Chicago, San Diego, Miami, Houston, Dallas, Philadelphia, LA

Tier 3: Everywhere else in the US

For the UK:

Tier 1: Applies to candidates within 50 miles of London, Cambridge, Oxford

Tier 2: Everywhere else in the UK

For Canada:

Tier 1: Applies to candidates within 50 miles of Toronto & Vancouver

Tier 2: Everywhere else in Canada

## About SandboxAQ

SandboxAQ is a high-growth company delivering AI solutions that address some of the world''s greatest challenges. The company’s Large Quantitative Models (LQMs) power advances in life sciences, financial services, navigation, cybersecurity, and other sectors.

We are a global team that is tech-focused and includes experts in AI, chemistry, ',
  'https://jobs.ashbyhq.com/sandboxaq/f760ffd1-3795-4fb1-bb33-8478d4bab7f6'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Research Engineer @ Roboflow', 
  'machine-learning-research-engineer-@-roboflow',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['RAG', 'Python', 'Computer Vision'],
  'Machine Learning Research Engineer @ Roboflow

- Back to Roboflow’s Job Listings

# Machine Learning Research Engineer

## Location

Remote

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## Who We Are

Our mission is to make the world programmable. Sight is one of the key ways we understand the world, and soon this will be true for the software we use, too.

We’re building the tools, community, and resources needed to make the world programmable with artificial intelligence. Roboflow simplifies building and using computer vision models. Today, over 1M+ developers, including those from half the Fortune 100, use Roboflow’s machine learning open source and hosted tools. That includes counting cells to accelerate cancer research, improving construction site safety, digitizing floor plans, preserving coral reef populations, guiding drone flight, and much more.

Our team is small relative to our impact, and we believe our user success is our success (not the inverse). A team member summarized: “Roboflow is a company full of giant brains and tiny egos.” We find software has a multiplier effect on all roles (not only product and engineering), so Roboflow employs developers across the company in design, sales, customer support, marketing, and beyond.

We’re supported by great customers and investors, having raised over 63 million from Google Ventures, Y Combinator, Craft Ventures, Sam Altman, Lachy Groom, amongst other leading software investors.

## What You''ll Do

As a Machine Learning Research Engineer, you will develop novel machine learning methods and contribute to the research agenda of the team. Because of Roboflow’s huge userbase, we have a unique visibility into how people are using computer vision in the real world, including in what circumstances existing methods are unable to solve user problems.

Our Research Team’s mission is to introduce novel methods that generalize as well as possible across our user base. This include',
  'https://jobs.ashbyhq.com/roboflow/40c3389e-c7ea-4054-8c90-05b1beb38bff'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Principal ML Engineer @ Rebar', 
  'principal-ml-engineer-@-rebar',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'New York, NY',
  false,
  'Full-time',
  220000,
  350000,
  ARRAY['Infrastructure', 'Computer Vision'],
  'Principal ML Engineer @ Rebar
* [![Rebar](https://app.ashbyhq.com/api/images/org-theme-wordmark/dfbed057-e8d6-4e63-abc6-3832cf9df8e1/1a1dc4f9-27fa-414e-8f91-29371207ade9/f1dcefae-3baa-44e2-a95c-159ba4bad4b5.png)](https://withrebar.ai)
* [](https://jobs.ashbyhq.com/rebar)
*
# Principal ML Engineer
## Location
New York City
## Employment Type
Full time
## Location Type
On-site
## Department
Engineering
## Background
Rebar is building the AI operating system for commercial HVAC, Electrical, and Plumbing.
Over the past year our quoting platform has processed tens of thousands of projects across North America and we’ve doubled our revenue in the first 6 weeks of this year. Our customers include many of the top firms in the industry. Some of these companies are running billion dollar construction projects on workflows that still look like it’s 1985.
Construction is 10% of GDP and still massively underserved by software. We are changing that.
We recently raised a $14M Series A from leading construction tech investors and are entering our next phase of growth. We are building a set of AI native products that will define how this industry operates.
We''re looking for a **Principal ML Engineer** to help define the future of AI at Rebar. In this role, you''ll combine hands-on technical excellence with long-term technical leadership, driving our strategy for computer vision systems, training infrastructure, and data. You''ll work alongside a small, highly capable engineering team to turn cutting-edge research into reliable, production-ready AI systems that solve real problems for our customers.
This role is ideal for someone who enjoys staying deeply technical while shaping how AI is built across an organization. You''ll lead by example through architecture, technical direction, mentorship, and execution rather than people management.
## Responsibilities
* **Model Training & Development**: Design and train deep learning models for layout analysis, image-to-graph, object detection, ',
  'https://jobs.ashbyhq.com/rebar/9939e1be-9d42-4cea-b17d-5dbebfade1f8'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'LLM Engineer (GenAI, NYC) @ GPTZero', 
  'llm-engineer-(genai,-nyc)-@-gptzero',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'New York, NY',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'LangChain', 'Agent', 'Python'],
  '# LLM Engineer (GenAI, NYC) @ GPTZero

**Location:** NYC Hybrid
**Type:** FullTime
**Workplace:** Hybrid
**Compensation:** $150K – $230K • Offers Equity

GPTZero is on a mission to restore trust and transparency on the internet. As the leading AI detection platform, we empower educators, students, journalists, marketers, and writers to navigate the evolving landscape of AI-generated content. With millions of users and institutions relying on us, we’re building a category-defining company at the intersection of AI and information integrity.

Our team comes from high-performing engineering cultures, including Meta, Perplexity, AWS, Affirm, and leading AI research labs, including Princeton, Caltech, and Vector Institute.

## About this role:

In this role, you''ll build the next generation of AI tools that preserve and enhance critical thinking for humanity. The ideal candidate is someone who is adept at creating reliable AI agents, prompt engineering, possesses a great product sense, and is also an excellent software engineer. You''ll be working on a fast-paced team of passionate builders to create industry-defining software that has attracted millions of users globally.

## What you''ll contribute:

- Fine-tune and evaluate state-of-the-art language models

- Optimize prompts to maximize classification accuracy, personalize outputs, and enforce style guidelines

- Develop multi-agent workflows incorporating data from diverse sources using RAG

- Improve and iterate on AI agents using observability and experimentation tools

- Stay up-to-date with the latest literature and emerging technologies to solve novel problems

- Work closely with product and design teams to develop intuitive applications that create societal impact

## Qualifications

- 3+ YOE in Python

- 1+ YOE in LLM framework like Langchain or LlamaIndex

- 1+ YOE with agentic or RAG applications

- Strong exploratory data analysis (EDA) skills to effectively leverage data in a way that informs pragmatic sol',
  'https://jobs.ashbyhq.com/GPTZero/9e23e2df-d15d-4bf5-a841-ced573fb8511'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Full Stack LLM Engineer @ Cerebras Systems', 
  'full-stack-llm-engineer-@-cerebras-systems',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['TensorFlow', 'LLM', 'Agent', 'Python'],
  'Full Stack LLM Engineer @ Cerebras Systems

- Back to Cerebras Systems’s Job Listings

# Full Stack LLM Engineer

## Location

Toronto Office

## Employment Type

Full time

## Location Type

Hybrid

## Department

Software

Cerebras Systems builds the world''s largest AI chip, 56 times larger than GPUs. This architecture allows Cerebras to deliver industry-leading training and inference speeds; over 10 times faster than GPU-based hyperscale cloud inference services. This order of magnitude increase in speed is transforming the user experience of AI applications, unlocking real-time iteration and increasing intelligence via additional agentic computation.Cerebras works with the leading model labs, global enterprises, and cutting-edge AI-native startups. OpenAI recently announced a multi-year partnership with Cerebras, to deploy 750 megawatts of scale, transforming key workloads with ultra high-speed inference.

About the RoleWe are seeking a versatile and experienced engineer to join our Inference Core Model Bringup team. This team is responsible to rapidly bring up state-of-the-art open-source models (like LLaMA, Qwen, etc) or customer-provided proprietary models on our Cerebras CSX systems. Success in this role requires a system-minded generalist who thrives in fast-paced bringup environments and is comfortable working across the entire Cerebras software stack.Your work will play a critical role in achieving unprecedented levels of performance, efficiency, and scalability for AI applications.

Responsibilities

Contribute to the end-to-end bring up of ML models on Cerebras CSX systems.

Work across the stack: model architecture translation, graph lowering, compiler optimizations, runtime integration, and performance tuning.

Debug performance and correctness issues spanning model code, compiler IRs, runtime behavior, and hardware utilization.

Propose and prototype improvements across tools, APIs, or automation flows to accelerate future bring ups.

Skills & Qualif',
  'https://jobs.ashbyhq.com/cerebras/c3890fd4-99de-4a22-b442-b6a77a717dfb'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'LLM Applications Engineer @ Uncountable Inc.', 
  'llm-applications-engineer-@-uncountable-inc.',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM'],
  'LLM Applications Engineer @ Uncountable Inc.

LLM Applications Engineer @ Uncountable Inc.',
  'https://jobs.ashbyhq.com/uncountable/c88f8550-635e-4bdd-9280-1cd40b7212c0'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer @ LiteLLM', 
  'ai-engineer-@-litellm',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM'],
  'AI Engineer @ LiteLLM

AI Engineer @ LiteLLM',
  'https://jobs.ashbyhq.com/litellm/6e025e39-6f8a-46bd-91f7-8784d1f5076b'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Hippocratic AI', 
  'hippocratic-ai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'Infrastructure', 'Rust', 'Generative AI'],
  'LLM Inference Engineer @ Hippocratic AI

- Back to Hippocratic AI’s Job Listings

# LLM Inference Engineer

## Location

Menlo Park, CA

## Employment Type

Full time

## Location Type

On-site

## Department

Product and Engineering

## About Us

Hippocratic AI is the leading generative AI company in healthcare. We have the only system that can have safe, autonomous, clinical conversations with patients. We have trained our own LLMs as part of our Polaris constellation, resulting in a system with over 99.9% accuracy.

## Why Join Our Team

Reinvent healthcare with AI that puts safety first. We’re building the world’s first healthcare‑only, safety‑focused LLM — a breakthrough platform designed to transform patient outcomes at a global scale. This is category creation.

Work with the people shaping the future. Hippocratic AI was co‑founded by CEO Munjal Shah and a team of physicians, hospital leaders, AI pioneers, and researchers from institutions like El Camino Health, Johns Hopkins, Washington University in St. Louis, Stanford, Google, Meta, Microsoft, and NVIDIA.

Backed by the world’s leading healthcare and AI investors. We recently raised a $126M Series C at a $3.5B valuation, led by Avenir Growth, bringing total funding to $404M with participation from CapitalG, General Catalyst, a16z, Kleiner Perkins, Premji Invest, UHS, Cincinnati Children’s, WellSpan Health, John Doerr, Rick Klausner, and others.

Build alongside the best in healthcare and AI. Join experts who’ve spent their careers improving care, advancing science, and building world‑changing technologies — ensuring our platform is powerful, trusted, and truly transformative.

Location Requirement

We believe the best ideas happen together. To support fast collaboration and a strong team culture, this role is expected to be in our Menlo Park office five days a week, unless otherwise specified.

## About the Role

We''re seeking an experienced LLM Inference Engineer to optimize our large language model (LLM)',
  'https://jobs.ashbyhq.com/Hippocratic%20AI/eef8a721-23de-4c20-bff0-56088b39afa0'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  '(Senior) AI/LLM Engineer @ Mercura', 
  '(senior)-ai/llm-engineer-@-mercura',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  180000,
  280000,
  ARRAY['LLM', 'RAG', 'Agent', 'Data Engineering'],
  '(Senior) AI/LLM Engineer @ Mercura

- Back to Mercura’s Job Listings

# (Senior) AI/LLM Engineer

## Location

Munich

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

Mercura (YC W25) helps the companies that build the real world move at software speed, automating the back-office work that runs the $12 trillion industry behind every hospital, school, and power plant. We started with one of their biggest bottlenecks - turning messy technical requests into accurate quotes - and grew to $2M ARR in our first year. With a team of 16, we''re now targeting $10M by the end of 2026 as well as our expansion into the US.

## About the role

As an AI/LLM Engineer, you will play a key role in building agentic AI systems end-to-end. This is a fast-paced, hands-on role for engineers with high agency, strong technical depth and founder mindset. You’ll work on building reliable AI systems in production - from retrieval and LLM orchestration to tool-using agents and product integration.

If you’re a passionate builder who excels at the intersection of LLMs, data systems, AI, data engineering, and full-stack development, this is your opportunity to shape how users interact with AI in real-world workflows.

## What you will be working on

Agentic Systems: Design and build LLM-powered agentic systems end-to-end, from experimentation to production deployment

Retrieval & Context: Build retrieval and context pipelines (RAG, hybrid search, structured retrieval) to enable reliable reasoning over large volumes of technical and commercial data

AI Evals: Develop evaluation and monitoring systems to measure and improve AI performance in production

Data Pipelines: Build scalable pipelines to process and structure large volumes of unstructured documents and data

Feedback Loops: Implement automated feedback pipelines that allow AI systems to learn from usage data and human feedback

AI Infra: Own the architecture and reliability of AI systems in production, ',
  'https://jobs.ashbyhq.com/mercura/90bb4d91-9311-4d6c-a30b-a2d6dc783a13'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'LLM Training Engineer @ Sciforium', 
  'llm-training-engineer-@-sciforium',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM'],
  'LLM Training Engineer @ Sciforium

LLM Training Engineer @ Sciforium',
  'https://jobs.ashbyhq.com/Sciforium/2c72c7ad-9da9-4738-af58-2650d22ec6de'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer @ Certa', 
  'ai-engineer-@-certa',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Python', 'Generative AI'],
  'AI Engineer @ Certa

- Back to Certa’s Job Listings

# AI Engineer

## Location

India

## Employment Type

Full time

## Department

Engineering

Certa is the AI-first third-party operating system. Enterprises, from the Fortune 500 to fast-growing startups, use our no-code platform to onboard, assess, and monitor their vendors, suppliers, and partners across risk, compliance, and ESG. We have processed over 10 million entities for 100,000+ users across 120+ countries, and are backed by Fin Capital, Vertex Ventures, and Point72 Ventures.

We''re looking for an experienced, innovative AI Engineer to push the boundaries of LLM technology and build intelligent features for our enterprise platform. Pairing strong Python and cloud backend skills with hands-on generative AI experience (LLMs, prompt engineering, RAG, and agents), you''ll design and deploy AI-driven solutions from prototype to production - helping define a new class of engineering role that blends robust system design with state-of-the-art AI.

## What You''ll Do

Design & ship AI features: Lead the design, development, and deployment of generative AI and LLM-powered services — intelligent chatbots, AI-driven recommendations, workflow automation - that deliver engaging, human-centric experiences.

Build RAG pipelines: Design, implement, and continuously optimize end-to-end RAG pipelines (data ingestion and parsing, chunking, vector indexing, prompt engineering) so our systems retrieve and use knowledge accurately.

Build LLM agents: Develop and refine LLM-based agentic systems for complex, multi-step tasks - incorporating planning, memory, and tool use, and applying emerging best practices to make agents more reliable.

Evaluate & iterate: Rigorously evaluate models and pipelines on accuracy, latency, and hallucination rate, using thorough testing and user feedback to improve prompts, parameters, and data processing.

Engineer for production: Write clean, maintainable, testable code with strong monitoring and ',
  'https://jobs.ashbyhq.com/certa/da4d5879-d94d-4f8c-ada4-24bd955520e3'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer, Multimodal LLMs @ Eloquent AI', 
  'ai-engineer,-multimodal-llms-@-eloquent-ai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['TensorFlow', 'LLM', 'RAG', 'Agent', 'Fine-tuning'],
  'AI Engineer, Multimodal LLMs @ Eloquent AI

- Back to Eloquent AI’s Job Listings

# AI Engineer, Multimodal LLMs

## Location

San Francisco

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

## Meet Eloquent AI

At Eloquent AI, we’re building the next generation of AI Operators—multimodal, autonomous systems that execute complex workflows across fragmented tools with human-level precision. Our technology goes far beyond chat: it sees, reads, clicks, types, and makes decisions—transforming how work gets done in regulated, high-stakes environments.

We’re already powering some of the world’s leading financial institutions and insurers, fundamentally changing how millions of people manage their finances every day. From automating compliance reviews to handling customer operations, our Operators are quietly replacing repetitive, manual tasks with intelligent, end-to-end execution.

Headquartered in San Francisco with a global footprint, Eloquent AI is a fast-growing company backed by top-tier investors. Join us to work alongside world-class talent in AI, engineering, and product as we redefine the future of financial services.

Your Role

As an AI Engineer at Eloquent AI, you will be at the forefront of building, deploying, and optimizing enterprise-grade AI agents that handle high-stakes conversations. You’ll work directly with software engineers, deep learning experts and AI researchers to design intelligent agents that understand, take action, and deliver real business impact.

This role requires a mix of software development, AI integration, and problem-solving skills, with the ability to customize, optimize, and scale AI models for real-world enterprise applications. If you''re passionate about LLMs, conversational AI, and solving last-mile AI adoption challenges, this role is for you.

You will:

Build, deploy, and optimize AI agents that engage in enterprise-grade conversations.

Design & develop next-gen multimodal LLM archite',
  'https://jobs.ashbyhq.com/eloquentai/41c12538-9543-4a0b-a84f-034f4cb2db9a'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI/ML Engineer @ Profound', 
  'ai/ml-engineer-@-profound',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Python', 'NLP'],
  'AI/ML Engineer @ Profound

- Back to Profound’s Job Listings

# AI/ML Engineer

## Location

New York, New York; San Francisco, California

## Employment Type

Full time

## Location Type

On-site

## Department

EPDDData

## Compensation

- $160K – $250K • Offers Equity

Profound is the marketing platform for the age of AI search. The way brands reach people is being rewritten — AI models like ChatGPT, Perplexity, and Google AI Mode are now the answer layer between companies and their customers. We built the platform marketers use to understand, measure, and win in that world: the analytics, intelligence, and agent automation that turn AI search from a threat into a competitive advantage.

We went from 0 to a $1B valuation in 18 months. Revenue grew 100x last year. Our customers include Ramp, Figma, Spotify, Nike, Apple, AWS, Reddit, and JPMC. We are backed by Sequoia, Kleiner Perkins, LSVP, and Khosla Ventures — and we are moving fast enough that the people joining now are building the playbook everyone who comes after them will run.

As an AI and ML Engineer, you will design, build, and ship large scale NLP and LLM systems that power classification, ranking, clustering, topic discovery, and content generation. You will own workflows from data to deployment, partner across product and engineering, and turn real user conversations into production features and publish-ready content that drives visibility, engagement, and conversion.

### What you’ll do

Build and deploy NLP models at scale for classification, ranking, clustering, topic extraction, and summarization

Design LLM workflows for context and content generation end to end, including topic discovery, brief creation, outlines and drafts, revision loops, and publish-ready assets

Develop prompt and template libraries aligned to brand voice and channel, including blogs, landing pages, help docs, and ads, with retrieval for evidence-grounded generation and citations

Create evaluation frameworks for generated c',
  'https://jobs.ashbyhq.com/profound/08484c30-121a-4d1f-961b-09518f14337a'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer: LLM Interpretability & Systems', 
  'machine-learning-engineer:-llm-interpretability-&-',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM'],
  'Machine Learning Engineer: LLM Interpretability & Systems @ CTGT

Machine Learning Engineer: LLM Interpretability &amp; Systems @ CTGT',
  'https://jobs.ashbyhq.com/ctgt/c6916802-4158-4f24-b4b1-ac978157b6d9'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer', 
  'ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'LangChain', 'Agent', 'Fine-tuning'],
  '# AI Engineer - India @ Pulsora, Inc.

**Location:** India
**Type:** FullTime

Founded in 2021, [Pulsora](https://pulsesg.com/) the “Enterprise Sustainability Platform”, is a well-funded Silicon Valley software startup.  It is dedicated to empowering purpose-driven enterprises to manage and improve their environmental, social, and governance (ESG) and overall sustainability footprint with an integrated, comprehensive, flexible, and innovative technology platform built for compliance, tracking, and insight. We are well funded, have amazing customers across industries and geographies, established strategic partnerships with leading ERP and consulting firms, and are growing fast! 

### **About the job**

We are seeking a highly skilled and experienced AI/ML Developer to join our team. The ideal candidate will be a specialist in the rapidly evolving field of Large Language Models (LLMs) and generative AI, with a strong background in developing, integrating, and optimizing complex agentic and RAG-based systems. 

### **What you will do**

- **LLM Integration & Development**: Design, develop, and deploy production-grade applications leveraging various LLMs, context optimization, etc.

- **Agentic Workflows**: Architect and implement sophisticated, multi-step and multi-agent workflows using frameworks like LangChain and LangGraph.

- **Retrieval Augmented Generation (RAG)**: Build and optimize RAG pipelines, including implementing and managing embeddings, vector databases, and advanced rerankers to enhance response quality and relevance.

- **Vibe Coding:** Use code generation applications (e.g. Replit, Cursor, Google AI Studio, Git Hub Copilot in Agent mode, etc.) to create full applications (including frontend and backend), generate tests, perform testing and integrate them in the core product without writing any code.

- **LLM Fine Tuning**: Lead efforts in LLM fine-tuning (e.g., LoRA, QLoRA) for specific domain knowledge and tasks, and implement strategies for and effi',
  'https://jobs.ashbyhq.com/Pulsora%20Inc/94d2db5c-8e55-48ec-ad52-738691a34924'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Software Engineer', 
  'software-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'AI'],
  'Software Engineer - Model Performance @ Baseten',
  'https://jobs.ashbyhq.com/baseten/d29e748c-7209-460d-a024-8f77ae0a3d4d'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Fullstack Software Engineer, Applied AI @ LangChain', 
  'fullstack-software-engineer,-applied-ai-@-langchai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LangChain', 'Agent'],
  'Fullstack Software Engineer, Applied AI @ LangChain

- Back to LangChain’s Job Listings

# Fullstack Software Engineer, Applied AI

## Location

San Francisco, CA; New York, NY

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

# About Us

At LangChain, our mission is to make intelligent agents ubiquitous. We build the foundation for agent engineering in the real world, helping developers move from prototypes to production-ready AI agents that teams can rely on. We began as widely adopted open-source tools and have grown to also offer a platform for building, evaluating, deploying, and operating agents at scale.

With $125M raised at Series B from IVP, Sequoia, Benchmark, CapitalG, and Sapphire Ventures, we’re at a stage where we’re continuing to develop new products, growth is accelerating, and all team members have meaningful impact on what we build and how we work together. LangChain is a place where your contributions can shape how this technology shows up in the real world.

Today, our platform includes LangSmith (Observability, Evaluation, Deployment, Fleet, and Sandboxes), our open source frameworks (LangChain, LangGraph, and Deep Agents), and the newly launched LangSmith Engine for autonomous agent improvement. We have 100M+ monthly open source downloads, 6,000+ active LangSmith customers, and 5 of the Fortune 10 use LangSmith in production (+ 35% of the Fortune 500 overall), including teams at Klarna, Clay, Coinbase, Workday, Lyft, Cloudflare, Harvey, Rippling, Vanta, LinkedIn, Monday.com, Nvidia, and Bridgewater.

# About The Team

The Applied AI team builds the agents that show the world what''s possible with LangChain. We ship open source reference agents like Open SWE, Open Canvas, and our Deep Research agent that developers across the community use as starting points for their own production systems, while also building internal agents that power LangChain''s own GTM and engineering workflows. It''s a small, fast-moving',
  'https://jobs.ashbyhq.com/LangChain/c75915ba-a32b-4e17-873d-19b47564170d'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI & ML Engineer @ Sandstone', 
  'ai-&-ml-engineer-@-sandstone',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'New York, NY',
  false,
  'Contract',
  140000,
  220000,
  ARRAY['LLM', 'Agent', 'Infrastructure', 'Rust'],
  'AI & ML Engineer @ Sandstone

- Back to Sandstone’s Job Listings

# AI & ML Engineer

## Location

New York, New York

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

## Compensation

- $225K – $300K • Offers Equity

## About Sandstone

Sandstone is on a mission to elevate in-house legal from a support function into a true strategic partner. From day one, we’ve been clear about what we are—and are not. We are not replacing in-house legal teams. We are building a platform that amplifies them.

Our platform enables modern legal teams to move at the speed of AI, deliver better outcomes, and create measurable business value. We unify legal data, power end-to-end workflows, and organize business context within the tools teams already use. Sandstone is the home for AI-native legal departments.

Today, Sandstone is trusted by Fortune 500 companies and fast-growing innovators alike. We ship quickly, iterate relentlessly, and scale with intention.

When you join Sandstone, you become part of a team that believes deeply in the compounding power of collaboration, rigorous problem-solving, and obsessive attention to detail. Our engineering team is elite, our lawyers ship code every day, and we are dedicated to building the most delightful product an in-house lawyer opens in the morning—and closes at the end of the day.

## The Role

Sandstone is building the AI-native operating system for in-house legal teams. As an AI & ML Engineer, you will build the systems that make that possible: agents that reason over contracts and business context, retrieval systems that surface the right precedent, document understanding pipelines that turn legal work into structured intelligence, and evals that help us measure and improve quality.

This is an applied AI product engineering role. You will own production AI systems end-to-end, from problem definition and data strategy through model behavior, orchestration, reliability, UX, and launch. You will work ',
  'https://jobs.ashbyhq.com/sandstone/60245340-bedd-4f0c-b3b9-ed27c924b973'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Builder', 
  'builder',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM'],
  'Builder - AI Engineer @ Reevo

- Back to Reevo’s Job Listings

# Builder - AI Engineer

## Location

Santa Clara

## Employment Type

Full time

## Department

Engineering

## Compensation

- $200K – $245K • Offers Equity

Location: Onsite - Santa Clara, CA

About this role:We are seeking AI-focused Software Engineers at all levels (Junior, Senior, Staff, Senior Staff) who thrive as T-shaped individuals—bringing deep technical expertise in AI/LLM systems while possessing a broad range of skills that allow them to build production-ready AI applications. The ideal candidate is highly innovative, with a passion for solving complex AI challenges and creating intelligent systems that enhance user experiences, all while maintaining a high standard of engineering excellence.

In this role, you will collaborate with engineering, product, and data teams to design and implement AI-powered features and systems. You will be expected to bring both cutting-edge AI knowledge and practical engineering skills to build scalable, reliable AI applications that directly impact our users.

Join us at Reevo Inc., where our initial focus on enhancing workflows for Account Executives (AE) and Sales Development Representatives (SDR) has laid the foundation for our ambitious goal to build an end-to-end solution designed to replace the entire CRM ecosystem and its point solutions. Backed by top tier venture investors in Silicon Valley and tens of millions raised, we are poised to redefine sales technology. This is your opportunity to be a pivotal part of a dynamic team committed to transforming how businesses manage their sales processes.

ABOUT REEVO: At Reevo, we''re reimagining the entire revenue stack from the ground up, and we''re doing it with speed. We''re building software that orchestrates every go-to-market motion, enabling B2B teams to operate faster, smarter, and more collaboratively. By combining automation, intelligence, and a radically intuitive interface, we''re helping companies u',
  'https://jobs.ashbyhq.com/reevo/c14a5fc2-8ab5-4585-b84e-8ff0e87227db'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Canals', 
  'canals',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Infrastructure'],
  'Canals - ML/AI Engineer @ Silver.dev

- Back to Silver.dev’s Job Listings

# Canals - ML/AI Engineer

## Location

Argentina; Colombia; Uruguay

## Employment Type

Full time

## Location Type

Remote

## Department

Engineering

## About Canals

Canals builds software for wholesale distributors, helping them operate more efficiently through automation and AI. Our customers are the companies responsible for moving the materials that power the real economy: electrical supplies, plumbing products, roofing materials, HVAC equipment, and more. Every day, thousands of people rely on Canals to help process orders, manage purchasing, handle accounts payable, and streamline critical business workflows.

We’re a profitable, rapidly growing company with a team of roughly 100 people distributed across North and South America. We care deeply about building great products, hiring exceptional people, and creating an environment where talented individuals can do the best work of their careers.

## The Opportunity

AI is becoming central to how our customers operate, from automating repetitive workflows to making complex operational decisions faster and more accurately. As Canals continues to grow, we’re looking for an ML/AI Engineer to help build and scale intelligent systems across our platform. This is a highly applied role focused on shipping production-grade AI features that create measurable business value.

You’ll work at the intersection of machine learning, backend systems, and product engineering, building solutions that improve how wholesale distributors process orders, manage purchasing, classify documents, and automate critical workflows.

This role is ideal for engineers who enjoy owning AI products end-to-end: from experimentation and model development to deployment, monitoring, and iteration in production.

## What You’ll Do

Design, build, and deploy AI-powered product features across Canals’ core workflows.

Develop and maintain LLM-powered systems, including agen',
  'https://jobs.ashbyhq.com/silver/b300b2f8-11b0-4dc7-bd7c-ccb62cc04aba'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Engineer @ Boom', 
  'ai-engineer-@-boom',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['RAG', 'Agent'],
  'AI Engineer @ Boom

- Back to Boom’s Job Listings

# AI Engineer

## Location

Austin Texas

## Employment Type

Full time

## Location Type

On-site

## Department

Engineering

## Compensation

- $120K – $200K • 0.01% – 0.15%

# About the job

## Our mission

Boom is on a mission to level the playing field for the 110+ million renters in the US by making housing more flexible, affordable, and rewarding. Boom is building a suite of rental financial services for renters and property managers, including tenant screening, rent payment reporting, rent reporting-as-a-service, and a number of integrations with the largest property management systems (PMS). Boom serves renters through the Boom App and property managers via the Boom Platform. Now serving thousands of renters, Boom is led by second-time founder Rob Whiting(ex-BCG, Rubicon). It''s backed by investors such as Starting Line, Clocktower Ventures, Gilgamesh Ventures(Petal co-founders), and angels such as William Hockey and Zach Perret(Co-founders of Plaid) and Harry Stebbings. Boom has been profiled by Inman, Business Insider, HousingWire, and more.

## Opportunity

We''re expanding our engineering team to meet the growing demands of our B2B partners and B2C users. AI is central to Boom''s vision on two fronts. Externally, we''re building the agentic operational layer for residential real estate: standalone agents (leasing, application, underwriting) and AI woven across every product. Internally, we use AI to make every team at Boom move faster, from engineering and product to operations, customer success, and sales.

We''re looking for an AI Engineer to ship production-grade customer-facing agents, drive Boom''s internal AI productivity, and push the state of what AI can do in our space.

This role offers the chance to work closely with our Co-founders, product leadership, and senior engineers, contributing directly to the growth of the company as we move from Seed to Series A and beyond. For this role, we are hiring',
  'https://jobs.ashbyhq.com/Boom/5c08f741-1f65-427c-90b1-7ccb9349e866'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Agentic Engineer (all genders)', 
  'agentic-engineer-(all-genders)',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'LangChain', 'Agent'],
  '# Agentic Engineer (all genders) @ Thorit

**Location:** Lisbon Office
**Type:** FullTime

### **About the Role**

You''ll design and ship production multi-agent systems for enterprise clients, the AUTOMATE layer of our Agentic Growth Stack. That means orchestrating fleets of LLM agents that qualify leads, draft outreach, coach revenue teams, and write back to CRM, on a reliability bar where they actually run in production for months without losing the plot.

You''ll own the orchestration topology, the tool ecosystem, the agent memory architecture, the human-in-the-loop checkpoints, and the observability stack. As the senior anchor for agentic engineering depth in Lisbon, you''ll also be the buddy and senior reviewer for our Tbilisi Agentic Engineer when that hire ramps later in the year.

This is engineering, not research. We ship.

### **What You''ll Do**

- You''ll **ship 3+ production multi-agent systems** to enterprise clients within your first 12 months (deployed, signed-off, in active use as AUTOMATE-layer engagements)

- You''ll **build and maintain our reusable agent orchestration framework**: orchestrator pattern, tool-calling layer, agent memory layer, human-in-the-loop hooks, observability hooks, usable by every future Agentic Engineer across all sites

- You''ll **establish our agent observability and reliability stack**: tracing, cost dashboards, drift monitoring, error-recovery and fallback patterns, with documented SLAs per agent type

- You''ll **establish our agent quality bar**: every shipped multi-agent system has documented orchestration-level evals (not just per-tool unit evals), a rollback plan, and an incident playbook

- You''ll **pair daily with the Tbilisi Agentic Engineer** once that hire ramps, with the explicit goal that Tbilisi takes ownership of at least one production agent within 6 months of joining

- You''ll **co-author 2+ public-facing technical assets** (blog post, webinar, conference talk) on our multi-agent architecture approach

- You''',
  'https://jobs.ashbyhq.com/thorit/13fc5ea3-8d7e-4be1-b41b-437aec00d4a1'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for AI Engineer', 
  'job-application-for-ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Part-time',
  140000,
  220000,
  ARRAY['RAG', 'Rust'],
  'Explore Careers - TEGNA

## TEGNA employees help people thrive in their local communities by providing the trusted local news and services that matter most.

#### Journalism and News

Our journalists uncover the truth, expose injustice, and give a voice to those who need it. We look for storytellers inspired by our purpose to serve the greater good.

Explore Careers

#### Advertising Sales and Marketing

Unlock your potential in advertising sales and marketing, where creativity meets strategy, and ideas have the power to make a difference.

Explore Careers

#### Technology and Engineering

Join our dynamic team at the forefront of innovation in technology and broadcast engineering.

Explore Careers

#### PREMION

Shape the future of digital advertising at PREMION, our industry-leading over-the-top/connected television advertising platform.

Explore Careers

#### Digital

Whether reporting, producing, podcasting, or ensuring our audiences have access to news and information wherever they are, unlock your digital career potential.

Explore Careers

#### Internships and Residencies

Explore our dynamic internship and residency opportunities, where aspiring journalists, producers, marketers and sales professionals can thrive and gain hands-on experience.

Explore Careers

All Departments All Locations All Jobs Full-time Part-time Temporary All Work Types Hybrid On-site Remote

Reset Filters

## Learn more about TEGNA

#### Benefits

We offer comprehensive health and wellness coverage to stay healthy, build financial security and maintain work-life balance.

#### Professional Development and Innovation

TEGNA offers a winning culture that embraces innovative ideas and helps you achieve your career goals.

Stay vigilant against recruitment fraud. Click here for more information.',
  'https://boards.greenhouse.io/tegnainc/jobs/4870922007?gh_jid=4870922007'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Principal AI Engineer', 
  'job-application-for-principal-ai-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  220000,
  350000,
  ARRAY['RAG', 'LangChain', 'Python', 'Computer Vision', 'NLP'],
  'Job Application for Principal AI Engineer at ALO

# Principal AI Engineer

Beverly Hills, California, United States

Apply

WHY JOIN ALO?

Mindful movement. It’s at the core of why we do what we do at ALO—it’s our calling. Because mindful movement in the studio leads to better living. It changes who yogis are off the mat, making their lives and their communities better. That’s the real meaning of studio-to-street: taking the consciousness from practice on the mat and putting it into practice in life.

OVERVIEW

Join ALO’s Artificial Intelligence and Data Science team to explore the frontiers of applied AI in wellness, fashion, and retail. You’ll build intelligent systems that power personalization, content generation, computer vision, and decision automation.

We’re looking for a hands-on AI Engineer who loves to build. You’ll design and deploy bespoke, high-impact AI solutions that stretch across product design, marketing, supply chain, customer experience, and engineering. Some projects will be fast-turnaround proofs of concept; others will grow into scalable internal platforms. You’ll balance the art of creative experimentation with the discipline of technical rigor—knowing when to build from scratch and when to leverage what already exists.

RESPONSIBILITIES

Build bespoke AI solutions to accelerate business outcomes—anything from product image generation to conversational assistants or process automation.

Prototype rapidly using APIs, open models, and cloud-native services to validate ideas and demonstrate value.

Design for scale—transition ad hoc experiments into maintainable, production-grade systems or reusable components.

Evaluate external AI platforms and tools for integration potential, cost, and business fit.

Collaborate cross-functionally with marketing, design, supply chain, retail operations, and engineering teams to translate real problems into AI-enabled solutions.

Implement responsible AI practices that ensure transparency, fairness, and expla',
  'https://boards.greenhouse.io/aloyoga/jobs/5726560004?gh_jid=5726560004'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Staff Engineer, AI', 
  'job-application-for-staff-engineer,-ai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  180000,
  280000,
  ARRAY['Python', 'Rust'],
  'Job Application for Staff Engineer, AI at BlackSky

# Staff Engineer, AI

Herndon, VA

Apply

Staff AI Engineer

About Us:

BlackSky is a real-time intelligence company. We own and operate the world''s most advanced space-based intelligence platform and provide customers satellite imagery, automated analytics and high-frequency monitoring of strategic locations, economic assets and events from around the globe. BlackSky is trusted by the most demanding allied military and intelligence organizations and commercial companies to deliver foresight into critical matters that affect national security and the economy. BlackSky''s data enables governments and businesses to see, understand and anticipate change as it happens, giving them the ultimate strategic advantage so they can act quickly. Our global team works with cutting-edge technology to make a difference around the world and prides itself on being people-first, customer-focused and fun.

BlackSky is seeking a Staff AI Engineer to lead the architecture, development, and delivery of mission-critical AI solutions within customer environments. This is a hands-on role and an opportunity to develop and shape an exciting new growth area. The ideal candidate for this role blends deep technical ownership (roadmap, R&D, AI/ML systems) with customer-facing solution delivery (scoping, prototype-to-production, and executive communication). This senior individual contributor role will partner with CV, MLOps, Data QA, Solutions, and BD teams to ensure BlackSky delivers reliable and actionable insights. The role will be full-time based out of Herndon, VA working in our SCIF with occasional customer site commitments and will report to the Senior Manager of AI.

Responsibilities:

- Partner with CV and MLOps to design and extend components needed to ensure models are trained, versioned, deployed, monitored, and maintained reliably in customer environments.
- Collaborate with the Data QA team to define annotation standards, resolve ta',
  'https://boards.greenhouse.io/blacksky/jobs/8535559002?gh_jid=8535559002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer/AI Engineer (Infra)', 
  'machine-learning-engineer/ai-engineer-(infra)',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['RAG', 'Infrastructure', 'Computer Vision'],
  'Job Application for Machine Learning Engineer/AI Engineer (Infra) at Sertis

New

# Machine Learning Engineer/AI Engineer (Infra)

Bangkok, Bangkok Metropolis, Thailand

Apply

### Who We Are

Located in the heart of Bangkok’s Phrom Phong District, Sertis is ASEAN''s leading Data and AI engineering and solutions company. Since 2014, our advanced solutions and products have powered over 400 enterprise Data and AI deployments at the region’s leading companies and conglomerates. We are also a member firm of Andersen Consulting, a global consulting practice integrating business strategy, digital transformation, and AI-driven technology solutions with Andersen Global’s world-class expertise.

### What We Do

Sertis provides both productized and bespoke AI and Data solutions for our Customers, optimizing and commercializing their data in ways that activate real business results. Our 140+ team have developed product offerings and IP ranging from advanced Computer Vision applications accredited Global Top 20 by NIST, to automated insights monetization for Retailers, eKYC for financial institutions, AI-driven agricultural safety assurance, precision steel cutting, trading algorithms for hedge funds, and enterprise knowledge management systems based on AI.

### Our Aspiration

We are data and AI pioneers, dedicated to enhancing the economic and social lives of our customers via technology. We are not just living in history, we are making history everyday. In becoming one of the world’s leading Data and AI companies, we always double-down on remaining a place where a diverse mix of talent wants to come, do their best work, and stay. We pride ourselves on bringing the best talent worldwide into a culture that encourages learning, growth opportunities, innovative contributions, and a sense of ownership. As part of Andersen Consulting, we are committed to delivering best-in-class Data and AI solutions—aligned with a global platform known for innovation, integration, and impact—whi',
  'https://boards.greenhouse.io/sertis/jobs/8623775002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Perception / Computer Vision Software Engineer', 
  'perception-/-computer-vision-software-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  200000,
  400000,
  ARRAY['CUDA', 'Computer Vision', 'Data Engineering'],
  'Job Application for Helix AI Engineer, Perception at Figure

# Helix AI Engineer, Perception

San Jose, CA

Apply

Figure is an AI Robotics company developing a general purpose humanoid. Our humanoid robot, Figure 03, is designed for commercial tasks and the home. We are based in San Jose, CA and require 5 days/week in-office collaboration. It’s time to build.

Figure’s vision is to deploy autonomous humanoids at a global scale. Our Helix team is looking for Perception Engineers to empower Figure humanoid robots to perform highly dynamic operations in demanding real-world environments.

Responsibilities:

- Develop perception systems including onboard computer vision, localization, visuomotor policies, and offline data annotation.
- Own the end-to-end product life cycle from initial ideation to deployment.
- Deliver high-quality, reliable software solutions for real-world application.
- Collaborate cross-functionally to evolve and optimize our autonomy stack.

Requirements:

- Extensive experience in production-level software and ML engineering best practices.
- Strong mathematical foundation in probability, optimization, and linear algebra.
- Domain expertise in at least one of the following areas: 3D Vision, VIO / SLAM, Vision-Language Model (VLM), Diffusion Models.
- Proficiency with geometric computer vision concepts, including perspective transformation, the pinhole camera model, and epipolar geometry.
- Ability to thrive in a fast-paced environment that demands exploration and creative problem-solving.
- Passion for advancing humanoid robotics.

Bonus Qualifications:

- Experience with CUDA programming and real-time systems performance optimization.
- Familiarity with scalable data engineering toolchains like Spark and Ray.
- Strong publication record in a relevant field.
- Proven success in developing and deploying production-grade systems.

The US base salary range for this full-time position is between $200,000 - $400,000

The pay offered for this position ',
  'https://boards.greenhouse.io/figureai/jobs/4007375006'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Staff ML Engineer, Applied AI', 
  'job-application-for-staff-ml-engineer,-applied-ai',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'Remote',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['LLM', 'Agent', 'Fine-tuning', 'Generative AI'],
  'Job Application for Staff ML Engineer, Applied AI at TIFIN

# Staff ML Engineer, Applied AI

at TIFIN(View all jobs)

Boulder, CO, Charlotte, NC or Remote

WHO WE ARE

TIFIN builds AI-powered financial technology that personalizes and improves financial advice across consumers, advisors, workplaces, and institutions. Our modular platform embeds finance-tuned AI to deliver dynamic, tailored guidance at scale—without added complexity. Combining proprietary models, specialized data, and a fast-paced engineering culture, we create secure, compliant tools that power real outcomes. Other differentiators include:

- World-Class Team: Complimentary financial services & technical expertise from Google, Microsoft, Uber, PayPal, eBay, Techstars, BlackRock, LPL, Franklin Templeton, Morgan Stanley, Broadridge and more.
- Strategic Partners: Partners include J.P. Morgan, Franklin Templeton, Morningstar, Broadridge, Hamilton Lane, Motive Partners and SEI.
- Track Record: Previous exits include 55ip (acquired by J.P. Morgan) and Paralel
- Speed: Our ability to stand up businesses at 2-4x the speed of typical fintech companies (building MVPs in 3 months and production-ready products in 6-12 months)

OUR VALUES: Go with your GUT

- I Win for Teamwin. We believe in staying within our genius zones to succeed and taking accountability for driving results. We are all individual contributors first and always thinking about what can be better.
- Understanding through Listening and Speaking the Truth. We communicate with authenticity, precision and integrity to create a shared understanding. We identify opportunities within constraints and propose solutions in service to the team.
- Grow at the Edge. We are driven by personal growth fueled by a beginner’s mindset. We get out of our comfort zone and keep egos aside. With self-awareness and integrity we strive to be the best we can possibly be. No excuses.

ROLE OVERVIEW

As a Staff ML Engineer on the Applied AI team, you will own and lead pr',
  'https://boards.greenhouse.io/embed/job_app?for=tifin&token=5381137004'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Machine Learning Software Engineer', 
  'job-application-for-machine-learning-software-engi',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'London, UK',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['RAG', 'Infrastructure', 'Python', 'Rust'],
  'Job Application for Machine Learning Software Engineer at Applied Intuition

Back to jobs

# Machine Learning Software Engineer

Stuttgart, Baden-Württemberg, Germany

Apply

## About Applied Intuition

Applied Intuition, Inc. is powering the future of physical AI. Founded in 2017 and now valued at $15 billion, the Silicon Valley company is creating the digital infrastructure needed to bring intelligence to every moving machine on the planet. Applied Intuition services the automotive, defense, trucking, construction, mining and agriculture industries in three core areas: tools and infrastructure, operating systems, and autonomy. Eighteen of the top 20 global automakers, as well as the United States military and its allies, trust the company’s solutions to deliver physical intelligence. Applied Intuition is headquartered in Sunnyvale, California, with offices in Washington, D.C.; San Diego; Ft. Walton Beach, Florida; Ann Arbor, Michigan; London; Stuttgart; Munich; Stockholm; Bangalore; Seoul; and Tokyo. Learn more at applied.co.

We are an in-office company, and our expectation is that employees primarily work from their Applied Intuition office 5 days a week. However, we also recognize the importance of flexibility and trust our employees to manage their schedules responsibly. This may include occasional remote work, starting the day with morning meetings from home before heading to the office, or leaving earlier when needed to accommodate family commitments.

## About the role

We are looking for software engineers with expertise in ML-first perception, prediction or planning for autonomous vehicles or mobile robots. Your contributions will focus on building out key ML capabilities of an autonomous vehicle stack.

In addition to your engineering contributions, by working in our dynamic and customer-focused team culture, you will contribute to and learn from best practices in the autonomy industry. We move fast and focus on excellence, for our products and for our b',
  'https://boards.greenhouse.io/appliedintuition/jobs/4532553005?gh_jid=4532553005'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'AI Native Senior Software Engineer', 
  'ai-native-senior-software-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  180000,
  280000,
  ARRAY['Agent', 'Infrastructure', 'Rust'],
  'AI Native Senior Software Engineer - OPSWAT

A New Docuseries Hosted by Kari Byron

A New Docuseries Hosted by Kari Byron Premieres on August 8th

Premieres on August 8th

10DAYS

14HOURS

46MINS

36SECS

# AI Native Senior Software Engineer

Vietnam

IT Security

Apply for This Job View all Opening Positions

OPSWAT

## Protecting the World’s Critical Infrastructure

OPSWAT, a global leader in IT, OT, and ICS critical infrastructure cybersecurity, delivers an end-to-end platform that gives public and private sector organizations and enterprises the critical advantage needed to protect their complex networks, secure their devices, and ensure compliance. Over the last 20 years our commitment to innovative technology has earned the trust of more than 1,700 organizations, governments, and institutions globally, solidifying our role in protecting the world’s critical infrastructure and securing our way of life.

About the Role

Join the MetaDefender Endpoint team building OPSWAT''s cross-platform endpoint security agent, deployed on millions of devices at governments, critical infrastructure operators, and large enterprises worldwide.

We are looking for an AI Native Senior Software Engineer who treats AI coding tools (GitHub Copilot, Cursor, Claude Code, all licensed by OPSWAT) as core productivity multipliers, and who has the judgment to know when AI accelerates work and when traditional engineering is the right call.

What You''ll Do

- Design, build, and ship features across the MetaDefender Endpoint C++/Qt codebase (Windows primary; macOS and Linux supported).
- Use GitHub Copilot, and Claude Code daily to accelerate coding, testing, and documentation, while evaluating AI-generated code for correctness, security, and maintainability before it ships.
- Author and maintain AI context files for the modules you own, so agents produce consistent, on-pattern code across the team.
- Review code with a security-first lens, for both human- and AI-generated changes.
- Mentor t',
  'https://boards.greenhouse.io/opswat/jobs/4476626005'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Sensor Sim - ML Engineer', 
  'job-application-for-sensor-sim---ml-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'London, UK',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['Agent', 'Infrastructure', 'Rust', 'Generative AI'],
  'Job Application for Sensor Sim - ML Engineer at Applied Intuition

Back to jobs

New

# Sensor Sim - ML Engineer

Sunnyvale, California, United States

Apply

## About Applied Intuition

Applied Intuition, Inc. is powering the future of physical AI. Founded in 2017 and now valued at $15 billion, the Silicon Valley company is creating the digital infrastructure needed to bring intelligence to every moving machine on the planet. Applied Intuition services the automotive, defense, trucking, construction, mining and agriculture industries in three core areas: tools and infrastructure, operating systems, and autonomy. Eighteen of the top 20 global automakers, as well as the United States military and its allies, trust the company’s solutions to deliver physical intelligence. Applied Intuition is headquartered in Sunnyvale, California, with offices in Washington, D.C.; San Diego; Ft. Walton Beach, Florida; Ann Arbor, Michigan; London; Stuttgart; Munich; Stockholm; Bangalore; Seoul; and Tokyo. Learn more at applied.co.

We are an in-office company, and our expectation is that employees primarily work from their Applied Intuition office 5 days a week. However, we also recognize the importance of flexibility and trust our employees to manage their schedules responsibly. This may include occasional remote work, starting the day with morning meetings from home before heading to the office, or leaving earlier when needed to accommodate family commitments.

## Meet our software engineers!

Meet some of our software engineers who are shaping the future of autonomy and delivering world-class solutions helping customers shorten time to market. Hear about what brought them to Applied Intuition, what’s kept them interested, and their advice to potential candidates.

## About the role

We are looking for a software engineer to join our team working on the incorporation of modern machine learning approaches into production-grade sensor simulation. In this role you will work with our re',
  'https://boards.greenhouse.io/appliedintuition/jobs/4678157005?gh_jid=4678157005'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Lead People Systems Engineer', 
  'lead-people-systems-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'RAG', 'Agent', 'Rust'],
  'Lead People Systems Engineer - Klaviyo

# Lead People Systems Engineer

IT & Security

San Francisco, CA

At Klaviyo, we value the unique backgrounds, experiences and perspectives each Klaviyo (we call ourselves Klaviyos) brings to our workplace each and every day. We believe everyone deserves a fair shot at success and appreciate the experiences each person brings beyond the traditional job requirements. If you’re a close but not exact match with the description, we hope you’ll still consider applying. Want to learn more about life at Klaviyo? Visit klaviyo.com/careers to see how we empower creators to own their own destiny.

Klaviyo is building an AI-first company—and that starts with how we support and scale our people.

We’re looking for a Lead People Technology Engineer to be the first dedicated AI engineer within our People Technology (KPPL) team. As an early leader in this space, you’ll reimagine how our People teams operate in an AI-first world by shaping our architecture, standards, and long-term vision.

You’ll partner across People Operations, Talent Acquisition, Talent, and Finance to design and build intelligent systems that transform how we hire, develop, retain, and support Klaviyos globally. This role is not just about applying AI it’s about defining how AI becomes embedded into the employee lifecycle at Klaviyo.

What You’ll Be Doing

AI-First People Systems & Architecture

- Reimagine core People workflows (recruiting, onboarding, performance, daily tasks) through an AI-first lens, not just incremental automation
- Design and build AI-powered workflows, copilots, and agents that automate and augment People processes across the employee lifecycle
- Architect and implement systems that integrate across SaaS such as Workday, Greenhouse, Sana, and internal Klaviyo platforms
- Partner with our internal IT AI team and establish best practices for:
- - Prompt engineering and evaluation
- LLM system design and orchestration
- Versioning, testing, security,',
  'https://boards.greenhouse.io/klaviyo/jobs/7819493003'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Description', 
  'job-description',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['Agent', 'Generative AI'],
  'Careers | C3 AI

Careers | C3 AI
[Skip to main content](#main-content)
[![C3.ai Logo](/images/global/logo-c3.svg)](/)
* Products
Products
Applications
* [C3 AI Reliability](/products/applications/c3-ai-reliability)
* [C3 AI Production Schedule Optimization](/products/applications/c3-ai-production-schedule-optimization)
* [C3 AI Demand Planning](/products/applications/c3-ai-demand-planning)
* [C3 AI Process Optimization](/products/applications/c3-ai-process-optimization)
* [C3 AI Inventory Optimization](/products/applications/c3-ai-inventory-optimization)
* [C3 AI Sourcing Optimization](/products/applications/c3-ai-sourcing-optimization)
* [All Applications](/products/applications)
Platform
* [C3 AI Studio](/products/studio)
* [C3 Code](/products/c3-agentic-ai-platform/c3-code)
* [C3 Generative AI](/products/c3-generative-ai)
* [C3 Agentic AI Platform](/products/c3-agentic-ai-platform)
![Abstract graphic of five glowing translucent horizontal planes stacked in isometric perspective, each edge-lit and fading from deep blue at the top to bright cyan at the bottom on a near-black background — representing a layered product stack.](/api/media/file/C3%20Agentic%20AI%20Platform%201840x820.png)
Product Portfolio Overview [Explore the Full C3 AI Product Stack](/products/portfolio)
* Industries
Industries
* [Defense & Intelligence](/industries/defense-intelligence)
* [Maritime](/industries/maritime)
* [Manufacturing](/industries/manufacturing)
* [Federal](/industries/federal)
* [Oil & Gas](/industries/oil-and-gas)
* [Utilities](/industries/utilities)
* [Healthcare & Life Sciences](/industries/healthcare-life-sciences)
![](/api/media/file/menu-industries.png)
Announcements [Introducing C3 AI Agentic Process Automation, Intelligent Workflows to Run Your Enterprise](/news/introducing-c3-ai-agentic-process-automation/)
* Resources
Resources
Insights
* [Case Studies](/case-studies)
* [Analyst Reports](/resources)
* [Events](/events)
Learn
* [Blog](/blog)
* [C3 AI Academy](https://',
  'https://boards.greenhouse.io/c3iot/jobs/6889513002?t=5c6794212'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Senior Machine Learning Engineer II, Search & Personalization', 
  'job-application-for-senior-machine-learning-engine',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['LLM', 'Infrastructure'],
  'Job Application for Senior Machine Learning Engineer II, Search & Personalization at Instacart

# Senior Machine Learning Engineer II, Search & Personalization

at Instacart(View all jobs)

Canada - Remote (AB, BC, ON, NS ONLY)

We''re transforming the grocery industry

At Instacart, we invite the world to share love through food because we believe everyone should have access to the food they love and more time to enjoy it together. Where others see a simple need for grocery delivery, we see exciting complexity and endless opportunity to serve the varied needs of our community. We work to deliver an essential service that customers rely on to get their groceries and household goods, while also offering safe and flexible earnings opportunities to Instacart Personal Shoppers.

Instacart has become a lifeline for millions of people, and we’re building the team to help push our shopping cart forward. If you’re ready to do the best work of your life, come join our table.

Instacart is a Flex First team

There’s no one-size fits all approach to how we do our best work. Our employees have the flexibility to choose where they do their best work—whether it’s from home, an office, or your favorite coffee shop—while staying connected and building community through regular in-person events. Learn more about our flexible approach to where we work.

Overview

The Search & Personalization ML team is Instacart’s engine for multi-task, multi-objective ranking—unifying search, discovery, ads, and merchandising into a single value-aware platform. The team’s scope includes item and carousel ranking across Search and all Discovery surfaces. Partnering with world-class engineers, scientists, and PMs, we build the ranking backbone that powers every pixel of the shopping journey, optimizing not just for clicks, but for long term incremental GTV, basket lift, and retention over the long run.

What We’re Building

- LLM-Enhanced Retrieval & Features: Using LLMs to enrich query and item semant',
  'https://boards.greenhouse.io/embed/job_app?for=instacart&token=6716788'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer II', 
  'machine-learning-engineer-ii',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  140000,
  220000,
  ARRAY['RAG', 'Infrastructure', 'Rust'],
  'Machine Learning Engineer II - Behavioral Security Products | Careers at Abnormal

# Machine Learning Engineer II - Behavioral Security Products

Remote - UK

Behavioral Security Products

R-100958

Apply Now

Abnormal AI is looking for a Machine Learning Engineer to join the Account Takeover Detection team. At Abnormal, we protect our customers against nefarious adversaries who are constantly evolving their techniques and tactics to outwit and undermine the traditional approaches to Security. Abnormal is recognized as a top cybersecurity startup (Leader in the 2024 Gartner Magic Quadrant for Email Security Platforms), securing a Series D funding of $250 million at a $5.1 billion valuation in August 2024. Our 100% YoY growth in annual recurring revenue highlights the trust our behavioral AI system has earned in protecting over 20+% of the Fortune 500. We continue to grow and innovate to stay ahead of the evolving threat landscape.

About the Role

In a landscape where a single successful attack can lead to financial losses of millions of dollars, the Account Takeover team (ATO) is at the forefront of customer protection, playing a central role in building systems that can detect malicious activity and protect customers from account takeovers. The Account Takeover Detection team’s mission is to leverage cutting-edge machine learning technologies for proactive detection and prevention of account takeover attempts, continuously improving ATO capabilities to stay ahead of evolving fraud patterns and safeguard user accounts with unparalleled accuracy and efficiency

This role offers the opportunity to contribute significantly to our team''s charter, direction, and roadmap by defining technical goals, addressing customer problems, maintaining production models, and ensuring operational excellence. The ideal candidate will have a background in machine learning, data science, and software engineering, with the ability to design, develop, and implement robust machine learning',
  'https://boards.greenhouse.io/abnormalsecurity/jobs/7679778003'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Machine Learning Engineer', 
  'senior-machine-learning-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'London, UK',
  false,
  'Full-time',
  180000,
  280000,
  ARRAY['LLM', 'AI'],
  'Jobs at Wayve | First

Skip to main content

# Jobs at Wayve

Wayve is building the leading AI platform for self-driving vehicles. Pioneering an end-to-end AI approach that allows vehicles to learn and adapt in the real world. This is a once-in-a-generation shift in how we live and move, on the scale of horses to cars, and cars to autonomous driving.

We’re looking for highly skilled, curious problem-solvers with grit, humility, and a bias for action. People who want to tackle unsolved problems and build what’s never been built before. If you’re ready to do the work of your career and help define the future, come and join the team!

## Where do you want to work?

## What do you want to do?

## 112 jobs open

### AI Platform

Applied Scientist / Machine Learning EngineerSunnyvale, California USA

Principal Engineer, Data & ComputeLondon, United KingdomSunnyvale, California USA

Principal Engineer, Model Development PlatformSunnyvale, California USA

Senior Cloud SRE - AI/ML Platform & GPU ComputeLondon, United Kingdom

Senior Fullstack Engineer - Data EnrichmentLondon, United Kingdom

Staff Cloud SRE – AI/ML Platform & GPU ComputeLondon, United Kingdomfull timeon-site

Staff ML Performance Engineer (Training Efficiency)Sunnyvale, California USA

Staff Security EngineerLondon, United Kingdom

Tech Lead, Ingestion SystemsSunnyvale, California USA

### AV Engineering

Director AV Product EngineeringSunnyvale, California USALondon, United Kingdom

Machine Learning Engineer, ADASLeonberg, Germany

Machine Learning Engineer, ADASHerzliya, Israel

Machine Learning Engineer, ADASLondon, United Kingdom

Machine Learning Engineer, AV EngineeringHerzliya, Israel

Robotics GeneralistSunnyvale, California USA

Staff Machine Learning Engineer, AV CoreSunnyvale, California USA

Tech Lead / Manager - Trajectory Generation and ControlsSunnyvale, California USALondon, United Kingdom

### Commercial & Operations

Automotive Product Security LeadLondon, United Kingdom

Automotive Produc',
  'https://boards.greenhouse.io/wayve/jobs/7735326002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Principal Data Scientist, ML Bots - Game Tech Group', 
  'job-application-for-principal-data-scientist,-ml-b',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  220000,
  350000,
  ARRAY['Agent', 'Rust'],
  'Job Application for Principal Data Scientist, ML Bots - Game Tech Group at Riot Games

# Principal Data Scientist, ML Bots - Game Tech Group

at Riot Games(View all jobs)

Los Angeles, USA

At AI Foundations, our mission is to unlock cutting edge player experiences through the power of ML and AI technologies. Within this space, the AI Foundry team partners with teams across Riot to accelerate the development and deployment of new machine learning & AI systems. We dive into diverse, high impact projects across Riot, and help take them from ideas to fully fledged features.

As a Principal Data Scientist specializing in applied machine learning, you will lead the modeling strategy for our most ambitious applications of Game Understanding Agents in a deeply technical role. You''ll elevate the technical standards in reinforcement learning, imitation learning, and simulation-based training for game AI by mentoring engineers on the ML Bots team. Your contributions to Riot’s shared game AI frameworks will accelerate development across multiple games and you''ll build strong cross-disciplinary partnerships to achieve these goals. You and your team will develop and deploy in-game Game AI capabilities that significantly enhance the player and developer experience, creating reusable training and evaluation pipelines for Game Understanding Agents that support multiple game genres and adapt to each title’s unique constraints. You will support the team in combining modern ML with deep game domain knowledge to create autonomous agents that can play, understand, and adapt like real players.

## Responsibilities:

- Represent the ML Bots team in multi-game forums and contribute to shared frameworks for autonomous agent development.
- Collaborate with game and platform engineers, along with UX teams, to integrate models into production systems in ways that enhance player experience and maintain operational reliability.
- Mentor senior and staff-level ML engineers in advanced ML for game',
  'https://boards.greenhouse.io/embed/job_app?token=7177099'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Lead Machine Learning Engineer | Amperity', 
  'lead-machine-learning-engineer-|-amperity',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['Rust'],
  'Careers | Amperity

# Careers at Amperity

At Amperity, we are proudly customer-obsessed. Working here means getting deep in the data and seeing through the eyes of our customers to help them transform their businesses. We''re building something that''s unique in the market, and every day is a chance to collaborate with super-smart people to solve complex challenges.

View open positions

## We innovate through our values

#### Trust

We’re building a company together, and trust is the foundation of our success. We say what we’re going to do and we do it with authenticity, integrity, and respect.

#### Customer Success

We’re relentless in our focus on helping our customers thrive. Our customers know they can count on us to evaluate every action through the lens of what will drive their success.

#### Innovation

Innovation is in our DNA. We’re driven by curiosity and constantly seeking ways, from small everyday actions to big solutions, to make things better for our customers and across every aspect of the business.

#### Grit

We’re here to win. And we know that it’s not based on luck or talent alone. We set our sights on a goal and we persevere and stay focused no matter what comes our way. If we fall down, we get back up. If we make a mistake, we own it and make it right. And when we win, we celebrate.

#### Ownership & Accountability

We are owners of this company and we think and act with a long-term mindset and don’t let anything get in the way of delivering great outcomes. If we encounter a problem, we don’t wait—we take action and we rally the right people to solve it. We ALL deliver results that drive value.

#### Diversity

Diversity—of people and perspectives—fuels better decisions, deeper empathy, and bolder innovation. We bring our authentic selves to work each day and we work in ways that honor inclusion, respect, collaboration and connection.

## Hard problems are way more exciting

Amperity only exists because we chose to solve a problem that hadn’t b',
  'https://boards.greenhouse.io/amperity/jobs/7665469'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Engineer, Applied AI (Hybrid)', 
  'machine-learning-engineer,-applied-ai-(hybrid)',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  140000,
  220000,
  ARRAY['LLM', 'AI'],
  'Machine Learning Engineer, Applied AI (Hybrid) | SimplePractice Careers

# Machine Learning Engineer, Applied AI (Hybrid)

Apply

## Mexico City

#### Sign up for updates

Email address

By entering your email address, you are opting-in to receive emails from SimplePractice on its various products, solutions, and/or offerings. Unsubscribe anytime.

About our product

Product demo Pricing Compare All features Customer stories Reviews

For practitioners

Switch to SimplePractice New practices Solo practices Group practices All specialties Sign in

For clients

Access Client Portal Join telehealth Find a therapist Therapy-seeker resources

Company

About us Careers Press Partner with us Refer a colleague Health Plans Track Your Hours

Help & support

Help Center FAQs Product tutorials

Proudly made in Santa Monica, CA © 2026 SimplePractice, LLC

Terms

Privacy

BAA

Cookie Preferences

Do Not Share My Personal Information

System status',
  'https://boards.greenhouse.io/simplepractice55/jobs/5761041004'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Principal Scientist, Machine Learning, Genomics', 
  'principal-scientist,-machine-learning,-genomics',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  220000,
  350000,
  ARRAY['LLM', 'AI'],
  'Roles | Flagship Pioneering

Flagship is a brave, bold organization and our people are creative thinkers, exceptional scientists and experienced company builders. Together we are on a mission to harness science and technology to deliver a healthier and more sustainable future for all. Join us.

Search

Companies

All Companies

Departments

All Departments

Locations

All Locations

Levels

All Levels

What are you looking for?',
  'https://boards.greenhouse.io/flagshippioneeringinc/jobs/8229819002?gh_jid=8229819002'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Machine Learning Principal Solutions Architect', 
  'machine-learning-principal-solutions-architect',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'On-site',
  false,
  'Full-time',
  220000,
  350000,
  ARRAY['Data Engineering'],
  'Careers at phData | View Our Jobs in Data Engineering and Data Analytics

The AI Reckoning Is Coming

Vincent Yates

KNIME Flow Variables: A Practical Guide

Bianca Sterpone

## Job Board

Check out the latest career opportunities at phData.

## Not seeing the job of your dreams?

Get insider info on our upcoming job opportunities, actionable career advice, and much more by joining the phData Talent Community.

Join the Community',
  'https://boards.greenhouse.io/phdata/jobs/7390457'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Senior Machine Learning Engineer', 
  'senior-machine-learning-engineer',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  180000,
  280000,
  ARRAY['Infrastructure'],
  'Open Roles | Abnormal

# Prepare for Impact

This isn''t a place where job descriptions define your potential. It''s where people who work with AI come together to solve cybersecurity challenges, protect millions, and grow faster than they thought possible.

Our roles aren''t just open, they''re open-ended, designed for people who want to shape what''s next in cybersecurity, AI, and their own careers.

Why They Joined

> “I''m passionate about using technology to solve real-world problems, and I wanted to be part of a team that''s doing something innovative and impactful. The energy, the people, and the mission really sealed the deal for me.”

Join Us

## Open Roles

63 open roles

All teams (63)

All locations (63)

Customer Success Operations ManagerCustomer SuccessRemote - USARemote→ L1 Technical Support EngineerCustomer SupportRemote - USARemote→ Machine Learning Engineer II - Behavioral Security ProductsEngineeringRemote - UKRemote→ Senior Software Engineer - Behavioral Security ProductsEngineeringRemote - UKRemote→ Senior Software Engineer - Configuration PlatformEngineeringHybrid - Bangalore, India→ Senior Software Engineer - Multi-Product PlatformEngineeringHybrid - Bangalore, India→ Senior Software Engineer - Platform Engineering - Federal OperationsEngineeringRemote - USARemote→ Senior Software Engineer - Product Engineering (Identity Security)EngineeringHybrid - San Francisco, CA, USA→ Software Engineer 2EngineeringHybrid - Bangalore, India→ Software Engineer 2 - Customer Journey TeamEngineeringHybrid - Bangalore, India→ Software Engineer 2 - Message Security Detection EngineeringHybrid - Bangalore, India→ Software Engineer 2 - Message Security ProductsEngineeringRemote - SingaporeRemote→ Software Engineer 2 - Message Security ProductsEngineeringHybrid - Bangalore, India→ Software Engineer 2 - Platform & InfrastructureEngineeringHybrid - Bangalore, India→ Software Engineer 2 - Product FeatureEngineeringHybrid - Bangalore, India→ Software Engineer II - Cloud Infr',
  'https://boards.greenhouse.io/abnormalsecurity/jobs/7602978003'
ON CONFLICT (apply_url) DO NOTHING;


INSERT INTO public.jobs (title, slug, company_id, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url) 
SELECT 
  'Job Application for Principal Engineer, Data & ML Infrastructure', 
  'job-application-for-principal-engineer,-data-&-ml-',
  (SELECT id FROM public.companies WHERE slug = 'anthropic' LIMIT 1),
  'San Francisco, CA',
  true,
  'Full-time',
  220000,
  350000,
  ARRAY['Infrastructure', 'Python', 'Data Engineering'],
  'Job Application for Principal Engineer, Data & ML Infrastructure at Motional

# Principal Engineer, Data & ML Infrastructure

Boston, Massachusetts, United States; Pittsburgh, Pennsylvania, United States; Remote U.S.

Apply

Mission:

We are seeking a highly skilled and motivated Principal Engineer, Technical Lead to lead our large-scale AI model and software evaluation framework – Ground Truth Regression. The ideal candidate will have a strong background in data engineering, machine learning principals and leadership, with experience in developing and deploying advanced data analysis and large scale orchestration frameworks.

At Motional, large scale orchestration for data analysis plays a critical role in delivering our ML-centered autonomous driving vehicle. Our robo-taxi ML Models and software are developed by hundreds of developers and deployed multiple times a day – The Ground Truth Regression team provides the large scale perception analysis framework for validating all changes to perception which can impact the autonomous vehicle behavior.

The GTRegression team validates the end impact of ML and software changes to the autonomous vehicle while those changes are in development, providing the tools for Root Cause Analysis, and safety consideration. We monitor for model errors, anomalies, rare objects & long-tail driving scenarios across thousands of driving hours. The team develops the full stack – AWS Kubernetes orchestration framework, ReSimulation, model metrics, regression reports, and deep dive analysis UI’s. The team works together with all other perception and ML teams to develop the metrics and analyze results.

What You''ll Do:

- Lead a team of engineers with a diverse skill set to deliver critical software supporting the development of the autonomous vehicle ML models and software.
- Drive innovation by researching and developing new large scale data warehousing and analysis.
- Own large-scale data analysis workflows that surface unexpected impacts ',
  'https://boards.greenhouse.io/embed/job_app?token=6676461003'
ON CONFLICT (apply_url) DO NOTHING;
