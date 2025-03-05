import { Link } from "react-router-dom"
import CartItem from "../../components/CartItem/CartItem"
import "./CartPage.css"

const CartPage = ({ cart, updateQuantity, removeFromCart, isLoggedIn }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isLoggedIn) {
    return (
      <div className="cart-page">
        <div className="login-required">
          <h2>Login Required</h2>
          <p>Please login to view your cart.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>

            <div className="summary-row">
              <span>Tax:</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>${(total + total * 0.1).toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage

