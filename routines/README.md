# Routines

The scheduled Claude Code cloud agents ("routines") that act on this repo. They run in Anthropic's cloud from https://claude.ai/code/routines, not from here, but each one reads its prompt from this directory at the start of every run. The files here are the source of truth.

The routines belong to @benitav's claude.ai account. Anyone can read these files to see what the automation does and why an issue was filed, and propose a prompt change in a PR. The first run after it merges to `main` uses it. Changes to a routine's settings still need Benita.

| Routine | Schedule | File |
|---|---|---|
| Prevent docs drift | Twice daily, 06:00 and 12:00 UTC | [prevent-docs-drift.md](./prevent-docs-drift.md) |

## How it's wired

The prompt saved on claude.ai is a short stub that tells the routine to read its file here, from its clone of `main`, and follow everything below the rule. The stub is:

```
Read `/home/user/powersync-docs/routines/prevent-docs-drift.md`, your clone of `powersync-ja/powersync-docs` on `main`. If it isn't at that path, find it with `find / -path '*/powersync-docs/routines/prevent-docs-drift.md' 2>/dev/null`. Skip its YAML frontmatter and the note above the first horizontal rule. Everything below that rule is your prompt for this run: follow it exactly. If the file is missing or empty, stop and report that as the run's result. Don't improvise the routine from memory.
```

- **Prompt changes:** edit the file and merge to `main`. Nothing needs to be pushed.
- **Settings changes:** the frontmatter (schedule, sources, allowed tools, model) mirrors the routine's settings on claude.ai. Those still have to be pushed with the `/schedule` skill, using the routine ID in the frontmatter. `config_last_synced` says when they were last pushed.
- **Missing file:** if the file is missing or empty, the routine stops and reports it instead of improvising.

## Prevent docs drift

Scans recent PRs across the SDK, service, and tooling repos twice a day and files `[Divergence]` issues here when the docs need to catch up. It only files issues — it never writes documentation or opens PRs. A human decides the scope, prepares the docs PR, and publishes it once the change has shipped in a release.

Closing a `[Divergence]` issue is also a human decision. The routine reads a closed issue as "no" for that source PR and won't re-file it for 30 days.
