import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of [
  "/",
  "/timeline/",
  "/timeline/week-18/",
  "/getting-pregnant/",
  "/essentials/",
  "/essentials/pregnancy-complications/",
  "/essentials/finding/everyday-home-hot-tub-or-sauna/",
  "/timeline/after-birth/",
  "/partners/",
  "/urgent-help/",
]) {
  test(`${path} has no automatically detectable serious accessibility violations`, async ({
    page,
  }) => {
    // The complete Essentials catalog is intentionally rendered without hiding
    // core guidance, so its cross-browser axe scan needs a larger CI budget.
    test.setTimeout(path === "/essentials/" ? 90_000 : 45_000);

    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact || ""),
    );
    expect(serious).toEqual([]);
  });
}

test("the saved baby loader has no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/timeline/");
  const dueDate = await page.evaluate(() => {
    const now = new Date();
    const localToday = new Date(
      now.getTime() - now.getTimezoneOffset() * 60_000,
    );
    localToday.setUTCDate(localToday.getUTCDate() + 63);
    return localToday.toISOString().slice(0, 10);
  });

  await page.getByLabel("Due date given by care").fill(dueDate);
  await page.getByRole("button", { name: "Show my baby loader" }).click();
  await expect(
    page.getByRole("heading", { name: "Baby loading…" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("#baby-loader")
    .analyze();
  const serious = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact || ""),
  );
  expect(serious).toEqual([]);
});
