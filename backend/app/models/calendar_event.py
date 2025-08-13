from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, Date, Text
from app.core.db import Base

class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    date: Mapped[Date] = mapped_column(Date, index=True)
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    repeat_yearly: Mapped[bool] = mapped_column(Boolean, default=False)
