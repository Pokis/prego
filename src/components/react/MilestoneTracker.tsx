import { useMemo, useState } from "react";
import {
  milestoneWindowLabel,
  sortMilestones,
  type Milestone,
} from "@/lib/milestones";
import { usePreferences } from "./usePreferences";
import ShareAnchor from "./ShareAnchor";

export default function MilestoneTracker({
  milestones,
}: {
  milestones: Milestone[];
}) {
  const { preferences, update, ready } = usePreferences();
  const [showCompleted, setShowCompleted] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const visible = useMemo(
    () =>
      sortMilestones(milestones).filter((item) => {
        const hidden = preferences.hiddenMilestones.includes(item.id);
        if (showHidden) return hidden;
        const completion =
          showCompleted || !preferences.completedMilestones.includes(item.id);
        return !hidden && completion;
      }),
    [milestones, preferences, showCompleted, showHidden],
  );

  const toggleCompleted = (id: string) =>
    update({
      ...preferences,
      completedMilestones: preferences.completedMilestones.includes(id)
        ? preferences.completedMilestones.filter((item) => item !== id)
        : [...preferences.completedMilestones, id],
    });

  const hide = (id: string) =>
    update({
      ...preferences,
      hiddenMilestones: [...preferences.hiddenMilestones, id],
    });

  const restore = (id: string) => {
    const remaining = preferences.hiddenMilestones.filter(
      (item) => item !== id,
    );
    update({
      ...preferences,
      hiddenMilestones: remaining,
    });
    if (!remaining.length) setShowHidden(false);
  };

  return (
    <section
      id="milestones"
      data-share-target
      tabIndex={-1}
      aria-labelledby="milestones-title"
    >
      <ShareAnchor targetId="milestones" label="important pregnancy dates" />
      <div className="section-heading">
        <div>
          <p className="eyebrow">From positive test to birth</p>
          <h2 id="milestones-title">Important pregnancy dates, in order</h2>
          <p>
            These are useful planning windows, not fixed deadlines. Your doctor
            or midwife may adjust them for your pregnancy.
          </p>
        </div>
        <div className="choice-row">
          <button
            className="choice-button"
            type="button"
            disabled={!ready}
            aria-pressed={showCompleted}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Hide completed" : "Show completed"}
          </button>
          <button
            className="choice-button"
            type="button"
            disabled={!ready || preferences.hiddenMilestones.length === 0}
            aria-pressed={showHidden}
            onClick={() => setShowHidden(!showHidden)}
          >
            {showHidden
              ? "Back to open dates"
              : `Manage hidden (${preferences.hiddenMilestones.length})`}
          </button>
          {showHidden && preferences.hiddenMilestones.length > 0 && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                update({ ...preferences, hiddenMilestones: [] });
                setShowHidden(false);
              }}
            >
              Restore all
            </button>
          )}
        </div>
      </div>
      <ol className="milestone-board milestone-list">
        {visible.map((item, index) => {
          const completed = preferences.completedMilestones.includes(item.id);
          const when = milestoneWindowLabel(item);
          return (
            <li key={item.id}>
              <article
                className="milestone-card"
                id={`milestone-${item.id}`}
                data-share-target
                tabIndex={-1}
                style={{ opacity: completed ? 0.68 : 1 }}
                aria-label={`Milestone ${index + 1} of ${visible.length}`}
              >
                <ShareAnchor
                  targetId={`milestone-${item.id}`}
                  label={item.title}
                  compact
                />
                <div className="milestone-card-topline">
                  <span className="milestone-order" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="meta">{when}</div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="choice-row" style={{ marginTop: "1rem" }}>
                  {showHidden ? (
                    <button
                      className="choice-button"
                      type="button"
                      disabled={!ready}
                      onClick={() => restore(item.id)}
                    >
                      Restore date
                    </button>
                  ) : (
                    <>
                      <button
                        className="choice-button"
                        type="button"
                        disabled={!ready}
                        aria-pressed={completed}
                        onClick={() => toggleCompleted(item.id)}
                      >
                        {completed ? "Completed ✓" : "Mark complete"}
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        disabled={!ready}
                        onClick={() => hide(item.id)}
                        aria-label={`Hide ${item.title}`}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      {!visible.length && (
        <div className="empty-state">
          {showHidden
            ? "No hidden dates. Return to your open pregnancy dates."
            : "No open dates for this view. Turn on “Show completed” to review earlier items."}
        </div>
      )}
    </section>
  );
}
