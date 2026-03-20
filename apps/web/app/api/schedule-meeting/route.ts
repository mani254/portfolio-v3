import { NextResponse } from "next/server"
import { createMeeting } from "@/lib/google-calendar"
import { addMinutes } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

const IST_TIMEZONE = "Asia/Kolkata"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, dateTime, duration, timezone } = body

    if (!name || !email || !dateTime || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const startDateTime = new Date(dateTime)
    const durationNum = parseInt(duration, 10)
    const endDateTime = addMinutes(startDateTime, durationNum)

    // Validation for Asia/Kolkata (10 PM - 6 AM restriction)
    const istTimeStr = formatInTimeZone(startDateTime, IST_TIMEZONE, "HH")
    const hour = parseInt(istTimeStr, 10)

    // 6:00 AM to 10:00 PM Asia/Kolkata
    if (hour < 6 || hour >= 22) {
      return NextResponse.json(
        { error: "Meetings can only be scheduled between 6:00 AM and 10:00 PM IST." },
        { status: 400 }
      )
    }

    const meeting = await createMeeting({
      name,
      email,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      description: `
        Duration: ${duration} minutes
        User Timezone: ${timezone}
        Scheduled via Portfolio.
      `
    })

    return NextResponse.json({
      message: "Meeting scheduled successfully",
      meetingUrl: meeting.hangoutLink,
    })
  } catch (error: unknown) {
    console.error("Schedule meeting error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to schedule meeting"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
