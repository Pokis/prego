import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of [
  "/",
  "/timeline/",
  "/timeline/week-18/",
  "/getting-pregnant/",
  "/essentials/",
  "/partners/",
  "/urgent-help/",
]) {
  test(`${path} has no automatically detectable serious accessibility violations`, async ({
    page,
  }) => {
    // The complete Essentials catalog is intentionally rendered without hiding
    // core guidance, so its cross-browser axe scan needs a larger CI budget.
    test.setTimeout(path === "/essentials/" ? 90_000 : 30_000);

    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact || ""),
    );
    expect(serious).toEqual([]);
  });
}
