import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const release = process.argv.includes("--release");
const dir = resolve("src/data/generated");
const requiredFiles = [
  "timeline",
  "essentials",
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

const postpartumRequired = [
  "birth-day",
  "first-24-hours",
  "days-2-3",
  "days-4-7",
  "week-2",
  "week-3",
  "weeks-4-6",
  "weeks-7-8",
  "weeks-9-12",
  "month-3",
  "month-4",
  "month-5",
  "month-6",
];
const postpartum = new Set(
  data.timeline
    .filter((entry) => entry.kind === "postpartum")
    .map((entry) => entry.slug),
);
for (const slug of postpartumRequired)
  if (!postpartum.has(slug)) errors.push(`Missing postpartum period ${slug}`);

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
  `Content audit passed: ${data.timeline.length} timeline entries, ${data.essentials.length} pregnancy essentials, ${data.substitutions.length} practical swaps, ${data.preconception.length} preconception guide and ${data.milestones.length} milestones.`,
);
