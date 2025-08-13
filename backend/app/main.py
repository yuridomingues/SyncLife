from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.routers import routines, calendar, finance

app = FastAPI(title="SyncLife")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routines.router, prefix="/routines", tags=["routines"])
app.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
app.include_router(finance.router, prefix="/finance", tags=["finance"])

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
