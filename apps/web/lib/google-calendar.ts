import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/calendar"]

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: SCOPES,
})

const calendar = google.calendar({ version: "v3", auth })

export async function createMeeting({
  name,
  email,
  startTime,
  endTime,
  description = "",
}: {
  name: string
  email: string
  startTime: string
  endTime: string
  description?: string
}) {
  try {
    const event = {
      summary: `Meeting with ${name}`,
      description: description || `Scheduled meeting with ${name} (${email}) via Portfolio.`,
      start: {
        dateTime: startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime,
        timeZone: "UTC",
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    })

    return response.data
  } catch (error) {
    console.error("Error creating Google Calendar event:", error)
    throw error
  }
}
