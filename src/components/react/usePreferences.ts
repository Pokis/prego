import { useEffect, useState } from "react";
import {
  defaultPreferences,
  loadPreferences,
  savePreferences,
} from "@/lib/storage";
import type { UserPreferences } from "@/lib/types";

export function usePreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPreferences(loadPreferences());
    setReady(true);

    const syncPreferences = (event: Event) => {
      const next = (event as CustomEvent<UserPreferences>).detail;
      setPreferences(next ?? loadPreferences());
    };
    const syncFromStorage = () => setPreferences(loadPreferences());

    window.addEventListener("pregnancy-clearly:preferences", syncPreferences);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener(
        "pregnancy-clearly:preferences",
        syncPreferences,
      );
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const update = (
    next: UserPreferences | ((current: UserPreferences) => UserPreferences),
  ) => {
    setPreferences((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      savePreferences(resolved);
      window.dispatchEvent(
        new CustomEvent("pregnancy-clearly:preferences", { detail: resolved }),
      );
      return resolved;
    });
  };

  return { preferences, update, ready };
}
