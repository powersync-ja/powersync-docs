# @powersync/docs-content

Authenticator and mutation uploader snippets, agent prompts, and diagrams from the PowerSync docs, for use outside the docs site, such as in the PowerSync Dashboard.

The docs are the source of truth. The build reads:

- `snippets/client-connection/**/*.mdx`
- `snippets/write-path/*-prompt.mdx`
- `images/handling-writes/*.png`

To change the content, edit those files.

## Usage

Each SDK has two kinds of snippet:

- `authenticators/<group>/<sdk>`: an authenticator and a download-only connect. The groups are `custom` (your own auth provider) and `supabase`.
- `uploaders/<group>/<sdk>`: a mutation uploader and a connect for downloads and uploads, which replaces the download-only connect. The groups are `reference-write-endpoint` and `supabase`. The reference write endpoint uploader works with either authenticator.

```ts
import { INSTANCE_URL_PLACEHOLDER } from '@powersync/docs-content';
import authenticator from '@powersync/docs-content/authenticators/custom/typescript';
import uploader from '@powersync/docs-content/uploaders/reference-write-endpoint/typescript';
import prompt from '@powersync/docs-content/prompts/existing-api';
import diagram from '@powersync/docs-content/images/write-path-overview.png';

const authenticatorCode = authenticator.replaceAll(INSTANCE_URL_PLACEHOLDER, instanceUrl);
const uploaderCode = uploader.replaceAll(INSTANCE_URL_PLACEHOLDER, instanceUrl);
```

The `custom` authenticators and `reference-write-endpoint` uploaders contain the placeholder. The Supabase snippets read the instance URL from app config.

The root export also has `AUTHENTICATOR_IDS`, `UPLOADER_IDS`, `PROMPT_IDS`, and `IMAGE_IDS`, and the types `AuthenticatorId`, `UploaderId`, `PromptId`, and `ImageId`.

Removing or renaming an ID, or changing the placeholder, is a breaking change.

## Local Development

```sh
pnpm --filter @powersync/docs-content build
```

To try it in another project, run `pnpm link <path-to-this-directory>` there, and rebuild after each change.

## Releasing

1. Run `pnpm changeset` and select `@powersync/docs-content`.
2. Merge to `main`. The Release workflow opens a Version Packages PR.
3. Merge that PR to publish to npm.
