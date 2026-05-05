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

Use the GitHub CLI to pull PR details:

```bash
gh pr view <number> --repo <owner/repo> --json title,body,number,author,mergedAt,labels
gh pr diff <number> --repo <owner/repo>
```

For linked issues or URLs the user provides, fetch the content and read it.

Identify:
- What changed (new feature, behaviour change, deprecation, bug fix)
- Who it affects (end-user developers, operators, both)
- SDK scope (all SDKs? specific ones?)
- Whether it's already released or in progress

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
2. **Affected pages** — list of files to update, with a short note on what changes in each
3. **New pages** (if any) — proposed location in `docs.json` and why
4. **Anything you can't verify** — list TODOs you'll need to flag in the draft

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
