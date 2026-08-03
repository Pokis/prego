import type { JourneyPosition } from "./types";

const DAY_MS = 86_400_000;
const PREGNANCY_DAYS = 280;

export interface PregnancyProgress {
  elapsedDays: number;
  remainingDays: number;
  percent: number;
}

function utcDate(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) throw new Error(`Invalid ISO date: ${value}`);
  return Date.UTC(year, month - 1, day);
}

export function addDays(value: string, days: number): string {
  const date = new Date(utcDate(value) + days * DAY_MS);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.floor((utcDate(to) - utcDate(from)) / DAY_MS);
}

export function estimateDueDateFromLmp(lmp: string): string {
  return addDays(lmp, PREGNANCY_DAYS);
}

export function gestationalWeek(dueDate: string, today: string): number {
  const pregnancyStart = addDays(dueDate, -PREGNANCY_DAYS);
  return Math.max(0, Math.floor(daysBetween(pregnancyStart, today) / 7));
}

export function pregnancyProgress(
  dueDate: string,
  today: string,
): PregnancyProgress {
  const pregnancyStart = addDays(dueDate, -PREGNANCY_DAYS);
  const elapsedDays = daysBetween(pregnancyStart, today);
  const remainingDays = daysBetween(today, dueDate);
  const completedDays = Math.min(PREGNANCY_DAYS, Math.max(0, elapsedDays));

  return {
    elapsedDays,
    remainingDays,
    percent: Math.round((completedDays / PREGNANCY_DAYS) * 100),
  };
}

export function journeyPosition(args: {
  today: string;
  dueDate?: string | null;
  birthDate?: string | null;
  isEstimate?: boolean;
}): JourneyPosition | null {
  if (args.birthDate) {
    const day = Math.max(0, daysBetween(args.birthDate, args.today));
    return {
      phase: "postpartum",
      day,
      label:
        day === 0
          ? "Birth day"
          : day < 7
            ? `Day ${day}`
            : day < 63
              ? `Week ${Math.floor(day / 7) + 1}`
              : `Month ${Math.min(6, Math.floor(day / 30) + 1)}`,
      isEstimate: false,
    };
  }
  if (args.dueDate) {
    const week = Math.min(42, gestationalWeek(args.dueDate, args.today));
    return {
      phase: "pregnancy",
      week,
      label: `Week ${week}`,
      isEstimate: Boolean(args.isEstimate),
    };
  }
  return null;
}

export function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
