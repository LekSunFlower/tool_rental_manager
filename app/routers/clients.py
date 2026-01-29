from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Client
from app.models import Rental
from app.models import Payment

router = APIRouter(
    prefix="/clients",
    tags=["Клиенты"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_clients(db: Session = Depends(get_db)):
    """
    Возвращает список всех клиентов системы.
    Используется для отображения таблицы клиентов.
    """
    return db.query(Client).all()


@router.get("/{client_id}")
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return client


@router.post("/")
def add_client(
    name: str,
    phone: str,
    email: str,
    db: Session = Depends(get_db)
):
    """
    Добавляет нового клиента в систему.
    """
    client = Client(
        name=name,
        phone=phone,
        email=email
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.put("/{client_id}")
def update_client(
    client_id: int,
    name: str,
    phone: str,
    email: str,
    db: Session = Depends(get_db)
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    client.name = name
    client.phone = phone
    client.email = email

    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    db.delete(client)
    db.commit()
    return {"message": "Клиент успешно удалён"}

@router.get("/{client_id}/rentals")
def client_rentals(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    rentals = db.query(Rental).filter(Rental.client_id == client_id).all()

    return {
        "client_id": client_id,
        "rentals": rentals
    }

@router.get("/{client_id}/payments")
def client_payments(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    payments = (
        db.query(Payment)
        .join(Rental, Payment.contract_id == Rental.id)
        .filter(Rental.client_id == client_id)
        .all()
    )

    return {
        "client_id": client_id,
        "payments": payments
    }