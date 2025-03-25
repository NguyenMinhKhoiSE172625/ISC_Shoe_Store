"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ordersAPI } from "../../services/api"
import PayOSCheckout from "../PayOSCheckout/PayOSCheckout"
import "./CheckoutForm.css"

// Định nghĩa các phương thức thanh toán
const PAYMENT_METHODS = [
  { id: "COD", name: "Thanh toán khi nhận hàng (COD)" },
  { id: "payos", name: "Thanh toán qua PayOS" }
]

const CheckoutForm = ({ total }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    paymentMethod: "payos" // Mặc định là PayOS
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Tạo đơn hàng với thông tin thanh toán
      const orderData = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        },
        phone: formData.phone,
        paymentMethod: formData.paymentMethod
      }

      // Xử lý theo phương thức thanh toán
      if (formData.paymentMethod === "COD") {
        // Xử lý đơn hàng COD
        const response = await ordersAPI.createOrder(orderData)
        
        if (response.success) {
          toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại ISC Shoe Store.")
          navigate(`/orders/${response.data._id}`)
        } else {
          toast.error("Không thể tạo đơn hàng. Vui lòng thử lại sau.")
        }
      } else {
        // Xử lý đơn hàng PayOS
        const response = await ordersAPI.createOrder({
          ...orderData,
          paymentMethod: "banking" // Chuyển đổi payos thành banking cho backend
        })

        // Nhận URL thanh toán từ PayOS và chuyển hướng người dùng
        if (response.success && response.data.checkoutUrl) {
          setCheckoutUrl(response.data.checkoutUrl)
        } else {
          toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.")
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error)
      const serverErrorMessage = error.response?.data?.error || error.response?.data?.message
      const errorMessage = serverErrorMessage || "Không thể tạo đơn hàng. Vui lòng thử lại sau."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Nếu đã có checkoutUrl, hiển thị component PayOSCheckout
  if (checkoutUrl) {
    return <PayOSCheckout 
      checkoutUrl={checkoutUrl} 
      onCancel={() => setCheckoutUrl(null)} 
    />
  }

  return (
    <div className="checkout-form-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Thông Tin Giao Hàng</h3>

          <div className="form-group">
            <label htmlFor="street">Địa chỉ</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Thành phố</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="province">Tỉnh/Thành</label>
              <input
                type="text"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">Mã bưu điện</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0xxxxxxxxx"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Phương Thức Thanh Toán</h3>
          <div className="payment-methods">
            {PAYMENT_METHODS.map(method => (
              <div className="payment-method" key={method.id}>
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={handleChange}
                  className="payment-radio"
                />
                <label htmlFor={method.id} className="payment-label">
                  {method.name}
                </label>
              </div>
            ))}
          </div>

          {formData.paymentMethod === "payos" && (
            <div className="payment-info">
              <div className="payos-info">
                <img 
                  src="https://payos.vn/wp-content/uploads/sites/13/2023/07/payos-logo.svg" 
                  alt="PayOS Logo" 
                  className="payos-logo" 
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                    e.target.onError = null;
                  }} 
                />
                <p>Thanh toán an toàn qua PayOS</p>
              </div>
            </div>
          )}

          {formData.paymentMethod === "COD" && (
            <div className="payment-info">
              <div className="cod-info">
                <p>Bạn sẽ thanh toán khi nhận được hàng.</p>
                <p>Phí vận chuyển có thể thay đổi tùy theo địa chỉ giao hàng.</p>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h3>Tóm Tắt Đơn Hàng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{(total * 0.9).toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="summary-row">
            <span>Thuế (10%):</span>
            <span>{(total * 0.1).toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>0đ</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary checkout-btn" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : `Thanh toán - ${total.toLocaleString('vi-VN')}đ`}
        </button>
      </form>
    </div>
  )
}

export default CheckoutForm

