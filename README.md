# Bumeter — AI coding token usage for Claude Code, Kiro and OpenCode

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/bumkom.bumeter?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=bumkom.bumeter)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/bumkom.bumeter)](https://marketplace.visualstudio.com/items?itemName=bumkom.bumeter)
[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue)](LICENSE)

**See where your Claude Code, Kiro and OpenCode tokens go, right in VS Code.** Your 5-hour and weekly quota in the status bar, the conversations and turns that cost the most, why a session got expensive and what to do about it, the skills that cost context in every session, and the files agents keep reading. Everything is read from the logs on your machine; nothing leaves it. No account, no API key.

![Bumeter Overview in VS Code: tokens, quota, effectiveness and where the Claude Code quota went](https://raw.githubusercontent.com/bumeter/vscode/main/media/screenshots/overview.png)

## Overview

Tokens, turns and conversations for today, 7, 30 or 90 days, per tool. The **Quota** panel shows the 5-hour and weekly limits with reset times and a forecast. **Effectiveness** finds what wasted the quota (very large contexts, the same context sent again and again, a cache that went cold, rate limits, tool errors) and links to the turns and sessions behind each finding.

## Conversations

![Claude Code and Kiro conversations sorted by tokens, with the turns of one conversation](https://raw.githubusercontent.com/bumeter/vscode/main/media/screenshots/conversations.png)

Every conversation with its token count, the costliest first; filter by project, time, model, large context or interrupted turns, and open one to see each turn and what it cost.

## Skills

![Claude Code skills with their uses, average tokens and always-on cost, with on/off switches](https://raw.githubusercontent.com/bumeter/vscode/main/media/screenshots/skills.png)

Every skill of Claude Code, Kiro and OpenCode: how often it is used, what it costs in every session, and which ones you never use. Turn them off in one click, check them for safety, and install new ones from skills.sh.

## Status bar and Explorer

![Claude Code quota in the VS Code status bar, and Explorer marks on files agents read often](https://raw.githubusercontent.com/bumeter/vscode/main/media/screenshots/editor.png)

- **Status bar**: 5-hour and weekly quota, and the context of this workspace's latest session (`5h 62% · 7d 41% · ctx 312K`). Yellow from 70% or past the context threshold, red from 90% or when you are blocked. Hover for reset times and the forecast; click to open the Overview.
- **Explorer marks**: files of the workspace agents read 3 times or more in the last 7 days, without an edit in red (`9×`). A file read again and again is worth a line in `CLAUDE.md`.

Light and dark themes follow your editor.

![The Bumeter Overview in the VS Code light theme](https://raw.githubusercontent.com/bumeter/vscode/main/media/screenshots/overview-light.png)

Works in remote windows (SSH, WSL, Dev Containers, Codespaces): the extension runs where the logs are. Also runs in Cursor, Windsurf and Kiro.

## How it works

The extension runs `bum rpc`, which answers from the Bumeter app or `bum daemon` when one is running, and otherwise reads the logs itself. The first start on a machine reads the whole history once (15–60 s).

`bum` is bundled with the extension. To use another one, set `bumeter.binaryPath`.

## Settings

| Setting | Default | |
|---|---|---|
| `bumeter.binaryPath` | empty | Path to `bum`; empty uses the bundled one, then `PATH` |
| `bumeter.decorations.enabled` | `true` | Mark files in the Explorer |
| `bumeter.decorations.minReads` | `3` | Reads in 7 days from which a file is marked |

## FAQ

**How do I see my Claude Code token usage?** Install Bumeter and open **Bumeter: Open Overview** (or click the status bar item). It reads Claude Code's local logs, so past sessions show up too.

**Why did I hit the Claude Code limit so fast?** The Effectiveness panel lists the likely reasons with numbers: turns started with a very large context, sessions that re-sent the same context dozens of times, a cache that went cold. Each links to the turns behind it.

**Which conversation used the most tokens?** Conversations, sorted by tokens; the costliest are flagged 🔥.

**Does it work with Kiro and OpenCode?** Yes: each tool has its own tab, and Kiro credits are shown next to tokens.

**Does it upload my data?** No. Everything stays on your machine.

**Just the status bar?** [Claude Code Usage](https://marketplace.visualstudio.com/items?itemName=bumkom.bumeter-claude-usage) is the status bar alone; [Claude Code Skills Manager](https://marketplace.visualstudio.com/items?itemName=bumkom.bumeter-claude-skills) is the skills alone.

## Develop

```
npm install
npm test                    # unit tests (vscode is stubbed)
npm run build               # dist/extension.js
scripts/fetch-bum.sh x86_64-unknown-linux-gnu .bum/bum
BUM_BINARY=.bum/bum BUM_PLATFORM=linux-x64 node scripts/media.mjs
npx vsce package --no-dependencies --target linux-x64
CHROME=/path/to/chrome node scripts/screenshots.mjs   # media/screenshots, demo data
```

Shared code (the `bum rpc` client, the status bar item) comes from [`@bumeter/vscode-kit`](https://github.com/bumeter/vscode-kit), the UI from [`@bumeter/ui`](https://github.com/bumeter/ui) and `bum` from [bumeter/statusline](https://github.com/bumeter/statusline) releases (`BUM_VERSION`). Tagging `vX.Y.Z` builds one `.vsix` per platform and attaches them to a GitHub Release.

Part of Bumeter: [Claude Code Usage](https://github.com/bumeter/vscode-claude-usage) (only the status bar) · [Claude Code Skills Manager](https://github.com/bumeter/vscode-claude-skills) (only the skills) · [Statusline](https://github.com/bumeter/statusline) · [Desktop](https://github.com/bumeter/bumeter) · [bumeter.cc](https://bumeter.cc).

Unofficial; not made by Anthropic. Claude is a trademark of Anthropic.
