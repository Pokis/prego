# Static deployment

Production is published at `https://prego.potatoroad.lt/` through GitHub Pages. The portable artifact is `dist/`, and no server-side functions or rewrites are required.

> **Content status:** health records are currently `editorial-ready`, not `clinical-approved`. The technical release gate permits that state while continuing to enforce sources, review freshness and release readiness. Publishing does not change or overstate the recorded clinical status; the live site retains its pending-review banner and `noindex` metadata.

## GitHub Pages

The repository includes two complementary workflows:

- `.github/workflows/verify.yml` checks every push and pull request but never deploys.
- `.github/workflows/deploy-pages.yml` runs automatically for pushes to `main`. It repeats the complete non-browser verifier, runs automated accessibility checks, builds through `build:release`, audits broken links and the final Pages artifact, then deploys.

The build derives GitHub Pages URLs from GitHub's environment:

| Repository type         | Canonical origin              | Base path      |
| ----------------------- | ----------------------------- | -------------- |
| `owner/project`         | `https://owner.github.io`     | `/project/`    |
| `owner/owner.github.io` | `https://owner.github.io`     | `/`            |
| This repository         | `https://prego.potatoroad.lt` | `/`            |
| Another custom domain   | value of `SITE_URL`           | `/` by default |

This keeps navigation, canonical links, the sitemap, manifest, social image, search index, React assets and service-worker registration on the same subpath. `public/.nojekyll` is included in every artifact.

### Repository setup

1. Open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
2. Configure `prego.potatoroad.lt` as the Pages custom domain and enable HTTPS after GitHub confirms the DNS records.
3. Push an authorized release change to `main`.
4. Monitor both workflows. `Verify` never publishes; `Deploy site to GitHub Pages` publishes only when every release job succeeds.
5. Verify the live domain, canonical URL, service worker and representative navigation after deployment.

The deployment workflow fixes `SITE_URL` to `https://prego.potatoroad.lt/` and `BASE_PATH` to `/`. `public/CNAME` contains the matching hostname. Keeping all three values aligned prevents GitHub from building `/prego/` asset paths for a custom domain that serves the site at `/`.

### Custom domain

The production custom domain is already represented in source control. To configure or repair it:

1. Keep the workflow's `SITE_URL` at `https://prego.potatoroad.lt/` and `BASE_PATH` at `/`.
2. Keep `public/CNAME` as the single line `prego.potatoroad.lt`.
3. Configure that exact custom domain in **Settings → Pages**.
4. Complete the DNS records GitHub shows and enable HTTPS after the certificate is ready.

Changing domains requires one coordinated change to the workflow, `public/CNAME`, GitHub Pages settings and DNS. Do not add a placeholder `CNAME`; it changes the published domain behavior.

### Local Pages simulation

Run the same URL derivation against a disposable project-site build:

```sh
npm ci
npm run audit:github-pages
```

The audit keeps unit coverage for generic `/repository/` project sites, then builds this repository as `https://prego.potatoroad.lt/`. It checks root paths, canonical URLs, the sitemap, `CNAME`, required files and the automatic `main`-branch workflow before removing its temporary artifact. It does not start a server or connect to GitHub.

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
- `npm run audit:github-pages` checks GitHub's `/repository/` project-site behavior and automatic-release workflow guardrails.

References: [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub's custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
