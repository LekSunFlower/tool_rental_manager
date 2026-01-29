import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Tools() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [tools, setTools] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tools")
      .then(res => res.json())
      .then(data => setTools(data))
  }, [])

  const filtered = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="tools-root">

      {/* HEADER */}
      <header className="tools-header">
        <div className="breadcrumbs">
          Главная &nbsp;&nbsp; Инструменты
        </div>

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
      <section className="tools-filters">
        <input
          placeholder="Инструмент"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button className="filter-btn">Категория</button>
        <button className="filter-btn">Статус</button>
        <button className="filter-search">Найти</button>
        <button className="filter-add">Добавить инструмент</button>
      </section>

      {/* CONTENT */}
      <section className="tools-content">

        {/* TABLE */}
        <div className="tools-table">

          <div className="table-head">
            <div>Название инструмента</div>
            <div>Категория</div>
            <div>Стоимость</div>
            <div>ID</div>
            <div>Статус</div>
          </div>

          {filtered.map(tool => (
            <div
              key={tool.id}
              className={`table-row ${
                selected?.id === tool.id ? "active" : ""
              }`}
              onClick={() => setSelected(tool)}
            >
              <div>{tool.name}</div>
              <div>{tool.category || "-"}</div>
              <div>{tool.price_per_day} ₽</div>
              <div>{tool.id}</div>
              <div className={`status ${tool.status}`}>
                {tool.status}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="tool-right">

          {/* RIGHT PANEL */}
          <div className="tool-panel">
            <h3>Управление записью</h3>

            {selected ? (
              <>
                <div className="tool-name">{selected.name}</div>
                <div>ID = {selected.id}</div>

                <p className="tool-desc">
                  Описание инструмента и технические характеристики
                </p>

                <div className="tool-status">
                  <span>СТАТУС</span>
                  <span className={`status ${selected.status}`}>
                    {selected.status}
                  </span>
                </div>

                <div>Последняя аренда: —</div>
                <div>Последнее ТО: —</div>
              </>
            ) : (
              <p className="tool-empty">Выберите инструмент</p>
            )}
          </div>

          {/* ACTIONS — ЧЁТКО ПОД ПАНЕЛЬЮ */}
          <div className="tool-actions">
            <button disabled={!selected}>Редактировать</button>
            <button disabled={!selected}>Удалить</button>
            <button disabled={!selected}>В ТО</button>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Tools
