from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Tool
from app.models import Maintenance
from app.models import Rental

router = APIRouter(prefix="/tools", tags=["Инструменты"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_tools(db: Session = Depends(get_db)):
    return db.query(Tool).all()

@router.get("/{tool_id}")
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")
    return tool

@router.post("/")
def add_tool(
    name: str,
    category: str,
    price_per_day: float,
    db: Session = Depends(get_db)
):
    tool = Tool(
        name=name,
        category=category,
        price_per_day=price_per_day,
        status="Свободно"
    )
    db.add(tool)
    db.commit()
    db.refresh(tool)
    return tool

@router.put("/{tool_id}")
def update_tool(
    tool_id: int,
    name: str,
    category: str,
    price_per_day: float,
    status: str,
    db: Session = Depends(get_db)
):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    tool.name = name
    tool.category = category
    tool.price_per_day = price_per_day
    tool.status = status

    db.commit()
    db.refresh(tool)
    return tool

@router.delete("/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    db.delete(tool)
    db.commit()
    return {"message": "Инструмент удалён"}

@router.get("/{tool_id}/rentals")
def tool_rentals(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    rentals = db.query(Rental).filter(Rental.tool_id == tool_id).all()
    return {
        "tool_id": tool_id,
        "rentals": rentals
    }

@router.get("/{tool_id}/maintenance")
def tool_maintenance(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Инструмент не найден")

    records = db.query(Maintenance).filter(Maintenance.tool_id == tool_id).all()
    return {
        "tool_id": tool_id,
        "maintenance": records
    }