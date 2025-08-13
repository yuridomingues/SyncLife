import { useMemo } from "react";
import { Table } from "react-bootstrap";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]; // 0..6
type Props = {
  startHour?: number; endHour?: number;
  onCellClick: (dayIndex: number, timeStr: string) => void;
  cellRenderer?: (dayIndex: number, timeStr: string) => React.ReactNode;
};

export default function ScheduleGrid({ startHour=6, endHour=22, onCellClick, cellRenderer }: Props) {
  const hours = useMemo(() => {
    const arr: string[] = [];
    for (let h = startHour; h <= endHour; h++) {
      arr.push(String(h).padStart(2, "0") + ":00");
    }
    return arr;
  }, [startHour, endHour]);

  return (
    <Table bordered responsive hover>
      <thead>
        <tr>
          <th style={{width:90}}>Hora</th>
          {DAYS.map((d, i) => <th key={i} className="text-center">{d}</th>)}
        </tr>
      </thead>
      <tbody>
        {hours.map((t) => (
          <tr key={t}>
            <td><strong>{t}</strong></td>
            {DAYS.map((_, dayIdx) => (
              <td key={dayIdx} style={{cursor: "pointer"}}
                  onClick={() => onCellClick(dayIdx, t)}>
                {cellRenderer?.(dayIdx, t)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
