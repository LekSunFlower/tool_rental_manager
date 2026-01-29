from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Date, Numeric
from app.database import Base
from datetime import date

class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    inventory_number = Column(String, unique=True)
    price_per_day = Column(Float)
    status = Column(String, default="Свободно")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)


class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_price = Column(Float, nullable=False)


class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=False)
    work_type = Column(String, nullable=False)
    maintenance_date = Column(Date, default=date.today)
    status = Column(String, default="Выполнено")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    contract_id = Column(Integer, ForeignKey("rentals.id"), nullable=False)
    payment_date = Column(Date, default=date.today)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_type = Column(String, nullable=False)
