from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.schemas.routine import RoutineCreate, RoutineRead, RoutineUpdate
from app.services import routine_service as svc

router = APIRouter()

@router.get("/", response_model=list[RoutineRead])
async def list_for_day(day_of_week: int, session: AsyncSession = Depends(get_session)):
    return await svc.list_by_day(session, day_of_week)

@router.post("/", response_model=RoutineRead, status_code=201)
async def create(payload: RoutineCreate, session: AsyncSession = Depends(get_session)):
    return await svc.upsert(session, payload)

@router.put("/{routine_id}", response_model=RoutineRead)
async def update(routine_id: int, payload: RoutineUpdate, session: AsyncSession = Depends(get_session)):
    r = await svc.get_one(session, routine_id)
    if not r:
        raise HTTPException(404, "Routine not found")
    return await svc.update(session, r, payload)

@router.delete("/{routine_id}", status_code=204)
async def delete(routine_id: int, session: AsyncSession = Depends(get_session)):
    r = await svc.get_one(session, routine_id)
    if not r:
        raise HTTPException(404, "Routine not found")
    await svc.remove(session, r)
