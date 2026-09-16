---
allowed-tools: Read, Bash(npx mintlify *), Bash(PATH=* npx mintlify *), Bash(vale *), Bash(git diff *), Bash(git status *)
description: Run Vale and Mintlify broken-link checks for documentation changes and report failures.
---

1. Read the canonical [Verification](../CLAUDE.md#verification) section for commands, supported Node versions, and vocabulary rules.
2. Use the requested file scope. Otherwise, identify changed MDX pages with `git diff main --name-only --diff-filter=ACMR -- '*.mdx'` and `git status --short`, including untracked pages.
3. Run `vale <file>` for each page and `npx mintlify broken-links` for the site. Use the canonical Node fallback if needed.
4. Report findings by file, suggested fixes, and totals for errors, warnings, and suggestions. Report failed or unavailable checks separately from content findings.
