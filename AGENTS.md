# PowerSync Docs — Agent Orientation

This is the documentation site for [PowerSync](https://www.powersync.com), a sync engine that keeps backend databases in sync with an in-app SQLite database. Apps read and write directly to this local database, so they respond instantly and stay fully functional without a network connection.

Documentation Index
Fetch the complete documentation index at: https://docs.powersync.com/llms.txt

Use this file to discover all available pages before exploring further.

It is built with [Mintlify](https://mintlify.com) using MDX files.

## Key Files

| File / Directory | Purpose |
|-----------------|---------|
| `docs.json` | Navigation structure, theme, redirects — read this first |
| `.claude/CLAUDE.md` | Canonical documentation standards for all agents |
| `.claude/skills/doc-author/SKILL.md` | Documentation writing mode |
| `.claude/skills/pr-to-docs/SKILL.md` | Translate a PR or spec into doc updates |
| `.claude/agents/document-reviewer.md` | Review docs against writing standards |
| `.claude/commands/review-docs.md` | `/review-docs` slash command |
| `.claude/commands/lint-docs.md` | `/lint-docs` slash command |
| `.github/vale/config/vocabularies/PowerSync/accept.txt` | Accepted technical terms for Vale linting |
| `routines/README.md` | Scheduled Claude Code cloud agents (routines) that act on this repo, and how to update them |
| `routines/prevent-docs-drift.md` | Prompt for the twice-daily drift check that files `[Drift]` issues here (live copy runs at claude.ai/code/routines) |

## Project Structure

```
docs.json          # Site config and navigation (required reading)
*.mdx              # Documentation pages
snippets/          # Reusable MDX components
images/            # Static assets
routines/          # Prompts for the scheduled Claude Code cloud agents that act on this repo
```

## Documentation Standards

`.claude/CLAUDE.md` is the single source of truth for writing, terminology, technical accuracy, formatting, and content strategy. All agents must read it before creating, revising, or reviewing documentation. Repository skills and reviewer agents define task-specific workflows and do not override those standards.

## Agent-Specific Config

- **Claude**: `.claude/CLAUDE.md` (loaded automatically)
- **All agents**: skills in `.claude/skills/` and agents in `.claude/agents/`

## Before Making Changes

1. Read `.claude/CLAUDE.md` in full
2. Read `docs.json` to understand the navigation structure
3. Search for existing content before creating new pages
4. Run `npx mintlify broken-links` after any link or navigation changes
5. Add new technical terms to `.github/vale/config/vocabularies/PowerSync/accept.txt`
