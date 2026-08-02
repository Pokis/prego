# Release process

## Preview release

`npm run build` produces a local/static evaluation artifact. Repository metadata records that clinical review is pending; the reader UI stays focused on guidance. The artifact must not be represented as public-ready medical guidance.

## Public release gate

1. Every medical record is sourced and within its review window.
2. Qualified reviewers approve exact records and add identity/qualification metadata.
3. Reviewers confirm that universal wording does not pretend to replace an individual care plan.
4. Legal, privacy and editorial policies are reviewed.
5. Unit, content, browser, accessibility, build and static audits pass.
6. Manual keyboard, screen-reader, zoom, mobile and comprehension checks pass.
7. `npm run build:release` succeeds without bypasses.
8. Final canonical URL, social metadata and service-worker scope are verified live.

Deployment requires separate explicit authorization. Successful asset upload alone is not proof that DNS, canonical URLs, caching or the live site are correct.
