import { useEffect, useMemo, useState } from "react";
import { estimateDueDateFromLmp, journeyPosition, todayIso } from "@/lib/date";
import { getPregnancyMonth } from "@/config/pregnancy";
import { pregnancyPositionLabel } from "@/config/pregnancy";
import { withBase } from "@/lib/paths";
import type { Audience } from "@/lib/types";
import { usePreferences } from "./usePreferences";

export default function JourneySetup({
  compact = false,
  hero = false,
}: {
  compact?: boolean;
  hero?: boolean;
}) {
  const { preferences, update, ready } = usePreferences();
  const [dateMode, setDateMode] = useState<"known" | "lmp">(
    preferences.dueDateSource || "known",
  );

  useEffect(() => {
    if (preferences.dueDateSource) setDateMode(preferences.dueDateSource);
  }, [preferences.dueDateSource]);

  const position = useMemo(
    () =>
      journeyPosition({
        today: todayIso(),
        dueDate: preferences.estimatedDueDate,
        birthDate: preferences.actualBirthDate,
        isEstimate: preferences.dueDateSource === "lmp",
      }),
    [preferences],
  );

  if (!ready)
    return (
      <div
        className={`setup-panel ${hero ? "hero-setup" : ""}`}
        aria-busy="true"
      >
        <div>
          <p className="eyebrow">Private on this device</p>
          <h2>
            {hero ? "Find your week now" : "Preparing your private timeline…"}
          </h2>
          {hero && <p>Your date stays in this browser.</p>}
        </div>
      </div>
    );

  const setDate = (value: string) => {
    update({
      ...preferences,
      dueDateSource: value ? dateMode : null,
      lastMenstrualPeriod: dateMode === "lmp" ? value || null : null,
      estimatedDueDate: value
        ? dateMode === "lmp"
          ? estimateDueDateFromLmp(value)
          : value
        : null,
      actualBirthDate: null,
    });
  };

  const pregnancyWeek =
    position?.phase === "pregnancy" ? Math.max(0, position.week ?? 0) : null;
  const pregnancyPeriod =
    pregnancyWeek !== null
      ? getPregnancyMonth(Math.max(3, pregnancyWeek))
      : null;
  const positionTitle =
    pregnancyWeek !== null && pregnancyPeriod
      ? pregnancyWeek < 3
        ? `Very early · Week ${pregnancyWeek}`
        : pregnancyPositionLabel(pregnancyWeek)
      : position?.label;

  return (
    <section
      className={`setup-panel ${hero ? "hero-setup" : ""}`}
      aria-labelledby={`setup-title-${hero ? "hero" : compact ? "compact" : "full"}`}
    >
      <div>
        <p className="eyebrow">Private on this device</p>
        <h2 id={`setup-title-${hero ? "hero" : compact ? "compact" : "full"}`}>
          {position
            ? `You’re at ${positionTitle}`
            : hero
              ? "Find your week now"
              : "Find your week and month"}
        </h2>
        <p>
          {position
            ? `${pregnancyPeriod ? `${pregnancyPeriod.trimester}. ` : ""}${position.isEstimate ? "Estimated from the date you entered. " : ""}Nothing is sent anywhere.`
            : "Enter a due date or last period to highlight where you are. Every page works without setup."}
        </p>
        {position && (
          <a
            className="button ghost"
            href={withBase(
              position.phase === "pregnancy"
                ? (position.week ?? 0) < 3
                  ? "/timeline/positive-test/"
                  : `/timeline/week-${position.week}/`
                : "/timeline/",
            )}
          >
            Open where I am →
          </a>
        )}
      </div>
      <div className="setup-form">
        <div>
          <span className="field-label">I know my…</span>
          <div className="choice-row" role="group" aria-label="Date type">
            <button
              className="choice-button"
              type="button"
              aria-pressed={dateMode === "known"}
              onClick={() => setDateMode("known")}
            >
              Estimated due date
            </button>
            <button
              className="choice-button"
              type="button"
              aria-pressed={dateMode === "lmp"}
              onClick={() => setDateMode("lmp")}
            >
              Last period date
            </button>
          </div>
        </div>
        <div className="field">
          <label htmlFor={`journey-date-${compact ? "compact" : "full"}`}>
            {dateMode === "known"
              ? "Due date given by care"
              : "First day of last period"}
          </label>
          <input
            id={`journey-date-${compact ? "compact" : "full"}`}
            type="date"
            value={
              dateMode === "lmp"
                ? preferences.lastMenstrualPeriod || ""
                : preferences.dueDateSource === "known"
                  ? preferences.estimatedDueDate || ""
                  : ""
            }
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        {!compact && (
          <>
            <div className="field">
              <label htmlFor="birth-date">
                Baby already arrived? Add actual birth date
              </label>
              <input
                id="birth-date"
                type="date"
                max={todayIso()}
                value={preferences.actualBirthDate || ""}
                onChange={(event) =>
                  update({
                    ...preferences,
                    actualBirthDate: event.target.value || null,
                  })
                }
              />
            </div>
            <div>
              <span className="field-label">I am…</span>
              <div className="choice-row" role="group" aria-label="Audience">
                {(
                  [
                    ["pregnant", "Pregnant"],
                    ["partner", "Supporting"],
                    ["browsing", "Browsing"],
                  ] as [Audience, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    className="choice-button"
                    type="button"
                    aria-pressed={preferences.audience === value}
                    onClick={() => update({ ...preferences, audience: value })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <p style={{ fontSize: ".78rem", margin: 0, color: "var(--muted)" }}>
          A last-period calculation is only an estimate. Clinical dating takes
          priority.
        </p>
      </div>
    </section>
  );
}
