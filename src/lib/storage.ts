import { siteConfig } from "../config/site";
import type { UserPreferences } from "./types";

export const recentFindingsStorageKey = "pregnancy-clearly:recent-findings:v1";
export const recentSearchesStorageKey = "pregnancy-clearly:recent-searches:v1";
export const applicationStorageKeys = [
  siteConfig.storageKey,
  recentFindingsStorageKey,
  recentSearchesStorageKey,
] as const;

export const defaultPreferences: UserPreferences = {
  version: 2,
  dueDateSource: null,
  estimatedDueDate: null,
  lastMenstrualPeriod: null,
  actualBirthDate: null,
  audience: "pregnant",
  bookmarks: [],
  completedMilestones: [],
  hiddenMilestones: [],
  dismissedSetup: false,
};

export function loadPreferences(
  storage: Pick<Storage, "getItem"> = localStorage,
): UserPreferences {
  try {
    const value = storage.getItem(siteConfig.storageKey);
    if (!value) return { ...defaultPreferences };
    const parsed = JSON.parse(value) as { version?: number } & Partial<
      Omit<UserPreferences, "version">
    >;
    if (parsed.version === 1) {
      const legacy = parsed as Partial<Omit<UserPreferences, "version">> & {
        version?: number;
        region?: string;
        units?: string;
      };
      return {
        ...defaultPreferences,
        dueDateSource: legacy.dueDateSource ?? null,
        estimatedDueDate: legacy.estimatedDueDate ?? null,
        lastMenstrualPeriod: legacy.lastMenstrualPeriod ?? null,
        actualBirthDate: legacy.actualBirthDate ?? null,
        audience: legacy.audience ?? "pregnant",
        bookmarks: legacy.bookmarks ?? [],
        completedMilestones: legacy.completedMilestones ?? [],
        hiddenMilestones: legacy.hiddenMilestones ?? [],
        dismissedSetup: legacy.dismissedSetup ?? false,
      };
    }
    if (parsed.version !== siteConfig.storageVersion)
      return { ...defaultPreferences };
    return { ...defaultPreferences, ...parsed, version: 2 } as UserPreferences;
  } catch {
    return { ...defaultPreferences };
  }
}

export function savePreferences(
  preferences: UserPreferences,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  storage.setItem(siteConfig.storageKey, JSON.stringify(preferences));
}

export function clearPreferences(
  storage: Pick<Storage, "removeItem"> = localStorage,
): void {
  for (const key of applicationStorageKeys) storage.removeItem(key);
}
