# Testing strategy

## Unit

Vitest covers date arithmetic, journey transitions, storage versions and generated-content coverage.

## Content audit

`audit:content` checks minimum counts, unique IDs, source existence, review expiry, weekly/postpartum continuity and essentials coverage. With `--release`, every public health record must be `clinical-approved`.

## Browser

Playwright covers Chromium, Firefox, WebKit and a mobile profile. Core journeys include home entry paths, device-only date personalization, static search, meaningful topic filters, bookmark retrieval, hidden-milestone restoration, direct essentials, week/month orientation, care tiers, urgent help and 320px overflow.

## Accessibility

Axe runs on the homepage, timeline, a representative weekly chapter, essentials, partners and urgent-help pages. Serious and critical findings fail the suite. Manual checks remain a release requirement.

## Static audit

After building, `audit:static` checks route count, required routes/assets, landmarks, titles, local URL leakage and disallowed third-party runtime references.
