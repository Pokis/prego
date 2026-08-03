import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  minimumFindingCounts,
  minimumFindingsBySection,
  requiredFindingFamilies,
  requiredPostpartumFields,
  requiredPostpartumSlugs,
  requiredSearchMatches,
} from "./content-coverage.mjs";

const release = process.argv.includes("--release");
const dir = resolve("src/data/generated");
const requiredFiles = [
  "timeline",
  "essentials",
  "findings",
  "substitutions",
  "preconception",
  "milestones",
  "sources",
  "urgent",
];
const evidenceBackedCollections = new Set(
  requiredFiles.filter((name) => name !== "sources"),
);
const errors = [];
const warnings = [];
const load = (name) => {
  const file = resolve(dir, `${name}.json`);
  if (!existsSync(file)) {
    errors.push(`Missing generated collection: ${name}`);
    return [];
  }
  return JSON.parse(readFileSync(file, "utf8"));
};

const data = Object.fromEntries(
  requiredFiles.map((name) => [name, load(name)]),
);
const sourceIds = new Set(data.sources.map((source) => source.id));
const today = new Date().toISOString().slice(0, 10);

const targets = {
  timeline: 57,
  essentials: 14,
  findings: minimumFindingCounts.total,
  substitutions: 14,
  preconception: 1,
  milestones: 20,
  sources: 39,
  urgent: 3,
};
for (const [name, target] of Object.entries(targets)) {
  if (data[name].length < target)
    errors.push(
      `${name} has ${data[name].length}; expected at least ${target}`,
    );
}

for (const [name, records] of Object.entries(data)) {
  const seen = new Set();
  for (const record of records) {
    if (!record.id) errors.push(`${name} contains a record without an id`);
    if (seen.has(record.id))
      errors.push(`${name} has duplicate id ${record.id}`);
    seen.add(record.id);
    if (evidenceBackedCollections.has(name)) {
      if (!Array.isArray(record.sourceIds) || !record.sourceIds.length) {
        errors.push(`${name}/${record.id} has no sources`);
      } else {
        for (const sourceId of record.sourceIds)
          if (!sourceIds.has(sourceId))
            errors.push(
              `${name}/${record.id} references missing source ${sourceId}`,
            );
      }
      if (!record.review) {
        errors.push(`${name}/${record.id} has no review metadata`);
      } else {
        if (record.review.nextReviewAt < today)
          errors.push(
            `${name}/${record.id} review expired ${record.review.nextReviewAt}`,
          );
        if (
          release &&
          !["editorial-ready", "clinical-approved"].includes(
            record.review.status,
          )
        )
          errors.push(
            `${name}/${record.id} is ${record.review.status}, not technically ready for release`,
          );
      }
    }
  }
}

const weeks = new Set(
  data.timeline
    .filter((entry) => entry.kind === "week")
    .map((entry) => Number(entry.slug.replace("week-", ""))),
);
for (let week = 3; week <= 42; week += 1)
  if (!weeks.has(week)) errors.push(`Missing week-${week}`);

const postpartumEntries = data.timeline.filter(
  (entry) => entry.kind === "postpartum",
);
const postpartum = new Set(postpartumEntries.map((entry) => entry.slug));
for (const slug of requiredPostpartumSlugs)
  if (!postpartum.has(slug)) errors.push(`Missing postpartum period ${slug}`);

for (const field of requiredPostpartumFields) {
  const values = postpartumEntries.map((entry) =>
    JSON.stringify(entry[field] ?? null),
  );
  if (values.some((value) => value === "null" || value === "[]"))
    errors.push(`Postpartum field ${field} is missing or empty`);
  if (new Set(values).size !== postpartumEntries.length)
    errors.push(
      `Postpartum field ${field} contains duplicated filler; every period must be stage-specific`,
    );
}

const findingIds = new Set(data.findings.map((entry) => entry.id));
for (const [family, ids] of Object.entries(requiredFindingFamilies)) {
  for (const id of ids)
    if (!findingIds.has(id))
      errors.push(`Required finding family ${family} is missing ${id}`);
}

for (const [priority, target] of Object.entries(minimumFindingCounts)) {
  if (priority === "total") continue;
  const count = data.findings.filter(
    (entry) => entry.priority === priority,
  ).length;
  if (count < target)
    errors.push(
      `findings priority ${priority} has ${count}; expected ${target}`,
    );
}

for (const [sectionId, target] of Object.entries(minimumFindingsBySection)) {
  const count = data.findings.filter(
    (entry) => entry.sectionId === sectionId,
  ).length;
  if (count < target)
    errors.push(
      `finding section ${sectionId} has ${count}; expected at least ${target}`,
    );
}

