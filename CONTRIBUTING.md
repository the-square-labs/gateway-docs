# Contributing to Good Gateway documentation

Documentation is published only when the English and Russian trees contain the same page paths and both versions pass the static build.

## Content workflow

1. Update the English page under `src/content/docs/en`.
2. Apply the equivalent change to the Russian page under `src/content/docs/ru`.
3. Preserve commands, API paths, configuration keys, product resource names, and security semantics.
4. Add public-safe screenshots under `public/screenshots` and use synthetic or redacted data.
5. Run `pnpm check` and `pnpm build`.

The Operations Console currently uses English UI labels. Russian guides should keep those labels in English when they identify a button, field, menu, tab, or status shown in the product.

## Publication safety

Do not commit:

- credentials, tokens, private keys, or secret names that reveal customer configuration;
- private IP addresses, internal hostnames, or local filesystem paths;
- customer names, email addresses, installation IDs, certificate bodies, or repository credentials;
- screenshots with production topology or operational identifiers that were not explicitly approved for publication.

## Delivery

The repository intentionally has no GitHub Actions workflow. Gateway Builds resolves an exact `main` commit, builds the static artifact, and Gateway Pages publishes the resulting immutable deployment through the `production` tag.
