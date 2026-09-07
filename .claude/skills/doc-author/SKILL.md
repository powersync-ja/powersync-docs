---
name: doc-author
description: Documentation writing mode for PowerSync docs. Activates collaborative or autonomous writing with full awareness of PowerSync standards. Use when writing new pages, updating existing content, or restructuring documentation.
---

# PowerSync Doc Author

Create or revise PowerSync documentation with the minimum content readers need to understand the system and complete their task.

## Canonical Standards

Before writing, read `../../CLAUDE.md` in full. It is the single source of truth for PowerSync writing, terminology, mental models, technical accuracy, formatting, and content strategy. This skill defines the authoring workflow and verification guardrails only.

Only document behavior you can verify from the codebase, explicit user input, or existing documentation. Never guess.

## Operating Modes

**Collaborative (default)**: Assist the user with research, structure, drafting, and review. Present a plan before writing more than a few paragraphs.

**Autonomous**: Use only when the task is explicitly delegated with a clear brief. Complete the documentation independently, but escalate if the scope grows, accuracy is uncertain, or the task touches legal or security content.

## Before You Write

Determine:

1. What feature or concept the documentation covers.
2. Who needs it, such as application developers, operators, or both.
3. What readers should understand or be able to do afterward.

Then:

- Search for existing coverage to avoid unnecessary duplication.
- Read two or three related pages to match their structure and level of detail.
- Read `docs.json` to understand the content's location and navigation context.

## Workflow

1. **Understand** the requested outcome and scope.
2. **Research** the implementation and related documentation.
3. **Plan** the structure and location, then present it for confirmation when working collaboratively.
4. **Write** using every applicable standard in `../../CLAUDE.md`.
5. **Self-review** the content and verify it in proportion to the change.
6. **Submit** the draft for review or complete the explicitly delegated delivery workflow.

## Verification Guardrails

Document behavior supported by the codebase, authoritative sources, explicit user input, or consistent existing documentation.

For an implementation detail or edge case you cannot verify, either research it further or add an inline TODO:

```mdx
{/* TODO: Verify whether X is supported in the Kotlin SDK before publishing */}
```

Escalate when:

- The scope grows beyond the original task.
- Accuracy is uncertain for security, authentication, legal, or compliance content.
- Resolving an uncertainty requires a product decision or unavailable source.

## Self-Review

Before presenting the work:

- Apply every relevant standard in `../../CLAUDE.md`, including its explanatory-writing guidance.
- Confirm the content serves the intended reader and outcome.
- Check that recommendations explain why the behavior occurs and why the action helps.
- Preserve useful causal explanations when qualifying broad claims.
- Verify all technical claims and flag anything unresolved.
- Confirm the change fits existing content and navigation without unnecessary duplication.
- Run the relevant Vale, link, accessibility, or build checks for the files changed.
