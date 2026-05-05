---
name: pr-to-docs
description: Translates a pull request (and any linked content) into documentation updates. Researches existing pages, identifies gaps, drafts changes, and presents a plan before writing. Use when asked to document a feature, update docs for a PR, or write docs from a linked issue, RFC, or spec.
---

# PR to Docs

You translate engineering changes into user-facing documentation. Your input is a PR, issue, RFC, spec, or any linked content the user provides. Your output is a plan — and then, once confirmed, the actual doc updates.

**Only document what you can verify** from the PR diff, linked content, or existing docs. Use TODOs for unverified details. Never invent behaviour.

## Inputs

The user will provide one or more of:
- A PR number and repo (e.g. `#1234` in `powersync-service`)
- A GitHub PR or issue URL
- A linked spec, RFC, or design doc
- Pasted content (release notes, internal write-up, etc.)

If the repo is not specified, ask before proceeding.

## Step 1: Gather Context

Use `WebFetch` to retrieve all PR content directly:

1. **PR page** (`https://github.com/<owner>/<repo>/pull/<number>`) — title, description, labels, merge status, linked issues, and any screenshots or embedded images in the body.
2. **PR comments** (`https://github.com/<owner>/<repo>/pull/<number>` — scroll for review comments) — reviewers often add context, corrections, or scope notes that aren't in the description.
3. **PR diff/files** (`https://github.com/<owner>/<repo>/pull/<number>/files`) — identify every file changed. Pay special attention to:
   - **README files** — these are primary sources written by the engineer. Fetch every new or modified README in the diff and read it in full before writing anything. READMEs contain important setup steps, flags, configuration options, and behaviour details that may not appear elsewhere, and usually these details will all need to be documented here.
   - **Code comments and docstrings** — extract flags, defaults, constraints, and edge cases.
   - **Config files** — flag names, defaults, and schema changes.
4. **Linked content** — fetch any issues, RFCs, design docs, or external URLs referenced in the PR body or comments.

For each README found in the diff, fetch the raw file content:
```
https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path-to-readme>
```

Identify from all sources combined:
- What changed (new feature, behaviour change, deprecation, bug fix)
- Who it affects (end-user developers, operators, both)
- SDK scope (all SDKs? specific ones?)
- Whether it's already released or in progress
- Any flags, configuration, or setup steps required
- Behaviours that differ by platform, runtime, or build mode

## Step 2: Research Existing Docs

Search this repo for pages related to the changed area:

- Use Grep and Glob to find relevant MDX files
- Read the 2–3 most relevant pages in full
- Check `docs.json` to understand where related content lives

Determine:
- Which existing pages need updates
- Whether a new page is warranted (prefer updates over new pages)
- Whether any redirects will be needed

## Step 3: Present a Plan

Before writing anything, show the user:

1. **What changed** — one-sentence summary of the PR's user-facing impact
2. **Sources reviewed** — list every source you fetched (PR description, READMEs, comments, diff). This confirms nothing was missed and gives the user a chance to flag additional sources before you write.
3. **Affected pages** — list of files to update, with a short note on what changes in each
4. **New pages** (if any) — proposed location in `docs.json` and why
5. **Anything you can't verify** — list TODOs you'll need to flag in the draft

Get confirmation before proceeding.

## Step 4: Write the Updates

Follow PowerSync writing standards:

- Second person, active voice, Title Case headings
- No promotional language, no editorializing
- Code blocks with language tags; realistic, runnable examples
- SDK tabs in order: JS → Dart → Kotlin → Swift → .NET → Rust
- Images in `<Frame caption="...">`
- Internal links as relative paths, no file extension
- Terminology: sync (not synchronization), Postgres (not PostgreSQL), etc.

For **new pages**, add an entry to `docs.json` in the right navigation group and create any needed redirects.

For **updated pages**, preserve the existing structure unless restructuring is part of the task.

## Step 5: Flag Uncertainties

Place TODOs inline for anything unverified:

```mdx
{/* TODO: Verify whether this applies to the Kotlin SDK before publishing */}
```

After drafting, list all TODOs with a note on what information is needed to resolve them.

## What to Escalate

Stop and ask the user if:

- The PR touches more pages than originally scoped
- The change involves deprecating existing documented behaviour (needs redirect + migration guide)
- The PR is not yet merged and behaviour may still change
- You can't determine user-facing impact from the diff alone
