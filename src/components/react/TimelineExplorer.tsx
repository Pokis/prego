import { Fragment, useMemo, useState } from "react";
import { journeyPosition, todayIso } from "@/lib/date";
import {
  getPregnancyMonth,
  getTrimester,
  pregnancyPositionLabel,
  weekFromTimelineId,
} from "@/config/pregnancy";
import { withBase } from "@/lib/paths";
import { usePreferences } from "./usePreferences";

type TimelineRecord = {
  id: string;
  slug: string;
  kind: string;
  phase: "pregnancy" | "postpartum";
  ordinal: number;
  windowLabel: string;
  title: string;
  dek: string;
  topics: string[];
  audiences: string[];
  milestoneIds: string[];
  bodyMind: string[];
  baby: string[];
  clarifications?: string[];
  doNow: string[];
  avoidAsk: string[];
  appointments: string[];
  partner: string[];
};

const topicLabels: Record<string, string> = {
  "early-pregnancy": "Early pregnancy",
  "nausea-food": "Nausea and food",
  "appointments-scans": "Appointments and scans",
  screening: "Screening and tests",
  movement: "Baby movement",
  "exercise-comfort": "Exercise and comfort",
  "work-travel": "Work and travel",
  "birth-preparation": "Birth preparation",
  "labour-signs": "Labour signs",
  "due-date": "Due date and beyond",
};

