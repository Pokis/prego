# Static deployment

No deployment has been performed. The portable artifact is `dist/`.

## Production inputs

Set `SITE_URL` to the canonical origin. Set `BASE_PATH` only when hosting under a subdirectory.

```sh
npm ci
npm run build:release
npm run audit:static
npm run audit:base
```

`build:release` is expected to fail until clinical review is complete.

## Provider-neutral settings

- Build command: `npm run build:release`
- Output directory: `dist`
- Node: 22+
- Functions/server rendering: none

Cloudflare Pages, Netlify and similar providers can publish `dist/` directly. GitHub Pages requires the correct repository `BASE_PATH`. A conventional web server should serve directory `index.html` files and the generated 404 page.

The service worker derives cached URLs from its registration scope, so root and subpath builds stay separate. Registration occurs only in production builds. `npm run audit:base` performs a disposable build under `/pregnancy-guide/` and checks navigation, manifest, social image, and service-worker paths.
