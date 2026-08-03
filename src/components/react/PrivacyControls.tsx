import { useState } from "react";
import { clearPreferences } from "@/lib/storage";

export default function PrivacyControls() {
  const [cleared, setCleared] = useState(false);
  return (
    <div>
      <button
        className="button danger"
        type="button"
        onClick={() => {
          clearPreferences();
          setCleared(true);
          window.dispatchEvent(new Event("pregnancy-clearly:cleared"));
        }}
      >
        Clear all my local data
      </button>
      {cleared && (
        <p role="status" style={{ marginTop: "1rem" }}>
          Your saved dates, timeline, answers, recent findings and recent
          searches have been removed from this browser.
        </p>
      )}
    </div>
  );
}
