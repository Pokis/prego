import { expect, test } from "@playwright/test";

test("homepage presents the two equal entry paths", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Pregnancy, made clear.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Set my timeline/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Browse without setup/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: "Pregnancy journey from a positive test through the due date",
    }),
  ).toBeVisible();
  await expect(page.getByText("Month 9", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Due date given by care")).toBeVisible();
  await expect(
    page.getByText(/health content is awaiting qualified clinical review/i),
  ).toBeVisible();
});

test("getting-pregnant guidance is persistent in desktop and mobile navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto("/");
  const primaryNavigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await expect(
    primaryNavigation.getByRole("link", {
      name: "Getting pregnant",
      exact: true,
    }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 780 });
  await page.locator(".mobile-nav summary").click();
  const mobileNavigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(
    mobileNavigation.getByRole("link", {
      name: "Getting pregnant",
      exact: true,
    }),
  ).toBeVisible();
});

test("positive-test deep link loads directly", async ({ page }) => {
  const response = await page.goto("/timeline/positive-test/");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "A positive test: start here",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "What to know now" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open urgent warning signs" }),
  ).toBeVisible();
});

test("getting-pregnant guide separates chances, health and myths", async ({
  page,
}) => {
  const response = await page.goto("/getting-pregnant/");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Getting pregnant, made clearer.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Pregnancy chance", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Future-baby health", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Folic acid is a fertility treatment.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Egg-providing partner under 35" }),
  ).toBeVisible();
  const guideNavigation = page.getByRole("navigation", {
    name: "Getting pregnant guide sections",
  });
  await expect(guideNavigation).toBeVisible();
  await expect(guideNavigation.getByRole("link")).toHaveCount(6);
  await guideNavigation.getByRole("link", { name: /Myths and truth/ }).click();
  await expect(page).toHaveURL(/#myths$/);
  await expect(
    page.getByRole("heading", {
      name: "Remove pressure that biology does not require.",
    }),
  ).toBeVisible();
  await expect(page.locator("main details")).toHaveCount(0);
});

test("site search finds concrete guidance instead of an FAQ", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("searchbox", { name: "What do you want to find?" })
    .fill("caffeine");
  await expect(
    page
      .locator(".search-results")
      .getByRole("link", { name: /Drinks, caffeine and alcohol/i }),
  ).toBeVisible();
});

test("site search ranks a finding and opens its exact shareable anchor", async ({
  page,
}) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", {
    name: "What do you want to find?",
  });
  await search.fill("hot tub");
  const result = page
    .locator(".search-results")
    .getByRole("link", { name: /Hot tub or sauna/i });
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(
    /\/essentials\/#everyday-home-hot-tub-or-sauna$/,
  );
  const finding = page.locator("#everyday-home-hot-tub-or-sauna");
  await expect(finding).toBeVisible();
  await expect(finding).toContainText("Avoid hot tubs, Jacuzzis, saunas");
  await expect(finding).toContainText("What changes the answer");
  await expect(finding).toContainText("Care threshold:");
});

test("site search covers specialist work and monitoring vocabulary", async ({
  page,
}) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", {
    name: "What do you want to find?",
  });
  await search.fill("chemotherapy nurse");
  const workResult = page
    .locator(".search-results")
    .getByRole("link", { name: /Chemotherapy and other hazardous drugs/i });
  await expect(workResult).toBeVisible();

  await search.fill("nonstress test");
  const monitoringResult = page
    .locator(".search-results")
    .getByRole("link", { name: /Nonstress test/i });
  await expect(monitoringResult).toBeVisible();
  await monitoringResult.click();
  await expect(page).toHaveURL(
    /\/essentials\/#appointments-warning-signs-nonstress-test$/,
  );
  await expect(
    page.locator("#appointments-warning-signs-nonstress-test"),
  ).toContainText("pregnancy week, movement and the reason for monitoring");
});

