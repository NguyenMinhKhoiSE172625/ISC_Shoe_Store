"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./RegisterForm.css"

const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Save user data to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      setError("Username already exists")
      return
    }

    // Add new user
    users.push({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })
    
    localStorage.setItem('users', JSON.stringify(users))

    setError("")
    setSuccess("Registration successful! Redirecting to login...")

    // Redirect to login after a delay
    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
            placeholder="Create a password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" className="btn btn-primary register-submit-btn">
          Register
        </button>

        <p className="register-help-text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm

