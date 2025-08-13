from sqlalchemy import Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from app.core.db import Base

class Routine(Base):
    __tablename__ = "routines"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    day_of_week: Mapped[int] = mapped_column(Integer, index=True)  # 0=Seg ... 6=Dom
    time_str: Mapped[str] = mapped_column(String(5), index=True)   # "HH:MM"
    title: Mapped[str] = mapped_column(String(120))
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subtasks: Mapped[list["SubTask"]] = relationship(
        "SubTask", back_populates="routine", cascade="all, delete-orphan", lazy="selectin"
    )

class SubTask(Base):
    __tablename__ = "subtasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    routine_id: Mapped[int] = mapped_column(ForeignKey("routines.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(120))
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    routine: Mapped["Routine"] = relationship("Routine", back_populates="subtasks")
