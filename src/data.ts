const DAYS = 24 * 60 * 60 * 1000

export async function fetchData(saal: string, start: Date): Promise<Data> {
  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${saal}/events`)
  url.search = new URLSearchParams({
    key: "AIzaSyASFeQwgBWJRTztizLH3yG_BBXQiESGhLY",
    timeMin: start.toISOString(),
    timeMax: new Date(start.getTime() + 7 * DAYS).toISOString(),
    singleEvents: "true",
  }).toString()

  const response = await fetch(url)
  return response.json() as Promise<Data>
}

export interface TimeStamp {
  dateTime: string
  timeZone: string
}

export interface EventData {
  id: string
  summary: string
  start: TimeStamp
  end: TimeStamp
  location: string
}

export interface Data {
  items: Array<EventData>
}
