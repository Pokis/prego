export type MilestoneAnchor =
  "positive-test" | "gestational-week" | "birth-day";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  anchor: MilestoneAnchor;
  start: number;
  end: number;
  category: string;
  importance: "essential" | "recommended" | "optional";
}

const anchorOrder: Record<MilestoneAnchor, number> = {
  "positive-test": 0,
  "gestational-week": 1,
  "birth-day": 2,
};

const importanceOrder: Record<Milestone["importance"], number> = {
  essential: 0,
  recommended: 1,
  optional: 2,
};

export function sortMilestones<T extends Milestone>(
  milestones: readonly T[],
): T[] {
  return [...milestones].sort(
    (a, b) =>
      anchorOrder[a.anchor] - anchorOrder[b.anchor] ||
      a.start - b.start ||
      a.end - b.end ||
      importanceOrder[a.importance] - importanceOrder[b.importance] ||
      a.title.localeCompare(b.title),
  );
}

export function milestoneWindowLabel(milestone: Milestone): string {
  if (milestone.anchor === "positive-test") {
    if (milestone.start <= 0 && milestone.end <= 7) {
      return "Positive test · first week";
    }

    return `Positive test · days ${Math.max(1, milestone.start)}–${milestone.end}`;
  }

  if (milestone.anchor === "gestational-week") {
    return milestone.start === milestone.end
      ? `Week ${milestone.start}`
      : `Weeks ${milestone.start}–${milestone.end}`;
  }

  if (milestone.start === 0 && milestone.end <= 1) {
    return "Birth day · first 24 hours";
  }

  return milestone.start === milestone.end
    ? `Day ${milestone.start} after birth`
    : `Days ${milestone.start}–${milestone.end} after birth`;
}
