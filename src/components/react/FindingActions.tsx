import { useEffect, useState } from "react";
import { usePreferences } from "@/components/react/usePreferences";
import { recentFindingsStorageKey } from "@/lib/storage";

export type RecentFinding = {
  id: string;
  title: string;
  summary: string;
  href: string;
  viewedAt: string;
};

const readRecentFindings = (): RecentFinding[] => {
  try {
    const value = localStorage.getItem(recentFindingsStorageKey);
    const parsed = value ? (JSON.parse(value) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as RecentFinding[]) : [];
  } catch {
    return [];
  }
};

export const saveRecentFinding = (finding: RecentFinding) => {
  const next = [
    finding,
    ...readRecentFindings().filter((item) => item.id !== finding.id),
  ].slice(0, 8);
  localStorage.setItem(recentFindingsStorageKey, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pregnancy-clearly:recent-findings"));
};

export const clearRecentFindings = () => {
  localStorage.removeItem(recentFindingsStorageKey);
  window.dispatchEvent(new CustomEvent("pregnancy-clearly:recent-findings"));
};

export { readRecentFindings };

interface Props {
  id: string;
  title: string;
  summary: string;
  href: string;
}

export default function FindingActions({ id, title, summary, href }: Props) {
  const { preferences, update, ready } = usePreferences();
  const [message, setMessage] = useState("");
  const bookmarkId = `finding:${id}`;
  const saved = preferences.bookmarks.includes(bookmarkId);

  useEffect(() => {
    saveRecentFinding({
      id,
      title,
      summary,
      href,
      viewedAt: new Date().toISOString(),
    });
  }, [href, id, summary, title]);

  const toggleSaved = () => {
    update((current) => ({
      ...current,
      bookmarks: current.bookmarks.includes(bookmarkId)
        ? current.bookmarks.filter((item) => item !== bookmarkId)
        : [...current.bookmarks, bookmarkId],
    }));
    setMessage(saved ? "Removed from saved answers." : "Saved on this device.");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, text: summary, url });
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setMessage("Link copied.");
      } else setMessage("The shareable link is in the address bar.");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError")
        setMessage("The shareable link is in the address bar.");
    }
  };

  return (
    <div className="finding-actions" aria-label="Finding actions">
      <button type="button" onClick={toggleSaved} disabled={!ready}>
        <span aria-hidden="true">{saved ? "★" : "☆"}</span>
        {saved ? "Saved" : "Save answer"}
      </button>
      <button type="button" onClick={share}>
        Share
      </button>
      <button type="button" onClick={() => window.print()}>
        Print answer
      </button>
      <p className="visually-hidden" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
