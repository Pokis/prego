import { describe, expect, it } from "vitest";
import {
  beyondDuePeriod,
  getPregnancyMonth,
  pregnancyMonths,
  pregnancyPositionLabel,
} from "../../src/config/pregnancy";

describe("pregnancy month orientation", () => {
  it("keeps month nine focused on weeks 36 through 40", () => {
    expect(pregnancyMonths.at(-1)).toMatchObject({
      month: 9,
      startWeek: 36,
      endWeek: 40,
    });
  });

  it("labels weeks 41 and 42 as beyond the estimated due date", () => {
    expect(beyondDuePeriod.weeks).toBe("Weeks 41–42");
    expect(getPregnancyMonth(41).kind).toBe("post-due");
    expect(pregnancyPositionLabel(42)).toBe("Beyond the due date · Week 42");
  });
});
