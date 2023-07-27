import { useEffect, useState } from 'react'
import './Calendar.css'
import Event from './Event.tsx'
import { EventData, fetchData } from './data.ts'

const DAYS = 24 * 60 * 60 * 1000

const DAY_FMT = new Intl.DateTimeFormat("de-DE", { dateStyle: "full" })

function startOfWeek(date: Date): Date {
  date.setHours(0, 0, 0, 0) // Go to start of day
  const day = (date.getDay() + 6) % 7 // Use Monday as first day of the week
  return new Date(date.getTime() - day * DAYS) // Go to start of week
}

export default function Calendar() {
  const [date, setDate] = useState(startOfWeek(new Date()))
  const [events, setEvents] = useState<[number[], EventData][]>()

  useEffect(() => {
    fetchData(date).then(setEvents).catch(console.error)
  }, [date])

  return <>
    <div style={{ position: "fixed" }}>
      <button onClick={() => setDate(new Date(date.getTime() - 7 * DAYS))}>{"<"}</button>
      <button onClick={() => setDate(new Date())}>•</button>
      <button onClick={() => setDate(new Date(date.getTime() + 7 * DAYS))}>{">"}</button>
    </div>

    <div className="calendar">
      {[...Array(7).keys()].map(day => <>
        <div className="day" key={day} style={{
          gridColumn: `${day * 3 + 2} / span 3`
        }}>{DAY_FMT.format(date.getTime() + day * DAYS)}</div>
        <div className="floor" style={{ gridColumn: `${day * 3 + 2}` }}>Saal 1</div>
        <div className="floor" style={{ gridColumn: `${day * 3 + 3}` }}>Saal 2</div>
        <div className="floor" style={{ gridColumn: `${day * 3 + 4}` }}>Saal 3</div>
      </>
      )}
      {[...Array(16).keys()].map(hour =>
        <div className="hour" key={hour} style={{
          gridRow: hour * 4 + 2,
        }}>{hour + 8}:00</div>
      )}
      {events?.map(event => <Event event={event[1]} floors={event[0]} key={event[1].id} />)}
    </div>
  </>
}
