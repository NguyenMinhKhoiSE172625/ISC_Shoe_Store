"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm"
import "./CheckoutPage.css"

const CheckoutPage = ({ cart, clearCart }) => {
  const navigate = useNavigate()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1 // Including tax

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate("/cart")
    }
  }, [cart, navigate])

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-container">
        <div className="order-items">
          <h2>Order Items ({cart.length})</h2>

          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-image">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              </div>

              <div className="checkout-item-details">
                <h3>{item.name}</h3>
                <p>Size: {item.selectedSize || "N/A"}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <CheckoutForm cart={cart} total={total} clearCart={clearCart} />
      </div>
    </div>
  )
}

export default CheckoutPage

