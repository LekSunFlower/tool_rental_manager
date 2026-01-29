import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/auth/login?email=${email}&password=${password}`,
        { method: "POST" }
      )

      if (!response.ok) {
        setError("Неверный логин или пароль")
        return
      }

      const data = await response.json()
      localStorage.setItem("user", JSON.stringify(data))
      navigate("/dashboard")
    } catch {
      setError("Ошибка соединения с сервером")
    }
  }

  return (
    <div className="login-root">

      <div className="login-card">

        {/* Верхний белый блок */}
        <div className="login-header">
          <div className="login-icon">🧰</div>

          <div className="login-title">МЕНЕДЖЕР</div>
          <div className="login-subtitle">ПО АРЕНДЕ ИНСТРУМЕНТОВ</div>
        </div>

        {/* Форма */}
        <div className="login-form">
          {error && <div className="login-error">{error}</div>}

          <input
            className="login-input"
            placeholder="Логин"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            ВОЙТИ
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login
