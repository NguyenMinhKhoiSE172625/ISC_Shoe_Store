import { Link } from "react-router-dom"
import "./Header.css"

const Header = ({ isLoggedIn, user, onLogout, cartItemCount }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>ShoeStore</h1>
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>
          </ul>
        </nav>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <span className="welcome-text">Welcome, {user.username}!</span>
              <Link to="/cart" className="cart-link">
                Cart ({cartItemCount})
              </Link>
              <button className="btn btn-secondary logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary login-btn">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

