# SyncLife — Agenda Semanal, Calendário e Finanças

Projeto **web responsivo e interativo** com **FastAPI** (backend) e **React + Vite + TypeScript** (frontend).
Gerenciador de pacotes Python: **uv**. Banco: **SQLite**.

## Visão rápida
- **/backend**: API FastAPI com boas práticas (models, schemas, services, routers), SQLite, SQLAlchemy 2.x async.
- **/frontend**: React + TS + Vite + React-Bootstrap (UI), axios (API).
- **Páginas**:
  1. **Agenda Semanal**: tabela (dias x horas) com **modal** para criar/editar rotina e **subtarefas**.
  2. **Calendário Anual**: meses janeiros a dezembro, anos navegáveis; eventos que **podem repetir todo ano**.
  3. **Gerenciador de Dinheiro**: renda, alocações e simulador de rendimento a **100%–102% do CDI** com taxa anual informada.

---

## Requisitos
- Python 3.11+ e **uv**: https://docs.astral.sh/uv/
- Node 18+ e npm

---

## Como rodar (dev)

### 1) Backend (FastAPI)
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
# API em http://localhost:8000/docs
```

### 2) Frontend (Vite React)
```bash
cd frontend
npm install
npm run dev
# App em http://localhost:5173
```

> A CORS já está liberada para `http://localhost:5173`.

---

## Endpoints principais

- **Rotinas**
  - `GET /routines?day_of_week=0..6` → lista do dia
  - `POST /routines` → cria rotina com subtarefas
  - `PUT /routines/{id}` → edita título/notas/subtarefas
  - `DELETE /routines/{id}`

- **Calendário**
  - `POST /calendar/events` → cria evento (c/ `repeat_yearly` opcional)
  - `GET /calendar/events?start=YYYY-MM-DD&end=YYYY-MM-DD` → por intervalo
  - `GET /calendar/events/year/{year}` → expande recorrentes para o ano

- **Finanças**
  - `POST /finance/cdi-projection` body `{ principal, months, cdi_annual_rate, percent_of_cdi }`
    → `{ monthly_rate_effective, fv, total_yield }`

---

## Estrutura
```
backend/
  app/
    core/ db.py
    models/ routine.py calendar_event.py budget.py
    schemas/ routine.py calendar_event.py budget.py
    services/ routine_service.py calendar_service.py budget_service.py
    routers/ routines.py calendar.py finance.py
    main.py
frontend/
  src/
    components/ ScheduleGrid.tsx RoutineModal.tsx YearCalendar.tsx
    pages/ SchedulePage.tsx CalendarPage.tsx MoneyManagerPage.tsx
    api.ts types.ts App.tsx main.tsx
  index.html vite.config.ts tsconfig.json tsconfig.node.json package.json
```

---

## Notas de produção
- Adicione Alembic para migrações de banco.
- Inclua autenticação se precisar de multiusuário (ex.: JWT + usuários/tokens).
- Crie Dockerfiles e um docker-compose para subir tudo em rede local.
- Melhorar interface

Bom proveito! 🚀
