#!/usr/bin/env python3
"""Append AI Agent Directory and AI Coding Agents sections to llms.txt."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB_DATA = ROOT / "web" / "data"
LLMS_PATH = ROOT / "web" / "public" / "llms.txt"


def load_entries(filename: str, limit: int = 10):
    path = WEB_DATA / filename
    if not path.exists():
        return []
    data = json.loads(path.read_text())
    return data.get("entries", [])[:limit]


def load_agents(limit: int = 10):
    path = WEB_DATA / "agents.json"
    if not path.exists():
        return []
    return json.loads(path.read_text())[:limit]


def load_comparisons(limit: int = 10):
    path = WEB_DATA / "comparisons.json"
    if not path.exists():
        return []
    return json.loads(path.read_text())[:limit]


def agent_name(slug: str, agents: list) -> str:
    for a in agents:
        if a.get("slug") == slug:
            return a.get("name", slug)
    return slug


def build_agent_section() -> str:
    lines = [
        "",
        "## AI Agent Directory",
        "> Top 150 ranked plugins and MCP servers for OpenClaw and Hermes Agent.",
        "",
        "### Hub",
        "- [Agent Directory](/agents): Browse OpenClaw plugins, MCP servers, and Hermes plugins",
        "- [Agentic Dev Hub](/agentic): Rankings, comparisons, MCPs, and jobs for agentic developers",
        "- [OpenClaw Plugins](/openclaw/plugins): Top 50 native OpenClaw extensions",
        "- [MCP Servers](/openclaw/mcps): Top 50 Model Context Protocol servers",
        "- [Hermes Plugins](/hermes/plugins): Top 50 Hermes Agent plugins",
        "- [Cursor Rules](/cursor-rules): Curated .cursorrules for AI coding agents",
        "- [List an MCP](/post-mcp): Feature your MCP server — $199/mo",
        "",
        "### Top OpenClaw Plugins",
    ]

    for entry in load_entries("openclaw-plugins.json", 10):
        lines.append(
            f"- [{entry['name']}](/openclaw/plugins/{entry['id']}): {entry['description'][:120]}"
        )

    lines.extend(["", "### Top MCP Servers"])
    for entry in load_entries("openclaw-mcps.json", 10):
        lines.append(
            f"- [{entry['name']}](/openclaw/mcps/{entry['id']}): {entry['description'][:120]}"
        )

    lines.extend(["", "### Top Hermes Plugins"])
    for entry in load_entries("hermes-plugins.json", 10):
        lines.append(
            f"- [{entry['name']}](/hermes/plugins/{entry['id']}): {entry['description'][:120]}"
        )

    return "\n".join(lines)


def build_compare_section() -> str:
    agents = load_agents(10)
    comparisons = load_comparisons(10)
    if not agents:
        return ""

    lines = [
        "",
        "## AI Coding Agents",
        "> Ranked comparisons of AI coding agents for agentic developers.",
        "",
        "### Hub",
        "- [Best AI Coding Agents (2026)](/compare/ai-coding-agents): Ranked hub with token usage and head-to-head links",
        "",
        "### Top Agents",
    ]

    for agent in agents:
        tagline = agent.get("tagline", "")[:100]
        lines.append(f"- [{agent['name']}](/compare/{agent['slug']}): {tagline}")

    if comparisons:
        lines.extend(["", "### Popular Comparisons"])
        for c in comparisons:
            name_a = agent_name(c["agentA"], agents)
            name_b = agent_name(c["agentB"], agents)
            lines.append(f"- [{name_a} vs {name_b}](/compare/{c['slug']})")

    return "\n".join(lines)


def strip_sections(content: str) -> str:
    for marker in ("## AI Agent Directory", "## AI Coding Agents"):
        if marker in content:
            content = content.split(marker)[0].rstrip()
    return content


def main():
    agent_section = build_agent_section()
    compare_section = build_compare_section()

    if LLMS_PATH.exists():
        content = strip_sections(LLMS_PATH.read_text())
    else:
        content = "# Artificial Jobs\n> Agentic dev tools and AI engineering jobs.\n"

    content = content + agent_section + compare_section + "\n"
    LLMS_PATH.write_text(content)
    print(f"Updated {LLMS_PATH} with agent directory and coding agent sections")


if __name__ == "__main__":
    main()
