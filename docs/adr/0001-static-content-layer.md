# ADR 0001: Static Astro content layer with small React islands

- Status: accepted
- Date: 2026-07-31

## Context

The product needs hundreds of crawlable, source-backed pages; optional private personalization; no backend; portable hosting; and strong safeguards for agent-authored content.

## Decision

Use Astro static output and validated Content Collections. Generate normalized JSON from an authored catalog. Use React only for optional local controls. Store journey data in versioned browser storage.

## Consequences

- Essential information works without JavaScript.
- Hosting remains cheap and portable.
- Schemas and audits catch malformed or unsafe content before build/release.
- Personal data remains local.
- Content regeneration must be part of normal development.
- Cloud accounts, notifications and cross-device state are intentionally unavailable.
