import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { resolveDeploymentConfig } from "./deployment-config.mjs";

assert.deepEqual(
  resolveDeploymentConfig({
    GITHUB_PAGES: "true",
    GITHUB_REPOSITORY: "example-owner/pregnancy-clearly",
    GITHUB_REPOSITORY_OWNER: "example-owner",
  }),
  {
    site: "https://example-owner.github.io",
    base: "/pregnancy-clearly/",
    outDir: "./dist",
    target: "github-project-site",
  },
);

assert.equal(
  resolveDeploymentConfig({
    GITHUB_PAGES: "true",
    GITHUB_REPOSITORY: "Example-Owner/example-owner.github.io",
    GITHUB_REPOSITORY_OWNER: "Example-Owner",
  }).base,
  "/",
);

assert.deepEqual(
  resolveDeploymentConfig({
    GITHUB_PAGES: "true",
    GITHUB_REPOSITORY: "example-owner/pregnancy-clearly",
    GITHUB_REPOSITORY_OWNER: "example-owner",
    SITE_URL: "https://pregnancy.example/path-that-is-not-used",
  }),
  {
    site: "https://pregnancy.example",
    base: "/",
    outDir: "./dist",
    target: "github-custom-domain",
  },
);

assert.equal(
  resolveDeploymentConfig({
    SITE_URL: "https://example.test",
    BASE_PATH: "pregnancy/guide",
  }).base,
  "/pregnancy/guide/",
);

const output = resolve(".audit-dist-github-pages");
if (basename(output) !== ".audit-dist-github-pages")
  throw new Error("Refusing an unsafe GitHub Pages audit output path");

const pagesEnv = {
  ...process.env,
  GITHUB_PAGES: "true",
  GITHUB_REPOSITORY: "Pokis/prego",
  GITHUB_REPOSITORY_OWNER: "Pokis",
  SITE_URL: "https://prego.potatoroad.lt/",
  BASE_PATH: "/",
  OUT_DIR: output,
};

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: pagesEnv,
    encoding: "utf8",
  });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

rmSync(output, { recursive: true, force: true });
try {
  run(process.execPath, [resolve("node_modules/astro/bin/astro.mjs"), "build"]);
  run(process.execPath, [resolve("scripts/finalize-pwa.mjs")]);
  run(process.execPath, [resolve("scripts/audit-pages-artifact.mjs")]);
  run(process.execPath, [resolve("scripts/audit-pwa.mjs")]);

  const workflowPath = resolve(".github/workflows/deploy-pages.yml");
  assert.ok(existsSync(workflowPath), "Missing automatic Pages workflow");
  const workflow = readFileSync(workflowPath, "utf8");
  for (const required of [
    "push:",
    "branches:",
    "- main",
    "npm run build",
    "actions/configure-pages@v5",
    "actions/upload-pages-artifact@v4",
    "actions/deploy-pages@v4",
    "https://prego.potatoroad.lt/",
  ]) {
    assert.ok(
      workflow.includes(required),
      `Pages workflow is missing ${required}`,
    );
  }
  assert.match(
    workflow,
    /\r?\n  push:\r?\n    branches:\r?\n      - main(?:\r?\n|$)/,
    "The Pages workflow must deploy automatically for pushes to main",
  );
  assert.ok(
    !/\r?\n  pull_request:/.test(workflow),
    "The Pages workflow must not deploy pull requests",
  );
  for (const forbidden of [
    "npm run verify",
    "npm run test",
    "npm run check",
    "npm run audit",
    "playwright",
  ]) {
    assert.ok(
      !workflow.toLowerCase().includes(forbidden),
      `Pages workflow must remain deployment-only; found ${forbidden}`,
    );
  }
  assert.ok(
    !existsSync(resolve(".github/workflows/verify.yml")),
    "Cloud verification workflow must remain removed; verification is local-only",
  );
  assert.equal(
    readFileSync(resolve("public/CNAME"), "utf8").trim(),
    "prego.potatoroad.lt",
    "The generated artifact must carry the configured Pages custom domain",
  );
  console.log(
    "GitHub Pages configuration and automatic main-branch workflow audit passed.",
  );
} finally {
  rmSync(output, { recursive: true, force: true });
}
