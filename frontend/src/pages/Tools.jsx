import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Tools() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [tools, setTools] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")

  const reloadTools = async () => {
    const res = await fetch("http://127.0.0.1:8000/tools")
    setTools(await res.json())
  }

  useEffect(() => {
    reloadTools()
  }, [])

  const handleDeleteTool = async () => {
    if (!selected) return
    if (!window.confirm("Удалить инструмент?")) return

    await fetch(`http://127.0.0.1:8000/tools/${selected.id}`, {
      method: "DELETE"
    })

    setSelected(null)
    reloadTools()
  }

  const handleAddTool = async () => {
    const name = prompt("Название инструмента")
    const category = prompt("Категория")
    const price = prompt("Цена за день")
    if (!name || !price) return

    await fetch(
      `http://127.0.0.1:8000/tools?name=${name}&category=${category}&price_per_day=${price}`,
      { method: "POST" }
    )

    reloadTools()
  }

  const filtered = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="tools-root">

      <header className="tools-header">
        <div className="breadcrumbs">
          Главная &nbsp;&nbsp; Инструменты
        </div>

        <div className="header-user">
          <span>{user.email}</span>
          <button onClick={() => { localStorage.clear(); navigate("/login") }}>
            Выход
          </button>
        </div>
      </header>

      <section className="tools-filters">
        <input
          placeholder="Инструмент"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button className="filter-btn">Категория</button>
        <button className="filter-btn">Статус</button>
        <button className="filter-search">Найти</button>
        <button className="filter-add" onClick={handleAddTool}>
          Добавить инструмент
        </button>
      </section>

      <section className="tools-content">
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
              className={`table-row ${selected?.id === tool.id ? "active" : ""}`}
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

        <div className="tool-right">
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

          <div className="tool-actions">
            <button disabled={!selected}>Редактировать</button>
            <button disabled={!selected} onClick={handleDeleteTool}>
              Удалить
            </button>
            <button disabled={!selected}>В ТО</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tools
