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
    | "partner";
  title: string;
  summary: string;
  href: string;
  topics: string[];
  aliases: string[];
  text: string;
  priority?: number;
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
