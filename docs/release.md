# Release process

## Content status

The current records are `editorial-ready`, and the reader UI clearly says that qualified clinical review is pending. The same status emits `noindex,nofollow`. Automatic publication does not change those facts or represent the material as specialist-approved.

`clinical-approved` remains a separate status for exact copy that a qualified reviewer has approved. Record the reviewer, qualification, approval date and expiry before changing that status or removing the pending-review presentation.

## Technical publication gate

1. Every medical record is sourced and within its review window.
2. Every public record has current review metadata and is `editorial-ready` or `clinical-approved`; `draft` and `needs-review` records block publication.
3. Schema validation, unit tests, content coverage and source-reference checks pass.
4. Automated accessibility checks pass in the supported browser projects.
5. The release build, broken-link checks, nested-base audit and GitHub Pages artifact audit pass.
6. `npm run build:release` succeeds without bypasses.
7. The canonical URL, social metadata, representative navigation and service-worker scope are verified live.

For changes that affect navigation, forms, focus, color, motion or responsive layout, complete the documented manual keyboard, screen-reader, zoom/reflow, high-contrast and mobile checks before pushing to `main`. Automated axe coverage is a safeguard, not proof of conformance.

A push to `main` is the publication event and automatically starts the Pages workflow, so only authorized release changes belong on `main`. Successful artifact upload alone is not proof that DNS, canonical URLs, caching or the live site are correct; monitor the deployment job through completion and check `https://prego.potatoroad.lt/` afterward.
