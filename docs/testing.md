# Testing strategy

## Unit

Vitest covers date arithmetic, journey transitions, storage versions and generated-content coverage.

## Content audit

`audit:content` checks minimum counts, unique IDs, required source references, review metadata and expiry, weekly/postpartum continuity and essentials coverage. With `--release`, `draft` and `needs-review` records fail; both `editorial-ready` and `clinical-approved` are technically publishable, and their distinct statuses remain visible in repository and product metadata.

## Browser

Playwright covers Chromium, Firefox, WebKit and a mobile profile. Core journeys include home entry paths, device-only date personalization, static search, meaningful topic filters, bookmark retrieval, hidden-milestone restoration, copyable finding links, direct fragment loading, direct essentials, week/month orientation, care tiers, urgent help and 320px overflow.

## Accessibility

Axe runs on the homepage, timeline, a representative weekly chapter, essentials, partners and urgent-help pages. Serious and critical findings fail the suite. For accessibility-affecting changes, complete the manual checks before pushing to `main`; the automatic release workflow cannot replace them.

## Static audit

After building, `audit:static` checks route count, required routes/assets, landmarks, titles, local URL leakage and disallowed third-party runtime references.
