import { useMemo, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { cdiProjection } from "../api";

type Allocation = { name: string; amount: number; };

export default function MoneyManagerPage() {
  const [income, setIncome] = useState<number>(0);
  const [allocs, setAllocs] = useState<Allocation[]>([]);
  const [newName, setNewName] = useState(""); const [newAmount, setNewAmount] = useState<number>(0);

  const allocated = useMemo(() => allocs.reduce((s,a)=>s+(a.amount||0), 0), [allocs]);
  const leftover = useMemo(() => (income || 0) - allocated, [income, allocated]);

  const addAlloc = () => {
    if (!newName.trim()) return;
    setAllocs([...allocs, { name: newName.trim(), amount: Number(newAmount||0) }]);
    setNewName(""); setNewAmount(0);
  };

  // Simulador CDI
  const [principal, setPrincipal] = useState<number>(0);
  const [months, setMonths] = useState<number>(12);
  const [cdiAnnual, setCdiAnnual] = useState<number>(0.10);
  const [pctCdi, setPctCdi] = useState<number>(1.02);
  const [result, setResult] = useState<{ monthly_rate_effective: number; fv: number; total_yield: number } | null>(null);

  const simulate = async () => {
    const res = await cdiProjection({
      principal: Number(principal||0),
      months: Number(months||1),
      cdi_annual_rate: Number(cdiAnnual||0),
      percent_of_cdi: Number(pctCdi||1),
    });
    setResult(res);
  };

  return (
    <Container className="py-3">
      <h3>Gerenciador de dinheiro</h3>

      <Row className="mt-3">
        <Col md={6}>
          <h5>Renda e alocações</h5>
          <Form.Group className="mb-2">
            <Form.Label>Renda mensal (R$)</Form.Label>
            <Form.Control type="number" value={income} onChange={e => setIncome(Number(e.target.value||0))}/>
          </Form.Group>

          <div className="d-flex gap-2">
            <Form.Control placeholder="Categoria (ex: Aluguel)" value={newName} onChange={e => setNewName(e.target.value)} />
            <Form.Control type="number" placeholder="Valor" value={newAmount} onChange={e => setNewAmount(Number(e.target.value||0))}/>
            <Button onClick={addAlloc}>Adicionar</Button>
          </div>

          <Table bordered size="sm" className="mt-3">
            <thead><tr><th>Categoria</th><th>Valor (R$)</th></tr></thead>
            <tbody>
              {allocs.map((a,i)=>(
                <tr key={i}><td>{a.name}</td><td>{a.amount.toFixed(2)}</td></tr>
              ))}
              <tr><td><strong>Total alocado</strong></td><td><strong>{allocated.toFixed(2)}</strong></td></tr>
              <tr><td><strong>Sobra</strong></td><td><strong>{leftover.toFixed(2)}</strong></td></tr>
            </tbody>
          </Table>
        </Col>

        <Col md={6}>
          <h5>Simulador CDI (100%–102%)</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Aplicação inicial (R$)</Form.Label>
                <Form.Control type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value||0))}/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Meses</Form.Label>
                <Form.Control type="number" value={months} onChange={e => setMonths(Number(e.target.value||1))}/>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Taxa CDI anual (ex: 0.1065 = 10.65%)</Form.Label>
                <Form.Control type="number" step="0.0001" value={cdiAnnual} onChange={e => setCdiAnnual(Number(e.target.value||0))}/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>% do CDI (1.00–1.02)</Form.Label>
                <Form.Control type="number" step="0.01" value={pctCdi} onChange={e => setPctCdi(Number(e.target.value||1))}/>
              </Form.Group>
            </Col>
          </Row>

          <Button onClick={simulate}>Calcular</Button>

          {result && (
            <div className="mt-3">
              <div>Taxa efetiva mensal: {(result.monthly_rate_effective*100).toFixed(3)}%</div>
              <div>Valor futuro: R$ {result.fv.toFixed(2)}</div>
              <div>Rendimento: R$ {result.total_yield.toFixed(2)}</div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
