import { useEffect, useMemo, useRef, useState } from "react";

type SwapGroup =
  "drinks" | "coffee-tea" | "meals" | "dairy" | "treats" | "protein-produce";

type SwapStatus =
  | "keep-with-limit"
  | "prepare-differently"
  | "choose-alternative"
  | "check-first";

type SwapItem = {
  id: string;
  item: string;
  group: SwapGroup;
  status: SwapStatus;
  searchTerms: string[];
  shortAnswer: string;
  why: string;
  alternatives: Array<{
    label: string;
    title: string;
    note: string;
  }>;
  labelCheck: string;
};

const groups: Array<{ id: "all" | SwapGroup; label: string }> = [
  { id: "all", label: "Everything" },
  { id: "drinks", label: "Cold drinks" },
  { id: "coffee-tea", label: "Coffee & tea" },
  { id: "meals", label: "Meals & takeaway" },
  { id: "dairy", label: "Dairy" },
  { id: "treats", label: "Desserts" },
  { id: "protein-produce", label: "Protein & produce" },
];

const statusCopy: Record<SwapStatus, { label: string; cue: string }> = {
  "keep-with-limit": {
    label: "Keep it, count it",
    cue: "Usually fits with a clear limit",
  },
  "prepare-differently": {
    label: "Change the preparation",
    cue: "Keep the idea, alter one step",
  },
  "choose-alternative": {
    label: "Choose an alternative",
    cue: "A like-for-like swap is the clearer choice",
  },
  "check-first": {
    label: "Check the exact product",
    cue: "Ingredients or circumstances matter",
  },
};

const normalize = (value: string) =>
  value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function SwapFinder({ items }: { items: SwapItem[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | SwapGroup>("all");
  const [hydrated, setHydrated] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setHydrated(true), []);

  const filtered = useMemo(() => {
    const words = normalize(query).trim().split(/\s+/).filter(Boolean);

    return items.filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      if (!words.length) return true;

      const searchable = normalize(
        [
          item.item,
          item.shortAnswer,
          item.why,
          item.labelCheck,
          ...item.searchTerms,
          ...item.alternatives.flatMap((alternative) => [
            alternative.label,
            alternative.title,
            alternative.note,
          ]),
        ].join(" "),
      );
      return words.every((word) => searchable.includes(word));
    });
  }, [group, items, query]);

  const clearFilters = () => {
    setQuery("");
    setGroup("all");
    searchRef.current?.focus();
  };

  return (
    <div className="swap-finder">
      <div className="swap-controls">
        <div className="swap-search-field">
          <label htmlFor="swap-search">What are you missing?</label>
          <p>Type the food or drink—not a medical question.</p>
          <div className="swap-search-control">
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchRef}
              id="swap-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Coca-Cola, coffee, sushi…"
              autoComplete="off"
              disabled={!hydrated}
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")}>
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="swap-category-filter">
          <span id="swap-category-label">Or browse by type</span>
          <div
            className="swap-chips"
            role="group"
            aria-labelledby="swap-category-label"
          >
            {groups.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={group === option.id}
                aria-controls="swap-results"
                onClick={() => setGroup(option.id)}
                disabled={!hydrated}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="swap-key" aria-label="How to read the swap verdicts">
          {Object.entries(statusCopy).map(([status, copy]) => (
            <div key={status}>
              <span className={`swap-key-dot ${status}`} aria-hidden="true" />
              <span>{copy.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="swap-results-heading">
        <p className="swap-result-count" aria-live="polite">
          <strong>{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "useful swap" : "useful swaps"}
        </p>
        {(query || group !== "all") && (
          <button className="swap-reset" type="button" onClick={clearFilters}>
            Show everything
          </button>
        )}
      </div>

      {filtered.length ? (
        <div className="swap-grid" id="swap-results">
          {filtered.map((item) => {
            const status = statusCopy[item.status];
            return (
              <article
                className={`swap-card ${item.status}`}
                id={`swap-${item.id}`}
                key={item.id}
              >
                <header className="swap-card-heading">
                  <div>
                    <p className={`swap-verdict ${item.status}`}>
                      <span aria-hidden="true" />
                      {status.label}
                    </p>
                    <h3>{item.item}</h3>
                  </div>
                  <p className="swap-cue">{status.cue}</p>
                </header>

                <div className="swap-bottom-line">
                  <span>Bottom line</span>
                  <p>{item.shortAnswer}</p>
                </div>

                <p className="swap-why">
                  <strong>Why:</strong> {item.why}
                </p>

                <div className="swap-alternatives">
                  <p className="swap-alternatives-label">Pick what fits</p>
                  <ol>
                    {item.alternatives.map((alternative, index) => (
                      <li key={alternative.title}>
                        <span className="swap-rank" aria-hidden="true">
                          {index + 1}
                        </span>
                        <div>
                          <span>{alternative.label}</span>
                          <h4>{alternative.title}</h4>
                          <p>{alternative.note}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="swap-label-check">
                  <span aria-hidden="true">Aa</span>
                  <p>
                    <strong>Check the label:</strong> {item.labelCheck}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="swap-empty" id="swap-results">
          <p className="eyebrow">No exact match yet</p>
          <h3>Try the main ingredient or product type.</h3>
          <p>
            For example, try{" "}
            <button onClick={() => setQuery("coffee")}>coffee</button>,{" "}
            <button onClick={() => setQuery("cheese")}>cheese</button> or{" "}
            <button onClick={() => setQuery("raw egg")}>raw egg</button>.
          </p>
          <button
            className="button secondary"
            type="button"
            onClick={clearFilters}
          >
            Show all swaps
          </button>
        </div>
      )}
    </div>
  );
}
