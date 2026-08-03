import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "zod";

const reviewSchema = z.object({
  status: z.enum([
    "draft",
    "editorial-ready",
    "clinical-approved",
    "needs-review",
  ]),
  reviewedAt: z.string(),
  nextReviewAt: z.string(),
  reviewer: z.string(),
  volatility: z.enum(["stable", "annual", "rapid-review"]),
});

const timeline = defineCollection({
  loader: file("src/data/generated/timeline.json"),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    kind: z.enum(["positive-test", "overview", "week", "postpartum"]),
    phase: z.enum(["pregnancy", "postpartum"]),
    ordinal: z.number(),
    windowLabel: z.string(),
    title: z.string(),
    dek: z.string(),
    summary: z.array(z.string()),
    bodyMind: z.array(z.string()),
    baby: z.array(z.string()),
    variationNote: z.string().optional(),
    clarifications: z.array(z.string()).optional(),
    doNow: z.array(z.string()),
    avoidAsk: z.array(z.string()),
    appointments: z.array(z.string()),
    partner: z.array(z.string()),
    topics: z.array(z.string()),
    audiences: z.array(z.string()),
    helpTier: z.enum(["common", "care-team", "urgent"]),
    sourceIds: z.array(z.string()),
    milestoneIds: z.array(z.string()),
    review: reviewSchema,
  }),
});

const essentials = defineCollection({
  loader: file("src/data/generated/essentials.json"),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    number: z.number(),
    title: z.string(),
    eyebrow: z.string(),
    intro: z.string(),
    dos: z.array(z.string()),
    donts: z.array(z.string()),
    askDoctor: z.array(z.string()),
    examples: z.array(
      z.object({
        name: z.string(),
        status: z.enum(["generally-ok", "avoid", "check-first"]),
        guidance: z.string(),
      }),
    ),
    sourceIds: z.array(z.string()),
    review: reviewSchema,
  }),
});

const findings = defineCollection({
  loader: file("src/data/generated/findings.json"),
  schema: z.object({
    id: z.string(),
    sectionId: z.string(),
    title: z.string(),
    aliases: z.array(z.string()).min(2),
    status: z.enum([
      "generally-ok",
      "avoid",
      "check-first",
      "contact-care",
      "urgent",
    ]),
    priority: z.enum(["baseline", "P0", "P1"]),
    recordType: z.enum([
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
    ]),
    summary: z.string(),
    details: z.array(z.string()).min(1).max(3),
    decisionFactors: z.array(z.string()).min(3).max(4),
    careNote: z.string(),
    sourceIds: z.array(z.string()).min(1),
    review: reviewSchema,
  }),
});

const substitutions = defineCollection({
  loader: file("src/data/generated/substitutions.json"),
  schema: z.object({
    id: z.string(),
    item: z.string(),
    group: z.enum([
      "drinks",
      "coffee-tea",
      "meals",
      "dairy",
      "treats",
      "protein-produce",
    ]),
    status: z.enum([
      "keep-with-limit",
      "prepare-differently",
      "choose-alternative",
      "check-first",
    ]),
    searchTerms: z.array(z.string()),
    shortAnswer: z.string(),
    why: z.string(),
    alternatives: z
      .array(
        z.object({
          label: z.string(),
          title: z.string(),
          note: z.string(),
        }),
      )
      .min(2)
      .max(3),
    labelCheck: z.string(),
    sourceIds: z.array(z.string()),
    review: reviewSchema,
  }),
});

const preconception = defineCollection({
  loader: file("src/data/generated/preconception.json"),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    eyebrow: z.string(),
    dek: z.string(),
    routeNote: z.string(),
    orientation: z.array(
      z.object({
        label: z.string(),
        title: z.string(),
        detail: z.string(),
      }),
    ),
    plan: z.array(z.object({ title: z.string(), detail: z.string() })),
    dos: z.array(z.string()),
    donts: z.array(z.string()),
    askDoctor: z.array(z.string()),
    factors: z.array(
      z.object({
        name: z.string(),
        category: z.enum(["chance", "health", "both", "neither"]),
        chance: z.string(),
        babyHealth: z.string(),
        action: z.string(),
      }),
    ),
    myths: z.array(
      z.object({
        myth: z.string(),
        truth: z.string(),
        takeaway: z.string(),
      }),
    ),
    help: z.array(z.object({ title: z.string(), guidance: z.string() })),
    partnerActions: z.array(z.string()),
    sourceIds: z.array(z.string()),
    review: reviewSchema,
  }),
});

const milestones = defineCollection({
  loader: file("src/data/generated/milestones.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    anchor: z.enum(["positive-test", "gestational-week", "birth-day"]),
    start: z.number(),
    end: z.number(),
    category: z.string(),
    importance: z.enum(["essential", "recommended", "optional"]),
    sourceIds: z.array(z.string()),
    review: reviewSchema,
  }),
});

const sources = defineCollection({
  loader: file("src/data/generated/sources.json"),
  schema: z.object({
    id: z.string(),
    authority: z.string(),
    title: z.string(),
    url: z.url(),
    publishedOrUpdated: z.string(),
    retrievedAt: z.string(),
    cadence: z.enum(["stable", "annual", "rapid-review"]),
    note: z.string(),
  }),
});

const urgent = defineCollection({
  loader: file("src/data/generated/urgent.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    intro: z.string(),
    audience: z.enum(["maternal", "infant"]),
    tier: z.enum(["care-team", "urgent"]),
    signs: z.array(z.object({ title: z.string(), detail: z.string() })),
    action: z.string(),
    sourceIds: z.array(z.string()),
    review: reviewSchema,
  }),
});

export const collections = {
  timeline,
  essentials,
  findings,
  substitutions,
  preconception,
  milestones,
  sources,
  urgent,
};
