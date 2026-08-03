export const siteConfig = {
  name: "Pregnancy, Clearly",
  shortName: "Clearly",
  description:
    "A calm, practical guide to all nine months of pregnancy, week by week, with an after-birth continuation.",
  locale: "en",
  themeColor: "#5f2847",
  storageKey: "pregnancy-clearly:journey:v1",
  storageVersion: 2,
  emergencyDisclaimer:
    "This guide cannot assess symptoms. If you think you or your baby may be in immediate danger, contact local emergency services now.",
  educationDisclaimer:
    "Pregnancy, Clearly provides general education, not diagnosis or individual medical advice. Your doctor or midwife knows your health and pregnancy.",
  navigation: [
    {
      label: "Getting pregnant",
      description: "Before a positive test",
      href: "/getting-pregnant/",
    },
    {
      label: "Timeline",
      description: "Pregnancy week by week",
      href: "/timeline/",
    },
    {
      label: "Pregnancy essentials",
      description: "Food, symptoms, tests and more",
      href: "/essentials/",
    },
    {
      label: "For partners",
      description: "Practical ways to help",
      href: "/partners/",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
