import { describe, expect, it } from "vitest";
import {
  milestoneWindowLabel,
  sortMilestones,
  type Milestone,
} from "../../src/lib/milestones";

const milestone = (
  id: string,
  anchor: Milestone["anchor"],
  start: number,
  end: number,
  importance: Milestone["importance"] = "recommended",
): Milestone => ({
  id,
  title: id,
  description: `${id} description`,
  anchor,
  start,
  end,
  category: "appointment",
  importance,
});

describe("milestone chronology", () => {
  it("orders a shuffled journey from the positive test through postpartum", () => {
    const shuffled = [
      milestone("week-24", "gestational-week", 24, 28),
      milestone("after-birth", "birth-day", 2, 3),
      milestone("week-10-wide", "gestational-week", 10, 20),
      milestone("positive-test", "positive-test", 0, 7, "essential"),
      milestone("week-6", "gestational-week", 6, 13, "essential"),
      milestone("week-10-short", "gestational-week", 10, 14),
    ];

    expect(sortMilestones(shuffled).map((item) => item.id)).toEqual([
      "positive-test",
      "week-6",
      "week-10-short",
      "week-10-wide",
      "week-24",
      "after-birth",
    ]);
    expect(shuffled.map((item) => item.id)).toEqual([
      "week-24",
      "after-birth",
      "week-10-wide",
      "positive-test",
      "week-6",
      "week-10-short",
    ]);
  });

  it("writes plain-language timing labels", () => {
    expect(
      milestoneWindowLabel(
        milestone("test", "positive-test", 0, 7, "essential"),
      ),
    ).toBe("Positive test · first week");
    expect(
      milestoneWindowLabel(milestone("scan", "gestational-week", 18, 22)),
    ).toBe("Weeks 18–22");
    expect(
      milestoneWindowLabel(milestone("first-day", "birth-day", 0, 1)),
    ).toBe("Birth day · first 24 hours");
  });
});
