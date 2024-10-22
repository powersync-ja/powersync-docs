# Mintlify Starter Kit

## Things to note:

The `docs` branch is the one that's published on docs.powersync.com (to work around branch-protection rules).

Navigation (and other global settings) is defined in `mint.json`. If you move or rename a page, ensure you add a redirect.

Only Fontawesome icons are currently supported: https://fontawesome.com/search

We use the following icons for the SDKs and backend databases:
- Postgres: `icon="elephant"`
- MongoDB: `icon="leaf"`
- Flutter: `icon="flutter"`
- React Native: `icon="react"`
- Web: `icon="js"`
- Kotlin: `icon="flag"`
- Swift: `icon="swift"`

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where mint.json is)

```
mintlify dev
```

Regularly check for broken links by running

```
mintlify broken-links
```

### Publishing Changes

Changes will be deployed to production automatically after pushing to the `docs` branch. 

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
