export const anchorSlug = (value: string) => {
  const slug = value
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "note";
};

export const scopedAnchor = (scope: string, label: string) =>
  `${anchorSlug(scope)}-${anchorSlug(label)}`;
