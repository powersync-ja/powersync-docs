---
allowed-tools: Read, Glob, Grep, Bash(git diff *), Bash(git status *)
description: Review documentation changes against PowerSync writing standards. Use when asked to review, check, or audit documentation before publishing.
---

Review the documentation changes in this branch against PowerSync's writing standards.

1. Run `git diff main --name-only` to identify changed MDX files
2. Read each changed file
3. Use the `document-reviewer` agent to check each file against standards
4. Report all issues found, grouped by file
5. Provide an overall assessment and a prioritized list of required fixes before merging
