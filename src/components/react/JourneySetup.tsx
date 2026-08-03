import { useEffect, useMemo, useRef, useState } from "react";
import {
  estimateDueDateFromLmp,
  journeyPosition,
  pregnancyProgress,
  todayIso,
} from "@/lib/date";
import { getPregnancyMonth, pregnancyPositionLabel } from "@/config/pregnancy";
import { withBase } from "@/lib/paths";
import type { Audience } from "@/lib/types";
import ShareAnchor from "./ShareAnchor";
import { usePreferences } from "./usePreferences";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function durationLabel(totalDays: number): string {
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  const parts: string[] = [];

  if (weeks) parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
  if (days || !weeks) parts.push(`${days} ${days === 1 ? "day" : "days"}`);

  return parts.join(", ");
}

export default function JourneySetup({
  compact = false,
  hero = false,
}: {
  compact?: boolean;
  hero?: boolean;
}) {
  const { preferences, update, ready } = usePreferences();
  const [dateMode, setDateMode] = useState<"known" | "lmp">("known");
  const [draftDate, setDraftDate] = useState("");
  const [draftBirthDate, setDraftBirthDate] = useState("");
  const [draftAudience, setDraftAudience] = useState<Audience>("pregnant");
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isEditing) return;

    const nextMode = preferences.dueDateSource || "known";
    setDateMode(nextMode);
    setDraftDate(
      nextMode === "lmp"
        ? preferences.lastMenstrualPeriod || ""
        : preferences.estimatedDueDate || "",
    );
    setDraftBirthDate(preferences.actualBirthDate || "");
    setDraftAudience(preferences.audience);
  }, [isEditing, preferences]);

  useEffect(() => {
    if (isEditing) editorRef.current?.querySelector("input")?.focus();
  }, [isEditing]);

  const today = todayIso();
  const position = useMemo(
    () =>
      journeyPosition({
        today,
        dueDate: preferences.estimatedDueDate,
        birthDate: preferences.actualBirthDate,
        isEstimate: preferences.dueDateSource === "lmp",
      }),
    [preferences, today],
  );
  const progress = useMemo(
    () =>
      preferences.estimatedDueDate
        ? pregnancyProgress(preferences.estimatedDueDate, today)
        : null,
    [preferences.estimatedDueDate, today],
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

  const hasSavedTimeline = Boolean(
    preferences.estimatedDueDate || preferences.actualBirthDate,
  );
  const showEditor = isEditing || !hasSavedTimeline;
  const titleId = `setup-title-${hero ? "hero" : compact ? "compact" : "full"}`;
  const dateInputId = `journey-date-${hero ? "hero" : compact ? "compact" : "full"}`;

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

  const chooseDateMode = (nextMode: "known" | "lmp") => {
    setDateMode(nextMode);
    setDraftDate(
      preferences.dueDateSource === nextMode
        ? nextMode === "lmp"
          ? preferences.lastMenstrualPeriod || ""
          : preferences.estimatedDueDate || ""
        : "",
    );
  };

  const openEditor = () => {
    const nextMode = preferences.dueDateSource || "known";
    setDateMode(nextMode);
    setDraftDate(
      nextMode === "lmp"
        ? preferences.lastMenstrualPeriod || ""
        : preferences.estimatedDueDate || "",
    );
    setDraftBirthDate(preferences.actualBirthDate || "");
    setDraftAudience(preferences.audience);
    setIsEditing(true);
  };

  const saveTimeline = () => {
    const estimatedDueDate = draftDate
      ? dateMode === "lmp"
        ? estimateDueDateFromLmp(draftDate)
        : draftDate
      : null;

    update({
      ...preferences,
      dueDateSource: draftDate ? dateMode : null,
      lastMenstrualPeriod: dateMode === "lmp" ? draftDate || null : null,
      estimatedDueDate,
      actualBirthDate: compact ? null : draftBirthDate || null,
      audience: compact ? preferences.audience : draftAudience,
    });
    setIsEditing(false);
  };

  const removeSavedDates = () => {
    update({
      ...preferences,
      dueDateSource: null,
      lastMenstrualPeriod: null,
      estimatedDueDate: null,
      actualBirthDate: null,
    });
    setIsEditing(false);
  };

  const remainingCopy = progress
    ? progress.remainingDays > 280
      ? "This expected date is more than 40 weeks away. Check that the date is correct."
      : progress.remainingDays > 0
        ? `${durationLabel(progress.remainingDays)} until the estimated due date`
        : progress.remainingDays === 0
          ? "The estimated due date is today"
          : `${durationLabel(Math.abs(progress.remainingDays))} past the estimated due date`
    : "";

  return (
    <section
      id="baby-loader"
      className={`setup-panel ${hero ? "hero-setup" : ""}`}
      aria-labelledby={titleId}
      data-share-target
      tabIndex={-1}
    >
      <div>
        <ShareAnchor targetId="baby-loader" label="baby loader" compact />
        <p className="eyebrow">Private on this device</p>
        <h2 id={titleId}>
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

      {showEditor ? (
        <form
          className="setup-form"
          ref={editorRef}
          onSubmit={(event) => {
            event.preventDefault();
            saveTimeline();
          }}
        >
          <div>
            <span className="field-label">I know my…</span>
            <div className="choice-row" role="group" aria-label="Date type">
              <button
                className="choice-button"
                type="button"
                aria-pressed={dateMode === "known"}
                onClick={() => chooseDateMode("known")}
              >
                Estimated due date
              </button>
              <button
                className="choice-button"
                type="button"
                aria-pressed={dateMode === "lmp"}
                onClick={() => chooseDateMode("lmp")}
              >
                Last period date
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor={dateInputId}>
              {dateMode === "known"
                ? "Due date given by care"
                : "First day of last period"}
            </label>
            <input
              id={dateInputId}
              type="date"
              value={draftDate}
              onInput={(event) => setDraftDate(event.currentTarget.value)}
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
                  max={today}
                  value={draftBirthDate}
                  onInput={(event) =>
                    setDraftBirthDate(event.currentTarget.value)
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
                      aria-pressed={draftAudience === value}
                      onClick={() => setDraftAudience(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <p className="setup-note">
            A last-period calculation is only an estimate. Clinical dating takes
            priority.
          </p>
          <div className="setup-actions">
            <button
              className="button"
              type="submit"
              disabled={!draftDate && (compact || !draftBirthDate)}
            >
              {hasSavedTimeline ? "Update timeline" : "Show my baby loader"}
            </button>
            {hasSavedTimeline && (
              <button
                className="button secondary"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
          {hasSavedTimeline && (
            <button
              className="text-button remove-timeline-button"
              type="button"
              onClick={removeSavedDates}
            >
              Remove saved dates
            </button>
          )}
        </form>
      ) : preferences.estimatedDueDate && !preferences.actualBirthDate ? (
        <div className="baby-loader-card">
          <div className="baby-loader-heading">
            <div>
              <p className="eyebrow">Your pregnancy timeline</p>
              <h3>Baby loading…</h3>
            </div>
            <strong className="baby-loader-percent">
              {progress?.percent}%
            </strong>
          </div>
          <p className="baby-loader-remaining">{remainingCopy}</p>
          <progress
            className="baby-loader-progress"
            max="100"
            value={progress?.percent ?? 0}
            aria-label={`${progress?.percent ?? 0}% of the 40-week pregnancy timeline elapsed`}
          >
            {progress?.percent ?? 0}%
          </progress>
          <div className="baby-loader-scale" aria-hidden="true">
            <span>Start</span>
            <span>Expected date</span>
          </div>
          <div className="baby-loader-date">
            <span>Expected around</span>
            <strong>
              <time dateTime={preferences.estimatedDueDate}>
                {formatDate(preferences.estimatedDueDate)}
              </time>
            </strong>
            <small>
              {preferences.dueDateSource === "lmp"
                ? "Calculated from the last-period date you entered."
                : "Due dates are estimates, not fixed arrival dates."}
            </small>
          </div>
          {progress && progress.remainingDays < 0 && (
            <p className="baby-loader-overdue-note">
              Reaching this date does not switch the site to after-birth mode.
              Add the actual birth date after baby arrives.
            </p>
          )}
          <button className="button ghost" type="button" onClick={openEditor}>
            Edit expected date
          </button>
        </div>
      ) : (
        <div className="baby-loader-card saved-timeline-card">
          <div>
            <p className="eyebrow">Your timeline</p>
            <h3>Baby has arrived</h3>
          </div>
          {preferences.actualBirthDate && (
            <p className="baby-loader-date">
              <span>Actual birth date</span>
              <strong>
                <time dateTime={preferences.actualBirthDate}>
                  {formatDate(preferences.actualBirthDate)}
                </time>
              </strong>
            </p>
          )}
          <p>
            The pregnancy loader is complete. Your after-birth timeline uses the
            actual birth date you saved.
          </p>
          <button className="button ghost" type="button" onClick={openEditor}>
            Edit timeline dates
          </button>
        </div>
      )}
    </section>
  );
}
