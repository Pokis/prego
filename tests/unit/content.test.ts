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
    expect(essentials).toHaveLength(14);
    const food = essentials.find((item: any) => item.id === "food-dishes");
    expect(food.dos.length).toBeGreaterThanOrEqual(4);
    expect(food.donts.length).toBeGreaterThanOrEqual(4);
    expect(food.examples.length).toBeGreaterThanOrEqual(10);
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
    const search = JSON.parse(
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
