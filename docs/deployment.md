# Static deployment

No deployment has been performed. The portable artifact is `dist/`, and no server-side functions or rewrites are required.

> **Current release status:** health records are still `editorial-ready`, not clinically approved. `npm run build:release` is expected to fail. That failure is a release safeguard, not a hosting problem; never replace it with `npm run build` in a public deployment workflow.

## GitHub Pages

The repository includes two intentionally separate workflows:

- `.github/workflows/verify.yml` checks every push and pull request but never deploys.
- `.github/workflows/deploy-pages.yml` is manual, requires an explicit public-release confirmation, runs the clinical release gate, audits the Pages artifact, then deploys.

The build derives GitHub Pages URLs from GitHub's environment:

| Repository type         | Canonical origin              | Base path      |
| ----------------------- | ----------------------------- | -------------- |
| `owner/project`         | `https://owner.github.io`     | `/project/`    |
| `owner/owner.github.io` | `https://owner.github.io`     | `/`            |
| This repository         | `https://prego.potatoroad.lt` | `/`            |
| Another custom domain   | value of `SITE_URL`           | `/` by default |

This keeps navigation, canonical links, the sitemap, manifest, social image, search index, React assets and service-worker registration on the same subpath. `public/.nojekyll` is included in every artifact.

### Repository setup

1. Push the repository to GitHub.
2. Open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
3. Let the `Verify` workflow pass. It does not publish anything.
4. Obtain clinical approval and update the review records until `npm run build:release` passes.
5. Only after public release is authorized, open **Actions → Deploy clinically approved site to GitHub Pages → Run workflow** and enable the confirmation input.

This repository defaults to `https://prego.potatoroad.lt/` in the deployment workflow and includes the same hostname in `public/CNAME`. Repository variables can still override the target. Without the custom-domain fallback, GitHub would build `/prego/` asset paths even though the custom domain serves the site at `/`.

### Custom domain

Only configure this when the real domain and DNS are ready:

1. Add the repository Actions variable `SITE_URL` with the full origin, such as `https://pregnancy.example`.
2. Add the repository Actions variable `BASE_PATH` with `/` unless the site genuinely lives below a path.
3. Add `public/CNAME` containing only the exact domain name.
4. Configure the custom domain and HTTPS in **Settings → Pages**, then complete the DNS records GitHub shows.

Do not add a placeholder `CNAME`; it changes the published domain behavior.

### Local Pages simulation

Run the same URL derivation against a disposable project-site build:

```sh
npm ci
npm run audit:github-pages
```

The audit keeps unit coverage for generic `/repository/` project sites, then builds this repository as `https://prego.potatoroad.lt/`. It checks the root paths, canonical URL, sitemap, `CNAME`, required files and guarded workflow before removing its temporary artifact. It does not start a server or connect to GitHub.

To inspect a specific Pages artifact locally in PowerShell:

```powershell
$env:GITHUB_PAGES = "true"
$env:GITHUB_REPOSITORY_OWNER = "your-owner"
$env:GITHUB_REPOSITORY = "your-owner/your-repository"
npm run build
npm run audit:pages
```

Clear those environment variables before testing a different hosting target.

## Other static hosts

Set `SITE_URL` to the canonical origin. Set `BASE_PATH` only when the site is hosted under a subdirectory.

```powershell
$env:SITE_URL = "https://example.com"
$env:BASE_PATH = "/pregnancy-guide/"
npm run build:release
npm run audit:pages
```

Provider-neutral settings:

- Build command: `npm run build:release`
- Output directory: `dist`
- Node.js: 22 or newer
- Functions/server rendering: none

Cloudflare Pages, Netlify and conventional static hosts can publish `dist/` directly. A conventional server should serve directory `index.html` files and the generated `404.html` page.

## How path handling works

`scripts/deployment-config.mjs` resolves one canonical origin and base path. Astro uses them for generated assets and the sitemap; application links use `src/lib/paths.ts`. The service worker derives cached URLs from its registration scope, so root and project-subpath builds have separate caches.

The checks cover three distinct cases:

- `npm run audit:static` checks the normal root artifact in `dist/`.
- `npm run audit:base` checks a generic `/pregnancy-guide/` deployment.
- `npm run audit:github-pages` checks GitHub's `/repository/` project-site behavior and workflow guardrails.

References: [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub's custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
