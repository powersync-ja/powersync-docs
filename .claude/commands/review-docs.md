---
allowed-tools: Read, Glob, Grep, Bash(git diff *), Bash(git status *)
description: Review documentation changes against the canonical PowerSync standards and report prioritized fixes.
---

1. Read [the canonical standards](../CLAUDE.md) and [reviewer instructions](../agents/document-reviewer.md).
2. Use the requested review scope. For a branch review, use `git diff main --name-only --diff-filter=ACMR -- '*.mdx'` and `git status --short`; include relevant untracked pages.
3. Read the affected files and review them with the `document-reviewer` agent when available. Otherwise, apply its instructions directly.
4. Use the reviewer's default output: findings grouped by file, prioritized fixes, and an overall assessment.
