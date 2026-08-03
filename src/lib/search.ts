export type SearchRecord = {
  id: string;
  type:
    | "timeline"
    | "essential"
    | "finding"
    | "swap"
    | "preconception"
    | "urgent"
    | "milestone"
    | "partner"
    | "postpartum";
  title: string;
  summary: string;
  href: string;
  topics: string[];
  aliases: string[];
  text: string;
  priority?: number;
  status?: "generally-ok" | "avoid" | "check-first" | "contact-care" | "urgent";
  careTier?: "common" | "care-team" | "urgent";
  sectionId?: string;
  reviewedAt?: string;
  intents?: string[];
};

export type RankedSearchRecord = SearchRecord & { score: number };

export const normalizeSearchText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const tokens = (value: string) =>
  normalizeSearchText(value).split(" ").filter(Boolean);

const hasWholePhrase = (value: string, phrase: string) =>
  ` ${value} `.includes(` ${phrase} `);

export const rankSearchRecord = (
  record: SearchRecord,
  query: string,
): RankedSearchRecord | null => {
  const normalizedQuery = normalizeSearchText(query);
  const queryTerms = tokens(query);
  if (!normalizedQuery || queryTerms.length === 0) return null;

  const title = normalizeSearchText(record.title);
  const summary = normalizeSearchText(record.summary);
  const aliases = record.aliases.map(normalizeSearchText);
  const topics = normalizeSearchText(record.topics.join(" "));
  const text = normalizeSearchText(record.text);
  const searchable = [title, summary, ...aliases, topics, text].join(" ");
  const searchableTerms = new Set(tokens(searchable));

  if (!queryTerms.every((term) => searchableTerms.has(term))) return null;

  let score = record.priority ?? 0;
  if (title === normalizedQuery) score += 240;
  else if (hasWholePhrase(title, normalizedQuery)) score += 150;

  const exactAlias = aliases.some((alias) => alias === normalizedQuery);
  const phraseAlias = aliases.some((alias) =>
    hasWholePhrase(alias, normalizedQuery),
  );
  if (exactAlias) score += 220;
  else if (phraseAlias) score += 130;

  if (hasWholePhrase(summary, normalizedQuery)) score += 90;
  if (hasWholePhrase(topics, normalizedQuery)) score += 70;
  if (hasWholePhrase(text, normalizedQuery)) score += 50;

  const titleTerms = new Set(tokens(title));
  const aliasTerms = new Set(tokens(aliases.join(" ")));
  const topicTerms = new Set(tokens(topics));
  const summaryTerms = new Set(tokens(summary));
  for (const term of queryTerms) {
    if (titleTerms.has(term)) score += 18;
    if (aliasTerms.has(term)) score += 14;
    if (topicTerms.has(term)) score += 8;
    if (summaryTerms.has(term)) score += 4;
    score += 1;
  }

  return { ...record, score };
};

export const searchRecords = (
  records: SearchRecord[],
  query: string,
  limit = 10,
) =>
  records
    .map((record) => rankSearchRecord(record, query))
    .filter((record): record is RankedSearchRecord => record !== null)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.title.localeCompare(b.title) ||
        a.href.localeCompare(b.href),
    )
    .slice(0, limit);

export const explainSearchMatch = (record: SearchRecord, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  const title = normalizeSearchText(record.title);
  const exactAlias = record.aliases.find(
    (alias) => normalizeSearchText(alias) === normalizedQuery,
  );
  if (title === normalizedQuery) return "Exact title match";
  if (exactAlias) return `Known term: ${exactAlias}`;
  if (hasWholePhrase(title, normalizedQuery)) return "Title phrase match";
  if (
    record.aliases.some((alias) =>
      hasWholePhrase(normalizeSearchText(alias), normalizedQuery),
    )
  )
    return "Known phrase match";
  if (hasWholePhrase(normalizeSearchText(record.summary), normalizedQuery))
    return "Direct-answer match";
  return "Related topic match";
};

const editDistance = (left: string, right: string) => {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => index);
  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    let previous = rows[0] ?? 0;
    rows[0] = rightIndex;
    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = rows[leftIndex] ?? leftIndex;
      rows[leftIndex] = Math.min(
        (rows[leftIndex] ?? leftIndex) + 1,
        (rows[leftIndex - 1] ?? leftIndex - 1) + 1,
        previous + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      previous = current;
    }
  }
  return rows[left.length] ?? right.length;
};

export const suggestSearchQueries = (
  records: SearchRecord[],
  query: string,
  limit = 4,
) => {
  const normalizedQuery = normalizeSearchText(query);
  const queryTerms = tokens(normalizedQuery);
  if (!normalizedQuery || queryTerms.some((term) => term.length < 4)) return [];

  const candidates = new Map<string, { label: string; score: number }>();
  for (const record of records) {
    for (const label of [record.title, ...record.aliases]) {
      const normalizedLabel = normalizeSearchText(label);
      const labelTerms = tokens(normalizedLabel);
      if (
        !normalizedLabel ||
        Math.abs(labelTerms.length - queryTerms.length) > 1
      )
        continue;
      const distances = queryTerms.map((queryTerm) =>
        Math.min(
          ...labelTerms.map((labelTerm) => editDistance(queryTerm, labelTerm)),
        ),
      );
      if (distances.some((distance) => distance > 1)) continue;
      const score = distances.reduce((total, distance) => total + distance, 0);
      if (score === 0) continue;
      const current = candidates.get(normalizedLabel);
      if (!current || score < current.score)
        candidates.set(normalizedLabel, { label, score });
    }
  }

  return [...candidates.values()]
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map((candidate) => candidate.label);
};

export type HighlightSegment = { text: string; match: boolean };

export const highlightSearchTerms = (
  value: string,
  query: string,
): HighlightSegment[] => {
  const terms = [...new Set(tokens(query))].filter((term) => term.length >= 2);
  if (!terms.length) return [{ text: value, match: false }];
  const escaped = terms
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const expression = new RegExp(`(${escaped.join("|")})`, "gi");
  return value
    .split(expression)
    .filter(Boolean)
    .map((text) => ({
      text,
      match: terms.includes(normalizeSearchText(text)),
    }));
};
