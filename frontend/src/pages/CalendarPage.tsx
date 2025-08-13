import { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import YearCalendar from "../components/YearCalendar";
import { CalendarEvent } from "../types";
import { createEvent, eventsForYear } from "../api";

export default function CalendarPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState<CalendarEvent>({ date: "", title: "", description: "", repeat_yearly: false });

  const refresh = async () => setEvents(await eventsForYear(year));

  useEffect(() => { refresh(); }, [year]);

  const onDayClick = (isoDate: string) => {
    setDraft({ date: isoDate, title: "", description: "", repeat_yearly: false });
    setShow(true);
  };

  const save = async () => {
    await createEvent(draft);
    setShow(false);
    await refresh();
  };

  return (
    <Container className="py-3">
      <div className="d-flex gap-2 align-items-center mb-3">
        <h3 className="mb-0">Calendário anual</h3>
        <Button variant="outline-secondary" onClick={() => setYear((y) => y-1)}>◀</Button>
        <Form.Control style={{width:100}} type="number" value={year} onChange={e => setYear(parseInt(e.target.value||`${year}`))} />
        <Button variant="outline-secondary" onClick={() => setYear((y) => y+1)}>▶</Button>
      </div>
      <YearCalendar year={year} events={events} onDayClick={onDayClick} />

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Novo evento — {draft.date}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Título</Form.Label>
              <Form.Control value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="Evento" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={3} value={draft.description ?? ""} onChange={e => setDraft({...draft, description: e.target.value})}/>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Repetir todo ano"
              checked={draft.repeat_yearly}
              onChange={e => setDraft({...draft, repeat_yearly: e.target.checked})}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button onClick={save}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
