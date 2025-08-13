from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.budget import Budget, Allocation
from app.schemas.budget import BudgetCreate, AllocationCreate, BudgetSummary

async def create_budget(session: AsyncSession, payload: BudgetCreate):
    b = Budget(month_ref=payload.month_ref, income=payload.income)
    session.add(b)
    await session.commit()
    await session.refresh(b)
    return b

async def add_allocation(session: AsyncSession, budget_id: int, payload: AllocationCreate):
    a = Allocation(budget_id=budget_id, name=payload.name, amount=payload.amount)
    session.add(a)
    await session.commit()
    await session.refresh(a)
    return a

async def get_budget(session: AsyncSession, budget_id: int):
    return await session.get(Budget, budget_id)

async def summary(session: AsyncSession, budget_id: int) -> BudgetSummary | None:
    b = await session.get(Budget, budget_id)
    if not b: return None
    q = select(func.coalesce(func.sum(Allocation.amount), 0.0)).where(Allocation.budget_id == budget_id)
    allocated = (await session.execute(q)).scalar_one()
    leftover = float(b.income) - float(allocated or 0.0)
    return BudgetSummary(id=b.id, month_ref=b.month_ref, income=b.income, allocated=allocated, leftover=leftover)
