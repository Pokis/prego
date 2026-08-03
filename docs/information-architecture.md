# Information architecture

The public header stays intentionally small: Getting Pregnant, Timeline, Pregnancy Essentials, For Partners and Urgent Help. Descriptions under each label explain the destination before a reader commits. After Birth is a clearly separated continuation linked from the homepage wayfinder, timeline and footer rather than competing with pregnancy in the primary header.

## Starting paths

The homepage and Pregnancy Essentials overview use the same four-way wayfinder:

1. Before pregnancy opens the complete Getting Pregnant chapter.
2. Follow pregnancy opens the week-by-week Timeline and optional device-only setup.
3. Find a pregnancy answer opens the dominant whole-guide search and topic handbook.
4. After birth opens its separate topic-and-time overview.

These are navigation choices, not a questionnaire. No answer depends on disclosing dates, symptoms or personal details.

## Pregnancy Essentials hierarchy

Pregnancy Essentials has three complementary levels:

- The overview is the canonical search and do/don't/check-first starting point. It provides six task shortcuts, an eighteen-topic directory, one visible baseline from every topic and an A-Z legacy-anchor directory.
- `/essentials/` starts with search and a sticky page map, then exposes task-based shortcuts, a topic directory with counts and examples, and one shareable answer library filtered by topic, task, next step and depth. The focused default removes short baseline records that can look repetitive; a query always checks the complete collection.
- `/essentials/<topic>/` contains the complete topic baseline, concrete examples and a filterable direct-finding collection without accordions.
- `/essentials/finding/<id>/` is the smallest shareable answer. It contains the summary, practical detail, decision factors, care threshold, reviewed date, related answers and device-only save/share/print actions.

The finding ID is stable across its route, fragment, search index, local save key and cross-links. Search, the answer library and sharing use the smaller permanent page rather than a giant overview-page A–Z directory.

## Search and recovery

Search is one guide-wide entry point rather than a competing directory. It loads a small core shard first, then the remaining everyday, care and planning shards. Whole-term matching, exact phrase and controlled-alias boosts, match explanations and constrained spelling suggestions improve discovery without guessing diagnoses. Loading, partial loading, failure, offline and true-zero states use different messages and always leave topic browsing available.

Recent searches, recently viewed answers and saved answers stay on the device. They are convenience shelves, not profiles, risk calculations or remote history.

## Linking and anchors

Important sections, notes, after-birth topics and every finding have stable IDs and visible copy-link controls. A shared fragment receives focus and target highlighting. Static HTML contains the content and destination before JavaScript; copying, saving, recent history and print controls are optional enhancements.
