"use client"

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"

export function ScheduleMeetingForm() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi()
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  return (
    <div className="w-full min-h-[600px] bg-background rounded-xl overflow-hidden border border-primary/10">
      <Cal
        calLink="sai-manikanta-mamidi-azzmtf/30min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  )
}
