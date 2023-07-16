import { EventData } from './data'
import './Event.css'

const TIME_FMT = new Intl.DateTimeFormat("de-DE", { timeStyle: "short" })

export default function Event({ event, saal }: { event: EventData, saal: number }) {
  const start = new Date(event.start?.dateTime)
  const end = new Date(event.end?.dateTime)

  let type = "unknown"

  if (event.summary.match(/(Std|Standard)/i)) { type = "standard" }
  if (event.summary.match(/(Lat|Latein)/i)) { type = "latein" }
  if (event.summary.match(/Breitensport/i)) { type = "breitensport" }

  return <div className={`event ${type}`} style={{
    gridRowStart: start.getHours() * 4 + start.getMinutes() / 15 + 2 - 32,
    gridRowEnd: end.getHours() * 4 + end.getMinutes() / 15 + 2 - 32,
    gridColumn: (start.getDay() + 6) % 7 * 3 + saal + 1,
  }}>
    <header>{TIME_FMT.format(start)} – {TIME_FMT.format(end)}</header>
    <p title={event.summary}>{event.summary}</p>
  </div >
}
