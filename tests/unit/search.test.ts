import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  explainSearchMatch,
  highlightSearchTerms,
  normalizeSearchText,
  searchRecords,
  suggestSearchQueries,
  type SearchRecord,
} from "../../src/lib/search";

const records = JSON.parse(
  readFileSync(resolve("public/data/search-index.json"), "utf8"),
) as SearchRecord[];

const expectedQueries = [
  ["hot tub", "everyday-home-hot-tub-or-sauna"],
  ["jacuzzi", "everyday-home-hot-tub-or-sauna"],
  ["steam room", "everyday-home-hot-tub-or-sauna"],
  ["NIPT", "appointments-warning-signs-nipt"],
  ["cell free DNA", "appointments-warning-signs-nipt"],
  ["pre-eclampsia", "common-symptoms-preeclampsia"],
  ["baby not moving", "common-symptoms-reduced-movement"],
  ["c section", "appointments-warning-signs-caesarean"],
  ["group b strep", "appointments-warning-signs-gbs"],
  ["slapped cheek", "infections-parvovirus-slapped-cheek"],
  ["dental x-ray", "dental-skin-dental-treatment-xray"],
  ["intrusive thoughts", "mental-health-intrusive-thoughts-harm"],
  ["cookie dough", "food-dishes-raw-flour-cookie-dough"],
  ["bubble tea", "drinks-caffeine-bubble-tea-boba"],
  ["weight lifting", "exercise-movement-resistance-machines-free-weights"],
  ["baby aspirin", "medicines-supplements-low-dose-aspirin-prescribed"],
  ["asthma inhaler", "medicines-supplements-asthma-inhalers"],
  ["antidepressant", "medicines-supplements-antidepressants-ssri"],
  ["x ray technician", "work-lifting-ionizing-radiation-xray-staff"],
  ["chemotherapy nurse", "work-lifting-hazardous-drugs-chemotherapy"],
  ["dating scan", "appointments-warning-signs-dating-ultrasound"],
  ["anatomy scan", "appointments-warning-signs-anatomy-ultrasound"],
  ["glucose test", "appointments-warning-signs-gestational-diabetes-test"],
  ["nonstress test", "appointments-warning-signs-nonstress-test"],
  ["vitamin K shot", "appointments-warning-signs-newborn-vitamin-k"],
  ["bleeding", "common-symptoms-bleeding-spotting"],
  ["pregnancy after loss", "mental-health-pregnancy-after-loss"],
  ["tick bite", "infections-tick-bite-lyme"],
  ["left side sleeping", "sleep-comfort-left-versus-right-side"],
  [
    "type 1 diabetes",
    "health-conditions-accessibility-type-1-or-type-2-diabetes-before-pregnancy",
  ],
  [
    "wheelchair",
    "health-conditions-accessibility-wheelchair-mobility-transfers",
  ],
  [
    "placenta previa",
    "pregnancy-complications-low-lying-placenta-or-placenta-praevia",
  ],
  [
    "itchy palms",
    "pregnancy-complications-persistent-itching-or-possible-cholestasis",
  ],
  [
    "inconclusive scan",
    "loss-uncertainty-support-early-scan-that-is-not-yet-conclusive",
  ],
  [
    "miscarriage recovery",
    "loss-uncertainty-support-physical-recovery-after-miscarriage",
  ],
  [
    "birth preferences",
    "birth-newborn-preparation-a-one-page-birth-preference-note",
  ],
  ["safe sleep space", "birth-newborn-preparation-newborn-sleep-space"],
  ["weight gain", "food-dishes-pregnancy-weight-gain-pattern"],
  ["home doppler", "appointments-warning-signs-home-fetal-doppler"],
  ["wildfire smoke", "everyday-home-wildfire-smoke-air-quality"],
  ["molar pregnancy", "loss-uncertainty-support-molar-pregnancy-followup"],
  ["hospital bag", "birth-newborn-preparation-hospital-bag"],
  ["skin to skin", "birth-newborn-preparation-skin-to-skin-first-hour"],
  [
    "medical interpreter pregnancy",
    "health-conditions-accessibility-interpreter-communication-plan",
  ],
] as const;

