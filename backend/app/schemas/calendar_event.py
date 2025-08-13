from pydantic import BaseModel, Field, ConfigDict
from datetime import date

class CalendarEventBase(BaseModel):
    date: date
    title: str = Field(min_length=1, max_length=160)
    description: str | None = None
    repeat_yearly: bool = False

class CalendarEventCreate(CalendarEventBase): pass

class CalendarEventRead(CalendarEventBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
