import { useMemo } from "react";
import { journeyPosition, todayIso } from "@/lib/date";
import {
  milestoneWindowLabel,
  sortMilestones,
  type Milestone,
} from "@/lib/milestones";
import { pregnancyPositionLabel } from "@/config/pregnancy";
import { withBase } from "@/lib/paths";
import { usePreferences } from "./usePreferences";

const stageLabels = ["Now", "Next", "Later"] as const;

function milestoneHref(milestone: Milestone): string {
  if (milestone.anchor === "positive-test") return "/timeline/positive-test/";
  if (milestone.anchor === "gestational-week") {
    return `/timeline/week-${Math.min(42, Math.max(3, milestone.start))}/`;
  }
  return "/timeline/#after-birth";
}

export default function JourneySnapshot({
  milestones,
}: {
  milestones: Milestone[];
}) {
  const { preferences, ready } = usePreferences();
  const position = ready
    ? journeyPosition({
        today: todayIso(),
        dueDate: preferences.estimatedDueDate,
        birthDate: preferences.actualBirthDate,
        isEstimate: preferences.dueDateSource === "lmp",
      })
    : null;

  const selected = useMemo(() => {
    const ordered = sortMilestones(milestones).filter(
      (item) => item.anchor !== "birth-day",
    );
    if (!position || position.phase !== "pregnancy") return ordered.slice(0, 3);

    const week = position.week ?? 0;
    const relevant = ordered.filter((item) => {
      if (week < 3) return item.anchor === "positive-test";
      return (
        item.anchor === "gestational-week" &&
        (item.end >= week || item.start >= week)
      );
    });

    const active = relevant.filter(
      (item) =>
        item.anchor === "gestational-week" &&
        item.start <= week &&
        item.end >= week,
    );
    const upcoming = relevant.filter(
      (item) => item.anchor === "gestational-week" && item.start > week,
    );
    return [active[0], ...upcoming]
      .filter((item): item is Milestone => Boolean(item))
      .filter(
        (item, index, items) =>
          items.findIndex((x) => x.id === item.id) === index,
      )
      .slice(0, 3);
  }, [milestones, position]);

  return (
    <section
      className="journey-snapshot"
      aria-labelledby="journey-snapshot-title"
    >
      <div className="journey-snapshot-heading">
        <div>
          <p className="eyebrow">Your short view</p>
          <h2 id="journey-snapshot-title">Now, next and later</h2>
        </div>
        {position?.phase === "pregnancy" && position.week !== undefined && (
          <strong>{pregnancyPositionLabel(position.week)}</strong>
        )}
      </div>
      <ol>
        {selected.map((milestone, index) => (
          <li key={milestone.id}>
            <span>{stageLabels[index] ?? "Later"}</span>
            <small>{milestoneWindowLabel(milestone)}</small>
            <strong>{milestone.title}</strong>
            <p>{milestone.description}</p>
            <a href={withBase(milestoneHref(milestone))}>Open this point →</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
