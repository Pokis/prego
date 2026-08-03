import { describe, expect, it } from "vitest";
import {
  clearPreferences,
  defaultPreferences,
  loadPreferences,
  savePreferences,
} from "../../src/lib/storage";
import { siteConfig } from "../../src/config/site";

class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

describe("local journey storage", () => {
  it("returns safe defaults for empty storage", () => {
    expect(loadPreferences(new MemoryStorage())).toEqual(defaultPreferences);
  });

  it("round-trips a preference record", () => {
    const storage = new MemoryStorage();
    const value = {
      ...defaultPreferences,
      estimatedDueDate: "2026-12-01",
      dueDateSource: "known" as const,
    };
    savePreferences(value, storage);
    expect(loadPreferences(storage)).toEqual(value);
  });

  it("ignores unsupported schema versions", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      siteConfig.storageKey,
      JSON.stringify({ version: 99, region: "us" }),
    );
    expect(loadPreferences(storage)).toEqual(defaultPreferences);
  });

  it("migrates version 1 dates and lists without legacy location fields", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      siteConfig.storageKey,
      JSON.stringify({
        version: 1,
        region: "lt",
        units: "metric",
        estimatedDueDate: "2026-12-01",
        dueDateSource: "known",
        bookmarks: ["week-12"],
      }),
    );
    expect(loadPreferences(storage)).toMatchObject({
      version: 2,
      estimatedDueDate: "2026-12-01",
      bookmarks: ["week-12"],
    });
    expect(loadPreferences(storage)).not.toHaveProperty("region");
  });

  it("clears every application key without touching unrelated storage", () => {
    const storage = new MemoryStorage();
    storage.setItem(siteConfig.storageKey, "saved");
    storage.setItem("pregnancy-clearly:recent-findings:v1", "saved");
    storage.setItem("pregnancy-clearly:recent-searches:v1", "saved");
    storage.setItem("other", "preserve");
    clearPreferences(storage);
    expect(storage.getItem(siteConfig.storageKey)).toBeNull();
    expect(storage.getItem("pregnancy-clearly:recent-findings:v1")).toBeNull();
    expect(storage.getItem("pregnancy-clearly:recent-searches:v1")).toBeNull();
    expect(storage.getItem("other")).toBe("preserve");
  });
});
