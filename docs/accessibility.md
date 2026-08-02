# Accessibility

Target WCAG 2.2 Level AA.

## Implementation rules

- Semantic headings and landmarks.
- Native links, buttons, selects, inputs and `details`/`summary` where suitable.
- Visible focus and logical keyboard order.
- 44×44 CSS-pixel targets.
- No color-only meaning.
- Reduced-motion and forced-colors support.
- Reflow at 320 CSS pixels and zoom through 400%.
- ARIA live regions only for meaningful result/status changes.
- Static content remains readable before hydration.

## QA

Automated axe checks cover representative pages but do not prove conformance. Manually test keyboard navigation, a screen reader, zoom/reflow, high contrast, motion preferences, form errors and dynamic filter result announcements.
