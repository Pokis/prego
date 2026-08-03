export const findingStatusLabels = {
  "generally-ok": "Generally okay",
  avoid: "Avoid",
  "check-first": "Check first",
  "contact-care": "Contact care",
  urgent: "Urgent help",
} as const;

export const careTierLabels = {
  common: "General guidance",
  "care-team": "Check with your care team",
  urgent: "Urgent help",
} as const;

export const recordTypeLabels = {
  food: "Food",
  drink: "Drink",
  activity: "Activity",
  medicine: "Medicine or treatment",
  "home-exposure": "Home exposure",
  "work-exposure": "Work exposure",
  travel: "Travel",
  "sexual-health": "Sexual health",
  sleep: "Sleep and comfort",
  "test-or-decision": "Test or decision",
  symptom: "Symptom guidance",
  "personal-care": "Personal care",
  infection: "Infection or vaccine",
  "mental-health": "Mental health and safety",
  "health-condition": "Health condition or access",
  complication: "Pregnancy complication",
  "loss-support": "Loss and bereavement",
  "birth-preparation": "Birth and newborn preparation",
} as const;

export const findingIntentDefinitions = [
  {
    id: "eat-drink",
    label: "Can I eat or drink this?",
    shortLabel: "Food or drink",
    detail: "Food, dishes, caffeine, drinks and practical swaps",
    href: "/essentials/?intent=eat-drink#answer-library",
  },
  {
    id: "do-use",
    label: "Can I do or use this?",
    shortLabel: "Do or use something",
    detail: "Activities, medicines, personal care, travel and daily life",
    href: "/essentials/?intent=do-use#answer-library",
  },
  {
    id: "symptom-support",
    label: "I noticed a symptom or change",
    shortLabel: "Symptom or change",
    detail: "General guidance plus clear care and urgent thresholds",
    href: "/essentials/?intent=symptom-support#answer-library",
  },
  {
    id: "test-care",
    label: "I need to understand a test or finding",
    shortLabel: "Test, result or care",
    detail: "Appointments, results, conditions and specialist care",
    href: "/essentials/?intent=test-care#answer-library",
  },
  {
    id: "work-home",
    label: "Work or home exposure",
    shortLabel: "Work or home exposure",
    detail: "Chemicals, infections, lifting, heat and practical controls",
    href: "/essentials/?intent=work-home#answer-library",
  },
  {
    id: "plan-birth",
    label: "I am planning birth and newborn care",
    shortLabel: "Birth or newborn plan",
    detail: "Consent, support, recovery, feeding and first-day decisions",
    href: "/essentials/?intent=plan-birth#answer-library",
  },
] as const;

export const findingHref = (id: string) => `/essentials/finding/${id}/`;
export const essentialTopicHref = (slug: string) => `/essentials/${slug}/`;

export const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

export const findingPriority = { P0: 0, P1: 1, baseline: 2 } as const;
