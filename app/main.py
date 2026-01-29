from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models
from app.routers import tools, clients, rentals, maintenance, reports, dashboard, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Менеджер по аренде инструментов")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(tools.router)
app.include_router(clients.router)
app.include_router(rentals.router)
app.include_router(maintenance.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"status": "ok"}
