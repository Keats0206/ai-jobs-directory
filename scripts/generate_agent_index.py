#!/usr/bin/env python3
"""Generate curated Top 50 JSON indexes for OpenClaw plugins, MCP servers, and Hermes plugins."""

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "web" / "data"
OVERRIDES_PATH = Path(__file__).parent / "agent-curation-overrides.json"

OPENCLAW_PLUGINS = [
    ("discord", "Discord", "Channels", "Connect OpenClaw to Discord as a messaging channel with full tool access.", "openclaw plugins install @openclaw/discord", True, True, ["messaging", "chat"]),
    ("slack", "Slack", "Channels", "Slack workspace integration for OpenClaw agents.", "openclaw plugins install @openclaw/slack", True, True, ["messaging", "workplace"]),
    ("telegram", "Telegram", "Channels", "Telegram bot channel for OpenClaw with DM and group support.", "openclaw plugins install @openclaw/telegram", True, True, ["messaging", "mobile"]),
    ("whatsapp", "WhatsApp", "Channels", "WhatsApp messaging channel for OpenClaw agents.", "openclaw plugins install @openclaw/whatsapp", True, True, ["messaging", "mobile"]),
    ("signal", "Signal", "Channels", "Signal messenger integration for privacy-focused agent chat.", "openclaw plugins install @openclaw/signal", True, True, ["messaging", "privacy"]),
    ("matrix", "Matrix", "Channels", "Decentralized Matrix protocol channel for OpenClaw.", "openclaw plugins install @openclaw/matrix", True, True, ["messaging", "decentralized"]),
    ("teams-meetings", "Microsoft Teams", "Channels", "Microsoft Teams messaging and meetings integration.", "openclaw plugins install @openclaw/teams-meetings", True, True, ["messaging", "enterprise"]),
    ("imessage", "iMessage", "Channels", "Apple iMessage channel for macOS OpenClaw deployments.", "openclaw plugins install @openclaw/imessage", True, True, ["messaging", "apple"]),
    ("googlechat", "Google Chat", "Channels", "Google Chat workspace integration for OpenClaw.", "openclaw plugins install @openclaw/googlechat", True, True, ["messaging", "google"]),
    ("feishu", "Feishu / Lark", "Channels", "Feishu/Lark enterprise messaging channel.", "openclaw plugins install @openclaw/feishu", True, True, ["messaging", "enterprise"]),
    ("line", "LINE", "Channels", "LINE Messaging API channel for OpenClaw.", "openclaw plugins install @openclaw/line", True, True, ["messaging", "asia"]),
    ("irc", "IRC", "Channels", "Internet Relay Chat channel adapter.", "openclaw plugins install @openclaw/irc", True, True, ["messaging", "legacy"]),
    ("synology-chat", "Synology Chat", "Channels", "Synology NAS Chat integration for self-hosted teams.", "openclaw plugins install @openclaw/synology-chat", True, True, ["messaging", "self-hosted"]),
    ("twitch", "Twitch", "Channels", "Twitch chat channel for streamer-facing agents.", "openclaw plugins install @openclaw/twitch", True, True, ["messaging", "streaming"]),
    ("browser", "Browser", "Tools", "Built-in browser automation and web interaction tools.", "openclaw plugins enable browser", True, True, ["automation", "web"]),
    ("anthropic", "Anthropic", "ModelProviders", "Anthropic Claude model provider for OpenClaw.", "openclaw plugins install @openclaw/anthropic", True, True, ["llm", "claude"]),
    ("openai", "OpenAI", "ModelProviders", "OpenAI GPT model provider integration.", "openclaw plugins install @openclaw/openai", True, True, ["llm", "gpt"]),
    ("google", "Google AI", "ModelProviders", "Google Gemini and AI Studio provider.", "openclaw plugins install @openclaw/google", True, True, ["llm", "gemini"]),
    ("openrouter", "OpenRouter", "ModelProviders", "Gateway to 200+ models via a single API key.", "openclaw plugins install @openclaw/openrouter", True, True, ["llm", "multi-model"]),
    ("groq", "Groq", "ModelProviders", "Ultra-fast inference via Groq LPU hardware.", "openclaw plugins install @openclaw/groq", True, True, ["llm", "fast"]),
    ("deepseek", "DeepSeek", "ModelProviders", "DeepSeek model provider integration.", "openclaw plugins install @openclaw/deepseek", True, True, ["llm", "coding"]),
    ("xai", "xAI", "ModelProviders", "xAI Grok model provider for OpenClaw.", "openclaw plugins install @openclaw/xai", True, True, ["llm", "grok"]),
    ("voice-call", "Voice Call", "Voice", "Twilio-powered voice call functionality for agents.", "openclaw plugins install @openclaw/voice-call", True, True, ["voice", "twilio"]),
    ("elevenlabs", "ElevenLabs", "Voice", "ElevenLabs text-to-speech integration.", "openclaw plugins install @openclaw/elevenlabs", True, True, ["voice", "tts"]),
    ("deepgram", "Deepgram", "Voice", "Deepgram speech-to-text and voice AI.", "openclaw plugins install @openclaw/deepgram", True, True, ["voice", "stt"]),
    ("talk-voice", "Talk Voice", "Voice", "Real-time voice conversation mode for agents.", "openclaw plugins install @openclaw/talk-voice", True, True, ["voice", "realtime"]),
    ("azure-speech", "Azure Speech", "Voice", "Microsoft Azure Speech Services integration.", "openclaw plugins install @openclaw/azure-speech", True, True, ["voice", "azure"]),
    ("tavily", "Tavily", "Search", "AI-optimized web search backend for agents.", "openclaw plugins install @openclaw/tavily", True, True, ["search", "web"]),
    ("brave", "Brave Search", "Search", "Brave Search API integration for web queries.", "openclaw plugins install @openclaw/brave", True, True, ["search", "web"]),
    ("duckduckgo", "DuckDuckGo", "Search", "Free DuckDuckGo web search without API keys.", "openclaw plugins install @openclaw/duckduckgo", True, True, ["search", "free"]),
    ("exa", "Exa", "Search", "Neural search API for high-quality web results.", "openclaw plugins install @openclaw/exa", True, True, ["search", "neural"]),
    ("perplexity", "Perplexity", "Search", "Perplexity AI search integration.", "openclaw plugins install @openclaw/perplexity", True, True, ["search", "ai"]),
    ("firecrawl", "Firecrawl", "Search", "Web scraping and structured content extraction.", "openclaw plugins install @openclaw/firecrawl", True, True, ["search", "scrape"]),
    ("searxng", "SearXNG", "Search", "Self-hosted meta-search engine integration.", "openclaw plugins install @openclaw/searxng", True, True, ["search", "self-hosted"]),
    ("web-readability", "Web Readability", "Search", "Extract clean readable content from web pages.", "openclaw plugins install @openclaw/web-readability", True, True, ["search", "extract"]),
    ("codex", "Codex", "DevTools", "OpenAI Codex coding agent integration.", "openclaw plugins install @openclaw/codex", True, True, ["coding", "agent"]),
    ("github-copilot", "GitHub Copilot", "DevTools", "GitHub Copilot model provider integration.", "openclaw plugins install @openclaw/github-copilot", True, True, ["coding", "copilot"]),
    ("diffs", "Diffs", "DevTools", "Code diff viewing and patch management tools.", "openclaw plugins install @openclaw/diffs", True, True, ["coding", "diff"]),
    ("document-extract", "Document Extract", "Tools", "Extract text and structure from PDFs and documents.", "openclaw plugins install @openclaw/document-extract", True, True, ["documents", "pdf"]),
    ("canvas", "Canvas", "Tools", "Live React canvas for rich agent output.", "openclaw plugins install @openclaw/canvas", True, True, ["ui", "visual"]),
    ("image-generation-core", "Image Generation", "Tools", "Core image generation capabilities for agents.", "openclaw plugins install @openclaw/image-generation-core", True, True, ["image", "generation"]),
    ("video-generation-core", "Video Generation", "Tools", "Video generation tools for creative agents.", "openclaw plugins install @openclaw/video-generation-core", True, True, ["video", "generation"]),
    ("webhooks", "Webhooks", "Integration", "HTTP webhook triggers and outbound notifications.", "openclaw plugins install @openclaw/webhooks", True, True, ["integration", "http"]),
    ("diagnostics-otel", "OpenTelemetry", "Observability", "OpenTelemetry diagnostics and tracing export.", "openclaw plugins install @openclaw/diagnostics-otel", True, True, ["observability", "tracing"]),
    ("diagnostics-prometheus", "Prometheus", "Observability", "Prometheus metrics export for gateway monitoring.", "openclaw plugins install @openclaw/diagnostics-prometheus", True, True, ["observability", "metrics"]),
    ("lmstudio", "LM Studio", "ModelProviders", "Local models via LM Studio on your machine.", "openclaw plugins install @openclaw/lmstudio", True, True, ["llm", "local"]),
    ("ollama-via-openai", "Ollama", "ModelProviders", "Local Ollama models through OpenAI-compatible API.", "openclaw plugins install @openclaw/litellm", True, True, ["llm", "local"]),
    ("parallel", "Parallel", "Search", "Parallel AI web search and research API.", "openclaw plugins install @openclaw/parallel", True, True, ["search", "research"]),
    ("vault", "Vault", "Tools", "Secure credential and secret vault for agents.", "openclaw plugins install @openclaw/vault", True, True, ["security", "secrets"]),
    ("powermem", "PowerMem", "Memory", "Community long-term memory plugin with smart recall.", "openclaw plugins install clawhub:powermem", False, False, ["memory", "community"]),
]

