#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const agentsPath = join(root, 'web/data/agents.json');
const comparisonsPath = join(root, 'web/data/comparisons.json');

const newAgents = [
  {
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    company: 'GitHub / Microsoft',
    website: 'https://github.com/features/copilot',
    faviconUrl: 'https://github.githubassets.com/favicons/favicon.svg',
    tokenUsage: null,
    rank: 11,
    tagline: 'AI pair programmer integrated into VS Code, JetBrains, Neovim, and GitHub.',
    features: [
      'Inline code completions and chat inside major IDEs',
      'Copilot Workspace and agent mode for multi-step tasks',
      'Deep GitHub integration for PRs, issues, and repos',
      'Enterprise plans with policy controls and audit logs',
      'Copilot CLI for terminal-based assistance',
    ],
    platforms: ['VS Code', 'JetBrains', 'Neovim', 'Visual Studio', 'GitHub.com', 'CLI'],
    pricing: 'Free tier for individuals; Pro and Business plans available — see github.com/features/copilot/pricing',
    openSource: false,
    bestFor: [
      'Teams already on GitHub who want AI assistance without switching editors',
      'Developers who want reliable inline completions with minimal setup',
      'Organizations needing enterprise governance for AI coding tools',
    ],
    pros: [
      'Ubiquitous IDE support and the largest installed base of any AI coding assistant',
      'Native GitHub workflow integration for reviews, issues, and pull requests',
      'Mature product with consistent completions and low latency',
    ],
    cons: [
      'Agentic capabilities lag behind dedicated agents like Claude Code or Cursor Composer',
      'Less flexible model choice compared to multi-model editors',
      'Advanced agent features often require paid Business or Enterprise tiers',
    ],
    quickAnswer:
      'GitHub Copilot is the most widely adopted AI coding assistant, offering inline completions, chat, and growing agent features across VS Code, JetBrains, and GitHub itself. It is the default choice for teams embedded in the GitHub ecosystem who want low-friction AI assistance.',
    bodySections: [
      {
        heading: 'What Is GitHub Copilot?',
        content:
          'GitHub Copilot is Microsoft and GitHub\'s AI pair programmer, built on OpenAI models and integrated across the most popular IDEs and GitHub.com. It started as inline autocomplete and has expanded into chat, Copilot Workspace, and agent-style coding workflows that can plan and execute tasks within a repository context.',
      },
      {
        heading: 'IDE and GitHub Integration',
        content:
          'Copilot\'s primary advantage is distribution: it works inside VS Code, JetBrains IDEs, Neovim, Visual Studio, and directly on GitHub for pull request summaries and code review. For teams that live in GitHub, Copilot reduces context switching compared to standalone agent tools.',
      },
      {
        heading: 'Agentic Features',
        content:
          'Copilot has added agent-mode capabilities for multi-step coding tasks, though it is still often compared against dedicated agents like Claude Code and Cursor. It excels at incremental assistance — completions, small refactors, and chat-driven edits — rather than fully autonomous long-horizon runs.',
      },
    ],
    faqs: [
      {
        question: 'Is GitHub Copilot an agentic coding tool?',
        answer:
          'Copilot includes agent-style features in Copilot Workspace and newer agent modes, but most developers still use it primarily for inline completions and chat. Dedicated coding agents like Claude Code or Cursor Composer are generally stronger for fully autonomous multi-step tasks.',
      },
      {
        question: 'How does Copilot compare to Cursor?',
        answer:
          'Cursor is an AI-native editor built around agents and multi-model support. Copilot plugs into your existing IDE and GitHub workflow with lower switching cost. Cursor offers deeper agentic editing; Copilot offers broader compatibility and GitHub-native integration.',
      },
    ],
    relatedSlugs: ['cursor', 'claude-code', 'codex', 'windsurf', 'cline'],
    sourceUrls: ['https://github.com/features/copilot'],
  },
  {
    slug: 'aider',
    name: 'Aider',
    company: 'Aider',
    website: 'https://aider.chat',
    faviconUrl: 'https://aider.chat/favicon.ico',
    tokenUsage: null,
    rank: 12,
    tagline: 'Open-source terminal pair programmer that edits git repos with LLMs.',
    features: [
      'Git-aware edits with automatic commits and diffs',
      'Works with Claude, GPT-4, DeepSeek, and local models',
      'Repo map for large codebase context',
      'Voice mode and scripting support',
      '100% open source (Apache 2.0)',
    ],
    platforms: ['Terminal', 'CLI'],
    pricing: 'Free and open source; pay for LLM API usage only',
    openSource: true,
    bestFor: [
      'Terminal-first developers who want git-native AI editing',
      'Engineers who bring their own API keys and model preferences',
      'Teams wanting transparent, auditable agent edits via git history',
    ],
    pros: [
      'Excellent git integration — every change is a commit you can review or revert',
      'Model-agnostic with strong support for frontier and local models',
      'Lightweight CLI with no IDE lock-in',
    ],
    cons: [
      'No GUI — requires comfort in the terminal',
      'Less polished onboarding than IDE-native tools like Cursor',
      'Agent UX is developer-oriented, not beginner-friendly',
    ],
    quickAnswer:
      'Aider is an open-source CLI that pairs you with LLMs to edit code in git repositories. It maps large repos, makes multi-file edits, and commits changes automatically — ideal for developers who want agentic coding without leaving the terminal or paying for a closed IDE.',
    bodySections: [
      {
        heading: 'What Is Aider?',
        content:
          'Aider is a terminal-based AI pair programmer that connects to LLMs and edits files in your local git repository. It builds a map of your codebase for context, applies patches, runs tests when asked, and creates git commits so every AI edit is reviewable.',
      },
      {
        heading: 'Git-Native Workflow',
        content:
          'Unlike IDE plugins, Aider treats git as the source of truth. Changes are committed with descriptive messages, making it easy to audit, revert, or cherry-pick agent work. This appeals to engineers who treat AI output like any other contributor\'s PR.',
      },
    ],
    faqs: [
      {
        question: 'Does Aider work with local models?',
        answer:
          'Yes. Aider supports many providers including Anthropic, OpenAI, and local models via Ollama and similar runtimes, making it popular for privacy-sensitive or cost-conscious workflows.',
      },
    ],
    relatedSlugs: ['claude-code', 'cline', 'cursor', 'continue', 'pi'],
    sourceUrls: ['https://aider.chat'],
  },
  {
    slug: 'continue',
    name: 'Continue',
    company: 'Continue',
    website: 'https://continue.dev',
    faviconUrl: 'https://continue.dev/favicon.ico',
    tokenUsage: null,
    rank: 13,
    tagline: 'Open-source AI code assistant for VS Code and JetBrains with custom agents.',
    features: [
      'Open-source IDE extension with configurable agents',
      'Bring-your-own-model for any LLM provider',
      'Custom context providers and slash commands',
      'Autonomous agent mode for multi-step tasks',
      'Active open-source community and hub of shared configs',
    ],
    platforms: ['VS Code', 'JetBrains', 'CLI'],
    pricing: 'Free and open source; optional Continue Hub features',
    openSource: true,
    bestFor: [
      'Developers who want to customize agents, prompts, and context providers',
      'Teams standardizing on VS Code or JetBrains with flexible model choice',
      'Engineers building internal coding agents on open tooling',
    ],
    pros: [
      'Highly configurable — agents, rules, and context are code-defined',
      'Model-agnostic with strong OSS community momentum',
      'Works inside existing editors without a fork',
    ],
    cons: [
      'Setup and config.json tuning required for best results',
      'Polish and out-of-box UX trail dedicated products like Cursor',
      'Advanced features may require reading docs and community examples',
    ],
    quickAnswer:
      'Continue is an open-source AI coding assistant that runs inside VS Code and JetBrains. Developers configure agents, models, and context providers in code — making it a flexible foundation for customized agentic workflows without vendor lock-in.',
    bodySections: [
      {
        heading: 'What Is Continue?',
        content:
          'Continue is an open-source IDE extension that brings chat, autocomplete, and agentic editing into VS Code and JetBrains. Its config-driven architecture lets teams define custom agents, slash commands, and retrieval sources — popular with developers who want control over their AI stack.',
      },
    ],
    faqs: [
      {
        question: 'How is Continue different from Cursor?',
        answer:
          'Continue extends your existing IDE with configurable open-source agents. Cursor is a full AI-native editor fork with integrated cloud agents. Continue offers more customization; Cursor offers a more packaged experience.',
      },
    ],
    relatedSlugs: ['cursor', 'cline', 'aider', 'github-copilot', 'kilo-code'],
    sourceUrls: ['https://continue.dev'],
  },
  {
    slug: 'replit-agent',
    name: 'Replit Agent',
    company: 'Replit',
    website: 'https://replit.com/ai',
    faviconUrl: 'https://replit.com/public/icons/favicon-196.png',
    tokenUsage: null,
    rank: 14,
    tagline: 'Cloud AI agent that builds full-stack apps from natural language in Replit.',
    features: [
      'Describe apps in plain language and deploy in the cloud',
      'Integrated database, auth, hosting, and runtime',
      'Agentic multi-step building with live preview',
      'Collaboration and sharing in browser-based IDE',
      'Mobile-friendly app creation workflow',
    ],
    platforms: ['Web', 'Cloud'],
    pricing: 'Free tier available; Replit Core and Teams plans for heavier agent usage',
    openSource: false,
    bestFor: [
      'Builders prototyping full-stack apps without local setup',
      'Founders and indie hackers shipping MVPs quickly',
      'Educators and learners who want an all-in-one cloud environment',
    ],
    pros: [
      'Zero local setup — agent, runtime, and deploy in one place',
      'Strong for greenfield apps and rapid prototyping',
      'Accessible to non-traditional developers and vibe coders',
    ],
    cons: [
      'Less suited to large existing codebases or enterprise monorepos',
      'Cloud lock-in to Replit infrastructure',
      'Professional teams may outgrow browser-first workflows',
    ],
    quickAnswer:
      'Replit Agent is a cloud-native AI builder inside Replit that turns natural language into deployed full-stack applications. It targets rapid prototyping and vibe coding more than deep work in existing enterprise repos.',
    bodySections: [
      {
        heading: 'What Is Replit Agent?',
        content:
          'Replit Agent is an AI system embedded in Replit\'s cloud IDE that plans, writes, and deploys applications from conversational prompts. It handles scaffolding, dependencies, databases, and hosting — making it popular for MVPs, demos, and learning projects.',
      },
    ],
    faqs: [
      {
        question: 'Is Replit Agent good for professional software teams?',
        answer:
          'Replit Agent excels at greenfield prototyping and small apps. Large teams with existing repos and strict CI/CD requirements typically prefer IDE or CLI agents like Cursor, Claude Code, or Copilot.',
      },
    ],
    relatedSlugs: ['cursor', 'windsurf', 'codex', 'cline', 'github-copilot'],
    sourceUrls: ['https://replit.com/ai'],
  },
  {
    slug: 'amazon-q',
    name: 'Amazon Q Developer',
    company: 'Amazon Web Services',
    website: 'https://aws.amazon.com/q/developer/',
    faviconUrl: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
    tokenUsage: null,
    rank: 15,
    tagline: 'AWS AI coding assistant with IDE plugins, CLI agent, and cloud transformation tools.',
    features: [
      'Inline completions and chat in VS Code and JetBrains',
      'CLI agent for autonomous multi-file tasks',
      'AWS-aware guidance for cloud and infrastructure code',
      'Code transformation and legacy modernization features',
      'Enterprise security and IAM integration on AWS',
    ],
    platforms: ['VS Code', 'JetBrains', 'CLI', 'AWS Console'],
    pricing: 'Free tier for individual developers; Pro tier for professional usage — see AWS pricing',
    openSource: false,
    bestFor: [
      'Teams building on AWS who want AI assistance with cloud context',
      'Enterprises requiring AWS-native security and compliance',
      'Developers modernizing Java or .NET codebases with AWS tools',
    ],
    pros: [
      'Strong AWS and cloud infrastructure awareness',
      'Generous free tier for individual developers',
      'Enterprise-grade security posture for regulated industries',
    ],
    cons: [
      'Best value is inside the AWS ecosystem; less compelling elsewhere',
      'Agent capabilities newer compared to Claude Code or Cursor',
      'UX polish varies by IDE plugin vs dedicated AI editors',
    ],
    quickAnswer:
      'Amazon Q Developer is AWS\'s AI coding assistant for IDE plugins, CLI agents, and cloud-aware development. It shines for teams on AWS who want security, transformation tools, and infrastructure-aware suggestions alongside general coding help.',
    bodySections: [
      {
        heading: 'What Is Amazon Q Developer?',
        content:
          'Amazon Q Developer (formerly CodeWhisperer) provides AI coding assistance across IDEs, the terminal, and the AWS console. It offers completions, chat, and agentic CLI workflows with particular strength in AWS APIs, infrastructure code, and enterprise security requirements.',
      },
    ],
    faqs: [
      {
        question: 'How does Amazon Q compare to GitHub Copilot?',
        answer:
          'Both offer IDE completions and chat. Amazon Q adds deeper AWS context and transformation features for cloud workloads. Copilot has broader GitHub integration and larger general adoption outside AWS shops.',
      },
    ],
    relatedSlugs: ['github-copilot', 'cursor', 'claude-code', 'codex', 'windsurf'],
    sourceUrls: ['https://aws.amazon.com/q/developer/'],
  },
];

