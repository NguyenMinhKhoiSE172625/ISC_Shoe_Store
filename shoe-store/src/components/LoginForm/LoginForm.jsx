"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginForm.css"

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Kiểm tra dữ liệu đầu vào
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    
    // Tìm user
    const user = users.find(
      (u) => u.username === formData.username && u.password === formData.password
    )

    if (user) {
      // Đăng nhập thành công
      onLogin(user)
      // Chuyển về trang chủ
      navigate("/")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary login-submit-btn">
          Login
        </button>

        <div className="login-help-text">
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm

