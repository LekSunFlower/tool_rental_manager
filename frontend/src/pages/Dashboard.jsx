import { useEffect, useState } from "react"
import "../App.css"
import { useNavigate, useLocation } from "react-router-dom"


function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  if (!stats) return <div className="loading">Загрузка…</div>

  return (
    <div className="root">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-box">
          <div className="logo-title">МЕНЕДЖЕР</div>
          <div className="logo-subtitle">по аренде инструментов</div>
        </div>

        <div className="menu">
          <button
            className={`menu-btn ${location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            Главная
          </button>

          <button
            className={`menu-btn ${location.pathname === "/tools" ? "active" : ""}`}
            onClick={() => navigate("/tools")}
          >
            Инструменты
          </button>

          <button
            className={`menu-btn ${location.pathname === "/rentals" ? "active" : ""}`}
            onClick={() => navigate("/rentals")}
          >
            Аренда
          </button>

          <button
            className={`menu-btn ${location.pathname === "/clients" ? "active" : ""}`}
            onClick={() => navigate("/clients")}
          >
            Клиенты
          </button>

          <button
            className={`menu-btn ${location.pathname === "/maintenance" ? "active" : ""}`}
            onClick={() => navigate("/maintenance")}
          >
            Обслуживание
          </button>

          <button
            className={`menu-btn ${location.pathname === "/reports" ? "active" : ""}`}
            onClick={() => navigate("/reports")}
          >
            Отчёты
          </button>
        </div>

        <div className="warning-box">
          <strong>ВНИМАНИЕ</strong>
          <p>Клиент просрочил возврат!</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <header className="header">
          <h2>Главная</h2>
          <div className="user-block">
            <span>{user.email}</span>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
            >
              Выход
            </button>
          </div>
        </header>

        {/* TOP CARDS */}
        <section className="top-cards">
          <div className="top-card">
            <p>Всего инструментов</p>
            <h1>{stats.tools.total}</h1>
          </div>

          <div className="top-card">
            <p>В аренде</p>
            <h1>{stats.tools.in_rent}</h1>
          </div>

          <div className="top-card">
            <p>Активных договоров</p>
            <h1>{stats.rentals.active}</h1>
          </div>
        </section>

        {/* GRID */}
        <section className="grid">

          <div className="block">
            <h3>Сводные показатели</h3>

            <div className="inner-cards">
              <div className="inner-card green">
                ₽ {stats.finance.income}
                <span>за период</span>
              </div>

              <div className="inner-card yellow">
                ₽ {stats.finance.penalties}
                <span>штрафы</span>
              </div>
            </div>
          </div>

          <div className="block">
            <h3>Блок финансовой аналитики</h3>
            <div className="finance-value">
              ₽ {stats.finance.income}
              <span>за месяц</span>
            </div>
          </div>

          <div className="block">
            <h3>Рабочая область</h3>
            <div className="log success">Операция успешно выполнена</div>
            <div className="log warning">Предупреждение</div>
          </div>

          <div className="block">
            <h3>Уведомления</h3>
            <p>Сообщений нет</p>
          </div>

        </section>
      </main>
    </div>
  )
}

export default Dashboard
