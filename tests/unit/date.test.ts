import { describe, expect, it } from "vitest";
import {
  addDays,
  daysBetween,
  estimateDueDateFromLmp,
  gestationalWeek,
  journeyPosition,
  pregnancyProgress,
} from "../../src/lib/date";

describe("date calculations", () => {
  it("estimates 280 days from LMP across a leap year", () => {
    expect(estimateDueDateFromLmp("2027-06-01")).toBe("2028-03-07");
  });

  it("does not drift across daylight-saving boundaries", () => {
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
  });

  it("calculates gestational weeks from a due date", () => {
    expect(gestationalWeek("2026-11-07", "2026-07-31")).toBe(25);
  });

  it("calculates a clamped 40-week baby-loader progress", () => {
    expect(pregnancyProgress("2026-10-08", "2026-08-06")).toEqual({
      elapsedDays: 217,
      remainingDays: 63,
      percent: 78,
    });
    expect(pregnancyProgress("2026-08-01", "2026-08-10").percent).toBe(100);
    expect(pregnancyProgress("2027-08-01", "2026-08-10").percent).toBe(0);
  });

  it("does not automatically switch to postpartum when due date passes", () => {
    expect(
      journeyPosition({ today: "2026-08-10", dueDate: "2026-08-01" }),
    ).toMatchObject({ phase: "pregnancy", week: 41 });
  });

  it("uses actual birth date for postpartum position", () => {
    expect(
      journeyPosition({
        today: "2026-08-15",
        dueDate: "2026-09-01",
        birthDate: "2026-08-01",
      }),
    ).toMatchObject({ phase: "postpartum", day: 14, label: "Week 3" });
  });
});
