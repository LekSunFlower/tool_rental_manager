from pydantic import BaseModel
from datetime import date

class ToolCreate(BaseModel):
    name: str
    category: str
    price_per_day: float

class ClientCreate(BaseModel):
    name: str
    phone: str

class RentalCreate(BaseModel):
    client_id: int
    tool_id: int
    start_date: date
    end_date: date
