const DEFAULT_SITE = "https://pregnancy-clearly.example";

const nonEmpty = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
};

export const normalizeBasePath = (value = "/") => {
  const normalized = String(value).trim();
  if (!normalized || normalized === "/") return "/";
  return `/${normalized.replace(/^\/+|\/+$/g, "")}/`;
};

const normalizeSiteUrl = (value) => {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol))
    throw new Error("SITE_URL must use http or https");
  return url.origin;
};

/**
 * Resolve one canonical origin and base path for local/static hosting.
 *
 * GitHub project Pages defaults to /repository/. A user/organization Pages
 * repository named owner.github.io and an explicit custom domain default to /.
 * SITE_URL and BASE_PATH always override automatic GitHub detection.
 */
export function resolveDeploymentConfig(env = process.env) {
  const explicitSite = nonEmpty(env.SITE_URL);
  const explicitBase = nonEmpty(env.BASE_PATH);
  const [repositoryOwnerFromSlug, repositoryName] = nonEmpty(
    env.GITHUB_REPOSITORY,
  )?.split("/") ?? [undefined, undefined];
  const repositoryOwner =
    nonEmpty(env.GITHUB_REPOSITORY_OWNER) ?? repositoryOwnerFromSlug;
  const githubPages =
    env.GITHUB_PAGES === "true" && repositoryOwner && repositoryName;
  const githubHost = repositoryOwner
    ? `${repositoryOwner.toLowerCase()}.github.io`
    : undefined;
  const userSiteRepository =
    githubHost && repositoryName?.toLowerCase() === githubHost;
  const site = normalizeSiteUrl(
    explicitSite ?? (githubPages ? `https://${githubHost}` : DEFAULT_SITE),
  );
  const explicitCustomDomain =
    Boolean(explicitSite) &&
    Boolean(githubHost) &&
    new URL(site).hostname.toLowerCase() !== githubHost;
  const base = explicitBase
    ? normalizeBasePath(explicitBase)
    : githubPages && !userSiteRepository && !explicitCustomDomain
      ? normalizeBasePath(repositoryName)
      : "/";

  return {
    site,
    base,
    outDir: nonEmpty(env.OUT_DIR) ?? "./dist",
    target:
      githubPages && explicitCustomDomain
        ? "github-custom-domain"
        : githubPages && userSiteRepository
          ? "github-user-site"
          : githubPages
            ? "github-project-site"
            : "generic-static",
  };
}
