# [Docs] Swift SDK rewritten in pure Swift, removes Kotlin/SKIE dependency (powersync-swift #130)

> Auto-generated documentation update tracker. Convert to a GitHub Issue or address directly in a follow-up PR.
>
> **Assignees:** @benitav, @simolus3 (PR author)

**What shipped:** The PowerSync Swift SDK has been fully rewritten in native Swift, removing its internal dependency on the PowerSync Kotlin SDK and SKIE. The SDK now implements `SqlCursor`, the connection pool, sync client, schema serialization, and CRUD transactions directly in Swift using `CSQLite`, and loads the core extension via a direct function call instead of `sqlite3_load_extension`.

**Why this needs docs:** This is a major architecture change with user-facing breaking changes (`CrudBatch`, `CrudEntry`, and `CrudTransaction` are now concrete structs instead of protocols, the internal `withSession` API is removed, new typed `opDataTyped`/`previousValuesTyped` APIs on `CrudEntry`), and it directly contradicts current documentation that describes the Swift SDK as being built on top of the Kotlin SDK via SKIE.

**Likely affected pages/sections:**

- `client-sdks/reference/swift.mdx` — The "Kotlin -> Swift SDK" section (around lines 28-30) explicitly states the Swift SDK uses the PowerSync Kotlin SDK and SKIE under the hood. This section is now incorrect and should be removed or rewritten to reflect that the SDK is now pure Swift.
- `client-sdks/reference/swift.mdx` — Review code samples and notes about CRUD upload (`CrudBatch` / `CrudTransaction` / `CrudEntry` usage) since these types changed from protocols to concrete structs and may affect how user code is presented. Mention the new typed accessors `opDataTyped` and `previousValuesTyped`.
- `client-sdks/usage-examples.mdx` — Swift CRUD upload example (around line 621, `getCrudBatch()`) should be reviewed against the new concrete-struct API and any new typed accessors.
- `intro/setup-guide.mdx` — Swift backend connector example (around line 943, `getNextCrudTransaction()`) should be reviewed for compatibility with the new types.
- `handling-writes/custom-conflict-resolution.mdx` — If Swift-specific snippets reference `CrudEntry`, confirm they still apply with the new typed accessors.
- Any prerequisites/installation notes that mention the Kotlin XCFramework dependency or related build constraints should be removed, since the SDK no longer ships a Kotlin framework.

**Source PR:** [powersync-ja/powersync-swift#130](https://github.com/powersync-ja/powersync-swift/pull/130)
