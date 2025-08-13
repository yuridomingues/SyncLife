from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from app.core.db import get_session
from app.schemas.calendar_event import CalendarEventCreate, CalendarEventRead
from app.services import calendar_service as svc

router = APIRouter()

@router.post("/events", response_model=CalendarEventRead, status_code=201)
async def create_event(payload: CalendarEventCreate, session: AsyncSession = Depends(get_session)):
    return await svc.create_event(session, payload)

@router.get("/events", response_model=list[CalendarEventRead])
async def list_events(start: date, end: date, session: AsyncSession = Depends(get_session)):
    return await svc.list_events_range(session, start, end)

@router.get("/events/year/{year}", response_model=list[CalendarEventRead])
async def events_for_year(year: int, session: AsyncSession = Depends(get_session)):
    return await svc.list_events_for_year(session, year)
