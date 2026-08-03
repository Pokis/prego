import { useEffect, useMemo, useState } from "react";
import {
  careTierLabels,
  findingHref,
  findingIntentDefinitions,
  findingStatusLabels,
  recordTypeLabels,
} from "@/lib/findings";
import { withBase } from "@/lib/paths";

type Finding = {
  id: string;
  sectionId: string;
  title: string;
  aliases: string[];
  summary: string;
  status: keyof typeof findingStatusLabels;
  careTier: keyof typeof careTierLabels;
  recordType: keyof typeof recordTypeLabels;
  priority: "P0" | "P1" | "baseline";
  intents: string[];
};

type Topic = {
  id: string;
  title: string;
};

const priorityOrder = { P0: 0, P1: 1, baseline: 2 } as const;
const pageSize = 36;

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const wholeTermMatch = (haystack: string, query: string) => {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (!terms.length) return true;
  const words = new Set(normalize(haystack).split(" ").filter(Boolean));
  return terms.every((term) => words.has(term));
};

export default function AnswerDirectory({
  findings,
  topics,
  initialTopic = "all",
}: {
  findings: Finding[];
  topics: Topic[];
  initialTopic?: string;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [intent, setIntent] = useState("all");
  const [care, setCare] = useState("all");
  const [depth, setDepth] = useState("key");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [urlReady, setUrlReady] = useState(false);

  const topicNames = useMemo(
    () => new Map(topics.map((item) => [item.id, item.title])),
    [topics],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTopic = params.get("topic");
    const requestedIntent = params.get("intent");
    const requestedCare = params.get("care");
    const requestedDepth = params.get("depth");
    const requestedQuery = params.get("within");

    if (
      requestedTopic &&
      (requestedTopic === "all" ||
        topics.some((item) => item.id === requestedTopic))
    )
      setTopic(requestedTopic);
    if (
      requestedIntent &&
      (requestedIntent === "all" ||
        findingIntentDefinitions.some((item) => item.id === requestedIntent))
    )
      setIntent(requestedIntent);
    if (["all", "common", "care-team", "urgent"].includes(requestedCare ?? ""))
      setCare(requestedCare!);
    if (["key", "baseline", "all"].includes(requestedDepth ?? ""))
      setDepth(requestedDepth!);
    if (requestedQuery) setQuery(requestedQuery);
    setUrlReady(true);
  }, [topics]);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams(window.location.search);
    const update = (key: string, value: string, defaultValue: string) => {
      if (value === defaultValue || !value) params.delete(key);
      else params.set(key, value);
    };
    update("topic", topic, initialTopic);
    update("intent", intent, "all");
    update("care", care, "all");
    update("depth", depth, "key");
    update("within", query.trim(), "");
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search ? `?${search}` : ""}#answer-library`,
    );
  }, [care, depth, initialTopic, intent, query, topic, urlReady]);

  const filtered = useMemo(() => {
    return findings
      .filter((finding) => {
        const matchesQuery = wholeTermMatch(
          [finding.title, ...finding.aliases, finding.summary].join(" "),
          query,
        );
        const matchesTopic = topic === "all" || finding.sectionId === topic;
        const matchesIntent =
          intent === "all" || finding.intents.includes(intent);
        const matchesCare = care === "all" || finding.careTier === care;
        const matchesDepth =
          query.trim().length > 0 ||
          depth === "all" ||
          (depth === "baseline"
            ? finding.priority === "baseline"
            : finding.priority !== "baseline");
        return (
          matchesQuery &&
          matchesTopic &&
          matchesIntent &&
          matchesCare &&
          matchesDepth
        );
      })
      .sort(
        (a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority] ||
          a.title.localeCompare(b.title),
      );
  }, [care, depth, findings, intent, query, topic]);

  const visible = filtered.slice(0, visibleCount);
  const activeFilterCount = [
    query.trim() ? 1 : 0,
    topic !== initialTopic ? 1 : 0,
    intent !== "all" ? 1 : 0,
    care !== "all" ? 1 : 0,
    depth !== "key" ? 1 : 0,
  ].reduce((total, value) => total + value, 0);
  const baselineCount = findings.filter(
    (finding) => finding.priority === "baseline",
  ).length;

  const reset = () => {
    setQuery("");
    setTopic(initialTopic);
    setIntent("all");
    setCare("all");
    setDepth("key");
    setVisibleCount(pageSize);
  };

  const contextLabel = (finding: Finding) => {
    const topicTitle =
      topicNames.get(finding.sectionId) ?? "Pregnancy essentials";
    const recordType = recordTypeLabels[finding.recordType];
    return normalize(topicTitle) === normalize(recordType)
      ? topicTitle
      : `${topicTitle} · ${recordType}`;
  };

  return (
    <div className="answer-directory">
      <div className="answer-directory-orientation">
        <div>
          <strong>{findings.length} permanent answers</strong>
          <span>
            {topics.length === 1
              ? `in ${topics[0]?.title}`
              : `across ${topics.length} pregnancy topics`}
          </span>
        </div>
        <p>
          The focused view removes {baselineCount} short baseline records that
          overlap with topic summaries. Search still checks every answer.
        </p>
      </div>

      <div
        className="answer-directory-controls"
        aria-label="Filter direct answers"
      >
        <div className="field answer-directory-query">
          <label htmlFor="answer-directory-query">Filter these answers</label>
          <input
            id="answer-directory-query"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(pageSize);
            }}
            placeholder="Try air quality, hospital bag, dental care…"
          />
          <small>
            Matches complete words in titles, summaries and controlled aliases.
          </small>
        </div>
        {initialTopic === "all" && topics.length > 1 && (
          <div className="field">
            <label htmlFor="answer-directory-topic">Topic</label>
            <select
              id="answer-directory-topic"
              value={topic}
              onChange={(event) => {
                setTopic(event.target.value);
                setVisibleCount(pageSize);
              }}
            >
              <option value="all">All {topics.length} topics</option>
              {topics.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="answer-directory-intent">What you need</label>
          <select
            id="answer-directory-intent"
            value={intent}
            onChange={(event) => {
              setIntent(event.target.value);
              setVisibleCount(pageSize);
            }}
          >
            <option value="all">Any kind of answer</option>
            {findingIntentDefinitions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.shortLabel}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="answer-directory-care">Next step</label>
          <select
            id="answer-directory-care"
            value={care}
            onChange={(event) => {
              setCare(event.target.value);
              setVisibleCount(pageSize);
            }}
          >
            <option value="all">Any next step</option>
            <option value="common">General guidance</option>
            <option value="care-team">Check with care team</option>
            <option value="urgent">Urgent help</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="answer-directory-depth">Answer depth</label>
          <select
            id="answer-directory-depth"
            value={depth}
            onChange={(event) => {
              setDepth(event.target.value);
              setVisibleCount(pageSize);
            }}
          >
            <option value="key">Key and detailed answers</option>
            <option value="baseline">Short topic baselines only</option>
            <option value="all">Everything</option>
          </select>
        </div>
      </div>

      <div className="answer-directory-status">
        <p aria-live="polite">
          Showing <strong>{Math.min(visible.length, filtered.length)}</strong>{" "}
          of <strong>{filtered.length}</strong> matching answers
        </p>
        {activeFilterCount > 0 && (
          <button type="button" className="text-button" onClick={reset}>
            Clear {activeFilterCount}{" "}
            {activeFilterCount === 1 ? "filter" : "filters"}
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <ol className="answer-directory-list">
          {visible.map((finding) => (
            <li key={finding.id} id={`directory-${finding.id}`}>
              <a href={withBase(findingHref(finding.id))}>
                <span className="answer-directory-context">
                  {contextLabel(finding)}
                </span>
                <strong>{finding.title}</strong>
                <small>{finding.summary}</small>
                <span className="answer-directory-meta">
                  <span className={`example-status ${finding.status}`}>
                    {findingStatusLabels[finding.status]}
                  </span>
                  <span className={`care-tier-chip ${finding.careTier}`}>
                    {careTierLabels[finding.careTier]}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-state answer-directory-empty" role="status">
          <strong>No direct answer matches all of those filters.</strong>
          <p>
            Clear a filter, try a broader whole word, or use the full-guide
            search above.
          </p>
          <button type="button" className="button secondary" onClick={reset}>
            Reset answer filters
          </button>
        </div>
      )}

      {visible.length < filtered.length && (
        <button
          className="button secondary answer-directory-more"
          type="button"
          onClick={() => setVisibleCount((count) => count + pageSize)}
        >
          Show {Math.min(pageSize, filtered.length - visible.length)} more
          answers
        </button>
      )}
    </div>
  );
}
