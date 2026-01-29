import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Reports() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [reportType, setReportType] = useState("finance")

  // мок-данные отчёта (потом заменятся на backend)
  const rows = [
    { date: "06.01.26", income: 8000, penalty: 0 },
    { date: "15.02.26", income: 6000, penalty: 1200 },
    { date: "20.03.26", income: 10000, penalty: 0 },
  ]

  const total = rows.reduce((s, r) => s + r.income - r.penalty, 0)

  return (
    <div className="reports-root">

      {/* HEADER */}
      <header className="reports-header">
        <div className="breadcrumbs">Главная &nbsp;&nbsp; Отчёты</div>

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

      {/* BODY */}
      <div className="reports-body">

        {/* LEFT */}
        <div className="reports-left">

          {/* FILTERS */}
          <div className="report-filters">
            <input type="text" value="06.01.2026" readOnly />
            <input type="text" value="06.02.2026" readOnly />
            <input type="text" value="Семен Семеныч Семенов Ф.Л." readOnly />
            <input type="text" value="Бензопила NoWood01" readOnly />
          </div>

          {/* REPORT */}
          <div className="report-table">
            <div className="report-title">
              Финансовый отчёт по доходам<br />
              06.01.26 — 06.04.26
            </div>

            <div className="report-header-row">
              <div>Дата</div>
              <div>Доход</div>
              <div>Штрафы</div>
            </div>

            {rows.map((r, i) => {
              const isPenalty = r.penalty > 0
              const color = isPenalty ? "#FF3B3B" : "#38E078"

              return (
                <div key={i} className="report-row" style={{ color }}>
                  <div>{r.date}</div>
                  <div>{r.income}р</div>
                  <div>{r.penalty}р</div>
                </div>
              )
            })}

            <div className="report-total">
              ИТОГО: {total}р
            </div>
          </div>

          {/* SUCCESS */}
          <div className="report-success">
            ✔ Отчёт успешно сохранён в work/Desktop/otchet
          </div>
        </div>

        {/* RIGHT */}
        <div className="reports-right">
          <div
            className={`report-type ${reportType === "finance" ? "active" : ""}`}
            onClick={() => setReportType("finance")}
          >
            Финансовый отчёт по доходам
          </div>

          <div className="report-type">
            Отчёт по загрузке оборудования
          </div>

          <div className="report-type">
            Отчёт по техническому обслуживанию
          </div>

          <button className="report-btn">Сформировать отчёт</button>
          <button className="report-btn">Экспорт в PDF</button>
        </div>
      </div>
    </div>
  )
}

export default Reports
