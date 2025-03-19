"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEnvelope, faLock, faCheck, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../contexts/AuthContext"
import LoadingButton from "../LoadingButton/LoadingButton"
import "./RegisterForm.css"

const RegisterForm = () => {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: ""
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Xử lý đặc biệt cho trường address
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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

    // Submit registration to API
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address
    })

    if (success) {
      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    }
  }

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-form-header">
          <h2>Tạo Tài Khoản</h2>
          <p>Hãy điền thông tin để đăng ký tài khoản mới</p>
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ và tên <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên đầy đủ"
            autoComplete="name"
            required
          />
          <FontAwesomeIcon icon={faUser} className="input-icon" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn (dùng để đăng nhập)"
            autoComplete="email"
            required
          />
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <small className="form-text">Email này sẽ được dùng để đăng nhập</small>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            autoComplete="tel"
          />
          <FontAwesomeIcon icon={faPhone} className="input-icon" />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Thông tin địa chỉ</h3>
          <div className="address-fields">
            <div className="form-group full-width">
              <label htmlFor="address.street">Địa chỉ</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Số nhà, tên đường"
                autoComplete="address-line1"
              />
              <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
            </div>

            <div className="form-group">
              <label htmlFor="address.city">Thành phố</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Thành phố"
                autoComplete="address-level2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.province">Tỉnh</label>
              <input
                type="text"
                id="address.province"
                name="address.province"
                value={formData.address.province}
                onChange={handleChange}
                placeholder="Tỉnh"
                autoComplete="address-level1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.postalCode">Mã bưu điện</label>
              <input
                type="text"
                id="address.postalCode"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                placeholder="Mã bưu điện"
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu <span className="required">*</span></label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
            autoComplete="new-password"
            required
          />
          <FontAwesomeIcon icon={faLock} className="input-icon" />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận Mật khẩu <span className="required">*</span></label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu của bạn"
            autoComplete="new-password"
            required
          />
          <FontAwesomeIcon icon={faCheck} className="input-icon" />
        </div>

        <LoadingButton 
          type="submit"
          isLoading={loading}
          loadingText="Đang đăng ký..."
          className="register-submit-btn"
        >
          Đăng Ký
        </LoadingButton>

        <div className="register-help-text">
          Đã có tài khoản?
          <Link to="/login">Đăng nhập tại đây</Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm

