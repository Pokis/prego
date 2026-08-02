# Content model and authoring

The schemas in `src/content.config.ts` are the contract. Records that do not conform never reach a route.

## Collections

- `timeline`: positive test, trimester overviews, gestational weeks and postpartum windows.
- `essentials`: always-open do, don’t, ask-doctor and concrete-example sections.
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

## Substitute authoring

A substitute is not a product recommendation and must not promise that an item is universally safe. Name the familiar thing, choose the most useful supported verdict, lead with the direct answer and explain only the condition that changes the decision. Alternatives should solve different needs—closest taste, smallest change, easiest order—not merely repeat a generic instruction. `labelCheck` must tell the reader exactly what wording, amount, ingredient or preparation detail to inspect.

Search synonyms belong in `searchTerms`; they are discoverability metadata, not visible medical copy. `SwapFinder.tsx` controls search, category selection and layout only. It must not contain health guidance. Every card renders in the static HTML before hydration.