const normalizeFindingTerm = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
const findingRecordTypes = new Set([
  "food",
  "drink",
  "activity",
  "medicine",
  "home-exposure",
  "work-exposure",
  "travel",
  "sexual-health",
  "sleep",
  "test-or-decision",
  "symptom",
  "personal-care",
  "infection",
  "mental-health",
]);
const findingDetailSignatures = new Map();

for (const finding of data.findings) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(finding.id))
    errors.push(`finding ${finding.id} does not have a stable slug id`);
  if (!Array.isArray(finding.aliases) || finding.aliases.length < 2)
    errors.push(`finding ${finding.id} needs at least two controlled aliases`);
  else if (
    new Set(finding.aliases.map(normalizeFindingTerm)).size !==
    finding.aliases.length
  )
    errors.push(`finding ${finding.id} has duplicated controlled aliases`);
  if (!findingRecordTypes.has(finding.recordType))
    errors.push(`finding ${finding.id} has invalid record type`);
  if (!finding.summary?.trim())
    errors.push(`finding ${finding.id} has no summary`);
  if (!Array.isArray(finding.details) || finding.details.length === 0)
    errors.push(`finding ${finding.id} has no direct guidance`);
  else {
    const summary = normalizeFindingTerm(finding.summary);
    if (
      finding.details.some((detail) => normalizeFindingTerm(detail) === summary)
    )
      errors.push(`finding ${finding.id} repeats its summary as detail filler`);
    const wordCount = `${finding.summary} ${finding.details.join(" ")}`
      .trim()
      .split(/\s+/).length;
    if (wordCount < 30)
      errors.push(
        `finding ${finding.id} has only ${wordCount} words of direct guidance; expected at least 30`,
      );
    const detailSignature = finding.details.map(normalizeFindingTerm).join("|");
    const priorFinding = findingDetailSignatures.get(detailSignature);
    if (priorFinding)
      errors.push(
        `findings ${priorFinding} and ${finding.id} reuse identical direct guidance`,
      );
    else findingDetailSignatures.set(detailSignature, finding.id);
  }
  if (
    !Array.isArray(finding.decisionFactors) ||
    finding.decisionFactors.length < 3 ||
    new Set(finding.decisionFactors.map(normalizeFindingTerm)).size !==
      finding.decisionFactors.length
  )
    errors.push(`finding ${finding.id} needs three distinct decision factors`);
  if (!finding.careNote?.trim())
    errors.push(`finding ${finding.id} has no care threshold`);
}

const searchFile = resolve("public/data/search-index.json");
const searchIndex = existsSync(searchFile)
  ? JSON.parse(readFileSync(searchFile, "utf8"))
  : [];
if (!searchIndex.length) errors.push("Search index is missing or empty");
const searchById = new Map(searchIndex.map((record) => [record.id, record]));
for (const finding of data.findings) {
  const record = searchById.get(finding.id);
  if (!record) {
    errors.push(`Search index is missing finding ${finding.id}`);
    continue;
  }
  if (record.href !== `/essentials/#${finding.id}`)
    errors.push(
      `Search finding ${finding.id} does not link to its direct anchor`,
    );
  if (JSON.stringify(record.aliases) !== JSON.stringify(finding.aliases))
    errors.push(`Search finding ${finding.id} lost its controlled aliases`);
  if (!record.topics?.includes(finding.recordType))
    errors.push(`Search finding ${finding.id} lost its record type`);
}

const normalize = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
for (const [query, expectedId] of requiredSearchMatches) {
  const record = searchById.get(expectedId);
  if (!record) {
    errors.push(`Required search ${query} has no record ${expectedId}`);
    continue;
  }
  const controlled = [record.title, ...(record.aliases ?? [])].map(normalize);
  if (!controlled.includes(normalize(query)))
    errors.push(
      `Required search ${query} is not a controlled title or alias for ${expectedId}`,
    );
}

if (warnings.length)
  console.warn(
    `Content warnings (${warnings.length}):\n${warnings.slice(0, 20).join("\n")}`,
  );
if (errors.length) {
  console.error(
    `Content audit failed (${errors.length}):\n${errors.slice(0, 80).join("\n")}`,
  );
  process.exit(1);
}

console.log(
  `Content audit passed: ${data.timeline.length} timeline entries, ${data.essentials.length} pregnancy essentials, ${data.findings.length} direct findings, ${data.substitutions.length} practical swaps, ${data.preconception.length} preconception guide and ${data.milestones.length} milestones.`,
);
