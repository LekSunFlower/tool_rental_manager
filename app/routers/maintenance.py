from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import SessionLocal
from app.models import Maintenance, Tool

router = APIRouter(
    prefix="/maintenance",
    tags=["Обслуживание"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔹 Получить все записи ТО
@router.get("/")
def get_maintenance(db: Session = Depends(get_db)):
    return db.query(Maintenance).all()


# 🔹 Отправить инструмент в ТО
@router.post("/")
def add_maintenance(
    tool_id: int,
    maintenance_type: str,
    maintenance_date: date,
    db: Session = Depends(get_db)
):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    if tool.status == "ТО":
        raise HTTPException(status_code=400, detail="Инструмент уже находится на ТО")

    record = Maintenance(
        tool_id=tool_id,
        maintenance_type=maintenance_type,
        maintenance_date=maintenance_date,
        status="В работе"
    )

    tool.status = "ТО"

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# 🔹 Завершить ТО и вернуть инструмент в работу
@router.patch("/{record_id}/complete")
def complete_maintenance(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Maintenance).filter(Maintenance.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Запись ТО не найдена")

    tool = db.query(Tool).filter(Tool.id == record.tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    record.status = "Завершено"
    tool.status = "Свободно"

    db.commit()

    return {"message": "ТО завершено, инструмент снова доступен"}


# 🔹 Удалить запись ТО (БЕЗ изменения статуса инструмента)
@router.delete("/{record_id}")
def delete_maintenance(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Maintenance).filter(Maintenance.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    db.delete(record)
    db.commit()

    return {"message": "Запись ТО удалена"}
