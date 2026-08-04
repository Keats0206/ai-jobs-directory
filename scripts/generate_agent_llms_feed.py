#!/usr/bin/env python3
"""Append AI Agent Directory section to llms.txt from generated JSON data."""

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


def build_agent_section() -> str:
    lines = [
        "",
        "## AI Agent Directory",
        "> Top 150 ranked plugins and MCP servers for OpenClaw and Hermes Agent.",
        "",
        "### Hub",
        "- [Agent Directory](/agents): Browse OpenClaw plugins, MCP servers, and Hermes plugins",
        "- [OpenClaw Plugins](/openclaw/plugins): Top 50 native OpenClaw extensions",
        "- [MCP Servers](/openclaw/mcps): Top 50 Model Context Protocol servers",
        "- [Hermes Plugins](/hermes/plugins): Top 50 Hermes Agent plugins",
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


def main():
    section = build_agent_section()

    if LLMS_PATH.exists():
        content = LLMS_PATH.read_text()
        marker = "## AI Agent Directory"
        if marker in content:
            content = content.split(marker)[0].rstrip()
        content = content + section + "\n"
    else:
        content = "# AI Jobs Directory\n" + section + "\n"

    LLMS_PATH.write_text(content)
    print(f"Updated {LLMS_PATH} with agent directory section")


if __name__ == "__main__":
    main()
