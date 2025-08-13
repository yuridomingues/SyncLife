from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from app.models.calendar_event import CalendarEvent
from app.schemas.calendar_event import CalendarEventCreate

async def create_event(session: AsyncSession, payload: CalendarEventCreate):
    ev = CalendarEvent(**payload.model_dump())
    session.add(ev)
    await session.commit()
    await session.refresh(ev)
    return ev

async def list_events_range(session: AsyncSession, start: date, end: date):
    q = select(CalendarEvent).where(CalendarEvent.date >= start, CalendarEvent.date <= end).order_by(CalendarEvent.date)
    res = await session.execute(q)
    return res.scalars().all()

async def list_events_for_year(session: AsyncSession, year: int):
    events = (await session.execute(select(CalendarEvent))).scalars().all()
    expanded = []
    from datetime import date as mkdate
    for ev in events:
        if ev.repeat_yearly:
            expanded.append(
                CalendarEvent(
                    id=ev.id, date=mkdate(year, ev.date.month, ev.date.day),
                    title=ev.title, description=ev.description, repeat_yearly=True
                )
            )
        if ev.date.year == year:
            expanded.append(ev)
    seen = set()
    unique = []
    for ev in expanded:
        key = (ev.id, ev.date)
        if key not in seen:
            seen.add(key)
            unique.append(ev)
    return sorted(unique, key=lambda e: e.date)
