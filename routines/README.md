# Routines

A paper trail for the scheduled Claude Code cloud agents ("routines") that act on this repo. They run in Anthropic's cloud from https://claude.ai/code/routines, not from here. This directory just keeps a copy of each prompt in version control so changes are visible in a diff.

The routines belong to @benitav's claude.ai account, so only she can deploy them. Everyone else can read these files to see what the automation does, why an issue was filed, and suggest improvements.

| Routine | Schedule | File |
|---|---|---|
| Prevent docs drift | Twice daily, 06:00 and 12:00 UTC | [prevent-docs-drift.md](./prevent-docs-drift.md) |

Note that editing a file here changes nothing on its own — it has to be pushed to the routine with the `/schedule` skill, using the routine ID in the file's frontmatter. Each file's `last_synced` says how far behind it is.

## Prevent docs drift

Scans recent PRs across the SDK, service, and tooling repos twice a day and files `[Drift]` issues here when the docs need to catch up. It only files issues — it never writes documentation or opens PRs. A human decides the scope, prepares the docs PR, and publishes it once the change has shipped in a release.

Closing a `[Drift]` issue is also a human decision. The routine reads a closed issue as "no" for that source PR and won't re-file it for 30 days.
