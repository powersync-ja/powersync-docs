---
name: pr-to-docs
description: Research a PR, issue, RFC, or spec and translate its verified user-facing changes into a plan and PowerSync documentation updates.
---

# PR to Docs

Read [the canonical standards](../../CLAUDE.md) in full, including [Style Authority](../../CLAUDE.md#style-authority) and [Plain Technical English](../../CLAUDE.md#plain-technical-english). This workflow adds source research and planning requirements.

## 1. Establish the Source

Accept a PR number and repository, a URL, or supplied source text. Infer the repository from an explicit URL or established session context; ask if it remains ambiguous.

Read the PR description, comments, full diff, and relevant linked issues, specs, or references. Use the available GitHub, browser, or local source tools. Read every changed README in full; comments, docstrings, and configuration files can also explain behavior missing from the PR description.

Record the user-facing change, intended reader, SDK and platform scope, release status, required settings or steps, and relevant limitations. Research thoroughly, then select documentation detail under the canonical content strategy.

## 2. Locate Existing Coverage

Search the local docs, read the most relevant pages, and check `docs.json`. Identify the pages that need updates, whether a new page is necessary, and any required redirects.

## 3. Confirm the Plan

Present:

- The user-facing change and sources reviewed.
- Affected pages, proposed additions or moves, and the reason for each.
- Unverified facts and decisions needed before publication.

Obtain confirmation before drafting unless the user already approved the plan or explicitly authorized autonomous completion of this scope.

Ask before expanding scope, documenting a deprecation that needs migration decisions, or proceeding with an unmerged PR whose behavior may change. Do not repeat a question already resolved in the session.

## 4. Draft and Verify

Apply the canonical writing standards, navigation requirements, and verification checks. Preserve existing structure unless restructuring is part of the approved plan. Flag unresolved facts using the canonical draft-TODO convention and report what must be resolved before publication.
