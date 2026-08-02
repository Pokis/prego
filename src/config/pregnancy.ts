export type PregnancyMonth = {
  key: string;
  kind: "month" | "post-due";
  month: number;
  weeks: string;
  startWeek: number;
  endWeek: number;
  trimester: "First trimester" | "Second trimester" | "Third trimester";
  title: string;
  focus: string;
};

export const pregnancyMonths: PregnancyMonth[] = [
  {
    key: "month-1",
    kind: "month",
    month: 1,
    weeks: "Weeks 1–4",
    startWeek: 3,
    endWeek: 4,
    trimester: "First trimester",
    title: "Finding out",
    focus:
      "Testing, medicine checks and knowing which early symptoms need help.",
  },
  {
    key: "month-2",
    kind: "month",
    month: 2,
    weeks: "Weeks 5–8",
    startWeek: 5,
    endWeek: 8,
    trimester: "First trimester",
    title: "Early change",
    focus:
      "Nausea, tiredness, food safety and arranging your first care contact.",
  },
  {
    key: "month-3",
    kind: "month",
    month: 3,
    weeks: "Weeks 9–13",
    startWeek: 9,
    endWeek: 13,
    trimester: "First trimester",
    title: "First checks",
    focus:
      "Dating, screening choices and getting help when sickness is too much.",
  },
  {
    key: "month-4",
    kind: "month",
    month: 4,
    weeks: "Weeks 14–17",
    startWeek: 14,
    endWeek: 17,
    trimester: "Second trimester",
    title: "A new stretch",
    focus:
      "Changing energy, a growing bump, movement and comfortable activity.",
  },
  {
    key: "month-5",
    kind: "month",
    month: 5,
    weeks: "Weeks 18–22",
    startWeek: 18,
    endWeek: 22,
    trimester: "Second trimester",
    title: "Halfway landmarks",
    focus:
      "First movements, the anatomy scan window and practical body changes.",
  },
  {
    key: "month-6",
    kind: "month",
    month: 6,
    weeks: "Weeks 23–27",
    startWeek: 23,
    endWeek: 27,
    trimester: "Second trimester",
    title: "Patterns emerge",
    focus:
      "Movement patterns, glucose testing discussions and signs of early labour.",
  },
  {
    key: "month-7",
    kind: "month",
    month: 7,
    weeks: "Weeks 28–31",
    startWeek: 28,
    endWeek: 31,
    trimester: "Third trimester",
    title: "Third trimester",
    focus:
      "More frequent checks, birth preferences, swelling and baby movement.",
  },
  {
    key: "month-8",
    kind: "month",
    month: 8,
    weeks: "Weeks 32–35",
    startWeek: 32,
    endWeek: 35,
    trimester: "Third trimester",
    title: "Prepare simply",
    focus:
      "Contacts, transport, birth essentials, sleep and the final care plan.",
  },
  {
    key: "month-9",
    kind: "month",
    month: 9,
    weeks: "Weeks 36–40",
    startWeek: 36,
    endWeek: 40,
    trimester: "Third trimester",
    title: "Ready for birth",
    focus:
      "Labour signs, when to call, due-date planning and staying flexible.",
  },
];

export const beyondDuePeriod: PregnancyMonth = {
  key: "post-due",
  kind: "post-due",
  month: 9,
  weeks: "Weeks 41–42",
  startWeek: 41,
  endWeek: 42,
  trimester: "Third trimester",
  title: "Beyond the due date",
  focus:
    "Follow the individual monitoring and birth plan agreed with your maternity team.",
};

export function getPregnancyMonth(week: number): PregnancyMonth {
  return (
    pregnancyMonths.find(
      (period) => week >= period.startWeek && week <= period.endWeek,
    ) ?? beyondDuePeriod
  );
}

export function pregnancyPositionLabel(week: number): string {
  const period = getPregnancyMonth(week);
  return period.kind === "post-due"
    ? `Beyond the due date · Week ${week}`
    : `Month ${period.month} · Week ${week}`;
}

export function getTrimester(week: number): PregnancyMonth["trimester"] {
  return getPregnancyMonth(week).trimester;
}

export function weekFromTimelineId(id: string): number | null {
  const match = /^week-(\d+)$/.exec(id);
  return match ? Number(match[1]) : null;
}
