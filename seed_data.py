from datetime import date, timedelta
from app.database import SessionLocal
from app.models import Tool, Client, Rental, Maintenance, User, Payment

db = SessionLocal()

def seed_tools():
    tools = [
        Tool(name="Перфоратор Bosch", category="Электроинструмент", inventory_number="INV-001", price_per_day=500, status="Свободно"),
        Tool(name="Шуруповерт Makita", category="Электроинструмент", inventory_number="INV-002", price_per_day=400, status="В аренде"),
        Tool(name="Болгарка DeWalt", category="Ручной инструмент", inventory_number="INV-003", price_per_day=450, status="ТО"),
        Tool(name="Дрель Интерскол", category="Электроинструмент", inventory_number="INV-004", price_per_day=350, status="Свободно"),
    ]
    db.add_all(tools)
    db.commit()


def seed_clients():
    clients = [
        Client(full_name="Иванов Иван Иванович", phone="+7-900-123-45-67", email="ivanov@mail.ru"),
        Client(full_name="Петров Петр Петрович", phone="+7-900-222-33-44", email="petrov@mail.ru"),
        Client(full_name="ООО СтройГарант", phone="+7-900-555-66-77", email="info@stroi.ru"),
    ]
    db.add_all(clients)
    db.commit()


def seed_rentals():
    rentals = [
        Rental(client_id=1, tool_id=2, start_date=date.today() - timedelta(days=3), end_date=date.today() + timedelta(days=2), total_price=2000),
        Rental(client_id=2, tool_id=1, start_date=date.today() - timedelta(days=1), end_date=date.today() + timedelta(days=4), total_price=2500),
        Rental(client_id=3, tool_id=4, start_date=date.today(), end_date=date.today() + timedelta(days=1), total_price=350),
    ]
    db.add_all(rentals)
    db.commit()


def seed_maintenance():
    maintenance = [
        Maintenance(tool_id=3, work_type="Замена диска", maintenance_date=date.today() - timedelta(days=5), status="Выполнено"),
        Maintenance(tool_id=1, work_type="Диагностика", maintenance_date=date.today() - timedelta(days=2), status="Запланировано"),
        Maintenance(tool_id=2, work_type="Смазка", maintenance_date=date.today() - timedelta(days=1), status="Требует повторного ТО"),
    ]
    db.add_all(maintenance)
    db.commit()


def seed_users():
    users = [
        User(email="admin@mail.ru", password="admin123", role="admin"),
        User(email="manager@mail.ru", password="manager123", role="manager"),
        User(email="user@mail.ru", password="user123", role="user"),
    ]
    db.add_all(users)
    db.commit()


def seed_payments():
    payments = [
        Payment(contract_id=1, amount=2000, payment_type="Наличные"),
        Payment(contract_id=2, amount=2500, payment_type="Карта"),
        Payment(contract_id=3, amount=350, payment_type="Перевод"),
    ]
    db.add_all(payments)
    db.commit()


def run_seed():
    seed_tools()
    seed_clients()
    seed_rentals()
    seed_maintenance()
    seed_users()
    seed_payments()
    print("✅ База данных успешно заполнена тестовыми данными")


if __name__ == "__main__":
    run_seed()
