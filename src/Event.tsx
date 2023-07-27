import { EventData } from './data'
import './Event.css'

const TIME_FMT = new Intl.DateTimeFormat("de-DE", { timeStyle: "short" })

export default function Event({ event, floors }: { event: EventData, floors: number[] }) {
  const start = new Date(event.start?.dateTime)
  const end = new Date(event.end?.dateTime)

  let type = "unknown"
  if (event.summary.match(/(Std|Standard)/i)) { type = "standard" }
  if (event.summary.match(/(Lat|Latein)/i)) { type = "latein" }
  if (event.summary.match(/Breitensport/i)) { type = "breitensport" }

  const row = (time: Date) => time.getHours() * 4 + time.getMinutes() / 15 + 2 - 32
  const col = (time: Date, floor: number) => (time.getDay() + 6) % 7 * 3 + 1 + floor

  return <div className={`event ${type}`} style={{
    gridRowStart: row(start),
    gridRowEnd: row(end),
    gridColumnStart: col(start, Math.min(...floors)),
    gridColumnEnd: col(end, Math.max(...floors) + 1),
  }}>
    <header>{TIME_FMT.format(start)} – {TIME_FMT.format(end)}</header>
    <p title={event.summary}>{event.summary}</p>
  </div >
}
