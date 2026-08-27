# Routines

Prompts for the scheduled Claude Code cloud agents ("routines") that operate on this repo. They run in Anthropic's cloud from https://claude.ai/code/routines, not from this repository, so this directory exists only to version-control the prompts and make changes reviewable.

**Edit here first, then have Claude Code push the change to the cloud routine.** The file in this directory is the source of truth for the prompt; the copy in claude.ai is what actually runs, and it does not update itself when this file changes. The preferred workflow:

1. Edit the prompt in this directory and open a PR so the change is reviewed.
2. Once merged, ask Claude Code to sync it: "update the drift routine from `routines/prevent-docs-drift.md`". It uses the `/schedule` skill to push the prompt text below the separator to the routine ID in the frontmatter, leaving schedule, tools, and repos untouched, and echoes the stored config back so you can confirm.
3. Bump `last_synced` in the file's frontmatter.

Avoid editing the prompt directly in the claude.ai UI. If you have to (Claude Code unavailable, urgent fix), copy the new text back here in the same sitting so the two never diverge.

## What the routine does

The drift routine files `[Drift]` issues in this repo. It never opens PRs and never writes documentation copy — a human decides the scope, prepares the docs PR, and publishes it once the underlying change has shipped in a release. Closing a `[Drift]` issue is also a human decision, and the routine treats a closed issue as the team's "no" for that source PR for the next 30 days.

| Routine | Schedule | File |
|---|---|---|
| Prevent docs drift | Twice daily, 06:00 and 12:00 UTC | [prevent-docs-drift.md](./prevent-docs-drift.md) |
