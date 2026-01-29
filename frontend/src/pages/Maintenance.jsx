import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Maintenance() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [records, setRecords] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/maintenance")
      .then(res => res.json())
      .then(data => setRecords(data))
  }, [])

  const statusColor = status => {
    if (status === "Запланировано") return "#38E078"
    if (status === "Требует повторного ТО") return "#F5B301"
    if (status === "Тех обслуживание") return "#AFC3FF"
    return "#B4B8C3"
  }

  return (
    <div className="maintenance-root">

      {/* HEADER */}
      <header className="maintenance-header">
        <div className="breadcrumbs">Главная &nbsp;&nbsp; Тех обслуживание</div>

        <div className="header-user">
          <span>{user.email}</span>
          <button
            onClick={() => {
              localStorage.clear()
              navigate("/login")
            }}
          >
            Выход
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="maintenance-filters">
        <input placeholder="Инструмент" />
        <button className="filter-btn">Тип работ</button>
        <button className="filter-btn">Дата</button>

        <button className="outline-btn">Найти</button>
        <button className="outline-btn add">Добавить запись ТО</button>
      </div>

      {/* BODY */}
      <div className="maintenance-body">

        {/* TABLE (левая колонка) */}
        <div className="maintenance-table">
          <div className="table-header">
            <div>Инструмент</div>
            <div>Вид работ</div>
            <div>Дата</div>
            <div>Статус</div>
          </div>

          {records.map((r, i) => (
            <div
              key={r.id}
              className={`table-row ${selected?.id === r.id ? "active" : ""}`}
              style={{ background: i % 2 ? "#2F365F" : "#2B3257" }}
              onClick={() => setSelected(r)}
            >
              <div>{r.tool_name}</div>
              <div>{r.work_type}</div>
              <div>{r.maintenance_date}</div>
              <div style={{ color: statusColor(r.status) }}>
                {r.status}
              </div>
            </div>
          ))}
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="maintenance-right">

          {/* PANEL */}
          <div className="maintenance-panel">
            <h3>Управление записью</h3>

            {selected ? (
              <>
                <p className="title">{selected.tool_name}</p>
                <p>ID = {selected.tool_id}</p>

                <p className="desc">
                  Регламентное техническое обслуживание инструмента
                </p>

                <p className="status">
                  СТАТУС&nbsp;
                  <span style={{ color: statusColor(selected.status) }}>
                    {selected.status}
                  </span>
                </p>

                <p>Последняя аренда: {selected.last_rental || "—"}</p>
                <p>Последнее ТО: {selected.last_maintenance || "—"}</p>
              </>
            ) : (
              <p className="desc">Выберите запись из таблицы</p>
            )}
          </div>

          {/* ACTIONS — ОТДЕЛЬНО, ПОД PANEL */}
          <div className="maintenance-actions">
            <button className="outline-btn">Редактировать</button>
            <button className="outline-btn">Отменить</button>
            <button className="outline-btn">Отметить выполненным</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Maintenance
