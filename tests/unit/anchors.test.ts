import { describe, expect, it } from "vitest";
import { anchorSlug, scopedAnchor } from "../../src/lib/anchors";

describe("shareable anchor IDs", () => {
  it("creates readable, URL-safe IDs", () => {
    expect(anchorSlug("Do, don’t, and ask before trying.")).toBe(
      "do-dont-and-ask-before-trying",
    );
    expect(anchorSlug("Café & tea")).toBe("cafe-and-tea");
  });

  it("keeps record scope in item-level anchors", () => {
    expect(scopedAnchor("food-dishes", "Sushi and poke bowls")).toBe(
      "food-dishes-sushi-and-poke-bowls",
    );
  });

  it("always returns a usable fallback", () => {
    expect(anchorSlug("—")).toBe("note");
  });
});
