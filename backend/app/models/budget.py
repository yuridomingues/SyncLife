from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Float, ForeignKey
from app.core.db import Base

class Budget(Base):
    __tablename__ = "budgets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    month_ref: Mapped[str] = mapped_column(String(7), index=True)  # "YYYY-MM"
    income: Mapped[float] = mapped_column(Float)

    allocations: Mapped[list["Allocation"]] = relationship(
        "Allocation", back_populates="budget", cascade="all, delete-orphan", lazy="selectin"
    )

class Allocation(Base):
    __tablename__ = "allocations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    budget_id: Mapped[int] = mapped_column(ForeignKey("budgets.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    amount: Mapped[float] = mapped_column(Float)

    budget: Mapped["Budget"] = relationship("Budget", back_populates="allocations")
