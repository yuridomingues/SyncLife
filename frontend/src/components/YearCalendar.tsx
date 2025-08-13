import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Card } from "react-bootstrap";
import { CalendarEvent } from "../types";
dayjs.extend(isoWeek);

type Props = {
  year: number;
  events: CalendarEvent[];
  onDayClick?: (isoDate: string) => void;
};

export default function YearCalendar({ year, events, onDayClick }: Props) {
  const months = Array.from({ length: 12 }, (_, i) => i); // 0..11
  const mapByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const key = ev.date;
    const list = mapByDate.get(key) ?? [];
    list.push(ev); mapByDate.set(key, list);
  }

  return (
    <div className="d-grid gap-3" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
      {months.map(m => {
        const first = dayjs().year(year).month(m).date(1);
        const daysInMonth = first.daysInMonth();
        const label = first.format("MMMM YYYY");
        const padding = (first.isoWeekday() % 7);

        const cells: (number | null)[] = Array(padding).fill(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);

        return (
          <Card key={m} className="p-2">
            <strong>{label}</strong>
            <div className="mt-2 small text-muted">D S T Q Q S S</div>
            <div className="mt-1" style={{display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"4px"}}>
              {cells.map((d, idx) => {
                const iso = d ? first.date(d).format("YYYY-MM-DD") : "";
                const evs = d ? (mapByDate.get(iso) ?? []) : [];
                return (
                  <div key={idx}
                       onClick={() => d && onDayClick?.(iso)}
                       style={{minHeight:36, padding:4, border:"1px solid #eee", cursor: d? "pointer":"default"}}>
                    <div className="fw-semibold">{d ?? ""}</div>
                    {evs.slice(0,2).map((e, i) => (
                      <div key={i} className="text-truncate" title={e.title}>• {e.title}</div>
                    ))}
                    {evs.length > 2 && <div className="small">+{evs.length-2}</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
