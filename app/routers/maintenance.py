from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import SessionLocal
from app.models import Maintenance, Tool

router = APIRouter(prefix="/maintenance", tags=["Обслуживание"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_maintenance(db: Session = Depends(get_db)):
    return db.query(Maintenance).all()

@router.post("/")
def add_maintenance(
    tool_id: int,
    maintenance_type: str,
    maintenance_date: date,
    status: str,
    db: Session = Depends(get_db)
):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    record = Maintenance(
        tool_id=tool_id,
        maintenance_type=maintenance_type,
        maintenance_date=maintenance_date,
        status=status
    )

    tool.status = "ТО"

    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{record_id}")
def delete_maintenance(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Maintenance).filter(Maintenance.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    db.delete(record)
    db.commit()
    return {"message": "Запись ТО удалена"}