MCP_SERVERS = [
    ("filesystem", "Filesystem", "DevTools", "Secure local file read/write with configurable directory access.", "openclaw mcp add filesystem --command npx --arg -y --arg @modelcontextprotocol/server-filesystem --arg /path/to/allowed/dir", True, True, "stdio"),
    ("memory", "Memory", "Memory", "Knowledge graph memory server for persistent agent recall.", "openclaw mcp add memory --command npx --arg -y --arg @modelcontextprotocol/server-memory", True, True, "stdio"),
    ("github", "GitHub", "DevTools", "Repository management, issues, PRs, and code search via GitHub API.", "openclaw mcp add github --command npx --arg -y --arg @modelcontextprotocol/server-github", True, True, "stdio"),
    ("gitlab", "GitLab", "DevTools", "GitLab project and merge request management.", "openclaw mcp add gitlab --command npx --arg -y --arg @modelcontextprotocol/server-gitlab", True, True, "stdio"),
    ("postgres", "PostgreSQL", "Database", "Read-only SQL queries against PostgreSQL databases.", "openclaw mcp add postgres --command npx --arg -y --arg @modelcontextprotocol/server-postgres --arg postgresql://localhost/db", True, True, "stdio"),
    ("sqlite", "SQLite", "Database", "Query and analyze local SQLite database files.", "openclaw mcp add sqlite --command npx --arg -y --arg @modelcontextprotocol/server-sqlite --arg --db-path --arg ./data.db", True, True, "stdio"),
    ("fetch", "Fetch", "Search", "Fetch and convert web page content for LLM consumption.", "openclaw mcp add fetch --command npx --arg -y --arg @modelcontextprotocol/server-fetch", True, True, "stdio"),
    ("playwright", "Playwright", "Automation", "Full browser automation with Playwright for web tasks.", "openclaw mcp add playwright --command npx --arg -y --arg @playwright/mcp@latest", True, False, "stdio"),
    ("puppeteer", "Puppeteer", "Automation", "Headless Chrome automation via Puppeteer MCP server.", "openclaw mcp add puppeteer --command npx --arg -y --arg @modelcontextprotocol/server-puppeteer", True, True, "stdio"),
    ("brave-search", "Brave Search", "Search", "Web and local search via Brave Search API.", "openclaw mcp add brave-search --command npx --arg -y --arg @modelcontextprotocol/server-brave-search", True, True, "stdio"),
    ("tavily", "Tavily", "Search", "AI-optimized search and content extraction API.", "openclaw mcp add tavily --command npx --arg -y --arg @tavily/mcp", False, False, "stdio"),
    ("context7", "Context7", "DevTools", "Up-to-date library documentation for coding agents.", "openclaw mcp add context7 --url https://mcp.context7.com/mcp --transport streamable-http", False, False, "http"),
    ("google-drive", "Google Drive", "Productivity", "Search, read, and manage Google Drive files.", "openclaw mcp add google-drive --command npx --arg -y --arg @modelcontextprotocol/server-gdrive", True, True, "stdio"),
    ("google-maps", "Google Maps", "Search", "Location search, directions, and place details.", "openclaw mcp add google-maps --command npx --arg -y --arg @modelcontextprotocol/server-google-maps", True, True, "stdio"),
    ("slack", "Slack", "Channels", "Send messages and interact with Slack workspaces.", "openclaw mcp add slack --command npx --arg -y --arg @modelcontextprotocol/server-slack", True, True, "stdio"),
    ("notion", "Notion", "Productivity", "Read and write Notion pages and databases.", "openclaw mcp add notion --command npx --arg -y --arg @notionhq/notion-mcp-server", False, False, "stdio"),
    ("linear", "Linear", "Productivity", "Issue tracking and project management via Linear API.", "openclaw mcp add linear --command npx --arg -y --arg @linear/mcp-server", False, False, "stdio"),
    ("sentry", "Sentry", "Observability", "Query Sentry issues, events, and error analytics.", "openclaw mcp add sentry --command npx --arg -y --arg @sentry/mcp-server", False, False, "stdio"),
    ("supabase", "Supabase", "Database", "Supabase database and auth management tools.", "openclaw mcp add supabase --command npx --arg -y --arg @supabase/mcp-server", False, False, "stdio"),
    ("redis", "Redis", "Database", "Redis key-value store read/write operations.", "openclaw mcp add redis --command npx --arg -y --arg @modelcontextprotocol/server-redis", True, True, "stdio"),
    ("docker", "Docker", "DevOps", "Manage Docker containers, images, and compose stacks.", "openclaw mcp add docker --command npx --arg -y --arg @modelcontextprotocol/server-docker", False, False, "stdio"),
    ("kubernetes", "Kubernetes", "DevOps", "kubectl-based Kubernetes cluster management.", "openclaw mcp add kubernetes --command npx --arg -y --arg @modelcontextprotocol/server-kubernetes", False, False, "stdio"),
    ("aws-kb-retrieval", "AWS Knowledge Base", "Database", "Retrieve documents from Amazon Bedrock Knowledge Bases.", "openclaw mcp add aws-kb --command npx --arg -y --arg @modelcontextprotocol/server-aws-kb-retrieval", True, True, "stdio"),
    ("sequential-thinking", "Sequential Thinking", "Tools", "Structured step-by-step reasoning for complex problems.", "openclaw mcp add sequential-thinking --command npx --arg -y --arg @modelcontextprotocol/server-sequential-thinking", True, True, "stdio"),
    ("everart", "EverArt", "Tools", "AI image generation via EverArt API.", "openclaw mcp add everart --command npx --arg -y --arg @modelcontextprotocol/server-everart", True, True, "stdio"),
    ("time", "Time", "Tools", "Current time and timezone conversion utilities.", "openclaw mcp add time --command npx --arg -y --arg @modelcontextprotocol/server-time", True, True, "stdio"),
    ("everything", "Everything", "DevTools", "Reference MCP server demonstrating all protocol features.", "openclaw mcp add everything --command npx --arg -y --arg @modelcontextprotocol/server-everything", True, True, "stdio"),
    ("obsidian", "Obsidian", "Productivity", "Read and search Obsidian vault notes.", "openclaw mcp add obsidian --command npx --arg -y --arg obsidian-mcp", False, False, "stdio"),
    ("stripe", "Stripe", "Finance", "Stripe payment and customer management tools.", "openclaw mcp add stripe --command npx --arg -y --arg @stripe/mcp", False, False, "stdio"),
    ("cloudflare", "Cloudflare", "DevOps", "Cloudflare DNS, Workers, and R2 management.", "openclaw mcp add cloudflare --command npx --arg -y --arg @cloudflare/mcp-server-cloudflare", False, False, "stdio"),
    ("vercel", "Vercel", "DevOps", "Vercel deployment and project management.", "openclaw mcp add vercel --command npx --arg -y --arg @vercel/mcp-server", False, False, "stdio"),
    ("datadog", "Datadog", "Observability", "Query Datadog metrics, logs, and monitors.", "openclaw mcp add datadog --command npx --arg -y --arg @datadog/mcp-server", False, False, "stdio"),
    ("grafana", "Grafana", "Observability", "Grafana dashboard and alert management.", "openclaw mcp add grafana --command npx --arg -y --arg @grafana/mcp-server", False, False, "stdio"),
    ("jira", "Jira", "Productivity", "Atlassian Jira issue and sprint management.", "openclaw mcp add jira --command npx --arg -y --arg @atlassian/mcp-server-jira", False, False, "stdio"),
    ("confluence", "Confluence", "Productivity", "Atlassian Confluence wiki page access.", "openclaw mcp add confluence --command npx --arg -y --arg @atlassian/mcp-server-confluence", False, False, "stdio"),
    ("hubspot", "HubSpot", "Productivity", "CRM contacts, deals, and marketing automation.", "openclaw mcp add hubspot --command npx --arg -y --arg @hubspot/mcp-server", False, False, "stdio"),
    ("salesforce", "Salesforce", "Productivity", "Salesforce CRM data access and management.", "openclaw mcp add salesforce --command npx --arg -y --arg @salesforce/mcp-server", False, False, "stdio"),
    ("mongodb", "MongoDB", "Database", "MongoDB document database queries and operations.", "openclaw mcp add mongodb --command npx --arg -y --arg @mongodb-js/mcp-server", False, False, "stdio"),
    ("mysql", "MySQL", "Database", "MySQL database read/write operations.", "openclaw mcp add mysql --command npx --arg -y --arg @modelcontextprotocol/server-mysql", False, False, "stdio"),
    ("elasticsearch", "Elasticsearch", "Database", "Elasticsearch index search and analytics.", "openclaw mcp add elasticsearch --command npx --arg -y --arg @elastic/mcp-server-elasticsearch", False, False, "stdio"),
    ("figma", "Figma", "Design", "Read Figma designs, components, and design tokens.", "openclaw mcp add figma --command npx --arg -y --arg @figma/mcp-server", False, False, "stdio"),
    ("chrome-devtools", "Chrome DevTools", "Automation", "Browser debugging and performance profiling via CDP.", "openclaw mcp add chrome-devtools --command npx --arg -y --arg chrome-devtools-mcp", False, False, "stdio"),
    ("n8n", "n8n", "Automation", "Trigger and manage n8n workflow automations.", "openclaw mcp add n8n --command npx --arg -y --arg @n8n/mcp-server", False, False, "stdio"),
    ("airtable", "Airtable", "Productivity", "Airtable base and record management.", "openclaw mcp add airtable --command npx --arg -y --arg @airtable/mcp-server", False, False, "stdio"),
    ("todoist", "Todoist", "Productivity", "Task and project management via Todoist API.", "openclaw mcp add todoist --command npx --arg -y --arg @todoist/mcp-server", False, False, "stdio"),
    ("exa", "Exa Search", "Search", "Neural web search optimized for AI agents.", "openclaw mcp add exa --command npx --arg -y --arg exa-mcp-server", False, False, "stdio"),
    ("firecrawl", "Firecrawl", "Search", "Web scraping with structured markdown output.", "openclaw mcp add firecrawl --command npx --arg -y --arg firecrawl-mcp", False, False, "stdio"),
    ("perplexity", "Perplexity", "Search", "Perplexity AI search with cited answers.", "openclaw mcp add perplexity --command npx --arg -y --arg @perplexity/mcp-server", False, False, "stdio"),
    ("azure", "Azure", "DevOps", "Azure resource management and cloud operations.", "openclaw mcp add azure --command npx --arg -y --arg @azure/mcp-server", False, False, "stdio"),
    ("gcp", "Google Cloud", "DevOps", "Google Cloud Platform resource management.", "openclaw mcp add gcp --command npx --arg -y --arg @google-cloud/mcp-server", False, False, "stdio"),
]

