"use client"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import * as React from "react"
import { ResponsiveOverlay } from "./ResponsiveOverlay"
import { ScheduleMeetingForm } from "./ScheduleMeetingForm"

export function ScheduleMeetingButton() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="cursor-pointer group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-background px-6 py-2.5 text-center font-medium text-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30"
      >
        <div className="flex items-center gap-3 relative z-10 transition-all duration-500 group-hover:opacity-0 group-hover:translate-x-12">
          {/* indicator dot */}
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />

          {/* default label */}
          <span className="text-sm font-medium tracking-wide">
            Schedule Meeting
          </span>
        </div>

        {/* Expansion Dot - Positioned over the pulse dot */}
        <div className="absolute left-[26px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary transition-all duration-500 ease-in-out group-hover:scale-[100] z-0" />

        {/* hover overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          <div className="flex items-center gap-2.5 whitespace-nowrap text-primary-foreground">
            <span className="leading-none font-bold text-xs uppercase tracking-widest">Schedule Now</span>
            <Calendar className="h-4 w-4" />
          </div>
        </div>
      </motion.button>

      <ResponsiveOverlay
        open={open}
        onOpenChange={setOpen}
        title="Schedule a Meeting"
        description="Pick a date and time that works for you. I'll send a Google Meet link to your email."
        className="p-2 md:p-8"
        drawerClassName="h-[95vh]"
      >
        <ScheduleMeetingForm onSuccess={() => setOpen(false)} />
      </ResponsiveOverlay>
    </>
  )
}
