import { useEffect, useState } from 'react'
import './Calendar.css'
import Event from './Event.tsx'
import { Data, fetchData } from './data.ts'

const DAYS = 24 * 60 * 60 * 1000

const DAY_FMT = new Intl.DateTimeFormat("de-DE", { dateStyle: "full" })

function startOfWeek(date: Date): Date {
  const day = (date.getDay() + 6) % 7 // Use Monday as first day of the week
  return new Date(date.getTime() - day * DAYS)
}

export default function Calendar() {
  const [date, setDate] = useState(startOfWeek(new Date()))

  const [data1, setData1] = useState<Data>()
  const [data2, setData2] = useState<Data>()
  const [data3, setData3] = useState<Data>()

  useEffect(() => {
    const saal1 = "cafed7a0ea7ede3dc2abdcb1af7a8ce7de4a0348508655510ec673a6a2097ba0%40group.calendar.google.com"
    const saal2 = "23f000f0d58614525d3995bad740adee45252d2381a5c7a25b2e7a6710ad48e8%40group.calendar.google.com"
    const saal3 = "f8af0ec05dc660695eca9dfb723beb221ffd05369b4f0550eca64e2dac195442%40group.calendar.google.com"

    fetchData(saal1, date).then(setData1).catch(console.error)
    fetchData(saal2, date).then(setData2).catch(console.error)
    fetchData(saal3, date).then(setData3).catch(console.error)
  }, [date])


  return <>
    <div style={{ position: "fixed" }}>
      <button onClick={() => setDate(new Date(date.getTime() - 7 * DAYS))}>{"<"}</button>
      <button onClick={() => setDate(new Date())}>•</button>
      <button onClick={() => setDate(new Date(date.getTime() + 7 * DAYS))}>{">"}</button>
    </div>

    <div className="calendar">
      {[...Array(7).keys()].map(day =>
        <div className="day" key={day} style={{
          gridColumn: `${day * 3 + 2} / span 3`
        }}>{DAY_FMT.format(date.getTime() + day * DAYS)}</div>
      )}
      {[...Array(16).keys()].map(hour =>
        <div className="hour" key={hour} style={{
          gridRow: hour * 4 + 2,
        }}>{hour + 8}:00</div>
      )}
      {data1?.items.map((event) => <Event event={event} key={event.id} saal={1} />)}
      {data2?.items.map((event) => <Event event={event} key={event.id} saal={2} />)}
      {data3?.items.map((event) => <Event event={event} key={event.id} saal={3} />)}
    </div>
  </>
}