test("site search distinguishes loading from an honest zero result", async ({
  page,
}) => {
  await page.route("**/data/search-index.json", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.goto("/");
  await expect(page.getByText("Loading the search index…")).toBeVisible();
  await expect(
    page.getByRole("searchbox", { name: "What do you want to find?" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("searchbox", { name: "What do you want to find?" }),
  ).toBeEnabled();
});

test("site search reports loading failure instead of zero results", async ({
  page,
}) => {
  await page.route("**/data/search-index.json", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByText(/Search could not load/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retry search" }),
  ).toBeVisible();
  await expect(page.getByText(/0 useful results/)).toHaveCount(0);
});

test("site search names the offline state", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: () => false,
    });
  });
  await page.route("**/data/search-index.json", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByText(/Search is offline on this visit/)).toBeVisible();
});

test("timeline personalization stays in local storage", async ({ page }) => {
  await page.goto("/timeline/");
  await page.getByLabel("Due date given by care").fill("2026-11-07");
  await expect(page.getByText(/You’re at Month \d · Week \d+/)).toBeVisible();
  const state = await page.evaluate(() =>
    localStorage.getItem("pregnancy-clearly:journey:v1"),
  );
  expect(state).toContain('"version":2');
  expect(state).toContain('"estimatedDueDate":"2026-11-07"');
  expect(state).not.toContain('"region"');
});

test("important pregnancy dates stay in chronological order", async ({
  page,
}) => {
  await page.goto("/timeline/");
  const titles = await page
    .locator(".milestone-list .milestone-card h3")
    .allTextContents();

  expect(titles).toEqual([
    "Contact a maternity care professional",
    "Review medicines and supplements",
    "Early pregnancy assessment",
    "Dating and first-trimester assessment",
    "Understand screening choices",
    "Review pregnancy vaccinations",
    "Mid-pregnancy anatomy assessment",
    "Learn your baby's movement pattern",
    "Ask about gestational diabetes testing",
    "Choose birth and newborn learning",
    "Write flexible birth preferences",
    "Discuss feeding support",
    "Save the route and urgent contacts",
    "Make a term and overdue plan",
  ]);
});

test("the weekly journey appears before the complete milestone board", async ({
  page,
}) => {
  await page.goto("/timeline/");
  const order = await page.evaluate(() => {
    const weekly = [...document.querySelectorAll("h2")].find((item) =>
      item.textContent?.includes("Follow the pregnancy from week 3"),
    );
    const milestones = document.querySelector("#milestones-title");
    return weekly && milestones
      ? Boolean(
          weekly.compareDocumentPosition(milestones) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        )
      : false;
  });
  expect(order).toBe(true);
});

test("timeline topics and saved-only view are useful", async ({ page }) => {
  await page.goto("/timeline/");
  await page.getByLabel("Topic").selectOption("movement");
  await expect(
    page.getByText("25 pregnancy weeks", { exact: true }),
  ).toBeVisible();

  await page.getByLabel("Topic").selectOption("all");
  await page.getByRole("button", { name: /Add bookmark for Week 3:/ }).click();
  await page.getByRole("button", { name: "Saved only (1)" }).click();
  await expect(
    page.getByText("1 pregnancy weeks", { exact: true }),
  ).toBeVisible();
});

test("hidden milestones can be restored without clearing all data", async ({
  page,
}) => {
  await page.goto("/timeline/");
  await page
    .getByRole("button", { name: "Hide Contact a maternity care professional" })
    .click();
  await page.getByRole("button", { name: "Manage hidden (1)" }).click();
  await expect(
    page.getByRole("button", { name: "Restore date" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Restore date" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Contact a maternity care professional",
    }),
  ).toBeVisible();
});

test("essentials show direct dos, donts and food examples", async ({
  page,
}) => {
  await page.goto("/essentials/");
  await expect(
    page.getByRole("heading", { name: "Food and everyday dishes" }),
  ).toBeVisible();
  await expect(
    page.getByText("Well-cooked chicken, beef, pork or lamb", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("main details")).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "Common symptoms and practical self-care",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Mental health, relationships and safety",
    }),
  ).toBeVisible();
});

