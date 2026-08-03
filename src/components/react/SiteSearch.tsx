import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { withBase } from "@/lib/paths";
import { recentSearchesStorageKey } from "@/lib/storage";
import {
  explainSearchMatch,
  highlightSearchTerms,
  searchRecords,
  suggestSearchQueries,
  type SearchRecord,
} from "@/lib/search";

const typeLabels: Record<SearchRecord["type"], string> = {
  timeline: "Pregnancy week",
  essential: "Pregnancy topic",
  finding: "Direct answer",
  swap: "Food and drink swap",
  preconception: "Getting pregnant",
  urgent: "Help and warning signs",
  milestone: "Appointment or decision",
  partner: "For support people",
  postpartum: "After birth",
};

const statusLabels: Record<NonNullable<SearchRecord["status"]>, string> = {
  "generally-ok": "Generally okay",
  avoid: "Avoid",
  "check-first": "Check first",
  "contact-care": "Contact care",
  urgent: "Urgent help",
};

const careTierLabels: Record<NonNullable<SearchRecord["careTier"]>, string> = {
  common: "General guidance",
  "care-team": "Care-team guidance",
  urgent: "Urgent help",
};

const quickQueries = [
  "hot tub",
  "caffeine",
  "bleeding",
  "medicine",
  "NIPT",
  "pregnancy after loss",
];

type IndexState = "loading" | "loading-all" | "ready" | "offline" | "error";

type SearchManifest = {
  version: number;
  shards: { id: string; href: string; count: number }[];
};

const highlighted = (value: string, query: string) =>
  highlightSearchTerms(value, query).map((segment, index) =>
    segment.match ? (
      <mark key={`${segment.text}-${index}`}>{segment.text}</mark>
    ) : (
      <Fragment key={`${segment.text}-${index}`}>{segment.text}</Fragment>
    ),
  );

const loadStoredQueries = () => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(recentSearchesStorageKey) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed
          .filter((item): item is string => typeof item === "string")
          .slice(0, 5)
      : [];
  } catch {
    return [];
  }
};

