# Timeline and date calculations

## Pregnancy anchor

A clinician-provided estimated due date is preferred. If the reader enters the first day of the last menstrual period, the site adds 280 days and labels the result an estimate. Clinical dating replaces it when available.

Gestational age is counted from the start of the dating period, not conception. The site stores date-only ISO strings and uses UTC arithmetic to avoid daylight-saving and local-midnight shifts.

Reader-facing months are orientation only: weeks 1–4, 5–8, 9–13, 14–17, 18–22, 23–27, 28–31, 32–35 and 36–42 form the nine visual periods. Care and calculations continue to use gestational weeks.

## Postpartum anchor

The site never assumes birth occurred on the due date. Postpartum starts only when an actual birth date is entered. Bookmarks and completed milestones remain intact across that transition.

Month labels are orientation, not equal four-week medical blocks. Month 9 covers weeks 36–40. Weeks 41–42 are presented separately as “Beyond the due date,” with individual care planning emphasized.

## Testing cases

- Leap years.
- DST transitions.
- Dates near month and year boundaries.
- Due dates that have passed without a birth date.
- Birth before or after the estimate.
- Storage versions and reset behavior.