test("important findings have copyable deep links", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) =>
          sessionStorage.setItem("copied-finding-link", value),
      },
    });
  });

  await page.goto("/essentials/");
  const finding = page.locator("#food-dishes-sushi");
  await finding.getByRole("link", { name: "Copy link to Sushi" }).click();

  await expect(page).toHaveURL(/#food-dishes-sushi$/);
  await expect(page.locator("#share-link-status")).toHaveText(
    "Link to Sushi copied.",
  );
  await expect(finding).toBeFocused();
  expect(
    await page.evaluate(() => sessionStorage.getItem("copied-finding-link")),
  ).toMatch(/\/essentials\/#food-dishes-sushi$/);

  const response = await page.goto(
    "/urgent-help/#maternal-baby-movement-stops-or-slows",
  );
  expect(response?.ok()).toBe(true);
  const urgentFinding = page.locator("#maternal-baby-movement-stops-or-slows");
  await expect(urgentFinding).toBeVisible();
  expect(
    await urgentFinding.evaluate((element) => element.matches(":target")),
  ).toBe(true);

  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/essentials/#food-dishes-sushi");
  await expect
    .poll(() =>
      page
        .locator("#food-dishes-sushi")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(180);
});

test("swap finder turns a craving into a concrete alternative", async ({
  page,
}) => {
  await page.goto("/essentials/#smart-swaps");
  await expect(
    page.getByRole("heading", {
      name: "Keep the thing you love. Change only what matters.",
    }),
  ).toBeVisible();

  const search = page.getByRole("searchbox", {
    name: "What are you missing?",
  });
  await expect(search).toBeEnabled();
  await search.fill("Coca-Cola");

  const cola = page.locator("#swap-cola");
  await expect(cola).toBeVisible();
  await expect(page.locator("#swap-coffee")).toHaveCount(0);
  await expect(cola.getByText("Keep it, count it")).toBeVisible();
  await expect(cola.getByText("Caffeine-free cola")).toBeVisible();
  await expect(
    cola.getByText(/Zero sugar” does not mean caffeine-free/),
  ).toBeVisible();
  await expect(page.getByText("1 useful swap", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Show everything" }).click();
  await page.getByRole("button", { name: "Desserts" }).click();
  await expect(page.locator("#swap-raw-egg-desserts")).toBeVisible();
  await expect(page.locator("#swap-cola")).toHaveCount(0);
});

test("weeks after the due date are not presented as a seven-week month nine", async ({
  page,
}) => {
  await page.goto("/timeline/week-41/");
  await expect(
    page.getByText("Beyond the estimated due date · Third trimester", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Beyond due date", { exact: true }),
  ).toBeVisible();
});

test("week pages make the month and concrete action clear", async ({
  page,
}) => {
  await page.goto("/timeline/week-18/");
  await expect(
    page.getByText("Second trimester · Month 5 of 9", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What this means in real life" }),
  ).toBeVisible();
  await expect(
    page.locator("#do-now").getByText(/taps, flutters, bubbles/i),
  ).toBeVisible();
});

test("urgent help separates maternal and infant signs", async ({ page }) => {
  await page.goto("/urgent-help/");
  await expect(
    page.getByRole("heading", { name: /Urgent signs during pregnancy/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Urgent signs in a newborn/ }),
  ).toBeVisible();
  await expect(page.getByText("Baby movement stops or slows")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Contact your doctor or maternity team promptly",
    }),
  ).toBeVisible();
});

test("partner milestones use the same chronological source of truth", async ({
  page,
}) => {
  await page.goto("/partners/");
  const titles = await page
    .locator(".section.plum .milestone-card h3")
    .allTextContents();
  expect(titles.slice(0, 3)).toEqual([
    "Contact a maternity care professional",
    "Review medicines and supplements",
    "Early pregnancy assessment",
  ]);
});

test("mobile pages do not overflow horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  for (const path of ["/timeline/", "/getting-pregnant/", "/essentials/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow, `${path} overflows at 320 CSS pixels`).toBe(false);
  }
});
