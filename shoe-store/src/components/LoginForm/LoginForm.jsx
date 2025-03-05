"use client"

import { useState } from "react"
import "./LoginForm.css"

const LoginForm = ({ onLogin }) => {
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

    // Simple validation
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Find user
    const user = users.find(
      u => u.username === formData.username && u.password === formData.password
    )

    if (user) {
      onLogin({
        username: user.username,
        id: Date.now(), // Generate a temporary ID
        email: user.email
      })
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Your Account</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
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
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary login-submit-btn">
          Login
        </button>

        <p className="login-help-text">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  )
}

export default LoginForm

