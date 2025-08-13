import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ScheduleGrid from "../components/ScheduleGrid";
import RoutineModal from "../components/RoutineModal";
import { Routine } from "../types";
import { listRoutinesByDay, createRoutine, updateRoutine } from "../api";

export default function SchedulePage() {
  const [data, setData] = useState<Record<number, Routine[]>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  const fetchDay = async (dayIdx: number) => {
    const r = await listRoutinesByDay(dayIdx);
    setData(prev => ({ ...prev, [dayIdx]: r }));
  };

  useEffect(() => {
    for (let i=0;i<7;i++) fetchDay(i);
  }, []);

  const gridRenderer = (dayIdx: number, timeStr: string) => {
    const items = data[dayIdx]?.filter(r => r.time_str === timeStr) ?? [];
    if (!items.length) return <span className="text-muted">—</span>;
    return (
      <div>
        {items.map((r) => (
          <div key={r.id}
               className="text-truncate"
               onClick={(e) => { e.stopPropagation(); setEditing(r); setModalOpen(true); }}>
            <strong>{r.title}</strong>
            {r.subtasks?.length ? <div className="small text-muted">{r.subtasks.length} subtarefa(s)</div> : null}
          </div>
        ))}
      </div>
    );
  };

  const openCreate = (dayIdx: number, timeStr: string) => {
    const base: Routine = { day_of_week: dayIdx, time_str: timeStr, title: "", notes: "", subtasks: [] };
    setEditing(base);
    setModalOpen(true);
  };

  const saveRoutine = async (r: Routine) => {
    if (r.id) {
      await updateRoutine(r.id, { title: r.title, notes: r.notes, subtasks: r.subtasks });
    } else {
      await createRoutine(r);
    }
    await fetchDay(r.day_of_week);
    setModalOpen(false);
  };

  return (
    <Container className="py-3">
      <h3>Agenda semanal</h3>
      <p className="text-muted">Clique numa célula para criar. Clique no item para editar.</p>
      <ScheduleGrid
        onCellClick={(day, time) => openCreate(day, time)}
        cellRenderer={gridRenderer}
      />
      {editing && (
        <RoutineModal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          initial={editing}
          onSave={saveRoutine}
        />
      )}
    </Container>
  );
}
