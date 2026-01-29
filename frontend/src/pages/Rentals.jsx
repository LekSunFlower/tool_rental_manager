import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Rentals() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [clients, setClients] = useState([])
  const [tools, setTools] = useState([])

  const [client, setClient] = useState(null)
  const [tool, setTool] = useState(null)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/clients")
      .then(res => res.json())
      .then(data => setClients(data))

    fetch("http://127.0.0.1:8000/tools")
      .then(res => res.json())
      .then(data => setTools(data.filter(t => t.status === "Свободно")))
  }, [])

  const days =
    startDate && endDate
      ? Math.max(
          0,
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1
        )
      : 0

  const total = tool ? days * tool.price_per_day : 0

  const createRental = () => {
    fetch(
      `http://127.0.0.1:8000/rentals?client_id=${client.id}&tool_id=${tool.id}&start_date=${startDate}&end_date=${endDate}`,
      { method: "POST" }
    ).then(() => navigate("/dashboard"))
  }

  return (
    <div className="rentals-root">

      {/* HEADER */}
      <header className="rentals-header">
        <div className="breadcrumbs">Главная &nbsp;&nbsp; Аренда</div>

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

      {/* MAIN */}
      <div className="rentals-body">

        {/* LEFT FORM */}
        <div className="rental-form">

          {/* CLIENT */}
          <h3>Клиент</h3>
          <select
            className="readonly-field"
            onChange={e =>
              setClient(clients.find(c => c.id === Number(e.target.value)))
            }
          >
            <option>Выберите клиента</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </select>

          {/* TOOL */}
          <h3>Инструмент</h3>
          <select
            className="readonly-field"
            onChange={e =>
              setTool(tools.find(t => t.id === Number(e.target.value)))
            }
          >
            <option>Выберите инструмент</option>
            {tools.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* DATES */}
          <div className="dates-block">
            <div>
              <label>Дата начала</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div className="arrow">→</div>

            <div>
              <label>Дата конца</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* COST */}
          <div className="cost-box">
            <div>
              Расчет стоимости&nbsp;
              <span className="green">
                {days} дней по {tool?.price_per_day || 0}р/день
              </span>
            </div>

            <div className="total">
              ИТОГО: <span>{total}р</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rental-summary">
          <div>
            <h4>Клиент</h4>
            <p>{client?.full_name || "—"}</p>
          </div>

          <div>
            <h4>Инструмент</h4>
            <p>{tool?.name || "—"}</p>
          </div>

          <div className="penalty">
            <h4>Стоимость штрафа</h4>
            <p>Просрок возврата<br />370р/день</p>
            <p>Потеря инструмента<br />265 000р</p>
          </div>

          <button
            className="confirm-btn"
            disabled={!client || !tool || !startDate || !endDate}
            onClick={createRental}
          >
            ОФОРМИТЬ АРЕНДУ
          </button>
        </div>

      </div>
    </div>
  )
}

export default Rentals