HERMES_PLUGINS = [
    ("firecrawl", "Firecrawl", "Search", "Default web search backend with excellent speed and result quality.", "hermes plugins enable firecrawl", True, True, "backend", True, 5.0),
    ("openrouter", "OpenRouter", "ModelProviders", "Gateway to 200+ models from every major provider.", "Set OPENROUTER_API_KEY in .env", True, True, "model-provider", True, 5.0),
    ("tavily", "Tavily", "Search", "AI-optimized web search tailored for agent use cases.", "Set TAVILY_API_KEY in .env", True, True, "backend", True, 4.0),
    ("langfuse", "Langfuse", "Observability", "Full observability — traces conversations, LLM calls, and tool usage.", "hermes plugins enable langfuse", True, True, "standalone", False, 4.0),
    ("ollama", "Ollama (Local)", "ModelProviders", "Run Llama, Mistral, Phi-3 locally with zero API cost.", "ollama pull llama3.2", True, True, "model-provider", True, 4.0),
    ("openai-image-gen", "OpenAI Image Gen", "ImageGeneration", "OpenAI gpt-image-2 generation with best available quality.", "Set OPENAI_API_KEY in .env", True, True, "backend", True, 5.0),
    ("spotify", "Spotify", "Standalone", "Full playback control — devices, queue, search, playlists.", "hermes plugins enable spotify", True, True, "standalone", False, 5.0),
    ("google-meet", "Google Meet", "Standalone", "Join calls, transcribe captions, and speak in realtime.", "hermes plugins enable google_meet", True, True, "standalone", False, 5.0),
    ("kanban", "Kanban", "Standalone", "Multi-profile work queue and orchestration board.", "Enabled by default in multi-agent setups", True, True, "standalone", True, 4.0),
    ("mem0", "Mem0", "Memory", "Server-side LLM fact extraction with semantic search.", "hermes config set memory.provider mem0", True, True, "exclusive", False, 3.0),
    ("honcho", "Honcho", "Memory", "Social memory layer for personalized multi-session recall.", "hermes plugins enable honcho", False, False, "exclusive", False, 4.5),
    ("duckduckgo", "DuckDuckGo", "Search", "Free web search via DuckDuckGo, no API key needed.", "pip install ddgs", True, True, "backend", True, 3.0),
    ("brave-search", "Brave Search", "Search", "Privacy-focused web search via Brave Search API.", "Set BRAVE_API_KEY in .env", True, True, "backend", True, 4.0),
    ("exa", "Exa", "Search", "Neural search API for high-quality agent results.", "Set EXA_API_KEY in .env", True, True, "backend", True, 4.0),
    ("fal-video", "FAL Video", "VideoGeneration", "Multi-model video generation via FAL.ai (Veo, Kling).", "Set FAL_KEY in .env", True, True, "backend", True, 4.0),
    ("xai-video-gen", "xAI Video Gen", "VideoGeneration", "Grok-Imagine video generation and editing.", "Set XAI_API_KEY in .env", True, True, "backend", True, 3.0),
    ("openai-codex-image", "OpenAI Codex Image", "ImageGeneration", "Image generation via ChatGPT/Codex OAuth billing.", "hermes login --provider openai-codex", True, True, "backend", True, 5.0),
    ("xai-image-gen", "xAI Image Gen", "ImageGeneration", "xAI Grok-Imagine text-to-image generation.", "Set XAI_API_KEY in .env", True, True, "backend", True, 3.0),
    ("microsoft-teams", "Microsoft Teams", "Gateway", "Teams gateway adapter via Bot Framework.", "Configure in gateway section of config.yaml", True, True, "platform", True, 3.0),
    ("irc", "IRC", "Gateway", "Internet Relay Chat gateway using Python asyncio.", "Configure IRC_SERVER, IRC_CHANNEL in config", True, True, "platform", True, 3.0),
    ("line", "LINE", "Gateway", "LINE Messaging API with HMAC signature verification.", "Configure in gateway section of config.yaml", True, True, "platform", True, 3.0),
    ("disk-cleanup", "Disk Cleanup", "Standalone", "Auto-tracks and cleans ephemeral files from sessions.", "hermes plugins enable disk-cleanup", True, True, "standalone", False, 4.0),
    ("teams-pipeline", "Teams Pipeline", "Standalone", "Microsoft Teams meeting pipeline with transcript summaries.", "hermes plugins enable teams_pipeline", True, True, "standalone", False, 3.0),
    ("hermes-achievements", "Hermes Achievements", "Utilities", "Achievement and badge tracking system for agents.", "hermes plugins enable hermes-achievements", True, True, "standalone", False, 3.0),
    ("anthropic", "Anthropic", "ModelProviders", "Direct Anthropic Claude API provider.", "Set ANTHROPIC_API_KEY in .env", True, True, "model-provider", True, 5.0),
    ("openai", "OpenAI", "ModelProviders", "Direct OpenAI GPT API provider.", "Set OPENAI_API_KEY in .env", True, True, "model-provider", True, 5.0),
    ("deepseek", "DeepSeek", "ModelProviders", "DeepSeek model provider for coding tasks.", "Set DEEPSEEK_API_KEY in .env", True, True, "model-provider", True, 4.0),
    ("groq", "Groq", "ModelProviders", "Ultra-fast inference on Groq LPU hardware.", "Set GROQ_API_KEY in .env", True, True, "model-provider", True, 4.0),
    ("openviking", "OpenViking", "Memory", "Cloud memory provider with semantic recall.", "hermes config set memory.provider openviking", True, True, "exclusive", False, 3.0),
    ("supermemory", "Supermemory", "Memory", "Cloud memory provider for long-term agent recall.", "hermes config set memory.provider supermemory", True, True, "exclusive", False, 2.0),
    ("home-assistant", "Home Assistant", "Integration", "Control smart home devices via Home Assistant API.", "hermes plugins enable home-assistant", False, False, "standalone", False, 4.5),
    ("gbrain", "GBrain", "Memory", "Community graph-based memory for structured agent recall.", "hermes plugins enable gbrain", False, False, "exclusive", False, 4.0),
    ("mnemosyne", "Mnemosyne", "Memory", "Community memory plugin with episodic recall.", "hermes plugins enable mnemosyne", False, False, "exclusive", False, 4.0),
    ("hermes-lcm", "Hermes LCM", "Memory", "SQLite-backed DAG context engine for conversation history.", "hermes plugins enable hermes-lcm", False, False, "standalone", False, 4.0),
    ("byterover", "Byterover", "Memory", "Cloud memory provider for agent knowledge persistence.", "hermes config set memory.provider byterover", True, True, "exclusive", False, 2.0),
    ("hindsight", "Hindsight", "Memory", "Cloud memory provider with retrospective analysis.", "hermes config set memory.provider hindsight", True, True, "exclusive", False, 2.0),
    ("retaindb", "RetainDB", "Memory", "Cloud memory provider for structured recall.", "hermes config set memory.provider retaindb", True, True, "exclusive", False, 2.0),
    ("telegram-gateway", "Telegram", "Gateway", "Core Telegram gateway — messaging with full tool access.", "Configure in gateway section of config.yaml", True, True, "platform", True, 5.0),
    ("discord-gateway", "Discord", "Gateway", "Core Discord gateway for server and DM interactions.", "Configure in gateway section of config.yaml", True, True, "platform", True, 5.0),
    ("slack-gateway", "Slack", "Gateway", "Core Slack workspace gateway integration.", "Configure in gateway section of config.yaml", True, True, "platform", True, 5.0),
    ("whatsapp-gateway", "WhatsApp", "Gateway", "Core WhatsApp messaging gateway.", "Configure in gateway section of config.yaml", True, True, "platform", True, 4.0),
    ("signal-gateway", "Signal", "Gateway", "Core Signal messenger gateway for privacy.", "Configure in gateway section of config.yaml", True, True, "platform", True, 4.0),
    ("email-gateway", "Email", "Gateway", "Email gateway for agent inbox and outbound mail.", "Configure in gateway section of config.yaml", True, True, "platform", True, 4.0),
    ("matrix-gateway", "Matrix", "Gateway", "Decentralized Matrix protocol gateway.", "Configure in gateway section of config.yaml", True, True, "platform", True, 3.0),
    ("autonomy-engine", "Autonomy Engine", "Standalone", "Self-directed decision-making with decide/plan/reflect tools.", "hermes plugins enable autonomy-engine", False, False, "standalone", False, 4.0),
    ("model-router", "Smart Model Router", "Standalone", "Intelligent model routing with fallback chains.", "hermes plugins enable model-router", False, False, "standalone", False, 4.0),
    ("telemetry", "Telemetry", "Observability", "Structured JSON telemetry of every tool call.", "hermes plugins enable telemetry", False, False, "standalone", False, 3.5),
    ("budget-enforcer", "Budget Enforcer", "Standalone", "Langfuse-backed budget enforcement with spend warnings.", "hermes plugins enable budget-enforcer", False, False, "standalone", False, 3.5),
    ("pii-redaction", "PII Redaction", "Utilities", "Automatic PII and secret redaction in agent output.", "hermes plugins enable pii-redaction", True, True, "standalone", True, 4.0),
    ("voice-mode", "Voice Mode", "Standalone", "Real-time voice conversation mode for Hermes.", "hermes plugins enable voice-mode", True, True, "standalone", False, 4.0),
    ("browser-connect", "Browser Connect", "Standalone", "Connect to Chrome via CDP for browser automation.", "hermes plugins enable browser-connect", True, True, "standalone", False, 4.5),
]


