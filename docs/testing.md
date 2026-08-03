# Testing strategy

## Unit

Vitest covers date arithmetic, journey transitions, storage versions, generated-content coverage and search normalization/ranking. Search regressions include expected positive matches, protected zero-result terms, phrase and alias ranking, permanent finding destinations, match explanations, controlled typo recovery, highlighting, unrelated queries and substring false positives.

## Content audit

`audit:content` checks the 419-record floor, all eighteen section floors, priority and task-intent floors, unique IDs, required source references, review metadata and expiry, weekly continuity and required topic families. Finding audits also require a valid stage, record type, care tier, up to three valid related IDs, three distinct decision factors, an explicit care threshold and at least 30 words of direct answer plus supporting detail; duplicate normalized aliases, summary-as-detail filler and direct guidance reused across findings fail. Search records must preserve controlled aliases, types, safety facets, intents and permanent routes. The shard manifest must contain the complete index exactly once. Postpartum audits reject duplicated filler across every required checkpoint field and require all eight distinct topic guides. With `--release`, `draft` and `needs-review` records fail; both `editorial-ready` and `clinical-approved` are technically publishable, and their distinct statuses remain visible in repository and product metadata.

## Browser

Playwright covers Chromium, Firefox, WebKit and a mobile profile. Core journeys include task-based home and navigation entry paths, device-only date personalization, sharded-search loading/failure/offline/zero states, ranked finding routes, recent and saved answers, meaningful topic filters, bookmark retrieval, hidden-milestone restoration, copyable links, direct topic/finding/after-birth pages, week/month orientation, care tiers, urgent help and 320px overflow.

## Accessibility

Axe runs on the homepage, timeline, a representative weekly chapter, essentials overview, representative topic and finding pages, the after-birth overview, partners and urgent-help pages. Serious and critical findings fail the suite. For accessibility-affecting changes, complete the manual checks before pushing to `main`; the automatic release workflow cannot replace them.

## Static audit

After building, `audit:static` checks the 500-page floor, representative topic/finding/after-birth routes, search shards, anchors, broken links and fragments, landmarks, titles, local URL leakage and disallowed third-party runtime references.
