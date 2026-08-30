# Good Gateway Documentation

Public documentation for [Good Gateway](https://goodgateway.dev), built with Astro and Starlight and published through Gateway Pages.

## Development

```sh
pnpm install
pnpm dev
```

Run the complete publication gate before pushing:

```sh
pnpm check
pnpm build
```

English and Russian content must remain structurally equivalent under `src/content/docs/en` and `src/content/docs/ru`. The content validator fails when either locale is incomplete, an image is missing, required metadata is absent, or a private local path/address appears in public content.

## Delivery

The production pipeline is owned by Gateway Builds and Gateway Pages:

- source branch: `main`;
- package manager: pnpm;
- Node.js: 24;
- build script: `build`;
- artifact directory: `dist`;
- published tag: `production`.

This repository intentionally contains no GitHub Actions workflow.

## Content safety

Never commit credentials, private addresses, customer topology, production identifiers, or screenshots containing secrets. Use synthetic names and redact operational data before adding screenshots.

## License

Portal code, configuration, and build scripts are licensed under the [MIT License](LICENSE-CODE). Documentation text and documentation images are licensed under [Creative Commons Attribution 4.0 International](LICENSE-DOCS). These licenses do not apply to the Good Gateway product source code, binaries, trademarks, or commercial license keys.