export default function TimelineExplorer({
  entries,
}: {
  entries: TimelineRecord[];
}) {
  const { preferences, update, ready } = usePreferences();
  const [query, setQuery] = useState("");
  const [trimester, setTrimester] = useState("all");
  const [topic, setTopic] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);

  const topics = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.topics))].sort(),
    [entries],
  );
  const position = ready
    ? journeyPosition({
        today: todayIso(),
        dueDate: preferences.estimatedDueDate,
        birthDate: preferences.actualBirthDate,
        isEstimate: preferences.dueDateSource === "lmp",
      })
    : null;
  const filtered = entries.filter((entry) => {
    const searchable = [
      entry.title,
      entry.dek,
      entry.windowLabel,
      ...entry.topics,
      ...entry.bodyMind,
      ...entry.baby,
      ...(entry.clarifications ?? []),
      ...entry.doNow,
      ...entry.avoidAsk,
      ...entry.appointments,
      ...entry.partner,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || searchable.includes(query.toLowerCase());
    const week = weekFromTimelineId(entry.id);
    const matchesTrimester =
      trimester === "all" ||
      (week !== null && getTrimester(week) === trimester);
    const matchesTopic = topic === "all" || entry.topics.includes(topic);
    const matchesSaved = !savedOnly || preferences.bookmarks.includes(entry.id);
    return matchesQuery && matchesTrimester && matchesTopic && matchesSaved;
  });

  const isCurrent = (entry: TimelineRecord) => {
    if (!position) return false;
    return position.phase === "pregnancy"
      ? entry.id === `week-${position.week}`
      : entry.phase === "postpartum" &&
          entry.ordinal >= 100 + Math.max(0, (position.day || 0) - 7) &&
          entry.ordinal <= 100 + (position.day || 0) + 7;
  };

  const toggleBookmark = (id: string) =>
    update({
      ...preferences,
      bookmarks: preferences.bookmarks.includes(id)
        ? preferences.bookmarks.filter((item) => item !== id)
        : [...preferences.bookmarks, id],
    });

  return (
    <div>
      {position && (
        <div className="now-card">
          <strong>
            Your private timeline:{" "}
            {position.phase === "pregnancy" && position.week !== undefined
              ? `${pregnancyPositionLabel(position.week)} · ${getTrimester(Math.max(3, position.week))}`
              : position.label}
          </strong>
          <br />
          The highlighted entry is calculated on this device
          {position.isEstimate ? " from an estimated date" : ""}.
        </div>
      )}
      <div className="saved-toolbar" aria-label="Saved pregnancy weeks">
        <button
          className="choice-button"
          type="button"
          disabled={!ready || preferences.bookmarks.length === 0}
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(!savedOnly)}
        >
          {savedOnly
            ? "Show all weeks"
            : `Saved only (${preferences.bookmarks.length})`}
        </button>
        {ready && preferences.bookmarks.length > 0 && (
          <button
            className="text-button"
            type="button"
            onClick={() => {
              update({ ...preferences, bookmarks: [] });
              setSavedOnly(false);
            }}
          >
            Clear saved weeks
          </button>
        )}
      </div>
      <div className="filters" aria-label="Timeline filters">
        <div className="field">
          <label htmlFor="timeline-search">Search pregnancy weeks</label>
          <input
            id="timeline-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try nausea, movement, scan…"
            disabled={!ready}
          />
        </div>
        <div className="field">
          <label htmlFor="timeline-trimester">Trimester</label>
          <select
            id="timeline-trimester"
            value={trimester}
            onChange={(event) => setTrimester(event.target.value)}
            disabled={!ready}
          >
            <option value="all">All trimesters</option>
            <option value="First trimester">First trimester</option>
            <option value="Second trimester">Second trimester</option>
            <option value="Third trimester">Third trimester</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="timeline-topic">Topic</label>
          <select
            id="timeline-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            disabled={!ready}
          >
            <option value="all">All topics</option>
            {topics.map((item) => (
              <option key={item} value={item}>
                {topicLabels[item] ?? item.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length} pregnancy weeks
      </p>
      {filtered.length ? (
        <ol className="timeline-list">
          {filtered.map((entry, index) => {
            const week = weekFromTimelineId(entry.id);
            const period = week === null ? null : getPregnancyMonth(week);
            const previousWeek =
              index > 0 ? weekFromTimelineId(filtered[index - 1]!.id) : null;
            const previousPeriod =
              previousWeek === null ? null : getPregnancyMonth(previousWeek);
            const beginsMonth =
              period !== null && previousPeriod?.key !== period.key;
            const href = withBase(
              entry.kind === "postpartum"
                ? `/timeline/postpartum/${entry.slug}/`
                : `/timeline/${entry.slug}/`,
            );
            const bookmarked = preferences.bookmarks.includes(entry.id);
            return (
              <Fragment key={entry.id}>
                {beginsMonth && period && (
                  <li className="timeline-month-break">
                    <span>
                      {period.kind === "post-due"
                        ? "After the estimated due date"
                        : `Month ${period.month}`}
                    </span>
                    <strong>{period.title}</strong>
                    <small>
                      {period.weeks} · {period.trimester}
                    </small>
                  </li>
                )}
                <li
                  className={`timeline-row ${isCurrent(entry) ? "current" : ""}`}
                >
                  <div className="timeline-window">
                    <small>
                      {period?.kind === "post-due"
                        ? "Beyond due date"
                        : `Month ${period?.month}`}
                    </small>
                    Week {week}
                  </div>
                  <div className="timeline-copy">
                    <h2>
                      <a href={href}>
                        {entry.title.replace(`Week ${week}: `, "")}
                      </a>
                    </h2>
                    <p>{entry.dek}</p>
                  </div>
                  <div className="timeline-actions">
                    <button
                      className={`icon-button ${bookmarked ? "active" : ""}`}
                      type="button"
                      aria-pressed={bookmarked}
                      aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ${entry.title}`}
                      disabled={!ready}
                      onClick={() => toggleBookmark(entry.id)}
                    >
                      {bookmarked ? "★" : "☆"}
                    </button>
                    <a
                      className="icon-button"
                      href={href}
                      aria-label={`Open ${entry.title}`}
                    >
                      →
                    </a>
                  </div>
                </li>
              </Fragment>
            );
          })}
        </ol>
      ) : (
        <div className="empty-state">
          No entries match those filters. Try a broader search.
        </div>
      )}
    </div>
  );
}
