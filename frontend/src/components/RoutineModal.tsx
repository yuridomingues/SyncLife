import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Routine, SubTask } from "../types";

type Props = {
  show: boolean;
  onClose: () => void;
  initial: Routine;
  onSave: (routine: Routine) => Promise<void>;
};

export default function RoutineModal({ show, onClose, initial, onSave }: Props) {
  const [routine, setRoutine] = useState<Routine>(initial);

  useEffect(() => setRoutine(initial), [initial, show]);

  const addSub = () => {
    const s: SubTask = { title: "", order_index: routine.subtasks.length };
    setRoutine({ ...routine, subtasks: [...routine.subtasks, s] });
  };

  const updateSub = (idx: number, field: keyof SubTask, val: any) => {
    const list = routine.subtasks.slice();
    list[idx] = { ...list[idx], [field]: val };
    setRoutine({ ...routine, subtasks: list });
  };

  const removeSub = (idx: number) => {
    const list = routine.subtasks.slice();
    list.splice(idx, 1);
    setRoutine({ ...routine, subtasks: list });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {routine.id ? "Editar rotina" : "Nova rotina"} — {routine.time_str}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              value={routine.title}
              onChange={e => setRoutine({ ...routine, title: e.target.value })}
              placeholder="Acordar"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={routine.notes ?? ""}
              onChange={e => setRoutine({ ...routine, notes: e.target.value })}
              placeholder="Observações..."
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Subtarefas</strong>
            <Button size="sm" onClick={addSub}>Adicionar</Button>
          </div>

          {routine.subtasks.map((st, idx) => (
            <InputGroup className="mb-2" key={idx}>
              <Form.Control
                value={st.title}
                onChange={e => updateSub(idx, "title", e.target.value)}
                placeholder={`Subtarefa ${idx+1}`}
              />
              <Button variant="outline-danger" onClick={() => removeSub(idx)}>Remover</Button>
            </InputGroup>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(routine)}>Salvar</Button>
      </Modal.Footer>
    </Modal>
  );
}
