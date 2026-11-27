---
'@powersync/docs-content': minor
---

Split each connector snippet into an authenticator snippet and a mutation uploader snippet, so apps can set up downloads first and add uploads later.

- `connectors/*` is replaced by `authenticators/{custom,supabase}/<sdk>` and `uploaders/{reference-write-endpoint,supabase}/<sdk>`. Each authenticator snippet connects for downloads only. Each uploader snippet connects for downloads and uploads, and replaces that call.
- `CONNECTOR_URL_PLACEHOLDER` is renamed to `INSTANCE_URL_PLACEHOLDER`. The `custom` authenticators and `reference-write-endpoint` uploaders contain it.
- `CONNECTOR_IDS` and `ConnectorId` are replaced by `AUTHENTICATOR_IDS`, `UPLOADER_IDS`, `AuthenticatorId`, and `UploaderId`.
- The snippets use the split connector API (an authenticator and a mutation uploader instead of a backend connector), and state the minimum SDK version that they require in their first lines. The Kotlin Supabase snippets use `SupabaseAuthenticator` and `SupabaseUploader` from the Kotlin SDK's Supabase integration.
