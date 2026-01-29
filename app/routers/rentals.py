from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import SessionLocal
from app.models import Rental, Tool

router = APIRouter(prefix="/rentals", tags=["Аренда"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_rentals(db: Session = Depends(get_db)):
    return db.query(Rental).all()

@router.post("/")
def create_rental(
    client_id: int,
    tool_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")
    if tool.status != "Свободно":
        raise HTTPException(status_code=400, detail="Инструмент недоступен")

    days = (end_date - start_date).days + 1
    if days <= 0:
        raise HTTPException(status_code=400, detail="Некорректные даты")

    total_price = days * tool.price_per_day

    rental = Rental(
        client_id=client_id,
        tool_id=tool_id,
        start_date=start_date,
        end_date=end_date,
        total_price=total_price
    )

    tool.status = "В аренде"

    db.add(rental)
    db.commit()
    db.refresh(rental)

    return rental

from datetime import date

@router.post("/{rental_id}/return")
def return_tool(rental_id: int, db: Session = Depends(get_db)):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Аренда не найдена")

    tool = db.query(Tool).filter(Tool.id == rental.tool_id).first()

    today = date.today()
    penalty = 0

    if today > rental.end_date:
        overdue_days = (today - rental.end_date).days
        penalty = overdue_days * float(tool.price_per_day) * 0.2

    rental.actual_return_date = today
    rental.penalty_amount = penalty
    tool.status = "Свободно"

    db.commit()

    return {
        "message": "Инструмент возвращён",
        "penalty": penalty
    }

