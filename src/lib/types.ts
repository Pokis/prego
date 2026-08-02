export type Audience = "pregnant" | "partner" | "browsing" | "parent" | "both";
export type ReviewStatus =
  "draft" | "editorial-ready" | "clinical-approved" | "needs-review";
export type Volatility = "stable" | "annual" | "rapid-review";
export type HelpTier = "common" | "care-team" | "urgent";
export type TimelinePhase = "pregnancy" | "postpartum";

export interface ReviewMeta {
  status: ReviewStatus;
  reviewedAt: string;
  nextReviewAt: string;
  reviewer: string;
  volatility: Volatility;
}

export interface UserPreferences {
  version: 2;
  dueDateSource: "known" | "lmp" | null;
  estimatedDueDate: string | null;
  lastMenstrualPeriod: string | null;
  actualBirthDate: string | null;
  audience: Audience;
  bookmarks: string[];
  completedMilestones: string[];
  hiddenMilestones: string[];
  dismissedSetup: boolean;
}

export interface JourneyPosition {
  phase: TimelinePhase;
  week?: number;
  day?: number;
  label: string;
  isEstimate: boolean;
}
