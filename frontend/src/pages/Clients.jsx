import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Clients() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [clients, setClients] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/clients")
      .then(res => res.json())
      .then(data => setClients(data))
  }, [])

  const filtered = clients.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="clients-root">

      {/* HEADER */}
      <header className="clients-header">
        <div className="breadcrumbs">Главная &nbsp;&nbsp; Клиенты</div>

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
      <section className="clients-filters">
        <input
          placeholder="ФИО"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button className="filter-btn">Организация</button>
        <button className="filter-btn wide">Телефон / Email</button>
        <button className="filter-btn">Сортировка</button>

        <button className="filter-search">Найти</button>
        <button className="filter-add">Добавить клиента</button>
      </section>

      {/* CONTENT */}
      <section className="clients-content">

        {/* TABLE */}
        <div className="clients-table">
          <div className="table-head clients-head">
            <div>ФИО / Организация</div>
            <div>Телефон</div>
            <div>Email</div>
          </div>

          {filtered.map(client => (
            <div
              key={client.id}
              className={`client-row ${selected?.id === client.id ? "active" : ""}`}
              onClick={() => setSelected(client)}
            >
              <div>{client.full_name}</div>
              <div>{client.phone}</div>
              <div className="email">{client.email}</div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="client-right">

          {/* PANEL */}
          <div className="client-panel">
            <h3>Управление записью</h3>

            {selected ? (
              <>
                <div className="client-name">
                  {selected.full_name}
                </div>

                <div className="client-phone">
                  Телефон {selected.phone}
                </div>

                <div className="client-status success">
                  Арендует
                </div>

                <div className="rent-info">
                  <div className="rent-count">
                    Инструментов в аренде <strong>0</strong>
                  </div>

                  <div className="rent-list">
                    <div>—</div>
                  </div>

                  <div className="rent-date">
                    Возврат инструмента<br />
                    —
                  </div>
                </div>
              </>
            ) : (
              <p className="client-empty">Выберите клиента</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="client-actions">
            <button>Редактировать</button>
            <button>Завершить аренду</button>
            <button>Удалить</button>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Clients
