# PowerSync Documentation

Welcome to the PowerSync documentation repository! Our docs are powered by [Mintlify](https://mintlify.com/docs).

## Quick Start

1. **Fork and clone your repository:**
   - On GitHub, click "Fork" at the top right of this repository to create your own copy.
   - Then clone your fork:
   ```
   git clone https://github.com/YOUR-USERNAME/powersync-docs.git
   cd powersync-docs
   ```
2. **Install Mintlify CLI:**
   ```
   npx mintlify install
   ```
3. **Start the local docs server:**
   - Run the following command at the root of the repo (where docs.json is):
   ```
   npx mintlify dev
   ```
   
   - If you see the error `✖ Must be run in a directory where a mint.json file exists.`, update Mintlify:
   ```
   npx mintlify@latest dev
   ```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Publishing

All changes merged to the `main` branch are automatically published to https://docs.powersync.com.


## Editing guidelines

### Navigation & Global Settings

- Navigation and other global settings are defined in `docs.json`. Learn more in [Mintlify's docs](https://mintlify.com/docs/settings/global).
- If you move or rename a page, add a redirect using the `redirects` property to ensure existing links continue to work.

### Checking for Broken Links

Regularly check for broken links by running:
```
npx mintlify broken-links
```

### Whitelisting & Blacklisting Terms (Vale)

To whitelist terms so Mintlify's Vale integration does not flag them as misspelled:
- Add terms (one per line, case-insensitive) to `.github/vale/config/vocabularies/PowerSync/accept.txt`.
- To blacklist terms, create a `reject.txt` file in the same folder.
- For more info, see [Mintlify's docs](https://mintlify.com/docs/settings/ci#vale) and [Vale's docs](https://vale.sh/docs/keys/vocab).

### Icons

FontAwesome icons are supported: https://fontawesome.com/search

We use the following icons for supported backend databases and SDKs:
- Postgres: `icon="elephant"`
- MongoDB: `icon="leaf"`
- MySQL: `icon="dolphin"`
- Flutter: `icon="flutter"`
- React Native: `icon="react"`
- Web: `icon="js"`
- Kotlin: `icon="k"`
- Swift: `icon="swift"`
- Node.js: `icon="node-js"`
- .NET: `icon="microsoft"`

### Useful References

- [Writing content](https://mintlify.com/docs/page)
- [Available components](https://mintlify.com/docs/content/components/accordions)
- [Global settings](https://mintlify.com/docs/settings/global)
- [Reusable Snippets](https://mintlify.com/docs/reusable-snippets)

## Troubleshooting

- **Mintlify dev isn't running:** Run `npx mintlify install` to re-install dependencies.
- **Page loads as a 404:** Make sure you are running in a folder with `docs.json`.
