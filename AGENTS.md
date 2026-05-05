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
| `.claude/CLAUDE.md` | Full writing standards and workflow (Claude) |
| `.claude/skills/doc-author/SKILL.md` | Documentation writing mode |
| `.claude/skills/pr-to-docs/SKILL.md` | Translate a PR or spec into doc updates |
| `.claude/agents/document-reviewer.md` | Review docs against writing standards |
| `.claude/commands/review-docs.md` | `/review-docs` slash command |
| `.claude/commands/lint-docs.md` | `/lint-docs` slash command |
| `.github/vale/config/vocabularies/PowerSync/accept.txt` | Accepted technical terms for Vale linting |

## Project Structure

```
docs.json          # Site config and navigation (required reading)
*.mdx              # Documentation pages
snippets/          # Reusable MDX components
images/            # Static assets
```

## Essential Standards

- **Format**: MDX files with YAML frontmatter (`title`, `description` required)
- **Headings**: Title Case, starting at H2 (H1 comes from frontmatter)
- **Voice**: Second person ("you"), active voice, present tense
- **Links**: Relative paths only — `/sync/streams/overview`, never absolute
- **New pages**: Must be added to `docs.json` navigation
- **Moved pages**: Must have redirects added to `docs.json`

## Terminology

| Use | Avoid |
|-----|-------|
| sync | synchronization |
| Postgres | PostgreSQL |
| PowerSync Service | powersync service |
| Sync Rules | sync rules |
| Sync Streams | sync streams |

## Agent-Specific Config

- **Claude**: `.claude/CLAUDE.md` (loaded automatically)
- **All agents**: skills in `.claude/skills/` and agents in `.claude/agents/`

## Before Making Changes

1. Read `docs.json` to understand the navigation structure
2. Search for existing content before creating new pages
3. Run `npx mintlify broken-links` after any link or navigation changes
4. Add new technical terms to `.github/vale/config/vocabularies/PowerSync/accept.txt`
