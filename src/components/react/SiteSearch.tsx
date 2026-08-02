import { useEffect, useMemo, useState } from "react";
import { withBase } from "@/lib/paths";

type SearchRecord = {
  type: "timeline" | "essential" | "swap" | "preconception" | "urgent";
  title: string;
  summary: string;
  href: string;
  topics: string[];
  text: string;
};

const typeLabels: Record<SearchRecord["type"], string> = {
  timeline: "Pregnancy week",
  essential: "Pregnancy essentials",
  swap: "Food and drink swap",
  preconception: "Getting pregnant",
  urgent: "Help and warning signs",
};

export default function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    let active = true;
    fetch(withBase("/data/search-index.json"))
      .then((response) => (response.ok ? response.json() : []))
      .then((items: SearchRecord[]) => {
        if (active) setRecords(items);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (normalized.length < 2) return [];
    const terms = normalized.split(/\s+/).filter(Boolean);
    return records
      .map((record) => {
        const haystack =
          `${record.title} ${record.summary} ${record.topics.join(" ")} ${record.text}`.toLowerCase();
        const matches = terms.filter((term) => haystack.includes(term)).length;
        const titleBoost = terms.filter((term) =>
          record.title.toLowerCase().includes(term),
        ).length;
        return { record, score: matches + titleBoost * 2 };
      })
      .filter((item) => item.score >= terms.length)
      .sort(
        (a, b) =>
          b.score - a.score || a.record.title.localeCompare(b.record.title),
      )
      .slice(0, 10)
      .map((item) => item.record);
  }, [normalized, records]);

  return (
    <section
      className={`site-search ${compact ? "compact" : ""}`}
      aria-labelledby={`site-search-title-${compact ? "compact" : "full"}`}
    >
      <div className="site-search-intro">
        <p className="eyebrow">Find a direct answer</p>
        <h2 id={`site-search-title-${compact ? "compact" : "full"}`}>
          {compact
            ? "Find a food, product or activity."
            : "Search the guide, not an FAQ."}
        </h2>
        <p>
          Try a food, symptom, activity or appointment—such as sushi, caffeine,
          movement, nausea, exercise or scan.
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
            placeholder="Search food, symptoms, exercise, scans…"
            disabled={!hydrated}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              disabled={!hydrated}
            >
              Clear
            </button>
          )}
        </div>
        <p className="search-status" aria-live="polite">
          {normalized.length >= 2
            ? `${results.length} useful ${results.length === 1 ? "result" : "results"}`
            : "Enter at least two letters."}
        </p>
        {normalized.length >= 2 && (
          <div className="search-results">
            {results.length ? (
              <ol>
                {results.map((record) => (
                  <li key={`${record.type}-${record.href}`}>
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
                No close match yet. Try a shorter word or browse Pregnancy
                essentials.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
