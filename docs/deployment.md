# Static deployment

Production is published at `https://prego.potatoroad.lt/` through GitHub Pages. The portable artifact is `dist/`, and no server-side functions or rewrites are required.

## GitHub Pages

`.github/workflows/deploy-pages.yml` runs automatically for pushes to `main`. It deliberately does only the work needed to publish:

1. Check out the repository.
2. Set up Node.js and run `npm ci`.
3. Run `npm run build` to generate the static PWA artifact.
4. Upload `dist/` and deploy it to GitHub Pages.

The workflow does not run schema checks, unit tests, content audits, link audits, Playwright or accessibility tests. Run the local verification suite before pushing an authorized release to `main`.

The build derives GitHub Pages URLs from GitHub's environment:

| Repository type         | Canonical origin              | Base path      |
| ----------------------- | ----------------------------- | -------------- |
| `owner/project`         | `https://owner.github.io`     | `/project/`    |
| `owner/owner.github.io` | `https://owner.github.io`     | `/`            |
| This repository         | `https://prego.potatoroad.lt` | `/`            |
| Another custom domain   | value of `SITE_URL`           | `/` by default |

This keeps navigation, canonical links, the sitemap, PWA manifest, icons, search index, React assets and service-worker scope on the same subpath. `public/.nojekyll` is included in every artifact.

### Repository setup

1. Open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
2. Configure `prego.potatoroad.lt` as the Pages custom domain and enable HTTPS after GitHub confirms the DNS records.
3. Run the full local verification suite.
4. Push an authorized release change to `main`.
5. Monitor `Deploy site to GitHub Pages` through completion and verify the live domain, canonical URL, PWA manifest, service worker and representative navigation.

The deployment workflow fixes `SITE_URL` to `https://prego.potatoroad.lt/` and `BASE_PATH` to `/`. `public/CNAME` contains the matching hostname. Keep all three aligned.

### Local release verification

```sh
npm ci
npm run verify
npm run test:e2e
npm run test:a11y
```

`npm run verify` includes schema and unit checks, content/static/link audits, nested-base and GitHub Pages simulations, plus the PWA artifact audit. None of these commands run in GitHub Actions.

To inspect a specific Pages artifact locally in PowerShell:

```powershell
$env:GITHUB_PAGES = "true"
$env:GITHUB_REPOSITORY_OWNER = "Pokis"
$env:GITHUB_REPOSITORY = "Pokis/prego"
$env:SITE_URL = "https://prego.potatoroad.lt/"
$env:BASE_PATH = "/"
npm run build
npm run audit:pages
npm run audit:pwa
```

Clear those environment variables before testing another hosting target.

### Custom domain

Keep these values together:

- Workflow `SITE_URL`: `https://prego.potatoroad.lt/`
- Workflow `BASE_PATH`: `/`
- `public/CNAME`: `prego.potatoroad.lt`
- GitHub Pages custom-domain setting: `prego.potatoroad.lt`

Changing domains requires one coordinated change to the workflow, `public/CNAME`, GitHub Pages settings and DNS.

## Other static hosts

Set `SITE_URL` to the canonical origin and `BASE_PATH` only for subdirectory hosting.

```powershell
$env:SITE_URL = "https://example.com"
$env:BASE_PATH = "/pregnancy-guide/"
npm run build
npm run audit:pages
npm run audit:pwa
```

Provider-neutral settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22 or newer
- Functions/server rendering: none

The build finalizes the service worker with the current hashed CSS, JavaScript, font and image assets. The service worker derives URLs from its registration scope, so root and project-subpath builds keep separate caches.

References: [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub's custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
