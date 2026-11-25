"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export interface ScheduleMeetingFormProps {
  onSuccess?: () => void;
}

export function ScheduleMeetingForm({ onSuccess }: ScheduleMeetingFormProps = {}) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: {
          branding: { brandColor: "#111827" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div
      style={{ colorScheme: "light" }}
      data-theme="light"
      className="w-full min-h-[580px] bg-white rounded-2xl overflow-hidden"
    >
      <Cal
        calLink="sai-manikanta-mamidi-azzmtf/30min"
        style={{ width: "100%", height: "100%", minHeight: "560px", overflow: "auto" }}
        config={{ layout: "month_view", theme: "light" }}
      />
    </div>
  );
}
