"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ordersAPI, paymentAPI } from "../../services/api"
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
  const [payosData, setPayosData] = useState(null) // Lưu trữ dữ liệu thanh toán PayOS

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
      } else if (formData.paymentMethod === "payos") {
        try {
          // Bước 1: Tạo đơn hàng trước
          const orderResponse = await ordersAPI.createOrder(orderData)
          
          if (!orderResponse.success) {
            toast.error("Không thể tạo đơn hàng. Vui lòng thử lại sau.")
            return
          }
          
          const orderId = orderResponse.data._id
          
          try {
            // Bước 2: Tạo payment link với PayOS
            const paymentLinkOptions = {
              returnUrl: `${window.location.origin}/order-success/${orderId}`,
              cancelUrl: `${window.location.origin}/order-cancel/${orderId}`
            }
            
            // Sử dụng timeout dài hơn để tránh lỗi timeout
            const paymentResponse = await paymentAPI.createPaymentLink(orderId, paymentLinkOptions)
            
            if (paymentResponse.success) {
              // Có 2 lựa chọn: Hiển thị thông tin thanh toán hoặc chuyển hướng ngay
              // Lựa chọn 1: Hiển thị thông tin thanh toán
              setPayosData(paymentResponse.data)
              
              // Lựa chọn 2: Chuyển hướng ngay đến trang thanh toán PayOS
              // window.location.href = paymentResponse.data.checkoutUrl
            } else {
              // Nếu không thành công, chuyển đến trang chi tiết đơn hàng
              toast.warning("Không thể tạo liên kết thanh toán ngay lúc này. Bạn có thể thanh toán sau trong trang chi tiết đơn hàng.")
              navigate(`/orders/${orderId}`)
            }
          } catch (paymentError) {
            console.error("Chi tiết lỗi thanh toán:", paymentError)
            
            // Xử lý theo chi tiết lỗi nếu có
            if (paymentError.response?.status === 500) {
              toast.error("Có lỗi từ cổng thanh toán. Bạn có thể thanh toán sau trong trang chi tiết đơn hàng.")
            } else {
              toast.error("Có lỗi khi kết nối với cổng thanh toán. Bạn có thể thanh toán sau.")
            }
            
            // Vẫn chuyển hướng người dùng đến trang đơn hàng để họ có thể thanh toán sau
            navigate(`/orders/${orderId}`)
          }
        } catch (orderError) {
          console.error("Lỗi khi tạo đơn hàng:", orderError)
          const errorMessage = orderError.response?.data?.error || "Không thể tạo đơn hàng. Vui lòng thử lại sau."
          toast.error(errorMessage)
        }
      }
    } catch (error) {
      console.error("Lỗi:", error)
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại sau."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Nếu đã có dữ liệu PayOS, hiển thị thông tin thanh toán
  if (payosData) {
    console.log("PayOS Data received:", payosData); // Log để debug
    
    // Kiểm tra xem URL QR code có CORS issue không
    const isValidQrUrl = payosData.qrCode && 
      (payosData.qrCode.startsWith('https://api.qrserver.com') || 
       payosData.qrCode.startsWith('data:image'));
    
    return (
      <div className="payos-checkout-container">
        <div className="payos-checkout-header">
          <h2>Thanh toán qua PayOS</h2>
          <p>Vui lòng quét mã QR hoặc nhấn vào nút bên dưới để thanh toán</p>
        </div>
        
        <div className="payos-checkout-qr">
          {isValidQrUrl ? (
            <img 
              src={payosData.qrCode} 
              alt="QR Code" 
              className="payos-qr-image" 
              onError={(e) => {
                console.error("Lỗi khi tải QR code:", e);
                e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + 
                  encodeURIComponent(payosData.checkoutUrl || 'https://payos.vn');
                e.target.onError = null;
              }}
            />
          ) : payosData.checkoutUrl ? (
            // Tạo QR code từ checkout URL nếu không có QR code hợp lệ
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payosData.checkoutUrl)}`} 
              alt="QR Code" 
              className="payos-qr-image" 
              onError={(e) => {
                console.error("Lỗi khi tải QR code thay thế:", e);
                e.target.src = '/placeholder.svg';
                e.target.onError = null;
              }}
            />
          ) : (
            <div className="qr-code-fallback">
              <p>Không thể tải mã QR.</p>
              <p>Vui lòng sử dụng nút "Thanh toán ngay" bên dưới.</p>
            </div>
          )}
        </div>
        
        <div className="payos-checkout-info">
          <div className="info-row">
            <span>Số tiền:</span>
            <span>{Number(payosData.amount).toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="info-row">
            <span>Mô tả:</span>
            <span>{payosData.description || "Thanh toán đơn hàng"}</span>
          </div>
          {payosData.accountNumber && (
            <div className="info-row">
              <span>Số tài khoản:</span>
              <span>{payosData.accountNumber}</span>
            </div>
          )}
          {payosData.accountName && (
            <div className="info-row">
              <span>Tên tài khoản:</span>
              <span>{payosData.accountName}</span>
            </div>
          )}
        </div>
        
        <div className="payos-checkout-actions">
          <a 
            href={payosData.checkoutUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary payos-checkout-btn"
          >
            Thanh toán ngay
          </a>
          <button 
            className="btn btn-outline payos-cancel-btn"
            onClick={() => {
              setPayosData(null)
            }}
          >
            Quay lại
          </button>
        </div>
      </div>
    )
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

