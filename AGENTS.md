# AGENTS.md — Pregnancy, Clearly

This is the operating contract for every coding or content agent in the repository.

## Mission

Build a calm, beautiful and private guide to the nine months of pregnancy for first-time parents and their support people. The primary experience is a concrete week-by-week timeline plus one always-open essentials handbook. After-birth content is a secondary continuation.

The product must not become a chatbot, symptom checker, diagnostic tool, advertising funnel, location-pack directory, citation browser or FAQ maze.

## Product-shape invariants

1. Public navigation stays focused on Getting Pregnant, Timeline, Pregnancy Essentials, For Partners and Urgent Help. The Getting Pregnant entry and its on-page section navigation must remain obvious on desktop and mobile.
2. Pregnancy remains visually and editorially primary; after-birth content is clearly separated.
3. Core answers are visible on the page. Do not hide essential guidance in accordions, questions, tooltips or external links.
4. `src/pages/essentials/index.astro` is the canonical everyday do/don’t/check-first experience.
5. `src/pages/getting-pregnant/index.astro` is the canonical preconception experience; keep conception chances distinct from future-baby health.
6. Do not reintroduce reader location selection or country-specific care packs. General guidance must tell readers when their doctor or midwife should individualize it.

## Reader-safety invariants

1. Never declare a medicine, dose, supplement or treatment universally safe.
2. Never tell a reader to start or stop prescribed treatment; instruct them to review the exact product with their doctor or pharmacist.
3. Never diagnose, calculate individualized risk or infer health from saved dates, bookmarks or checklist state.
4. Keep common information, “contact your doctor” advice and urgent help visually and semantically distinct.
5. Medical prose belongs in validated content records, not presentational components.
6. A disclaimer is not a substitute for precise, safe wording.

## Repository map

- `scripts/generate-content.mjs`: authored preconception, timeline, essentials, milestones, urgent copy and internal evidence catalog.
- `src/data/generated/`: generated and inspectable JSON; never hand-edit.
- `src/content.config.ts`: schemas for public content collections.
- `src/config/pregnancy.ts`: canonical month/week/trimester mapping.
- `src/pages/`: static routes and page composition.
- `src/components/PregnancyMonthMap.astro`: reusable nine-month map.
- `src/components/TimelineEntryPage.astro`: weekly and checkpoint template.
- `src/components/react/`: local-only date setup, Now/Next/Later summary, full-text search, meaningful filters, bookmarks, milestones and privacy controls.
- `src/lib/date.ts`: UTC date-only timeline calculations.
- `src/lib/milestones.ts`: canonical milestone ordering and timing labels.
- `src/lib/storage.ts`: versioned browser-state migration.
- `src/styles/global.css`: tokens, components, responsive behavior and accessibility states.
- `scripts/audit-content.mjs`: coverage, uniqueness and source-reference integrity.
- `scripts/deployment-config.mjs`: canonical origin and root/subpath resolution, including GitHub Pages project sites.
- `.github/workflows/`: the automatic deployment-only Pages workflow for `main`; verification runs locally before push.
- `tests/`: unit, browser and automated accessibility checks.
- `docs/`: architecture, authoring, safety, testing and deployment guidance.

## Commands before handoff

```sh
npm run check
npm run test
npm run audit:content
npm run build
npm run audit:pwa
npm run audit:static
npm run audit:base
npm run audit:github-pages
```

For UI changes, run the relevant Playwright journeys. For navigation, form, focus, color or responsive changes, run `npm run test:a11y`. Use `npm run verify` for the complete non-browser sequence.

Run verification locally before pushing to `main`. Do not deploy without explicit owner authorization.

## Content recipes

### Add or update a pregnancy week

Edit the appropriate `babyByWeek`, `bodyByWeek` and `weekDetails` records in `scripts/generate-content.mjs`.

Every week must have:

- A unique, concrete title.
- A useful body/mind and development description.
- A unique first action for this week.
- A real-life clarification or example.
- A specific caution.
- A relevant appointment or decision prompt.
- One concrete partner action.
- Relevant internal sources where they improve traceability.

Do not fall back to repeated trimester filler. Regenerate and run the content uniqueness tests.

### Add or update a pregnancy essential

Use an `essentials` record with:

- `dos`, `donts` and `askDoctor` arrays.
- Concrete examples with `generally-ok`, `avoid` or `check-first` status.
- Plain wording that works without an accordion or linked article.
- Relevant internal sources where they improve traceability.

Examples must name the actual food, dish, product, activity or situation. Avoid vague entries such as “eat safely” without explaining what that means.

### Add or update a practical substitute

Add a `substitutions` record in `scripts/generate-content.mjs`. Name the item people actually search for, choose one honest verdict, explain the bottom line, and provide two or three ranked alternatives with different practical benefits. Include a concrete label check and search synonyms. Keep all health claims and product amounts in the record with current source IDs; `SwapFinder.tsx` must remain presentation-only. Regenerate and test search, filters, the no-JavaScript render and 320 px reflow.

### Add or update getting-pregnant guidance

Use the single `preconception` record in `scripts/generate-content.mjs`. Keep the six-step plan, do/don’t/ask rules, factor comparisons, myths, help timing and partner actions consistent. Every factor must say separately what it changes about conception chance and future-baby health; do not turn general wellness into an unsupported fertility promise.

### Add a milestone

Add a stable ID, date anchor, start/end window, importance, action-oriented description and sources. Present the window as common planning guidance, not a fixed universal appointment.

### Add an internal source

Prefer WHO, public health authorities, national clinical guidance and established professional bodies. Record the canonical URL, supported claims and available publication/update information. Do not link the reader away as a substitute for writing a complete answer here.

### Add a locale

Preserve stable IDs and make a complete translated edition. Do not add country-specific appointments, emergency numbers or public-service packs through localization. Verify routes, language metadata, interaction copy and urgent wording locally.

## Voice and UX

- Lead with what the reader should know or do.
- Use “you” without assuming happiness, partnership, gender, birth method or feeding method.
- Explain uncommon terms at first use.
- Give concrete examples before abstract caveats.
- Never infantilize, shame or use alarm as engagement.
- Do not make users open multiple panels to assemble one answer.
- Keep targets at least 44×44 CSS pixels.
- Preserve keyboard operation, focus, reduced motion, high contrast and 320px reflow.
- Keep critical information useful without JavaScript.

## Date and storage rules

- Use `src/lib/date.ts`; do not parse date-only values through local midnight.
- A clinician-provided due date takes precedence over an LMP estimate.
- Month labels orient readers; medical timing uses weeks.
- Month 9 ends at week 40. Weeks 41–42 use the separate “Beyond the due date” period and must never be folded back into a seven-week Month 9.
- Never switch to postpartum because the due date passed; an actual birth date is required.
- Preserve dates, bookmarks and milestones through storage migrations.
- Version 2 contains no region or units field. Do not reintroduce them.
- Never upload or remotely synchronize personal timeline state.

## Generated and public output

`src/data/generated/` and `public/data/search-index.json` come from `npm run content:generate`. Review the generator, not only generated diffs.

Public routes must not point to removed `/faq/`, `/guides/`, `/regions/`, `/sources/`, `/medical-review/` or `/editorial-policy/` pages. Static audits must catch missing internal links.

## Deployment boundary

GitHub Pages publishes automatically after a push to `main`. The GitHub workflow only installs dependencies, builds the static PWA artifact and deploys it; it must not run schema checks, tests, content audits, link audits or accessibility suites. Run the repository verification commands locally before the authorized push. Do not deploy or provision hosting without explicit authorization from the user; once given, the scoped deployment may proceed.