function makeComparison(slug, agentA, agentB, quickAnswer, verdict, criteria, bestForA, bestForB, faqs) {
  return { slug, agentA, agentB, quickAnswer, verdict, criteria, bestForA, bestForB, faqs, sourceUrls: [] };
}

const newComparisons = [
  makeComparison(
    'cursor-vs-github-copilot',
    'cursor',
    'github-copilot',
    'Choose Cursor for an AI-native editor with deep agentic editing and multi-model support. Choose GitHub Copilot if you want to keep your current IDE and GitHub workflow with minimal disruption.',
    'Cursor and GitHub Copilot represent two philosophies: Cursor replaces your editor with an AI-first experience; Copilot augments the editor and GitHub stack you already use. Cursor wins on agentic multi-file editing and model flexibility. Copilot wins on compatibility, GitHub integration, and enterprise adoption.',
    [
      { label: 'Agentic editing', agentA: 'Composer and cloud agents for multi-step autonomous tasks', agentB: 'Growing agent features but still completion-first for most users', winner: 'a' },
      { label: 'IDE compatibility', agentA: 'Cursor-only (VS Code fork)', agentB: 'VS Code, JetBrains, Neovim, Visual Studio, GitHub.com', winner: 'b' },
      { label: 'GitHub integration', agentA: 'PR and Slack integrations available', agentB: 'Native GitHub workflow integration is a core strength', winner: 'b' },
      { label: 'Model choice', agentA: 'Multiple frontier models in one editor', agentB: 'Primarily OpenAI models via Microsoft/GitHub', winner: 'a' },
    ],
    ['Developers ready to switch to an AI-native editor', 'Teams wanting autonomous agent workflows', 'Engineers who need multi-model flexibility'],
    ['Teams embedded in GitHub with existing IDE preferences', 'Enterprises needing Copilot Business governance', 'Developers who want low-friction inline completions'],
    [{ question: 'Can I use both Cursor and Copilot?', answer: 'Some developers use Copilot for completions in other IDEs and Cursor as their primary agentic editor. They overlap but can complement each other if your workflow justifies two subscriptions.' }],
  ),
  makeComparison(
    'claude-code-vs-github-copilot',
    'claude-code',
    'github-copilot',
    'Claude Code is a terminal-first agent for autonomous codebase tasks. GitHub Copilot is an inline assistant across IDEs and GitHub. Pick Claude Code for deep agent runs; Copilot for everyday completions and GitHub-native workflows.',
    'Claude Code targets engineers who want a dedicated agent to plan and execute complex work across a repo. Copilot targets the broad developer market with assistive AI inside familiar tools. They solve different layers of the stack.',
    [
      { label: 'Autonomous task execution', agentA: 'Purpose-built for multi-step agentic runs from the terminal', agentB: 'Agent features exist but inline assist remains the default mode', winner: 'a' },
      { label: 'Daily editing UX', agentA: 'Terminal-first; no built-in GUI editor', agentB: 'Inline completions and chat inside major IDEs', winner: 'b' },
      { label: 'Enterprise adoption', agentA: 'Growing among Anthropic customers and CLI-first teams', agentB: 'Widest enterprise deployment via Microsoft and GitHub', winner: 'b' },
    ],
    ['Engineers running large refactors or migrations autonomously', 'Anthropic Claude customers', 'Terminal-first development workflows'],
    ['Teams standardized on GitHub and Microsoft tooling', 'Developers wanting assistive AI without workflow change', 'Organizations needing mature enterprise admin controls'],
    [],
  ),
  makeComparison(
    'aider-vs-cursor',
    'aider',
    'cursor',
    'Aider is an open-source git-native CLI agent. Cursor is a polished AI-native IDE. Choose Aider for terminal control and transparency; Cursor for integrated GUI agent editing.',
    'Aider appeals to developers who want every AI edit committed to git from the terminal. Cursor appeals to those who want a seamless visual editing experience with cloud agents. Both are strong agentic tools with different UX philosophies.',
    [
      { label: 'Open source', agentA: 'Fully open source (Apache 2.0)', agentB: 'Proprietary commercial product', winner: 'a' },
      { label: 'Editor experience', agentA: 'CLI only — bring your own editor', agentB: 'Full AI-native IDE with visual diff review', winner: 'b' },
      { label: 'Git workflow', agentA: 'Automatic commits and repo map are core features', agentB: 'Git integration via standard IDE tooling', winner: 'a' },
      { label: 'Onboarding friction', agentA: 'Requires terminal comfort and API key setup', agentB: 'Low — install and open like any editor', winner: 'b' },
    ],
    ['Terminal-first developers who audit every change via git', 'Teams wanting model flexibility without IDE lock-in', 'Open-source advocates'],
    ['Developers wanting the fastest path to agentic editing in a GUI', 'Teams using cloud agents and parallel sessions', 'Engineers who prefer visual diff review'],
    [],
  ),
  makeComparison(
    'windsurf-vs-github-copilot',
    'windsurf',
    'github-copilot',
    'Windsurf is an agentic IDE with Cascade flows and session management. Copilot is the ubiquitous assistive layer for existing IDEs and GitHub. Windsurf for agent delegation; Copilot for broad compatibility.',
    'Windsurf competes with Cursor more than Copilot on agentic depth, but both are compared by teams choosing their default AI coding stack. Windsurf offers richer agent session UI; Copilot offers reach and GitHub-native workflows.',
    [
      { label: 'Agent session management', agentA: 'Cascade flows with parallel sessions and diff review', agentB: 'Agent mode available but less session-centric', winner: 'a' },
      { label: 'Market reach', agentA: 'Growing IDE with focused user base', agentB: 'Largest installed base of AI coding assistants', winner: 'b' },
    ],
    ['Engineers delegating multi-step tasks to agents in one IDE', 'Teams wanting Codeium SWE models and ACP interoperability'],
    ['Organizations already on Copilot Enterprise', 'Developers who refuse to switch editors'],
    [],
  ),
  makeComparison(
    'cline-vs-claude-code',
    'cline',
    'claude-code',
    'Cline is an open-source IDE extension with Plan-and-Act modes. Claude Code is Anthropic\'s terminal agent. Cline for visual control in your editor; Claude Code for headless autonomous runs.',
    'Both are agentic coding tools, but Cline keeps you in the IDE with diff checkpoints while Claude Code operates from the terminal with Anthropic model depth. Many developers use both for different task types.',
    [
      { label: 'IDE integration', agentA: 'VS Code extension with inline diff and checkpoints', agentB: 'Terminal/CLI first without a built-in editor', winner: 'a' },
      { label: 'Model depth', agentA: 'Bring your own API keys for multiple providers', agentB: 'Optimized for Anthropic Claude models', winner: 'b' },
      { label: 'Open source', agentA: 'Open source with visible prompts and controls', agentB: 'Closed-source commercial product', winner: 'a' },
    ],
    ['Developers who want agentic editing inside VS Code', 'Teams needing checkpoint/undo on every agent step'],
    ['Engineers running long autonomous jobs from the terminal', 'Anthropic ecosystem teams'],
    [],
  ),
  makeComparison(
    'continue-vs-cursor',
    'continue',
    'cursor',
    'Continue is an open-source configurable assistant inside VS Code/JetBrains. Cursor is a dedicated AI editor. Continue for customization; Cursor for integrated out-of-box agent UX.',
    'Continue and Cursor serve developers who want AI in their editor, but Continue emphasizes config-driven flexibility while Cursor emphasizes product polish and cloud agents.',
    [
      { label: 'Customization', agentA: 'Config.json agents, context providers, slash commands', agentB: 'Polished defaults with less config surface', winner: 'a' },
      { label: 'Out-of-box UX', agentA: 'Requires tuning for best results', agentB: 'Immediate agentic editing after install', winner: 'b' },
      { label: 'Open source', agentA: 'Fully open source', agentB: 'Proprietary', winner: 'a' },
    ],
    ['Teams building custom internal agents on open tooling', 'Developers who want BYOM in existing IDEs'],
    ['Developers who want the fastest agentic IDE experience', 'Teams using Cursor cloud agents'],
    [],
  ),
  makeComparison(
    'replit-agent-vs-cursor',
    'replit-agent',
    'cursor',
    'Replit Agent builds and deploys cloud apps from prompts. Cursor is a professional AI editor for existing codebases. Replit for greenfield prototypes; Cursor for daily engineering on real repos.',
    'These tools overlap in marketing as AI coding agents but target different jobs: Replit Agent is a cloud app builder; Cursor is a developer\'s primary editor for production code.',
    [
      { label: 'Greenfield prototyping', agentA: 'Excellent — full stack in browser with instant deploy', agentB: 'Good for new files but assumes local repo workflow', winner: 'a' },
      { label: 'Existing codebase work', agentA: 'Limited for large local monorepos', agentB: 'Purpose-built for professional repo-scale editing', winner: 'b' },
    ],
    ['Indie hackers and learners shipping MVPs fast', 'Non-developers exploring vibe coding'],
    ['Professional software engineers on production repos', 'Teams with local git workflows and CI/CD'],
    [],
  ),
  makeComparison(
    'amazon-q-vs-github-copilot',
    'amazon-q',
    'github-copilot',
    'Amazon Q Developer adds AWS-aware coding and transformation tools. GitHub Copilot leads on GitHub integration and general IDE adoption. Choose based on cloud stack, not raw completion quality.',
    'Both are enterprise-friendly AI coding assistants. Amazon Q wins for AWS-heavy workloads; Copilot wins for GitHub-centric organizations.',
    [
      { label: 'AWS context', agentA: 'Deep AWS API and infrastructure awareness', agentB: 'General-purpose without AWS specialization', winner: 'a' },
      { label: 'GitHub workflow', agentA: 'Standard IDE plugins', agentB: 'Native GitHub PR and issue integration', winner: 'b' },
      { label: 'Free tier', agentA: 'Generous individual free tier on AWS', agentB: 'Free tier for verified individuals', winner: 'tie' },
    ],
    ['AWS-native engineering teams', 'Enterprises modernizing Java/.NET on AWS'],
    ['GitHub Enterprise customers', 'Teams standardized on Microsoft developer tools'],
    [],
  ),
  makeComparison(
    'aider-vs-claude-code',
    'aider',
    'claude-code',
    'Both are terminal-first coding agents. Aider is open source and git-commit-centric. Claude Code is Anthropic\'s managed agent with deep Claude integration.',
    'Aider offers transparency and model choice; Claude Code offers polish and Anthropic model depth. Terminal-first developers often evaluate both.',
    [
      { label: 'Open source', agentA: 'Apache 2.0 — inspect and self-host', agentB: 'Commercial closed-source product', winner: 'a' },
      { label: 'Managed experience', agentA: 'Bring your own keys and setup', agentB: 'Integrated Anthropic agent harness', winner: 'b' },
      { label: 'Git audit trail', agentA: 'Automatic commits are a core design', agentB: 'Git integration available but not commit-centric', winner: 'a' },
    ],
    ['OSS advocates who want git-native audit trails', 'Developers using local or multi-provider models'],
    ['Teams standardized on Claude models', 'Engineers wanting Anthropic-supported agent UX'],
    [],
  ),
  makeComparison(
    'continue-vs-github-copilot',
    'continue',
    'github-copilot',
    'Continue is an open-source BYOM assistant in your IDE. Copilot is Microsoft\'s managed assistant with the largest reach. Continue for control; Copilot for convenience and enterprise GitHub integration.',
    'Continue targets developers who want to own their agent config. Copilot targets organizations that want a turnkey assistive layer across GitHub and IDEs.',
    [
      { label: 'Configuration control', agentA: 'Full config.json control over agents and context', agentB: 'Managed defaults with limited customization', winner: 'a' },
      { label: 'Enterprise reach', agentA: 'Community-driven adoption', agentB: 'Microsoft/GitHub enterprise sales and admin', winner: 'b' },
    ],
    ['Developers customizing agents and context providers', 'Teams avoiding vendor-specific editor forks'],
    ['GitHub Enterprise deployments', 'Organizations wanting turnkey AI assist everywhere'],
    [],
  ),
];

const agents = JSON.parse(readFileSync(agentsPath, 'utf8'));
const comparisons = JSON.parse(readFileSync(comparisonsPath, 'utf8'));

const existingSlugs = new Set(agents.map((a) => a.slug));
for (const agent of newAgents) {
  if (!existingSlugs.has(agent.slug)) agents.push(agent);
}

const existingCompare = new Set(comparisons.map((c) => c.slug));
for (const c of newComparisons) {
  if (!existingCompare.has(c.slug)) comparisons.push(c);
}

agents.sort((a, b) => a.rank - b.rank);
writeFileSync(agentsPath, JSON.stringify(agents, null, 2) + '\n');
writeFileSync(comparisonsPath, JSON.stringify(comparisons, null, 2) + '\n');
console.log(`Agents: ${agents.length}, Comparisons: ${comparisons.length}`);
