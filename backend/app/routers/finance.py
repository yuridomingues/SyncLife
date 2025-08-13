from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class CDIProjectionIn(BaseModel):
    principal: float = Field(ge=0)
    months: int = Field(ge=1, le=600)
    cdi_annual_rate: float = Field(ge=0)     # ex: 0.1065 para 10.65% a.a.
    percent_of_cdi: float = Field(ge=1.00, le=1.02)  # 1.00=100%, 1.02=102%

class CDIProjectionOut(BaseModel):
    monthly_rate_effective: float
    fv: float
    total_yield: float

@router.post("/cdi-projection", response_model=CDIProjectionOut)
async def cdi_projection(body: CDIProjectionIn):
    base_monthly = (1 + body.cdi_annual_rate) ** (1/12) - 1
    eff_monthly = base_monthly * body.percent_of_cdi
    fv = body.principal * (1 + eff_monthly) ** body.months
    return CDIProjectionOut(
        monthly_rate_effective=eff_monthly,
        fv=fv,
        total_yield=fv - body.principal
    )
