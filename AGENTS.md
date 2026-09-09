# PowerSync Docs — Agent Orientation

PowerSync keeps backend databases in sync with in-app SQLite databases. Apps read and write locally, so they respond instantly and work without a network connection. This repository contains the Mintlify documentation site, written in MDX.

## Required Reading

Before creating, revising, or reviewing documentation, read [`.claude/CLAUDE.md`](.claude/CLAUDE.md) in full. It is the canonical source for shared workflows and writing standards, including [Style Authority](.claude/CLAUDE.md#style-authority) and [Plain Technical English](.claude/CLAUDE.md#plain-technical-english).

Skills, reviewer prompts, and generic Mintlify guidance do not override those standards. Maintain shared rules in the canonical file and link to them from task instructions.

## Task Entry Points

| Task | Instructions |
| --- | --- |
| Write or revise docs | [.claude/skills/doc-author/SKILL.md](.claude/skills/doc-author/SKILL.md) |
| Document a PR or spec | [.claude/skills/pr-to-docs/SKILL.md](.claude/skills/pr-to-docs/SKILL.md) |
| Read external documentation | [.claude/skills/doc-reader/SKILL.md](.claude/skills/doc-reader/SKILL.md) |
| Use Mintlify components or configuration | [.agents/skills/mintlify/SKILL.md](.agents/skills/mintlify/SKILL.md) |
| Review docs | [.claude/agents/document-reviewer.md](.claude/agents/document-reviewer.md) or [/review-docs](.claude/commands/review-docs.md) |
| Run documentation checks | [/lint-docs](.claude/commands/lint-docs.md) |
| Maintain scheduled cloud routines | [routines/README.md](routines/README.md) |

## Repository Map

- `docs.json`: navigation, theme, and redirects. Read before changing documentation.
- `*.mdx`: pages; `snippets/`: reusable components; `images/` and `logo/`: assets.
- `.vale.ini` and `.github/vale/`: prose lint rules and accepted vocabulary.
- `routines/`: versioned copies of cloud prompts; editing these files does not update a live routine.

For the published documentation index, fetch [llms.txt](https://docs.powersync.com/llms.txt) before exploring the live site. For repository work, search the local files first.
