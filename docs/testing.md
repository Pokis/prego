# Testing strategy

## Unit

Vitest covers date arithmetic, journey transitions, storage versions, generated-content coverage and search normalization/ranking. Search regressions include expected positive matches, protected zero-result terms, phrase and alias ranking, permanent finding destinations, match explanations, controlled typo recovery, highlighting, unrelated queries and substring false positives.

## Content audit

`audit:content` checks the 440-record floor, all eighteen section floors, priority and task-intent floors, unique IDs, unique reader-facing titles, source-reference integrity, weekly continuity and required topic families. Required families now include weight and nutrition context, substances and air quality, consumer monitoring, early-pregnancy conditions, practical birth preparation and accessible care. Finding audits also require a valid stage, record type, care tier, up to three valid related IDs, three distinct decision factors, an explicit care threshold and at least 30 words of direct answer plus supporting detail; duplicate normalized aliases, duplicate titles, summary-as-detail filler and direct guidance reused across findings fail. Search records must preserve controlled aliases, types, safety facets, intents and permanent routes. The shard manifest must contain the complete index exactly once. Postpartum audits reject duplicated filler across every required checkpoint field and require all eight distinct topic guides.

## Browser

Playwright covers Chromium, Firefox, WebKit and a mobile profile. Core journeys include task-based home and navigation entry paths, the device-only baby-loader save/edit/overdue states, sharded-search loading/failure/offline/zero states, ranked finding routes, recent and saved answers, meaningful topic filters, bookmark retrieval, hidden-milestone restoration, copyable links, direct topic/finding/after-birth pages, week/month orientation, care tiers, urgent help and 320px overflow.

## Accessibility

Axe runs on the homepage, timeline, a representative weekly chapter, essentials overview, representative topic and finding pages, the after-birth overview, partners and urgent-help pages. Serious and critical findings fail the suite. For accessibility-affecting changes, complete the manual checks locally before pushing to `main`; GitHub does not run them.

## Static audit

After building, `audit:static` checks the 500-page floor, representative topic/finding/after-birth routes, search shards, anchors, broken links and fragments, landmarks, titles, local URL leakage and disallowed third-party runtime references.

## PWA audit

`audit:pwa` validates the built manifest, relative app identity and scope, 192 px and 512 px PNG icons, a maskable icon, Apple touch metadata, versioned build-asset precaching, navigation-only offline fallback and non-HTML 503 behavior. It runs locally as part of `npm run verify`, never in the GitHub deployment workflow.
