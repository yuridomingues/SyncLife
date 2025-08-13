import { Container, Nav, Navbar } from "react-bootstrap";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import SchedulePage from "./pages/SchedulePage";
import CalendarPage from "./pages/CalendarPage";
import MoneyManagerPage from "./pages/MoneyManagerPage";

export default function App() {
  return (
    <>
      <Navbar bg="light" className="mb-3">
        <Container>
          <Navbar.Brand as={Link} to="/">SyncLife</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/schedule">Agenda</Nav.Link>
            <Nav.Link as={Link} to="/calendar">Calendário</Nav.Link>
            <Nav.Link as={Link} to="/money">Finanças</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/schedule" replace />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/money" element={<MoneyManagerPage />} />
        </Routes>
      </Container>
    </>
  );
}
