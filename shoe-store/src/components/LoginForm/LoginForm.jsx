"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faLock, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../contexts/AuthContext"
import LoadingButton from "../LoadingButton/LoadingButton"
import "./LoginForm.css"
import { USER_ROLES } from "../../constants/userRoles"

const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  const [rememberMe, setRememberMe] = useState(false)

  // Redirect to previous page or home after login
  const from = location.state?.from || "/"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Kiểm tra dữ liệu đầu vào
    if (!formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin", {
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

    // Thực hiện đăng nhập qua API
    const success = await login({
      email: formData.email,
      password: formData.password,
    })

<<<<<<< HEAD
      if (user) {
        // Đăng nhập thành công
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 2000,
        })
        onLogin(user)
        
        // Điều hướng dựa vào role
        if (user.role === USER_ROLES.STAFF) {
          navigate("/staff/orders")
        } else {
          navigate("/")
        }
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng", {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
      }
    }, 800)
=======
    if (success) {
      // Chuyển về trang trước đó hoặc trang chủ
      navigate(from)
    }
>>>>>>> Tphat
  }

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-header">
          <h2>Chào Mừng Trở Lại</h2>
          <p>Hãy đăng nhập để truy cập tài khoản và tiếp tục mua sắm</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="Nhập địa chỉ email của bạn"
          />
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
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
            placeholder="Nhập mật khẩu của bạn"
          />
          <FontAwesomeIcon icon={faLock} className="input-icon" />
        </div>

        <div className="login-options">
          <div className="remember-me">
            <input 
              type="checkbox" 
              id="remember-me" 
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember-me">Ghi nhớ đăng nhập</label>
          </div>
          <Link to="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </Link>
        </div>

        <LoadingButton 
          type="submit"
          isLoading={loading}
          loadingText="Đang đăng nhập..."
          className="login-submit-btn"
        >
          Đăng Nhập
        </LoadingButton>

        <div className="login-help-text">
          Chưa có tài khoản?
          <Link to="/register">Đăng ký tại đây</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm

