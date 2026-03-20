"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addMinutes, endOfDay, format, isBefore, isSameDay, startOfDay } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import * as React from "react"
import { Calendar } from "../ui/calendar"

interface DateTimePickerProps {
  date: Date | undefined
  onChange: (date: Date | undefined) => void
  timezone?: string
}

const IST_TIMEZONE = "Asia/Kolkata"

export function DateTimePicker({ date, onChange, timezone = Intl.DateTimeFormat().resolvedOptions().timeZone }: DateTimePickerProps) {
  const [is24h, setIs24h] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  const slots = React.useMemo(() => {
    if (!selectedDate) return []

    // Get the start and end of the day in the selected timezone
    const dayStart = startOfDay(selectedDate)
    const dayEnd = endOfDay(selectedDate)

    const res = []
    let current = dayStart

    while (current <= dayEnd) {
      // Check if this specific time in IST falls within 6 AM - 10 PM
      const istHour = parseInt(formatInTimeZone(current, IST_TIMEZONE, "H"), 10)

      const isWithinIstWorkingHours = istHour >= 6 && istHour < 22

      if (isWithinIstWorkingHours) {
        // Also ensure it's not in the past relative to now
        if (current > new Date()) {
          res.push(new Date(current))
        }
      }
      current = addMinutes(current, 30)
    }
    return res
  }, [selectedDate])

  return (
    <div className="flex md:flex-row flex-col gap-2 rounded-xl overflow-hidden pointer-events-auto">
      <div className="w-full bg-card border border-primary/10 rounded-xl p-4 shadow-sm">
        {/* <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold capitalize px-1">
            {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select Date"}
          </h3>
        </div> */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => {
            setSelectedDate(d)
          }}
          disabled={(date) => isBefore(date, startOfDay(new Date()))}
          className="rounded-md border-0 p-0 shadow-none w-full"
        // style={{
        // }}
        />
      </div>

      <div className="w-full md:max-w-[200px] flex flex-col bg-card border border-primary/10 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-muted-foreground">
              {selectedDate ? format(selectedDate, "EEE dd") : "Time Slots"}
            </h3>
            <span className="text-[10px] text-primary/60 font-medium uppercase tracking-tight">
              Timezone: {timezone}
            </span>
          </div>
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setIs24h(false)}
              className={cn(
                "px-2 py-1 text-[10px] rounded-md transition-all",
                !is24h ? "bg-background shadow-sm" : "hover:bg-background/20"
              )}
            >
              12h
            </button>
            <button
              type="button"
              onClick={() => setIs24h(true)}
              className={cn(
                "px-2 py-1 text-[10px] rounded-md transition-all",
                is24h ? "bg-background shadow-sm" : "hover:bg-background/20"
              )}
            >
              24h
            </button>
          </div>
        </div>

        <div
          className="h-[270px] overflow-y-auto no-scrollbar pr-2"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap md:flex-col gap-2">
            {slots.length > 0 ? (
              slots.map((slot) => {
                const isSelected = date && format(slot, "HH:mm") === format(date, "HH:mm") && isSameDay(slot, date)
                return (
                  <Button
                    key={slot.toISOString()}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "md:w-full md:justify-center text-xs font-medium px-2 py-4 rounded-lg transition-all",
                      !isSelected && "hover:bg-primary/10 hover:border-primary/50"
                    )}
                    onClick={() => {
                      const newDate = new Date(selectedDate!)
                      newDate.setHours(slot.getHours())
                      newDate.setMinutes(slot.getMinutes())
                      newDate.setSeconds(0)
                      onChange(newDate)
                    }}
                  >
                    {formatInTimeZone(slot, timezone, is24h ? "HH:mm" : "hh:mm a")}
                  </Button>
                )
              })
            ) : (
              <div className="text-center text-muted-foreground text-xs py-10">
                No available {selectedDate ? "slots" : "date selected"}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
