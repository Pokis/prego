# Content model and authoring

The schemas in `src/content.config.ts` are the contract. Records that do not conform never reach a route.

## Collections

- `timeline`: positive test, trimester overviews, gestational weeks and postpartum windows.
- `essentials`: always-open do, don’t, ask-doctor and concrete-example sections.
- `findings`: stable, directly anchored answers with a canonical essentials section, record type, controlled aliases, priority, care status, summary, visible details, decision factors, a care threshold, sources and review metadata.
- `substitutions`: searchable common foods and drinks with one verdict, a direct explanation, ranked alternatives and an exact label/preparation check.
- `preconception`: the getting-pregnant plan, direct rules, chance-versus-health factors, myths, help timing and partner actions.
- `milestones`: date/window anchored planning actions with importance metadata.
- `sources`: internal authority, canonical URL, dates, cadence and support note.
- `urgent`: an amber contact-care group plus red maternal and infant urgent-warning groups.

Every health-bearing record includes source IDs and review metadata. IDs are public contracts: routes, bookmarks, completion state and cross-links depend on them. Do not rename an ID casually; add a migration when stored state is affected.

## Authoring process

1. Identify the concrete action, caution or everyday situation the reader needs resolved.
2. Read current primary sources.
3. Write direct, plain guidance with do, don’t and ask-doctor boundaries.
4. Add source IDs and volatility.
5. Generate and audit.
6. Review the rendered route in context.
7. Obtain editorial and clinical review.

Generated JSON must not become a second source of truth. Edit the generator, regenerate, then commit both source and output.

## Finding coverage and search

Finding IDs are public fragment contracts: every record renders at `/essentials/#<finding-id>` and the search index must preserve that exact destination. P0 marks a high-consequence or highly expected answer, P1 marks an important breadth gap, and `baseline` retains a concrete example from the original essentials structure. Priority affects ranking and audit thresholds; it does not imply a diagnosis or an individual risk score.

Every finding exposes the same decision-support shape in the static page: a direct answer, practical clarification, three section-specific factors that can change the answer and a status-specific care threshold. `recordType` makes the generated collection useful to future static views without turning the reader experience into a filter maze. These fields provide structured general guidance; they must never be interpreted as a symptom assessment, contraindication engine or personalized clearance.

Aliases are a controlled vocabulary, not a bag of substrings. Add ordinary spelling, abbreviations and genuinely equivalent phrases. Whole query terms must match whole indexed terms; exact titles and aliases receive the strongest boosts. Medical prose stays in the finding record while `SiteSearch.tsx` handles only loading, offline, failure and result presentation.

`scripts/content-coverage.mjs` is the machine-readable coverage contract for at least 350 findings, minimum section and priority counts, required topic families, known zero-result queries and postpartum periods. Expand it when a new topic family becomes part of the product baseline.

## Postpartum authoring

Each after-birth period has distinct summaries, parent recovery, baby guidance, current actions, cautions, appointments, partner actions and topics. Reusing one generic set across periods is rejected by the content audit. Content remains parent-and-baby inclusive, does not assume a birth or feeding method and preserves direct urgent escalation.

## Substitute authoring

A substitute is not a product recommendation and must not promise that an item is universally safe. Name the familiar thing, choose the most useful supported verdict, lead with the direct answer and explain only the condition that changes the decision. Alternatives should solve different needs—closest taste, smallest change, easiest order—not merely repeat a generic instruction. `labelCheck` must tell the reader exactly what wording, amount, ingredient or preparation detail to inspect.

Search synonyms belong in `searchTerms`; they are discoverability metadata, not visible medical copy. `SwapFinder.tsx` controls search, category selection and layout only. It must not contain health guidance. Every card renders in the static HTML before hydration.