export default function SiteSearch({ compact = false }: { compact?: boolean }) {
  const titleId = useId();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [indexState, setIndexState] = useState<IndexState>("loading");
  const requestRef = useRef<AbortController | null>(null);

  const loadIndex = useCallback(() => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setRecords([]);
    setIndexState("loading");

    const loadLegacyIndex = () =>
      fetch(withBase("/data/search-index.json"), {
        signal: controller.signal,
      }).then(async (response) => {
        if (!response.ok) throw new Error(`Search index ${response.status}`);
        const items = (await response.json()) as unknown;
        if (!Array.isArray(items)) throw new Error("Invalid search index");
        return items as SearchRecord[];
      });

    fetch(withBase("/data/search-manifest.json"), {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search manifest ${response.status}`);
        const manifest = (await response.json()) as SearchManifest;
        if (!Array.isArray(manifest.shards) || !manifest.shards.length)
          throw new Error("Invalid search manifest");

        const core = manifest.shards.find((shard) => shard.id === "core");
        const remaining = manifest.shards.filter(
          (shard) => shard.id !== "core",
        );
        if (!core) throw new Error("Search core shard missing");

        const coreResponse = await fetch(withBase(core.href), {
          signal: controller.signal,
        });
        if (!coreResponse.ok)
          throw new Error(`Search core ${coreResponse.status}`);
        const coreRecords = (await coreResponse.json()) as SearchRecord[];
        if (controller.signal.aborted) return [];
        setRecords(coreRecords);
        setIndexState("loading-all");

        const otherRecords = await Promise.all(
          remaining.map(async (shard) => {
            const shardResponse = await fetch(withBase(shard.href), {
              signal: controller.signal,
            });
            if (!shardResponse.ok)
              throw new Error(
                `Search shard ${shard.id} ${shardResponse.status}`,
              );
            const items = (await shardResponse.json()) as unknown;
            if (!Array.isArray(items))
              throw new Error(`Invalid search shard ${shard.id}`);
            return items as SearchRecord[];
          }),
        );
        return [...coreRecords, ...otherRecords.flat()];
      })
      .catch(async (error) => {
        if (controller.signal.aborted) return [];
        try {
          return await loadLegacyIndex();
        } catch {
          throw error;
        }
      })
      .then((items) => {
        if (controller.signal.aborted || !items.length) return;
        setRecords(items);
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
    setRecentQueries(loadStoredQueries());
    const urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery) setQuery(urlQuery);
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
      records.length && normalized.length >= 2
        ? searchRecords(records, normalized)
        : [],
    [normalized, records],
  );
  const suggestions = useMemo(
    () =>
      indexState === "ready" && normalized.length >= 2 && !results.length
        ? suggestSearchQueries(records, normalized)
        : [],
    [indexState, normalized, records, results.length],
  );
  const searchReady = hydrated && records.length > 0;

  useEffect(() => {
    if (indexState !== "ready" || normalized.length < 2 || !results.length)
      return;
    const timer = window.setTimeout(() => {
      const next = [
        normalized,
        ...loadStoredQueries().filter(
          (item) => item.toLowerCase() !== normalized.toLowerCase(),
        ),
      ].slice(0, 5);
      localStorage.setItem(recentSearchesStorageKey, JSON.stringify(next));
      setRecentQueries(next);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [indexState, normalized, results.length]);

  const status =
    indexState === "loading"
      ? "Loading the search index…"
      : indexState === "loading-all"
        ? "The guide is ready; loading every direct answer…"
        : indexState === "offline"
          ? "Search is offline on this visit. The complete guide is still available by topic below."
          : indexState === "error"
            ? "Search could not load. Retry or browse Pregnancy essentials below."
            : normalized.length >= 2
              ? `${results.length} useful ${results.length === 1 ? "result" : "results"}`
              : "Enter at least two letters.";

  return (
    <section
      className={`site-search ${compact ? "compact" : ""}`}
      aria-labelledby={titleId}
      aria-busy={indexState === "loading" || indexState === "loading-all"}
    >
      <div className="site-search-intro">
        <p className="eyebrow">One search for the whole guide</p>
        <h2 id={titleId}>
          {compact ? "Find a direct answer." : "What do you need to find?"}
        </h2>
        <p>
          Search food, products, activities, symptoms, tests, findings, work
          exposures, pregnancy weeks or after-birth care. This gives general
          guidance—it does not assess symptoms.
        </p>
      </div>
      <div className="site-search-box">
        <label htmlFor={inputId}>What do you want to find?</label>
        <div className="search-control">
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try hot tub, medication, bleeding, scan…"
            disabled={!searchReady && indexState === "loading"}
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
        <div className="quick-query-list" aria-label="Example searches">
          {quickQueries.map((item) => (
            <button type="button" key={item} onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
        {!normalized && recentQueries.length ? (
          <div className="recent-query-list">
            <span>Recent on this device</span>
            {recentQueries.map((item) => (
              <button type="button" key={item} onClick={() => setQuery(item)}>
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(recentSearchesStorageKey);
                setRecentQueries([]);
              }}
            >
              Clear history
            </button>
          </div>
        ) : null}
        {records.length > 0 && normalized.length >= 2 && (
          <div className="search-results">
            {results.length ? (
              <ol>
                {results.map((record) => (
                  <li key={`${record.type}-${record.id}-${record.href}`}>
                    <a href={withBase(record.href)}>
                      <div className="search-result-meta">
                        <span>{typeLabels[record.type]}</span>
                        {record.status ? (
                          <span
                            className={`search-result-status ${record.status}`}
                          >
                            {statusLabels[record.status]}
                          </span>
                        ) : null}
                        {record.careTier ? (
                          <span
                            className={`search-result-care ${record.careTier}`}
                          >
                            {careTierLabels[record.careTier]}
                          </span>
                        ) : null}
                      </div>
                      <strong>{highlighted(record.title, normalized)}</strong>
                      <p>{highlighted(record.summary, normalized)}</p>
                      <small>{explainSearchMatch(record, normalized)}</small>
                    </a>
                  </li>
                ))}
              </ol>
            ) : indexState === "ready" ? (
              <div className="empty-state">
                <strong>No direct match yet.</strong>
                <p>
                  Try one of the controlled terms below or browse by what you
                  are trying to do. Search never guesses a diagnosis.
                </p>
                {suggestions.length ? (
                  <div
                    className="search-suggestions"
                    aria-label="Suggested searches"
                  >
                    <span>Did you mean:</span>
                    {suggestions.map((suggestion) => (
                      <button
                        type="button"
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div
                  className="search-suggestions"
                  aria-label="Browse suggestions"
                >
                  {quickQueries.slice(0, 4).map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
