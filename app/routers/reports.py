from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import SessionLocal
from app.models import Rental

router = APIRouter(prefix="/reports", tags=["Отчёты"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/income")
def income_report(date_from: date, date_to: date, db: Session = Depends(get_db)):
    rentals = db.query(Rental).filter(
        Rental.start_date >= date_from,
        Rental.end_date <= date_to
    ).all()

    total = sum(r.total_price for r in rentals)
    return {
        "period": f"{date_from} – {date_to}",
        "total_income": total,
        "records": rentals
    }
