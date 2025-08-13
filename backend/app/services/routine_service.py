from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.routine import Routine, SubTask
from app.schemas.routine import RoutineCreate, RoutineUpdate

async def list_by_day(session: AsyncSession, day_of_week: int):
    q = select(Routine).where(Routine.day_of_week == day_of_week).order_by(Routine.time_str)
    res = await session.execute(q)
    return res.scalars().unique().all()

async def get_one(session: AsyncSession, routine_id: int):
    return await session.get(Routine, routine_id)

async def upsert(session: AsyncSession, payload: RoutineCreate):
    routine = Routine(
        day_of_week=payload.day_of_week,
        time_str=payload.time_str,
        title=payload.title,
        notes=payload.notes,
    )
    session.add(routine)
    await session.flush()
    for idx, st in enumerate(payload.subtasks):
        session.add(SubTask(routine_id=routine.id, title=st.title, order_index=st.order_index or idx))
    await session.commit()
    await session.refresh(routine)
    return routine

async def update(session: AsyncSession, routine: Routine, payload: RoutineUpdate):
    if payload.title is not None: routine.title = payload.title
    if payload.notes is not None: routine.notes = payload.notes
    if payload.subtasks is not None:
        await session.execute(delete(SubTask).where(SubTask.routine_id == routine.id))
        for idx, st in enumerate(payload.subtasks):
            session.add(SubTask(routine_id=routine.id, title=st.title, order_index=st.order_index or idx))
    await session.commit()
    await session.refresh(routine)
    return routine

async def remove(session: AsyncSession, routine: Routine):
    await session.delete(routine)
    await session.commit()
