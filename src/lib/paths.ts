const basePath = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Prefix a site-local path with Astro's configured deployment base. */
export function withBase(path: string): string {
  if (!path || path.startsWith("#") || /^(?:[a-z]+:)?\/\//i.test(path))
    return path;
  const localPath = `/${path.replace(/^\/+/, "")}`;
  if (basePath !== "/" && localPath.startsWith(basePath)) return localPath;
  return `${basePath}${localPath.slice(1)}`;
}
