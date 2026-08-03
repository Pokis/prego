import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve("dist");
const errors = [];
if (!existsSync(dist)) {
  console.error(
    "Static audit failed: dist/ does not exist. Run npm run build first.",
  );
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = resolve(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const files = walk(dist);
const html = files.filter((file) => file.endsWith(".html"));
const fileSet = new Set(files.map((file) => file.replaceAll("\\", "/")));
if (html.length < 60)
  errors.push(
    `Only ${html.length} HTML pages generated; expected at least 60.`,
  );

for (const file of html) {
  const content = readFileSync(file, "utf8");
  if (!content.includes("<main")) errors.push(`${file} has no main landmark`);
  if (!content.includes("<title>")) errors.push(`${file} has no title`);
  if (
    /fonts\.googleapis|googletagmanager|google-analytics|doubleclick/i.test(
      content,
    )
  )
    errors.push(`${file} contains a disallowed third-party runtime`);
  if (/localhost:|127\.0\.0\.1:/.test(content))
    errors.push(`${file} contains a local URL`);

  const ids = [...content.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const seenIds = new Set();
  for (const id of ids) {
    if (seenIds.has(id)) errors.push(`${file} contains duplicate id #${id}`);
    seenIds.add(id);
  }

  for (const match of content.matchAll(
    /<[a-z][^>]*data-share-target[^>]*>/gi,
  )) {
    if (!/\sid="[^"]+"/.test(match[0]))
      errors.push(`${file} contains a share target without an id`);
  }

  for (const match of content.matchAll(/data-share-anchor="([^"]+)"/g)) {
    if (!seenIds.has(match[1]))
      errors.push(`${file} has a copy-link control for missing #${match[1]}`);
  }

  const relativePage = file
    .replace(dist, "")
    .replaceAll("\\", "/")
    .replace(/^\//, "");
  const pageUrl = new URL(
    relativePage.endsWith("index.html")
      ? relativePage.replace(/index\.html$/, "")
      : relativePage,
    "https://static.local/",
  );
  for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:mailto:|tel:|data:|javascript:)/.test(reference)) continue;
    const targetUrl = new URL(reference, pageUrl);
    if (targetUrl.origin !== "https://static.local") continue;
    const decodedPath = decodeURIComponent(targetUrl.pathname);
    const relativeTarget = decodedPath.replace(/^\//, "");
    const candidates = relativeTarget.endsWith("/")
      ? [resolve(dist, relativeTarget, "index.html")]
      : [
          resolve(dist, relativeTarget),
          resolve(dist, relativeTarget, "index.html"),
        ];
    const target = candidates.find((candidate) =>
      fileSet.has(candidate.replaceAll("\\", "/")),
    );
    if (!target) errors.push(`${file} links to missing ${reference}`);
    if (target && target.endsWith(".html") && targetUrl.hash) {
      const id = decodeURIComponent(targetUrl.hash.slice(1)).replace(
        /["&<>]/g,
        "",
      );
      const targetHtml = readFileSync(target, "utf8");
      if (id && !targetHtml.includes(`id="${id}"`))
        errors.push(`${file} links to missing fragment ${reference}`);
    }
  }
}

const required = [
  ".nojekyll",
  "index.html",
  "timeline/index.html",
  "getting-pregnant/index.html",
  "essentials/index.html",
  "urgent-help/index.html",
  "manifest.webmanifest",
  "og.webp",
  "robots.txt",
  "sw.js",
  "data/search-index.json",
];
for (const path of required)
  if (!existsSync(resolve(dist, path)))
    errors.push(`Missing static output ${path}`);

const homeHtmlPath = resolve(dist, "index.html");
if (existsSync(homeHtmlPath)) {
  const homeHtml = readFileSync(homeHtmlPath, "utf8");
  if (
    !homeHtml.includes('aria-label="Primary navigation"') ||
    !homeHtml.includes('href="/getting-pregnant/"')
  )
    errors.push(
      "Primary navigation is missing the persistent Getting pregnant entry.",
    );
}

const preconceptionHtmlPath = resolve(dist, "getting-pregnant", "index.html");
if (existsSync(preconceptionHtmlPath)) {
  const preconceptionHtml = readFileSync(preconceptionHtmlPath, "utf8");
  for (const fragment of [
    "#simple-plan",
    "#dos-donts",
    "#what-affects-what",
    "#myths",
    "#when-to-get-help",
    "#for-couples",
  ])
    if (!preconceptionHtml.includes(`href="${fragment}"`))
      errors.push(
        `Getting pregnant section navigation is missing ${fragment}.`,
      );

  for (const id of [
    "chance-vs-future-health",
    "preconception-baseline-note",
    "dos-donts-check-first",
    "fertility-evaluation-note",
  ])
    if (!preconceptionHtml.includes(`data-share-anchor="${id}"`))
      errors.push(`Getting pregnant guide is missing copy link for #${id}.`);
}

const timelineHtmlPath = resolve(dist, "timeline", "index.html");
if (existsSync(timelineHtmlPath)) {
  const timelineHtml = readFileSync(timelineHtmlPath, "utf8");
  const milestoneListStart = timelineHtml.indexOf(
    'class="milestone-board milestone-list"',
  );
  const milestoneListEnd = timelineHtml.indexOf("</ol>", milestoneListStart);
  const milestoneListHtml =
    milestoneListStart >= 0 && milestoneListEnd > milestoneListStart
      ? timelineHtml.slice(milestoneListStart, milestoneListEnd)
      : "";
  const chronologicalMilestones = [
    "Contact a maternity care professional",
    "Early pregnancy assessment",
    "Mid-pregnancy anatomy assessment",
    "Make a term and overdue plan",
  ].map((title) => milestoneListHtml.indexOf(title));

  if (chronologicalMilestones.some((index) => index < 0)) {
    errors.push(
      "Timeline static HTML is missing pregnancy milestone content before hydration.",
    );
  } else if (
    chronologicalMilestones.some(
      (index, position) =>
        position > 0 && index <= chronologicalMilestones[position - 1],
    )
  ) {
    errors.push("Timeline milestones are not chronological in static HTML.");
  }

  const weekListHeading = timelineHtml.indexOf(
    "Follow the pregnancy from week 3 to week 42",
  );
  const milestoneHeading = timelineHtml.indexOf(
    "Important pregnancy dates, in order",
  );
  if (
    weekListHeading < 0 ||
    milestoneHeading < 0 ||
    weekListHeading >= milestoneHeading
  )
    errors.push(
      "The primary week-by-week journey must appear before the full milestone board.",
    );

  for (const expected of [
    "Positive test",
    "Weeks 36–40",
    "Beyond the due date",
  ])
    if (!timelineHtml.includes(expected))
      errors.push(`Timeline is missing clarified journey label: ${expected}`);
}

const essentialsHtmlPath = resolve(dist, "essentials", "index.html");
if (existsSync(essentialsHtmlPath)) {
  const essentialsHtml = readFileSync(essentialsHtmlPath, "utf8");
  const renderedSwapCards = [
    ...essentialsHtml.matchAll(/class="swap-card [^"]+"/g),
  ].length;
  if (renderedSwapCards !== 14)
    errors.push(
      `Essentials static HTML has ${renderedSwapCards} swap cards; expected 14 before hydration.`,
    );
  for (const expected of [
    'id="swap-cola"',
    "Caffeine-free cola",
    "Keep it, count it",
    "Check the label:",
  ])
    if (!essentialsHtml.includes(expected))
      errors.push(
        `Essentials static HTML is missing substitute content: ${expected}`,
      );

  for (const id of [
    "individual-care-baseline",
    "food-dishes-real-examples",
    "food-dishes-sushi",
    "swap-cola-label-check",
  ])
    if (!essentialsHtml.includes(`data-share-anchor="${id}"`))
      errors.push(`Essentials static HTML is missing copy link for #${id}.`);
}

const urgentHtmlPath = resolve(dist, "urgent-help", "index.html");
if (existsSync(urgentHtmlPath)) {
  const urgentHtml = readFileSync(urgentHtmlPath, "utf8");
  for (const id of ["care-team", "maternal-what-to-do", "infant-what-to-do"])
    if (!urgentHtml.includes(`data-share-anchor="${id}"`))
      errors.push(`Urgent help is missing copy link for #${id}.`);
}

const weekHtmlPath = resolve(dist, "timeline", "week-20", "index.html");
if (existsSync(weekHtmlPath)) {
  const weekHtml = readFileSync(weekHtmlPath, "utf8");
  for (const id of [
    "know-now",
    "variation-note",
    "appointments",
    "individual-care-note",
  ])
    if (!weekHtml.includes(`data-share-anchor="${id}"`))
      errors.push(`Timeline week is missing copy link for #${id}.`);
}

const searchIndexPath = resolve(dist, "data", "search-index.json");
if (existsSync(searchIndexPath)) {
  const searchIndex = readFileSync(searchIndexPath, "utf8");
  for (const expected of [
    "caffeine",
    "Sushi",
    "Coca-Cola and other cola",
    "Caffeine-free cola",
    "Zero sugar” does not mean caffeine-free",
    "fertile window",
    "Folic acid is a fertility treatment",
    "Mental health",
    "Contact your doctor or maternity team promptly",
  ])
    if (!searchIndex.toLowerCase().includes(expected.toLowerCase()))
      errors.push(`Static search index is missing ${expected}`);
}

if (errors.length) {
  console.error(
    `Static audit failed (${errors.length}):\n${errors.slice(0, 80).join("\n")}`,
  );
  process.exit(1);
}
console.log(
  `Static audit passed: ${html.length} HTML pages and ${files.length} total files.`,
);
