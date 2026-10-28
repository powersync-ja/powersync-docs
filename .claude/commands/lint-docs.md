---
allowed-tools: Read, Bash(pnpm check:links), Bash(PATH=* pnpm check:links), Bash(vale *), Bash(git diff *), Bash(git status *)
description: Run Vale and the link check for documentation changes and report failures.
---

1. Read the canonical [Verification](../CLAUDE.md#verification) section for commands and vocabulary rules.
2. Use the requested file scope. Otherwise, identify changed MDX pages with `git diff main --name-only --diff-filter=ACMR -- '*.mdx'` and `git status --short`, including untracked pages.
3. Run `vale <file>` for each page and `pnpm check:links` once for the site.
4. Report findings by file, suggested fixes, and totals for errors, warnings, and suggestions. Report failed or unavailable checks separately from content findings.