def build_openclaw_entry(rank, row):
    id_, name, category, desc, install, official, bundled, tags = row
    return {
        "rank": rank,
        "id": id_,
        "name": name,
        "ecosystem": "openclaw",
        "category": category,
        "description": desc,
        "install": install,
        "docsUrl": f"https://docs.openclaw.ai/plugins/{id_}" if official else None,
        "repoUrl": f"https://github.com/openclaw/openclaw/tree/main/extensions/{id_}" if bundled else None,
        "official": official,
        "bundled": bundled,
        "tags": tags,
    }


def build_mcp_entry(rank, row):
    id_, name, category, desc, install, official, bundled, transport = row
    return {
        "rank": rank,
        "id": id_,
        "name": name,
        "ecosystem": "mcp",
        "category": category,
        "description": desc,
        "install": install,
        "docsUrl": "https://modelcontextprotocol.io/servers" if official else None,
        "repoUrl": f"https://github.com/modelcontextprotocol/servers/tree/main/src/{id_}" if official else None,
        "official": official,
        "bundled": bundled,
        "transport": transport,
        "tags": [category.lower(), transport],
    }


def build_hermes_entry(rank, row):
    id_, name, category, desc, install, official, bundled, plugin_type, auto_loaded, rating = row
    return {
        "rank": rank,
        "id": id_,
        "name": name,
        "ecosystem": "hermes",
        "category": category,
        "description": desc,
        "install": install,
        "docsUrl": "https://hermes-agent.nousresearch.com/docs",
        "repoUrl": "https://github.com/NousResearch/hermes-agent",
        "official": official,
        "bundled": bundled,
        "pluginType": plugin_type,
        "autoLoaded": auto_loaded,
        "tags": [category.lower(), plugin_type],
        "popularity": {"rating": rating, "source": "hermes-tutorials.dev"},
    }


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    updated = date.today().isoformat()

    openclaw = [build_openclaw_entry(i + 1, row) for i, row in enumerate(OPENCLAW_PLUGINS[:50])]
    mcps = [build_mcp_entry(i + 1, row) for i, row in enumerate(MCP_SERVERS[:50])]
    hermes = [build_hermes_entry(i + 1, row) for i, row in enumerate(HERMES_PLUGINS[:50])]

    meta = {"updated": updated, "methodology": "Composite score: official/bundled (+3), docs (+2), community popularity, curator boost"}

    for filename, data in [
        ("openclaw-plugins.json", {"meta": meta, "entries": openclaw}),
        ("openclaw-mcps.json", {"meta": meta, "entries": mcps}),
        ("hermes-plugins.json", {"meta": meta, "entries": hermes}),
    ]:
        path = DATA_DIR / filename
        path.write_text(json.dumps(data, indent=2) + "\n")
        print(f"Wrote {len(data['entries'])} entries to {path}")

    print(f"Total: {len(openclaw) + len(mcps) + len(hermes)} entries")


if __name__ == "__main__":
    main()
