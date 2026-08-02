# Privacy model

The site is static and has no account, backend, analytics, advertising or cloud state.

One versioned local-storage record may contain audience, date anchors, bookmarks and milestone state. Version 2 removed region and unit fields; the migration preserves useful dates and lists while discarding those legacy fields. The record is readable by scripts running on the same origin, so avoid third-party runtime scripts and review any future dependency that executes in the browser.

The Privacy page clears only the Pregnancy, Clearly key. Unsupported storage versions fall back to safe defaults. Browsing must remain useful when local storage is disabled or cleared.

Do not add sensitive free-text journals, symptom logs or identity fields without a new privacy design and explicit owner approval.
