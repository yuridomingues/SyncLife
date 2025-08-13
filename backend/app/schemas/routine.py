from pydantic import BaseModel, Field, ConfigDict
from typing import List

class SubTaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    order_index: int = 0

class SubTaskCreate(SubTaskBase): pass

class SubTaskRead(SubTaskBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class RoutineBase(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    time_str: str = Field(pattern=r"^\d{2}:\d{2}$")
    title: str = Field(min_length=1, max_length=120)
    notes: str | None = None

class RoutineCreate(RoutineBase):
    subtasks: List[SubTaskCreate] = []

class RoutineUpdate(BaseModel):
    title: str | None = None
    notes: str | None = None
    subtasks: List[SubTaskCreate] | None = None

class RoutineRead(RoutineBase):
    id: int
    subtasks: List[SubTaskRead] = []
    model_config = ConfigDict(from_attributes=True)
