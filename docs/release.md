# Release process

A push to `main` is the publication event. GitHub Actions performs a straight static build and Pages deployment; it does not run verification jobs.

## Before pushing

Run locally:

```sh
npm run verify
npm run test:e2e
npm run test:a11y
```

Resolve failures before the authorized push. For navigation, forms, focus, color, motion or responsive changes, also complete the documented manual keyboard, screen-reader, zoom/reflow, high-contrast and mobile checks.

Sources and existing provenance fields remain part of the content data, but they do not control whether GitHub Pages publishes.

## Publish

1. Confirm the intended changes and a clean local verification result.
2. Commit them to `main`.
3. Push `main` to `origin`.
4. Monitor `Deploy site to GitHub Pages` through completion.
5. Verify `https://prego.potatoroad.lt/`, representative routes, the PWA manifest, install icons and service-worker response.

The workflow is intentionally minimal: checkout, Node setup, `npm ci`, `npm run build`, Pages upload and Pages deploy.
