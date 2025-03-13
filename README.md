# PowerSync Docs

The `docs` branch is the one that's published on docs.powersync.com. Merge your changes into this branch.

The workflow for updates is essentially:
* Create a PR to the `docs` branch
* Make sure that checks pass (these include a check for broken links)
* Get a review
* Merge (changes are published automatically upon merge)

There is also a WYSIWYG editor available in our [Mintlify dashboard](https://dashboard.mintlify.com/powersync/powersync), which is useful for quick updates that don't require a PR or review. Note that this editor is currently in Beta and is a little bit flakey in my experience, so double-check that your updates were indeed published if you use it. If you require access to the dashboard ping Benita or Kobie.

### Development

Run the following command at the root of your documentation (where mint.json is)

```
npx mintlify dev
```

Regularly check for broken links by running

```
npx mintlify broken-links
```

Navigation (and other global settings) is defined in `mint.json`. Learn more about these in [Mintlify's docs](https://mintlify.com/docs/settings/global).

NB: If you move or rename a page, ensure you add a redirect (via the `redirects` property) to that existing links that were shared via Discord etc continue to work.

#### Whitelisting Terms

Certain terms can be whitelisted such that Mintlify's Vale integration does not flag them as misspelled.

Modify the `.github/vale/config/vocabularies/PowerSync/accept.txt` file to add terms to the whitelist - every line is a new term. Terms added to the whitelist are not case-sensitive, but capitalisation is still used for readability purposes. Further info on Vale vocab lists can be found in [Mintlify's docs](https://mintlify.com/docs/settings/ci#vale) and [Vale's docs](https://vale.sh/docs/keys/vocab).

NB: If you need to blacklist terms, you can create a `reject.txt` file in the same folder as `accept.txt`.

#### Icons

Only Fontawesome icons are currently supported: https://fontawesome.com/search

We use the following icons for the SDKs and backend databases:
- Postgres: `icon="elephant"`
- MongoDB: `icon="leaf"`
- MySQL: `icon="dolphin"`
- Flutter: `icon="flutter"`
- React Native: `icon="react"`
- Web: `icon="js"`
- Kotlin: `icon="k"`
- Swift: `icon="swift"`
- Node.js: `icon="node-js"`
- .NET: `icon="wave-sine"`

#### Some useful references:
- Writing content: https://mintlify.com/docs/page
- Available components: https://mintlify.com/docs/content/components/accordions
- Global settings: https://mintlify.com/docs/settings/global

### Publishing Changes

Changes will be deployed to production automatically after pushing to the `docs` branch. You can review the deploy status in the Dashboard [here](https://dashboard.mintlify.com/powersync/powersync).


### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`

### Getting help

- Mintlify Slack community: https://mintlify.com/community 
- Send an email to support@mintlify.com.
