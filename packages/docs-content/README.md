# @powersync/docs-content

Connector snippets, agent prompts, and diagrams from the PowerSync docs, for the PowerSync Dashboard.

The docs are the source of truth. The build reads:

- `snippets/backend-connectors/**/*.mdx`
- `snippets/write-path/*-prompt.mdx`
- `images/handling-writes/*.png`

To change the content, edit those files.

## Usage

```ts
import { CONNECTOR_URL_PLACEHOLDER, type ConnectorId } from '@powersync/docs-content';
import connector from '@powersync/docs-content/connectors/generic/typescript';
import prompt from '@powersync/docs-content/prompts/existing-api';
import diagram from '@powersync/docs-content/images/write-path-overview.png';

const code = connector.replace(CONNECTOR_URL_PLACEHOLDER, instanceUrl);
```

The root export also has `CONNECTOR_IDS`, `PROMPT_IDS`, and `IMAGE_IDS`.

Removing or renaming an ID, or changing the placeholder, is a breaking change.

## Local Development

```sh
pnpm --filter @powersync/docs-content build
```

To try it in the Dashboard, run `pnpm link <path-to-this-directory>` there, and rebuild after each change.

## Releasing

1. Run `pnpm changeset` and select `@powersync/docs-content`.
2. Merge to `main`. The Release workflow opens a Version Packages PR.
3. Merge that PR to publish to npm.
