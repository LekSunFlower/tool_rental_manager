from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import SessionLocal
from app.models import Tool, Rental, Maintenance

router = APIRouter(prefix="/dashboard", tags=["Главная"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    total_tools = db.query(Tool).count()
    tools_in_rent = db.query(Tool).filter(Tool.status == "В аренде").count()
    active_rentals = db.query(Rental).count()

    total_income = sum(r.total_price for r in db.query(Rental).all())

    notifications = []

    overdue_rentals = db.query(Rental).filter(Rental.end_date < date.today()).all()
    for r in overdue_rentals:
        notifications.append(f"Просрочка аренды: инструмент ID {r.tool_id}")

    maintenance_tools = db.query(Maintenance).filter(Maintenance.status != "Выполнено").all()
    for m in maintenance_tools:
        notifications.append(f"Инструмент ID {m.tool_id} требует ТО")

    return {
        "tools": {
            "total": total_tools,
            "in_rent": tools_in_rent
        },
        "rentals": {
            "active": active_rentals
        },
        "finance": {
            "income": total_income,
            "penalties": 0
        },
        "notifications": notifications
    }
