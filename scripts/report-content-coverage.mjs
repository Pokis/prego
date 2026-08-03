import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  minimumFindingCounts,
  minimumFindingsBySection,
  requiredFindingIntents,
} from "./content-coverage.mjs";

const load = (name) =>
  JSON.parse(
    readFileSync(resolve("src/data/generated", `${name}.json`), "utf8"),
  );

const findings = load("findings");
const topics = load("essentials");
const postpartumTopics = load("postpartumTopics");
const searchManifest = JSON.parse(
  readFileSync(resolve("public/data/search-manifest.json"), "utf8"),
);

const countBy = (field, value) =>
  findings.filter((finding) => finding[field] === value).length;

console.log("Pregnancy, Clearly content coverage");
console.log(
  `Direct findings: ${findings.length} / ${minimumFindingCounts.total}`,
);
console.log(`Pregnancy topics: ${topics.length}`);
console.log(`After-birth topics: ${postpartumTopics.length}`);
console.log("");
console.log("By priority");
for (const priority of ["P0", "P1", "baseline"])
  console.log(
    `  ${priority.padEnd(8)} ${String(countBy("priority", priority)).padStart(3)} / ${minimumFindingCounts[priority]}`,
  );

console.log("");
console.log("By pregnancy topic");
for (const topic of topics) {
  const count = countBy("sectionId", topic.id);
  const floor = minimumFindingsBySection[topic.id] ?? 0;
  console.log(
    `  ${String(topic.number).padStart(2, "0")} ${topic.title.padEnd(52)} ${String(count).padStart(3)} / ${floor}`,
  );
}

console.log("");
console.log("By task intent (records may serve more than one intent)");
for (const intent of requiredFindingIntents)
  console.log(
    `  ${intent.padEnd(18)} ${String(findings.filter((finding) => finding.intents.includes(intent)).length).padStart(3)}`,
  );

console.log("");
console.log("Search shards");
for (const shard of searchManifest.shards)
  console.log(`  ${shard.id.padEnd(12)} ${String(shard.count).padStart(3)}`);
