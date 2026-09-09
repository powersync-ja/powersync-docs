# PowerSync Documentation Standards

Write the minimum content readers need to understand PowerSync and complete their task.

## Style Authority

This file is the canonical source for shared workflows and documentation standards for all agents in this repository.

- Explicit user instructions take precedence. Otherwise, this file overrides conflicting prose guidance in skills, reviewer prompts, generic tool references (including Mintlify), and existing pages.
- Prioritize technical correctness, then reader understanding, then the minimum useful detail. Apply every writing and review rule under these priorities.
- External style guides fill gaps. They do not replace project conventions such as Title Case headings or PowerSync terminology.
- Maintain shared rules here. Skills contain task-specific workflows; commands and automation can specify output formats. Keep their references to this file when updating them, rather than copying its rules.
- Ask before making an exception that the user has not already authorized. Applying an explicit exception or exercising judgment allowed by a rule does not require additional permission.

## Working Process

1. Establish the topic, intended reader, outcome, and scope. Search existing pages and read `docs.json` before changing documentation. Prefer updates to existing pages; match useful local patterns without copying their mistakes.
2. Research the relevant implementation and authoritative references. Read only what the task requires. Prefer direct file reads and searches when paths are known. Track multi-step work with the available planning tool.
3. Verify technical claims, API behavior, platform scope, and examples. Do not invent facts. Identify inferences and ask when a required fact or decision remains unclear. Give candid, evidence-based feedback.
4. Follow the task skill's planning and delivery workflow. An approved scope remains approved; do not request the same permission again. Ask when scope expands or a product, security, authentication, or legal decision is needed.
5. For unresolved facts in a draft, add an MDX comment such as `{/* TODO: Verify whether X is supported before publishing */}` and report what must be resolved. A TODO does not make an unverified claim ready for publication.
6. Before presenting the result, review it against the writing standards and run the relevant [verification checks](#verification). Report changes, check results, and unresolved limitations.

## Writing Standards

### Content Strategy

- Lead with what readers need to know or do. Include prerequisites before procedural steps.
- Include a detail only when it helps readers understand behavior, recognize a relevant problem, or choose an action. A verified fact is not automatically useful documentation.
- For non-obvious behavior, explain the mechanism, consequence, observable signal, action, or trade-off that readers need. These are decision aids, not a mandatory five-part template. A reference entry often needs only its meaning and a useful next step.
- Preserve necessary causal context when shortening an explanation. Correct broad claims with narrow, accurate wording rather than a list of exceptions. Remove repetition, internal mechanics, and rare cases that do not affect the reader's interpretation or action.
- Explain why a recommendation helps when the reason is unclear. Use an example or contrast when it resolves a likely misunderstanding, such as a row in ten buckets being stored and synced ten times. Do not repeat explanations that are already clear.
- Prefer evergreen content and broadly applicable examples. Link to existing troubleshooting or advanced guidance for further detail.

### Plain Technical English

These required rules adopt principles from [ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/about_STE.html) and Google's guidance on [global audiences](https://developers.google.com/style/translation), [active voice](https://developers.google.com/style/voice), and [pronouns](https://developers.google.com/style/pronouns).

- Use second person for instructions and active voice with the correct actor. Distinguish the Service, source database, client SDK, and reader: "The Service checks the replication slot." Prefer present tense for general behavior.
- Use familiar words in their usual meaning and one term for each concept. Prefer "new snapshot" to "fresh snapshot" and "becomes active" to "takes over." Keep established technical terms when they are more precise.
- Give each sentence one main idea. Separate independent statements and instructions. Avoid long noun chains and mappings that depend on "respectively" when direct wording or separate rows are clearer. Do not fragment an explanation to meet a word count.
- Make references explicit: "this entry" or "these definitions" instead of an ambiguous "this" or "these." Include helper words such as "that" when they clarify meaning.
- Put a condition before its instruction: "If a deployment is still processing, check Replicator logs." Use numbered steps for a sequence.
- Briefly define unfamiliar abbreviations and terms on first use. Do not explain every term the intended reader already knows.
- Explain behavior and how readers recognize it. A bare disclaimer such as "This does not mean the data has downloaded" needs the relevant sequence or completion signal. Retain negative statements when they prevent a likely, consequential misunderstanding.
- Preserve exact log messages, error codes, identifiers, API names, and quoted output. Simplify the surrounding explanation without changing facts, removing necessary qualifications, or inventing an actor.

This is an adaptation of STE principles, not a requirement for full controlled-vocabulary compliance. Do not claim STE compliance from prose review or Vale results. Google's [reference hierarchy](https://developers.google.com/style#reference-hierarchy) also gives project-specific style precedence.

### Language and Tone

- Use American English, such as "behavior," "color," "initialize," and "analyze."
- Write concepts and benefits in full sentences. Use specific claims with evidence rather than vague attribution.
- Omit promotional language, editorial filler, and statements that minimize difficulty. Avoid "breathtaking," "it's important to note," "simply," "just," "easily," and "obviously."
- Avoid title and description filler such as "Comprehensive" or "Complete," and unnecessary transitions such as "moreover" or "furthermore."
- Explain the practical meaning of "local-first" or "offline-first": apps read and write locally, respond instantly, and remain functional without a network connection.

### Headings and Formatting

- Use Title Case headings. The page title comes from frontmatter; body headings start at H2.
- Use imperative headings only for procedural steps. Established "Get Started" and "Need Help?" headings, questions, and activity names such as "Reading Data" are also allowed.
- Use bold for a term being defined for the first time or a critical warning or distinction. Avoid decorative emphasis, emoji, and compressed labels in place of explanations.
- Do not join independent statements with a dash. Use separate sentences or a colon. Dashes are allowed for fragments, link-list annotations, headings, code, and table cells.
- Introduce components with their purpose: "Use [component] to…"

### Legal and Compliance Content

Contractual terms may intentionally differ from product terminology. For example, legal text may use "Synchronization Service." Confirm the intended legal meaning before changing such terms.

## Terminology

Use these conventions in authored prose, subject to the exceptions for exact technical literals and legal terms above.

| Use | Avoid |
| --- | --- |
| sync | synchronization |
| Postgres | PostgreSQL |
| partial sync | dynamic partial replication |
| PowerSync Service | powersync service |
| the Service | the service, when referring to PowerSync |
| Sync Rules | sync rules |
| Sync Streams | sync streams |
| Sync Config | sync config, except in identifiers such as `sync_config` |

Generic services, such as a Docker Compose service or a third-party service, stay lowercase.

## MDX and Mintlify

### Frontmatter

Every page requires a title and description:

```yaml
---
title: "Clear Title"
description: "Concise explanation of the page's purpose and value."
---
```

Optional fields include `sidebarTitle`, `icon`, and `keywords`. The description summarizes the page for previews. The opening paragraph must add context rather than repeat it; start with a heading or callout if no introduction is needed.

### Components

Use the Mintlify skill for syntax. These project conventions take precedence over its generic writing guidance:

| Component | Use |
| --- | --- |
| `<Steps>` | Sequential procedures |
| `<Tabs>` | Platform-specific content |
| `<CodeGroup>` | The same concept in multiple languages |
| `<Accordion>` | Optional details |
| `<Expandable>` | Nested object properties |
| `<Note>` | Additional helpful information |
| `<Tip>` | Best practices or shortcuts |
| `<Warning>` | Breaking changes or critical issues |
| `<Info>` | Neutral background context |
| `<Check>` | Success confirmations |

In platform lists, tabs, code groups, accordions, and cards, order SDKs as follows: JavaScript variants (React Native, Web, Node.js), Dart, Kotlin, Swift, .NET, Rust. Put platform-specific extras such as Capacitor and Tauri after the JavaScript variants they belong to.

Wrap images in a `Frame` with a caption and descriptive alt text:

```mdx
<Frame caption="Description of what the image shows">
  ![Alt text](/images/category/descriptive-filename.png)
</Frame>
```

### Code Examples

- Provide complete, runnable, tested examples with realistic data and expected output where useful. Never include real credentials or secrets.
- Give fenced code blocks a language tag. Use filenames only for self-hosted examples.
- Do not use placeholder names such as `foo`, `bar`, or `example.com` in runnable examples.
- In SQL, use table names directly unless an alias is necessary for a self-join or ambiguous column. Prefer `SELECT tasks.* FROM tasks JOIN projects ON ...` to aliases such as `t`.

### Links and Navigation

Use root-relative links without extensions for site pages, such as `/sync/streams/overview`. Do not use absolute site URLs or `../` links in published pages. Repository instruction files use relative file links.

Update `docs.json` when adding, moving, or removing pages. Add redirects for moved content and preserve existing navigation paths.

## Sync Streams and Sync Rules

Sync Streams are the default for new documentation. Keep legacy Sync Rules documentation accurate, but do not add new Sync Rules teaching, examples, or proactive references.

When existing content shows both in tabs, preserve equivalent results and filters. Do not add new parallel Sync Rules examples.

For existing prose that mentions both, use "[Sync Streams](/sync/streams/overview) (or legacy [Sync Rules](/sync/rules/overview))" once per page or major section. Later mentions should omit Sync Rules.

## Verification

- Verify technical claims and run code examples before publication. Select other checks appropriate to the change.
- Run `vale <file>` for changed MDX pages. Add new technical terms to `.github/vale/config/vocabularies/PowerSync/accept.txt`; do not add ordinary misspellings.
- After link or navigation changes, run `npx mintlify broken-links`. Mintlify requires Node 20.17–24; if needed, use `PATH="/opt/homebrew/opt/node@24/bin:$PATH" npx mintlify broken-links`.
- For anchor and snippet checks, use `pnpm check:links`. Validate repository instruction links as file paths, since the site checker does not cover all of them.
- Use [the lint command](commands/lint-docs.md) for the check workflow and [the reviewer](agents/document-reviewer.md) for editorial review. Passing linters does not establish technical accuracy or style compliance.

## Git Workflow

- Check for uncommitted changes. Ask how to handle them unless the session already authorizes work on those changes. Preserve unrelated edits.
- Create a branch when no clear branch exists for the work, and commit at useful milestones.
- Never use `--no-verify` or skip or disable pre-commit hooks.
