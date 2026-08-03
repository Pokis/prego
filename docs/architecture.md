# Architecture and data flow

Pregnancy, Clearly is an Astro 7 static site. Every route is generated at build time. React is limited to optional islands for local setup, the Now/Next/Later summary, static-index search, filtering, bookmarks, milestone state and data deletion.

## Flow

1. Authored records and compact generation rules live in `scripts/generate-content.mjs`.
2. `npm run content:generate` writes normalized preconception, timeline, essentials, finding, after-birth topic, substitution, milestone, urgent and internal-source JSON plus a complete search index and four search shards.
3. `src/content.config.ts` validates every record through Astro Content Collections.
4. Static routes query collections with `getCollection()`.
5. Astro emits semantic HTML to `dist/`.
6. React islands hydrate only interactive controls. Essential prose, finding-level answers, substitute cards and links already exist in HTML.
7. Personal state uses one versioned local-storage record and never reaches a server.

## Boundaries

- Pages decide composition, metadata and structured data.
- Components decide presentation and interaction.
- Content records hold medical prose and internal source IDs.
- `src/lib/date.ts` is the only source for journey date calculations.
- Audit scripts enforce editorial and release invariants separately from type checking.

## Why generation exists

The getting-pregnant guide, forty weekly pages, eighteen essentials topics, 419 direct finding pages, eight after-birth topic guides, thirteen stage-specific postpartum periods and the practical substitute catalog need canonical, repeatable structure. The generator keeps IDs, task intents, record types, decision factors, care thresholds, related records, source-backed prose, controlled search aliases and direct anchors consistent while emitting inspectable JSON. It is not runtime AI generation and does not fetch content.
