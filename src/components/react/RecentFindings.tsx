import { useEffect, useMemo, useState } from "react";
import {
  clearRecentFindings,
  readRecentFindings,
  type RecentFinding,
} from "@/components/react/FindingActions";
import { usePreferences } from "@/components/react/usePreferences";
import { withBase } from "@/lib/paths";

interface CatalogItem {
  id: string;
  title: string;
  summary: string;
  href: string;
}

export default function RecentFindings({
  catalog,
}: {
  catalog: CatalogItem[];
}) {
  const { preferences, ready } = usePreferences();
  const [recent, setRecent] = useState<RecentFinding[]>([]);

  useEffect(() => {
    const sync = () => setRecent(readRecentFindings());
    sync();
    window.addEventListener("pregnancy-clearly:recent-findings", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pregnancy-clearly:recent-findings", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const saved = useMemo(() => {
    const ids = new Set(
      preferences.bookmarks
        .filter((item) => item.startsWith("finding:"))
        .map((item) => item.slice("finding:".length)),
    );
    return catalog.filter((item) => ids.has(item.id));
  }, [catalog, preferences.bookmarks]);

  if (!ready || (!recent.length && !saved.length)) return null;

  return (
    <section
      className="personal-finding-shelf"
      aria-labelledby="your-answers-title"
    >
      <div className="personal-finding-shelf-heading">
        <div>
          <p className="eyebrow">Private on this device</p>
          <h2 id="your-answers-title">Your answers</h2>
        </div>
        <p>Recently viewed and saved findings never leave this browser.</p>
      </div>
      <div className="personal-finding-columns">
        {recent.length ? (
          <section aria-labelledby="recent-findings-title">
            <div className="personal-finding-column-heading">
              <h3 id="recent-findings-title">Recently viewed</h3>
              <button type="button" onClick={() => clearRecentFindings()}>
                Clear
              </button>
            </div>
            <ul>
              {recent.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <a href={withBase(item.href)}>{item.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {saved.length ? (
          <section aria-labelledby="saved-findings-title">
            <h3 id="saved-findings-title">Saved answers</h3>
            <ul>
              {saved.slice(0, 8).map((item) => (
                <li key={item.id}>
                  <a href={withBase(item.href)}>{item.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </section>
  );
}
