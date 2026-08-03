# Testing strategy

## Unit

Vitest covers date arithmetic, journey transitions, storage versions, generated-content coverage and search normalization/ranking. Search regressions include expected positive matches, protected zero-result terms, phrase and alias ranking, exact fragment destinations, unrelated queries and substring false positives.

## Content audit

`audit:content` checks the 350-record floor, section and priority floors, unique IDs, required source references, review metadata and expiry, weekly continuity and required topic families. Finding audits also require a valid record type, three distinct decision factors, an explicit care threshold and at least 30 words of direct answer plus supporting detail; duplicate normalized aliases, summary-as-detail filler and direct guidance reused across findings fail. Search records must preserve controlled aliases, record types and exact anchors. Postpartum audits reject duplicated filler across every required stage-specific field. With `--release`, `draft` and `needs-review` records fail; both `editorial-ready` and `clinical-approved` are technically publishable, and their distinct statuses remain visible in repository and product metadata.

## Browser

Playwright covers Chromium, Firefox, WebKit and a mobile profile. Core journeys include home entry paths, device-only date personalization, static search loading/failure/offline states, ranked finding results and exact fragment navigation, meaningful topic filters, bookmark retrieval, hidden-milestone restoration, copyable finding links, direct fragment loading, direct essentials, week/month orientation, care tiers, urgent help and 320px overflow.

## Accessibility

Axe runs on the homepage, timeline, a representative weekly chapter, essentials, partners and urgent-help pages. Serious and critical findings fail the suite. For accessibility-affecting changes, complete the manual checks before pushing to `main`; the automatic release workflow cannot replace them.

## Static audit

After building, `audit:static` checks route count, required routes/assets, landmarks, titles, local URL leakage and disallowed third-party runtime references.
