# Design system

## Direction

Warm editorial, not clinical software and not a baby-product storefront. Cream and oat surfaces, plum typography, clay/berry accents and restrained sage produce calm without becoming pale or low-contrast.

## Tokens

Design tokens are CSS custom properties in `src/styles/global.css`. Use existing colors, spacing, radii and shadows before adding another value. Red is reserved for urgent or destructive actions; amber means contact/review attention; sage supports ordinary information.

## Typography

Fraunces Variable is the expressive display face. DM Sans Variable is the reading and interface face. Both are bundled locally through Fontsource packages; do not restore remote font calls.

## Components

- Editorial cards provide navigable topic entry points.
- Content sections establish the predictable timeline hierarchy.
- Summary cards use plum for “In 60 seconds.”
- Help cards use amber for care-team context and red only for urgent context.
- Timeline rows remain semantic ordered-list items.
- Essentials use always-open three-column do/don’t/ask-doctor rules and labeled example rows.
- Setup and milestone controls use explicit labels and pressed states.

## Motion and responsive behavior

Motion is limited to small hover transitions and respects `prefers-reduced-motion`. Layouts collapse at 920px and 660px. The minimum target is 320 CSS pixels with no two-dimensional scrolling for ordinary content.
