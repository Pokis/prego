import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const load = (name: string) =>
  JSON.parse(readFileSync(resolve(`src/data/generated/${name}.json`), "utf8"));

describe("generated content coverage", () => {
  it("contains every pregnancy week from 3 through 42", () => {
    const weeks = load("timeline")
      .filter((entry: any) => entry.kind === "week")
      .map((entry: any) => Number(entry.slug.slice(5)));
    expect(weeks).toEqual(Array.from({ length: 40 }, (_, index) => index + 3));
  });

  it("ships direct, always-visible pregnancy essentials", () => {
    const essentials = load("essentials");
    expect(essentials).toHaveLength(18);
    const food = essentials.find((item: any) => item.id === "food-dishes");
    expect(food.dos.length).toBeGreaterThanOrEqual(4);
    expect(food.donts.length).toBeGreaterThanOrEqual(4);
    expect(food.examples.length).toBeGreaterThanOrEqual(10);
  });

  it("ships broad finding-level coverage with stable direct anchors", () => {
    const findings = load("findings");
    expect(findings.length).toBeGreaterThanOrEqual(419);
    expect(
      findings.filter((finding: any) => finding.priority === "P0").length,
    ).toBeGreaterThanOrEqual(179);
    expect(
      findings.filter((finding: any) => finding.priority === "P1").length,
    ).toBeGreaterThanOrEqual(153);
    expect(new Set(findings.map((finding: any) => finding.id)).size).toBe(
      findings.length,
    );
    expect(
      findings.every(
        (finding: any) =>
          finding.aliases.length >= 2 &&
          finding.recordType &&
          finding.stage === "pregnancy" &&
          finding.intents.length >= 1 &&
          ["common", "care-team", "urgent"].includes(finding.careTier) &&
          finding.relatedIds.length <= 3 &&
          finding.summary &&
          finding.details.length &&
          finding.decisionFactors.length >= 3 &&
          finding.careNote &&
          finding.sourceIds.length &&
          finding.review,
      ),
    ).toBe(true);
    expect(
      findings.every(
        (finding: any) =>
          `${finding.summary} ${finding.details.join(" ")}`.split(/\s+/)
            .length >= 30,
      ),
    ).toBe(true);
    expect(
      findings.every((finding: any) =>
        finding.details.every(
          (detail: string) =>
            detail.trim().toLowerCase() !==
            finding.summary.trim().toLowerCase(),
        ),
      ),
    ).toBe(true);

    const sections = new Set(findings.map((finding: any) => finding.sectionId));
    expect(sections).toEqual(
      new Set([
        "food-dishes",
        "drinks-caffeine",
        "exercise-movement",
        "medicines-supplements",
        "everyday-home",
        "work-lifting",
        "travel",
        "sex-relationships",
        "sleep-comfort",
        "appointments-warning-signs",
        "common-symptoms",
        "dental-skin-personal-care",
        "infections-vaccinations",
        "mental-health-safety",
        "health-conditions-accessibility",
        "pregnancy-complications",
        "loss-uncertainty-support",
        "birth-newborn-preparation",
      ]),
    );
    const sectionCounts = new Map<string, number>();
    for (const finding of findings)
      sectionCounts.set(
        finding.sectionId,
        (sectionCounts.get(finding.sectionId) ?? 0) + 1,
      );
    expect(
      sectionCounts.get("appointments-warning-signs"),
    ).toBeGreaterThanOrEqual(42);
    expect(sectionCounts.get("common-symptoms")).toBeGreaterThanOrEqual(42);
    expect(sectionCounts.get("work-lifting")).toBeGreaterThanOrEqual(25);
    expect(sectionCounts.get("infections-vaccinations")).toBeGreaterThanOrEqual(
      26,
    );
    expect(sectionCounts.get("health-conditions-accessibility")).toBe(13);
    expect(sectionCounts.get("pregnancy-complications")).toBe(13);
    expect(sectionCounts.get("loss-uncertainty-support")).toBe(12);
    expect(sectionCounts.get("birth-newborn-preparation")).toBe(13);
  });

  it("keeps every postpartum period stage-specific", () => {
    const postpartum = load("timeline").filter(
      (entry: any) => entry.kind === "postpartum",
    );
    expect(postpartum).toHaveLength(13);
    for (const field of [
      "summary",
      "bodyMind",
      "baby",
      "doNow",
      "avoidAsk",
      "appointments",
      "partner",
      "topics",
    ]) {
      expect(
        new Set(postpartum.map((entry: any) => JSON.stringify(entry[field])))
          .size,
      ).toBe(postpartum.length);
    }
  });

  it("ships distinct practical after-birth topic families", () => {
    const topics = load("postpartumTopics");
    expect(topics).toHaveLength(8);
    expect(new Set(topics.map((topic: any) => topic.id))).toEqual(
      new Set([
        "recovery-vaginal-perineal",
        "recovery-caesarean",
        "pelvic-bladder-bowel",
        "feeding-support",
        "mood-trauma-sleep",
        "sex-contraception",
        "newborn-feeding-jaundice-temperature",
        "newborn-safe-sleep-home",
      ]),
    );
    expect(
      topics.every(
        (topic: any) =>
          topic.practicalSteps.length >= 3 &&
          topic.contactCare.length >= 1 &&
          topic.urgent.length >= 1 &&
          topic.sourceIds.length >= 1 &&
          topic.review,
      ),
    ).toBe(true);
    expect(
      new Set(
        topics.map((topic: any) =>
          JSON.stringify([
            topic.summary,
            topic.practicalSteps,
            topic.contactCare,
            topic.urgent,
          ]),
        ),
      ).size,
    ).toBe(topics.length);
  });

  it("ships useful substitutes with clear verdicts and ranked alternatives", () => {
    const substitutions = load("substitutions");
    expect(substitutions).toHaveLength(14);
    expect(
      substitutions.every((item: any) => item.alternatives.length >= 2),
    ).toBe(true);
    expect(new Set(substitutions.map((item: any) => item.status))).toEqual(
      new Set([
        "keep-with-limit",
        "prepare-differently",
        "choose-alternative",
        "check-first",
      ]),
    );

    const cola = substitutions.find((item: any) => item.id === "cola");
    expect(cola.status).toBe("keep-with-limit");
    expect(cola.shortAnswer).toContain("less than 200 mg");
    expect(
      cola.alternatives.some(
        (alternative: any) => alternative.title === "Caffeine-free cola",
      ),
    ).toBe(true);
    expect(cola.labelCheck).toContain(
      "Zero sugar” does not mean caffeine-free",
    );
    expect(cola.sourceIds).toContain("coca-cola-caffeine");
  });

  it("separates conception chances from future-baby health", () => {
    const guides = load("preconception");
    expect(guides).toHaveLength(1);
    const guide = guides[0];
    expect(guide.plan).toHaveLength(6);
    expect(guide.factors.length).toBeGreaterThanOrEqual(9);
    expect(guide.myths.length).toBeGreaterThanOrEqual(8);
    expect(
      new Set(guide.factors.map((factor: any) => factor.category)),
    ).toEqual(new Set(["chance", "health", "both", "neither"]));
    expect(guide.sourceIds.length).toBeGreaterThanOrEqual(6);
  });

  it("uses meaningful week topics instead of one universal topic set", () => {
    const weeks = load("timeline").filter(
      (entry: any) => entry.kind === "week",
    );
    const signatures = new Set(
      weeks.map((entry: any) => [...entry.topics].sort().join(",")),
    );
    expect(signatures.size).toBeGreaterThan(8);
    expect(
      weeks.filter((entry: any) => entry.topics.includes("movement")),
    ).toHaveLength(25);
  });

  it("keeps recurring caveats out of the main weekly sections", () => {
    const weeks = load("timeline").filter(
      (entry: any) => entry.kind === "week",
    );
    expect(weeks.every((entry: any) => entry.bodyMind.length === 1)).toBe(true);
    expect(weeks.every((entry: any) => entry.baby.length === 1)).toBe(true);
    expect(weeks.every((entry: any) => entry.avoidAsk.length === 1)).toBe(true);
    expect(weeks.every((entry: any) => entry.variationNote)).toBe(true);
  });

  it("indexes direct guidance and care tiers for static search", () => {
    const search: any[] = JSON.parse(
      readFileSync(resolve("public/data/search-index.json"), "utf8"),
    );
    const haystack = JSON.stringify(search).toLowerCase();
    expect(haystack).toContain("caffeine");
    expect(haystack).toContain("sushi");
    expect(haystack).toContain("caffeine-free cola");
    expect(haystack).toContain("fertile window");
    expect(haystack).toContain(
      "contact your doctor or maternity team promptly",
    );
    const findings = load("findings");
    const indexed = new Map<string, any>(
      search.map((record: any) => [record.id, record]),
    );
    expect(
      findings.every(
        (finding: any) =>
          indexed.get(finding.id)?.href ===
            `/essentials/finding/${finding.id}/` &&
          indexed.get(finding.id)?.careTier === finding.careTier &&
          JSON.stringify(indexed.get(finding.id)?.intents) ===
            JSON.stringify(finding.intents),
      ),
    ).toBe(true);

    const manifest = JSON.parse(
      readFileSync(resolve("public/data/search-manifest.json"), "utf8"),
    );
    const sharded = manifest.shards.flatMap((shard: any) =>
      JSON.parse(
        readFileSync(
          resolve(`public/${shard.href.replace(/^\//, "")}`),
          "utf8",
        ),
      ),
    );
    expect(sharded).toHaveLength(search.length);
    expect(new Set(sharded.map((record: any) => record.id)).size).toBe(
      search.length,
    );
  });

  it("keeps every weekly chapter concrete and distinct", () => {
    const weeks = load("timeline").filter(
      (entry: any) => entry.kind === "week",
    );
    expect(new Set(weeks.map((entry: any) => entry.title)).size).toBe(40);
    expect(new Set(weeks.map((entry: any) => entry.doNow[0])).size).toBe(40);
    expect(weeks.every((entry: any) => entry.clarifications.length > 0)).toBe(
      true,
    );
  });

  it("leaves release content awaiting clinician approval", () => {
    const timeline = load("timeline");
    expect(
      timeline.every((entry: any) => entry.review.status === "editorial-ready"),
    ).toBe(true);
  });
});
