const DAYS = 24 * 60 * 60 * 1000

const FLOORS: Record<number, string> = {
  1: "cafed7a0ea7ede3dc2abdcb1af7a8ce7de4a0348508655510ec673a6a2097ba0%40group.calendar.google.com",
  2: "23f000f0d58614525d3995bad740adee45252d2381a5c7a25b2e7a6710ad48e8%40group.calendar.google.com",
  3: "f8af0ec05dc660695eca9dfb723beb221ffd05369b4f0550eca64e2dac195442%40group.calendar.google.com"
}

export async function fetchCalendar(floor: number, start: Date): Promise<EventData[]> {
  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${FLOORS[floor]}/events`)
  url.search = new URLSearchParams({
    key: "AIzaSyASFeQwgBWJRTztizLH3yG_BBXQiESGhLY",
    timeMin: start.toISOString(),
    timeMax: new Date(start.getTime() + 7 * DAYS).toISOString(),
    singleEvents: "true",
  }).toString()

  const response = await fetch(url)
  const data = await response.json() as Data
  return data.items.map(item => ({
    ...item,
    floor: floor,
  }))
}

function groupBy<T>(arr: T[], fn: (item: T) => string) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr)
    const group = prev[groupKey] || []
    group.push(curr)
    return { ...prev, [groupKey]: group }
  }, {})
}

export async function fetchData(start: Date): Promise<[number[], EventData][]> {
  const events = (await Promise.all(Object.keys(FLOORS).map(floor => fetchCalendar(+floor, start)))).flat()
  const eventGroups = groupBy(events, event => event.start.dateTime + "|" + event.summary.trim())
  return Object.values(eventGroups).map(group => [group.map(event => event.floor), group[0]])
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
  floor: number
}

interface Data {
  items: Array<EventData>
}
