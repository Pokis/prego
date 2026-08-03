# Pregnancy, Clearly

A premium static guide focused on getting pregnant and the nine months of pregnancy. It combines a couple-friendly preconception guide, a clear month-and-week timeline and an always-open essentials handbook for food, dishes, drinks, exercise, medicines, work, travel, sex, sleep and everyday life. A practical Swap Finder turns common cravings into close, usable alternatives. An after-birth continuation remains available, but it is intentionally secondary to pregnancy.

> **Release status:** successful pushes to `main` publish automatically to [prego.potatoroad.lt](https://prego.potatoroad.lt/). GitHub performs a straight static build and Pages deployment with no cloud test or audit jobs. Run the complete verification suite locally before pushing an authorized release.

## Product shape

The public navigation is deliberately small:

- **Getting pregnant** — conception tips, a six-step plan, dos and don’ts, chance-versus-health explanations, fertility myths, common hurdles and when to seek help.
- **Timeline** — positive test, nine month map, trimester overviews, weeks 3–42 and important care windows.
- **Pregnancy essentials** — eighteen direct do/don’t/check-first topics, 419 stable finding pages, resilient whole-term search and a separate food-and-drink substitute finder.
- **For partners** — useful support actions at important pregnancy weeks.
- **Urgent help** — clearly separated pregnancy, postpartum and young-baby warning signs.

The **Getting pregnant** chapter has a persistent header entry and its own six-part section navigator on desktop and mobile. It remains a distinct pre-pregnancy chapter while the homepage and main timeline stay pregnancy-first.

The current content includes:

- 40 distinct weekly pregnancy chapters with a unique title, action, caution, clarification, appointment prompt and partner action.
- A fully expanded getting-pregnant guide with a six-step plan, couple-level dos and don’ts, nine chance-versus-health comparisons, eight myth corrections and clear points for seeking help.
- A nine-month orientation map that also explains why medical care counts pregnancy in weeks.
- Eighteen pregnancy-essential topics and 419 source-backed finding records. The catalog includes 179 P0, 153 P1 and 87 baseline answers across food and drinks, exercise, medicines, home and work exposures, travel, sexual health, sleep, tests, birth choices, symptoms, personal care, infections, mental health, chronic conditions, accessibility, pregnancy complications, loss and uncertainty, and newborn preparation.
- Each finding is a database-like public record with a stable ID, permanent page and direct anchor, record type, task intents, care tier, controlled aliases, concise answer, supporting detail, three decision factors, related records, an explicit care threshold and internal sources. The catalog is intentionally broad but remains general guidance—not a diagnostic or individualized-risk database.
- Fourteen searchable substitute cards for common drinks and foods, each with one clear verdict, the reason, two or three ranked alternatives and a label check.
- 21 date-window milestones for appointments, tests, decisions and preparation.
- Optional due-date or last-period personalization stored only on the device, with an editable “Baby loading” bar showing the estimated timeline and time remaining.
- A sharded searchable static index spanning preconception, weeks, findings, practical substitutes, milestones, partner guidance, warning signs and after-birth topics. Whole-term matching, exact-phrase boosts and controlled aliases prevent accidental substring matches; result explanations, controlled typo suggestions, loading, offline and failure states remain distinct from a genuine zero result.
- Stable copy-link anchors for major sections, individual examples, cautions, milestones and care notes, with visible highlighting when a shared fragment opens.
- Retrievable bookmarks, recently viewed and saved answers, recent searches, restorable hidden milestones, completed milestones, an actual birth-date transition and one-click local-data deletion.
- Eight topic-based after-birth guides plus 13 stage-specific checkpoints through month six as a separate continuation, with common information, contact-care advice and urgent thresholds visibly distinct.
- Static, semantic routes that remain useful without JavaScript.

The project intentionally has no accounts, backend, public location packs, FAQ library, chatbot, symptom checker, tracking, ads, affiliate links, comments, remote persistence or reader-facing source directory.

## Quick start

Requirements:

- Node.js 22 or newer.
- npm 11 or compatible.

```sh
npm install
npm run dev
```

Open the local URL printed by Astro. The content generator runs automatically before development and verification commands.

## Commands

```sh
npm run dev            # generate content and start Astro development
npm run check          # schema validation and Astro/TypeScript checks
npm run test           # date, storage, content and migration tests
npm run test:e2e       # Playwright journeys in the configured browsers
npm run test:a11y      # focused automated accessibility checks
npm run audit:content  # coverage, uniqueness and source-reference integrity
npm run report:coverage # human-readable coverage by topic, priority, intent and search shard
npm run build          # portable static evaluation artifact
npm run audit:static   # route, link and third-party-runtime audit of dist/
npm run audit:base     # nested-base-path build and link audit
npm run audit:pages    # audit the current dist/ as a Pages-ready artifact
npm run audit:github-pages # disposable GitHub project-site build and workflow audit
npm run audit:pwa      # manifest, icons, precache and offline-behavior audit
npm run verify         # complete non-browser verification sequence
npm run assets:pwa     # regenerate install icons from the tracked SVG source
npm run format         # format authored and generated files
```

## Architecture

```text
scripts/generate-content.mjs
        │ authored health records and generation rules
        ▼
src/data/generated/*.json
        │ validated by Astro Content Collections
        ▼
static Astro routes ───── small React islands for local-only state
        │
        ▼
dist/  portable HTML, CSS, JS and assets
```

Important locations:

- `src/config/site.ts` — brand, navigation and product-level disclaimer.
- `src/config/pregnancy.ts` — canonical month/week/trimester mapping.
- `scripts/generate-content.mjs` — authored preconception, timeline, essentials, finding-level answers, postpartum guidance, practical substitutes, milestones, urgent copy and internal evidence links.
- `src/content.config.ts` — public content contracts.
- `src/pages/` — static route composition.
- `src/pages/essentials/[topic].astro` — complete pregnancy topic pages.
- `src/pages/essentials/finding/[id].astro` — permanent direct-answer pages.
- `src/components/PregnancyMonthMap.astro` — reusable nine-month orientation.
- `src/components/TimelineEntryPage.astro` — predictable weekly chapter layout.
- `src/components/react/` — date setup, search, timeline filters, recent/saved answers, bookmarks, milestones and privacy controls.
- `src/components/react/SiteSearch.tsx` — build-time indexed, client-side search with no server or tracking.
- `src/components/react/SwapFinder.tsx` — progressively enhanced search and category filters over fully rendered substitute cards.
- `src/components/react/JourneySnapshot.tsx` — device-only Now/Next/Later pregnancy summary.
- `src/lib/date.ts` — timezone-safe date-only calculations.
- `src/lib/milestones.ts` — deterministic journey ordering and plain-language date-window labels.
- `src/lib/search.ts` — deterministic whole-term matching, controlled-alias and phrase ranking.
- `src/lib/storage.ts` — versioned device-state schema and migration.
- `scripts/audit-content.mjs` — content coverage and medical release rules.
- `scripts/deployment-config.mjs` — normalized canonical URL and automatic GitHub Pages base-path resolution.
- `.github/workflows/` — non-deploying pull-request CI plus the release-gated automatic Pages workflow for `main`.
- `tests/` — unit, cross-browser and accessibility verification.
- `docs/` — focused implementation and authoring documentation.

Generated JSON is committed for inspection but must not be hand-edited. Change the generator and run `npm run content:generate`.

## Content model

### Timeline chapter

Every public timeline record contains:

- Journey phase, stable ID, ordering and week/month label.
- A three-point “what to know” summary.
- Body/mind and baby-development copy.
- A real-life clarification or example.
- Direct “what to do” and “what not to do / ask first” lists.
- Appointment/decision and partner actions.
- Help tier, milestone links and internal source IDs.

Medical prose belongs in validated content records, never in presentational components.

### Pregnancy essential

Each essential contains:

- An always-visible introduction.
- `dos`, `donts` and `askDoctor` arrays.
- Concrete examples labeled `generally-ok`, `avoid` or `check-first`.
- Internal evidence IDs.

The labels are general guidance, not individualized approval. “Check first” always means checking the exact product, activity, symptom or health context with a doctor, midwife or pharmacist.

Each topic has its own `/essentials/<topic>/` route with the full baseline and every finding visible. Each finding also has a permanent `/essentials/finding/<id>/` route with a matching anchor, related answers, reviewed date and device-only save/share/print controls. Legacy `/essentials/#<id>` links remain valid through the A–Z directory.

### Practical substitute

Each substitute record contains:

- The familiar product or dish plus useful search synonyms and a browsing category.
- One verdict: keep within a limit, prepare differently, choose another version or check the exact product.
- A direct bottom line and a visible explanation.
- Two or three alternatives ordered by practical fit, such as closest taste, easiest change or keeping the original in a smaller amount.
- A specific packaging or preparation check and internal evidence IDs.

All cards are server-rendered. Search and category chips enhance the page after hydration; without JavaScript, every answer remains visible.

## Authoring recipes

### Update a pregnancy week

1. Edit `babyByWeek`, `bodyByWeek` or the matching `weekDetails` record in `scripts/generate-content.mjs`.
2. Keep the stable `week-{n}` ID.
3. Make the week-specific action, clarification, caution and appointment prompt genuinely distinct.
4. Attach relevant primary internal `sourceIds`.
5. Run `npm run content:generate`, `npm run check`, `npm run test` and `npm run audit:content`.
6. Run the relevant Playwright journey for layout or interaction changes.

### Add or update an essential

1. Edit the `essentials` collection in `scripts/generate-content.mjs`.
2. Write direct rules; do not turn the content into questions or accordions.
3. Add concrete examples that match one of the three supported statuses.
4. State when doctor review is needed and avoid universal medicine approval.
5. Add internal evidence IDs, regenerate and run all content checks.

### Add or update a finding

1. Add or edit the `finding(...)` record in `scripts/generate-content.mjs`; never hand-edit generated JSON.
2. Keep the stable slug ID and assign it to one canonical essentials section.
3. Add the phrases people genuinely type as distinct controlled aliases, one direct summary, visible supporting details, status, priority and internal sources. The section metadata supplies the validated record type, three decision factors and status-specific care threshold.
4. Use P0 for a high-consequence or predictably common gap, P1 for a meaningful breadth gap, and `baseline` for an existing essentials example.
5. Update `scripts/content-coverage.mjs` when the record establishes a required topic family or a zero-result query that must stay protected.
6. Add a positive, ranking and false-positive regression when the term needs new alias behaviour.
7. Regenerate and run schema, unit, content, browser, static and accessibility checks.

### Add or update a practical substitute

1. Edit the `substitutions` collection in `scripts/generate-content.mjs`.
2. Use the item name a reader would type and add realistic synonyms.
3. Pick one supported verdict and write the bottom line before the explanation.
4. Add two or three alternatives with distinct benefits; do not provide three cosmetic variations of the same answer.
5. Add one concrete label or preparation check and current source IDs.
6. Regenerate, run the content checks and exercise search, category filtering, keyboard use and narrow-screen reflow.

### Add a milestone

Add a stable record to the milestone catalog with an anchor, week/day window, importance, short action and internal sources. Milestones are common planning windows; the user’s doctor can change the actual schedule.

### Add an internal source

Use a primary health authority or professional guideline. Record the canonical URL, supported claim and available publication or update information. Sources provide internal editorial provenance and are not a separate reader journey or publication gate.

### Add a translation

Keep stable content IDs, create a complete locale edition, set the correct page language, and validate hydrated dates, filters, urgent wording and all essential examples. Translation does not introduce location-specific care packs.

## Date and timeline rules

- Pregnancy uses gestational age, counted from the first day of the last menstrual period.
- A clinician-provided estimated due date takes precedence over a calculated estimate.
- Month labels are orientation only; care decisions continue to use weeks.
- Month 9 covers weeks 36–40; weeks 41–42 are shown separately as “Beyond the due date.”
- Date-only helpers use UTC arithmetic so leap years, daylight-saving changes and local midnight do not move the displayed date.
- Passing the due date never switches the user to postpartum.
- Postpartum begins only after the actual birth date is entered.
- Changing from due date to actual birth date preserves bookmarks and completed milestones.

## Privacy

The browser may save:

- Due-date source and estimated due date.
- Last menstrual period when used for an estimate.
- Actual birth date.
- Audience view, bookmarks and milestone state.
- Up to eight recently viewed answers and five recent search phrases.

The version-2 journey state contains no location or unit preference. Version-1 records migrate dates and lists while dropping old location fields. Journey state and the two small activity lists use namespaced `localStorage` keys, are never uploaded, and are all erased by the Privacy page.

## Reader safety and release

Reader-facing content remains bounded general guidance:

- Never diagnose symptoms, calculate individualized risk, approve a medicine universally or tell someone to stop prescribed treatment.
- Separate common information, amber “contact your doctor” advice and red urgent action.
- Keep internal primary-source IDs for traceability.
- `npm run build` creates the deployable static PWA artifact.
- Run all schema, unit, content, browser, accessibility, static, Pages and PWA checks locally before pushing to `main`.

The absence of public citation panels is not permission to turn the guide into diagnosis or individualized treatment advice.

## Accessibility and progressive enhancement

- WCAG 2.2 AA is the target.
- Interactive targets are at least 44×44 CSS pixels.
- Timeline, essentials and urgent information are present in static HTML.
- Shareable findings use permanent static pages with ordinary fragment links; JavaScript only adds one-click copying, focus and confirmation.
- JavaScript enhances private personalization, full-text search, meaningful topic filtering, recently viewed/saved answers, bookmarks and milestone state only.
- The layout is tested at 320 CSS pixels, zoom/reflow, keyboard input and reduced motion.
- Color is paired with text labels such as “Generally okay,” “Avoid” and “Check first.”

## Static builds and hosting

```sh
npm run build
npm run audit:static
npm run audit:base
npm run audit:github-pages
```

The output is `dist/`. `SITE_URL` controls canonical and sitemap URLs; `BASE_PATH` supports subpath hosting. This repository's Pages workflow defaults to `https://prego.potatoroad.lt/` with a root base path and emits the matching `CNAME`. The generic resolver still supports `https://owner.github.io/repository/` project sites and root `owner.github.io` repositories.

```powershell
$env:SITE_URL = "https://example.com"
$env:BASE_PATH = "/pregnancy-guide/"
npm run build
```

See [Information architecture](docs/information-architecture.md) for the navigation hierarchy and [Static deployment](docs/deployment.md) for the automatic GitHub Pages workflow, fixed custom domain, local simulation and provider-neutral alternatives. GitHub runs only the static build and deployment; all verification is local before the push to `main`.

## Troubleshooting

- **Generated content is missing:** run `npm run content:generate`.
- **A page shows stale copy:** restart the development server after regeneration.
- **Dates appear one day off:** use `src/lib/date.ts`; never parse a date-only string through local midnight ad hoc.
- **The essentials page fails schema validation:** check every example status and all required do/don’t/ask arrays.
- **PWA audit fails:** rebuild first, then fix the reported manifest, icon, service-worker or precache problem.
- **A GitHub project site has broken assets:** run `npm run audit:github-pages`; do not hard-code the repository name in components.
- **Browser tests cannot start:** install the supported Playwright browsers with `npx playwright install` and rerun the focused command.

## Documentation and contribution rules

Start with [Documentation index](docs/README.md). Coding agents must also read [AGENTS.md](AGENTS.md) before changing the repository.

No open-source license has been granted. All rights are reserved unless the project owner adds a license later.
