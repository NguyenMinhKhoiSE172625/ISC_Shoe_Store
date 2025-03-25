"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm"
import "./CheckoutPage.css"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, getCartTotal } = useCart()
  const total = getCartTotal()

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart || cart.length === 0) {
      navigate("/cart")
    }
  }, [cart, navigate])

  return (
    <div className="checkout-page">
      <h1 className="page-title">Thanh Toán</h1>

      <div className="checkout-container">
        <div className="order-items">
          <h2>Sản Phẩm Đặt Hàng ({cart.length})</h2>

          {cart && cart.map((item) => (
            <div key={item._id} className="checkout-item">
              <div className="checkout-item-image">
                <img 
                  src={item.product?.image || "/placeholder.svg"} 
                  alt={item.product?.name || "Sản phẩm"} 
                />
              </div>

              <div className="checkout-item-details">
                <h3>{item.product?.name || "Sản phẩm không xác định"}</h3>
                <p>Kích cỡ: {item.size || "N/A"}</p>
                <p>Số lượng: {item.quantity}</p>
                <p className="checkout-item-price">
                  {(item.product?.priceVND * item.quantity).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          ))}
        </div>

        <CheckoutForm total={total} />
      </div>
    </div>
  )
}

export default CheckoutPage

