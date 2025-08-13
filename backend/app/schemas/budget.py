from pydantic import BaseModel, Field, ConfigDict
from typing import List

class AllocationBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    amount: float = Field(ge=0)

class AllocationCreate(AllocationBase): pass

class AllocationRead(AllocationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BudgetCreate(BaseModel):
    month_ref: str = Field(pattern=r"^\d{4}-\d{2}$")
    income: float = Field(ge=0)

class BudgetRead(BudgetCreate):
    id: int
    allocations: List[AllocationRead] = []
    model_config = ConfigDict(from_attributes=True)

class BudgetSummary(BaseModel):
    id: int
    month_ref: str
    income: float
    allocated: float
    leftover: float