describe("guide search", () => {
  it.each(expectedQueries)(
    "prevents a zero result for %s",
    (query, expectedId) => {
      const matches = searchRecords(records, query);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some((match) => match.id === expectedId)).toBe(true);
    },
  );

  it("ranks exact phrases and controlled aliases above broad page text", () => {
    expect(searchRecords(records, "hot tub").at(0)?.id).toBe(
      "everyday-home-hot-tub-or-sauna",
    );
    expect(searchRecords(records, "NIPT").at(0)?.id).toBe(
      "appointments-warning-signs-nipt",
    );
    expect(searchRecords(records, "c section").at(0)?.id).toBe(
      "appointments-warning-signs-caesarean",
    );
    expect(searchRecords(records, "glucose test").at(0)?.id).toBe(
      "appointments-warning-signs-gestational-diabetes-test",
    );
    expect(searchRecords(records, "chemotherapy nurse").at(0)?.id).toBe(
      "work-lifting-hazardous-drugs-chemotherapy",
    );
  });

  it("sends finding results to their stable direct pages", () => {
    for (const [query, expectedId] of expectedQueries) {
      const match = searchRecords(records, query).find(
        (result) => result.id === expectedId,
      );
      expect(match?.href).toBe(`/essentials/finding/${expectedId}/`);
    }
  });

  it("matches whole terms instead of substrings", () => {
    const fixtures: SearchRecord[] = [
      {
        id: "hot-tub",
        type: "finding",
        title: "Hot tub",
        summary: "Heat guidance",
        href: "/essentials/#hot-tub",
        topics: [],
        aliases: ["jacuzzi"],
        text: "",
      },
      {
        id: "energy-shot",
        type: "finding",
        title: "Energy shot",
        summary: "Caffeine guidance",
        href: "/essentials/#energy-shot",
        topics: [],
        aliases: ["energy shots"],
        text: "",
      },
      {
        id: "education",
        type: "finding",
        title: "Childbirth education",
        summary: "Class guidance",
        href: "/essentials/#education",
        topics: [],
        aliases: ["birth class"],
        text: "",
      },
    ];

    expect(searchRecords(fixtures, "hot").map((record) => record.id)).toEqual([
      "hot-tub",
    ]);
    expect(searchRecords(fixtures, "cat")).toEqual([]);
    expect(searchRecords(records, "aspire")).toEqual([]);
    expect(searchRecords(records, "notable")).toEqual([]);
  });

  it("normalizes punctuation, accents and common spelling separators", () => {
    expect(normalizeSearchText("Pre-eclampsia")).toBe("pre eclampsia");
    expect(normalizeSearchText("C-section")).toBe("c section");
    expect(searchRecords(records, "pre eclampsia").at(0)?.id).toBe(
      "common-symptoms-preeclampsia",
    );
  });

  it("explains matches, highlights terms and offers controlled typo recovery", () => {
    const hotTub = searchRecords(records, "hot tub").at(0);
    expect(hotTub).toBeDefined();
    expect(explainSearchMatch(hotTub!, "hot tub")).toMatch(
      /Exact title|Known term|Known phrase/,
    );
    expect(
      highlightSearchTerms("Hot tub and sauna guidance", "hot tub")
        .filter((segment) => segment.match)
        .map((segment) => segment.text.toLowerCase()),
    ).toEqual(["hot", "tub"]);
    expect(suggestSearchQueries(records, "jacuzzie")).toContain("jacuzzi");
  });

  it("still gives an honest zero for unrelated input", () => {
    expect(searchRecords(records, "quantum carburetor")).toEqual([]);
  });
});
