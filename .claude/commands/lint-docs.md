---
allowed-tools: Bash(npx mintlify *), Bash(vale *), Bash(git diff *)
description: Run documentation linting checks — broken links, Vale prose style, and build validation. Use before publishing or merging documentation changes.
---

Run all documentation linting checks and report any issues.

1. Run `npx mintlify broken-links` to find broken internal links
2. Run `git diff main --name-only -- '*.mdx'` to get the list of changed MDX files
3. For each changed file, run `vale <file>` to check prose style
4. Report all broken links and Vale violations, grouped by file
5. For each violation, suggest a fix
6. Summarize: number of errors, warnings, and suggestions across all files
