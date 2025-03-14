"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./CheckoutForm.css"

const CheckoutForm = ({ cart, total, clearCart }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    setTimeout(() => {
      // Order successful
      alert("Đặt hàng thành công!")
      clearCart()
      navigate("/")
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="checkout-form-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Thông Tin Giao Hàng</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Tên</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Họ</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Thành phố</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Mã bưu điện</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Thông Tin Thanh Toán</h3>

          <div className="form-group">
            <label htmlFor="cardNumber">Số thẻ</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX XXXX"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardName">Tên trên thẻ</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Ngày hết hạn</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="XXX"
                required
              />
            </div>
          </div>
        </div>

        <div className="order-summary">
          <h3>Tóm Tắt Đơn Hàng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary checkout-btn" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : `Hoàn tất đơn hàng - $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}

export default CheckoutForm

