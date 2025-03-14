"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import LoadingButton from "../LoadingButton/LoadingButton"
import "./LoginForm.css"

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

    // Kiểm tra dữ liệu đầu vào
    if (!formData.username || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setIsLoading(true)

    // Giả lập độ trễ mạng
    setTimeout(() => {
      // Lấy danh sách users từ localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      
      // Tìm user
      const user = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      )

      if (user) {
        // Đăng nhập thành công
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 2000,
        })
        onLogin(user)
        // Chuyển về trang chủ
        navigate("/")
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng", {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <motion.div 
      className="login-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Chào Mừng Trở Lại</h2>

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
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
            required
            autoComplete="current-password"
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <LoadingButton 
          type="submit"
          isLoading={isLoading}
          loadingText="Đang đăng nhập..."
          className="btn btn-primary login-submit-btn"
        >
          Đăng Nhập
        </LoadingButton>

        <div className="login-help-text">
          Chưa có tài khoản?{" "}
          <Link to="/register">Đăng ký tại đây</Link>
        </div>
      </form>
    </motion.div>
  )
}

export default LoginForm

