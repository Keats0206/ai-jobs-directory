-- Seed companies
INSERT INTO public.companies (name, slug, website, description) VALUES
('Anthropic', 'anthropic', 'https://anthropic.com', 'AI safety research company'),
('OpenAI', 'openai', 'https://openai.com', 'Leading AI research lab'),
('Google DeepMind', 'google-deepmind', 'https://deepmind.google', 'AI research division'),
('Meta AI', 'meta-ai', 'https://ai.facebook.com', 'Meta''s AI research'),
('Cohere', 'cohere', 'https://cohere.ai', 'Large language models API'),
('Scale AI', 'scale-ai', 'https://scale.com', 'AI data infrastructure'),
('Hugging Face', 'hugging-face', 'https://huggingface.co', 'ML model hub and community'),
('Stability AI', 'stability-ai', 'https://stability.ai', 'Generative AI models'),
('Eleven Labs', 'eleven-labs', 'https://elevenlabs.io', 'AI voice synthesis'),
('Perplexity AI', 'perplexity-ai', 'https://perplexity.ai', 'AI search engine'),
('Mistral AI', 'mistral-ai', 'https://mistral.ai', 'European AI company'),
('Inflection AI', 'inflection-ai', 'https://inflection.ai', 'Personal AI assistant'),
('Replit', 'replit', 'https://replit.com', 'AI-powered coding platform'),
('Cursor', 'cursor', 'https://cursor.sh', 'AI code editor'),
('GitHub', 'github', 'https://github.com', 'Copilot AI coding assistance'),
('Railway', 'railway', 'https://railway.app', 'Infrastructure platform'),
('Vercel', 'vercel', 'https://vercel.com', 'AI-powered deployment'),
('Pinecone', 'pinecone', 'https://pinecone.io', 'Vector database for AI'),
('Weaviate', 'weaviate', 'https://weaviate.io', 'ML-first vector database'),
('LangChain', 'langchain', 'https://langchain.com', 'LLM framework');

-- Seed sample jobs
INSERT INTO public.jobs (company_id, title, slug, location, is_remote, job_type, salary_min, salary_max, tags, description, apply_url, category_id) VALUES
((SELECT id FROM public.companies WHERE slug = 'anthropic'), 'Senior AI Engineer', 'senior-ai-engineer-anthropic', 'San Francisco, CA', false, 'Full-time', 200000, 300000, ARRAY['LLM', 'AI Safety'], 'Help us advance AI safety and build next-generation language models.', 'https://jobs.anthropic.com', (SELECT id FROM public.categories WHERE slug = 'llm-genai')),
((SELECT id FROM public.companies WHERE slug = 'openai'), 'ML Engineer', 'ml-engineer-openai', 'San Francisco, CA', false, 'Full-time', 180000, 280000, ARRAY['LLM', 'Research'], 'Join our team building powerful generative models.', 'https://jobs.openai.com', (SELECT id FROM public.categories WHERE slug = 'llm-genai')),
((SELECT id FROM public.companies WHERE slug = 'hugging-face'), 'ML Systems Engineer', 'ml-systems-engineer', 'Remote', true, 'Full-time', 150000, 250000, ARRAY['ML', 'Infrastructure'], 'Build infrastructure for the open ML community.', 'https://huggingface.co/jobs', (SELECT id FROM public.categories WHERE slug = 'ai-infrastructure')),
((SELECT id FROM public.companies WHERE slug = 'cohere'), 'Prompt Engineer', 'prompt-engineer-cohere', 'Toronto, ON', true, 'Full-time', 130000, 200000, ARRAY['LLM', 'NLP'], 'Optimize and engineer prompts for large language models.', 'https://cohere.ai/careers', (SELECT id FROM public.categories WHERE slug = 'llm-genai')),
((SELECT id FROM public.companies WHERE slug = 'scale-ai'), 'Data Ops Engineer', 'data-ops-engineer', 'San Francisco, CA', false, 'Full-time', 140000, 220000, ARRAY['Data', 'Infrastructure'], 'Help build the data infrastructure for AI.', 'https://scale.com/careers', (SELECT id FROM public.categories WHERE slug = 'ai-infrastructure'));

-- Sample category assignments (jobs.category_id is already set during insert)
