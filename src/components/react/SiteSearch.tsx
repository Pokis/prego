import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { withBase } from "@/lib/paths";
import { searchRecords, type SearchRecord } from "@/lib/search";

const typeLabels: Record<SearchRecord["type"], string> = {
  timeline: "Pregnancy week",
  essential: "Pregnancy essentials",
  finding: "Direct answer",
  swap: "Food and drink swap",
  preconception: "Getting pregnant",
  urgent: "Help and warning signs",
  milestone: "Appointment or decision",
  partner: "For support people",
};

type IndexState = "loading" | "ready" | "offline" | "error";

export default function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [indexState, setIndexState] = useState<IndexState>("loading");
  const requestRef = useRef<AbortController | null>(null);

  const loadIndex = useCallback(() => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setIndexState("loading");
    fetch(withBase("/data/search-index.json"), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index ${response.status}`);
        return response.json();
      })
      .then((items: unknown) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(items)) throw new Error("Invalid search index");
        setRecords(items as SearchRecord[]);
        setIndexState("ready");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setRecords([]);
        setIndexState(navigator.onLine ? "error" : "offline");
      });
  }, []);

  useEffect(() => {
    setHydrated(true);
    loadIndex();
    const retryWhenOnline = () => loadIndex();
    window.addEventListener("online", retryWhenOnline);
    return () => {
      requestRef.current?.abort();
      window.removeEventListener("online", retryWhenOnline);
    };
  }, [loadIndex]);

  const normalized = query.trim();
  const results = useMemo(
    () =>
      indexState === "ready" && normalized.length >= 2
        ? searchRecords(records, normalized)
        : [],
    [indexState, normalized, records],
  );
  const searchReady = hydrated && indexState === "ready";

  const status =
    indexState === "loading"
      ? "Loading the search index…"
      : indexState === "offline"
        ? "Search is offline on this visit. The complete guide is still available below."
        : indexState === "error"
          ? "Search could not load. Retry or browse Pregnancy essentials below."
          : normalized.length >= 2
            ? `${results.length} useful ${results.length === 1 ? "result" : "results"}`
            : "Enter at least two letters.";

  return (
    <section
      className={`site-search ${compact ? "compact" : ""}`}
      aria-labelledby={`site-search-title-${compact ? "compact" : "full"}`}
      aria-busy={indexState === "loading"}
    >
      <div className="site-search-intro">
        <p className="eyebrow">Find a direct answer</p>
        <h2 id={`site-search-title-${compact ? "compact" : "full"}`}>
          {compact
            ? "Find a food, product or activity."
            : "Search the guide, not an FAQ."}
        </h2>
        <p>
          Try a food, symptom, activity, test or appointment—such as hot tub,
          caffeine, pre-eclampsia, NIPT, exercise or scan.
        </p>
      </div>
      <div className="site-search-box">
        <label htmlFor="site-search-input">What do you want to find?</label>
        <div className="search-control">
          <input
            id="site-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search foods, symptoms, activities, tests…"
            disabled={!searchReady}
          />
          {query && searchReady ? (
            <button type="button" onClick={() => setQuery("")}>
              Clear
            </button>
          ) : null}
          {(indexState === "error" || indexState === "offline") && (
            <button type="button" onClick={loadIndex}>
              Retry search
            </button>
          )}
        </div>
        <p className="search-status" aria-live="polite">
          {status}
        </p>
        {indexState === "ready" && normalized.length >= 2 && (
          <div className="search-results">
            {results.length ? (
              <ol>
                {results.map((record) => (
                  <li key={`${record.type}-${record.id}-${record.href}`}>
                    <a href={withBase(record.href)}>
                      <span>{typeLabels[record.type]}</span>
                      <strong>{record.title}</strong>
                      <p>{record.summary}</p>
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-state">
                No direct match yet. Try a related term or browse Pregnancy
                essentials below.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
