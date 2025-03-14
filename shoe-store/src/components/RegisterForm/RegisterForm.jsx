"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import LoadingButton from "../LoadingButton/LoadingButton"
import "./RegisterForm.css"

const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

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
      toast.error("Vui lòng điền đầy đủ thông tin", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsLoading(true)

    // Giả lập độ trễ mạng
    setTimeout(() => {
      // Save user data to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if username already exists
      if (users.some(user => user.username === formData.username)) {
        toast.error("Tên đăng nhập đã tồn tại", {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
        return
      }

      // Add new user
      users.push({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      localStorage.setItem('users', JSON.stringify(users))

      toast.success("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...", {
        position: "top-right",
        autoClose: 2000,
      })

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    }, 800)
  }

  return (
    <motion.div 
      className="register-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Tạo Tài Khoản</h2>

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Chọn tên đăng nhập"
            autoComplete="username"
            className="focus:ring-2 focus:ring-blue-500"
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
            placeholder="Nhập email của bạn"
            autoComplete="email"
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tạo mật khẩu"
            autoComplete="new-password"
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận Mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu của bạn"
            autoComplete="new-password"
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <LoadingButton 
          type="submit"
          isLoading={isLoading}
          loadingText="Đang đăng ký..."
          className="btn btn-primary register-submit-btn"
        >
          Đăng Ký
        </LoadingButton>

        <div className="register-help-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
        </div>
      </form>
    </motion.div>
  )
}

export default RegisterForm

