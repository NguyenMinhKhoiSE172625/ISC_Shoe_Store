import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart, faVenusMars, faHome, faShop } from "@fortawesome/free-solid-svg-icons"
import "./Header.css"

const Header = ({ isLoggedIn, user, onLogout, cartItemCount = 0 }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isProductsPage = location.pathname === "/products";
  
  // Safe way to get username
  const displayName = user?.name || "khách";
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Anh Bán Giày</h1>
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isHomePage ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHome} className="nav-icon" /> 
                <span>Trang Chủ</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={`nav-link ${isProductsPage ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faShop} className="nav-icon" /> 
                <span>Sản Phẩm</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <div className="welcome-text">
                Xin chào, <span>{displayName}</span>!
              </div>
              
              {isProductsPage && (
                <span className="gender-icon">
                  <FontAwesomeIcon icon={faVenusMars} />
                </span>
              )}
              
              <Link to="/cart" className="cart-link">
                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                <span className="cart-count">{cartItemCount || 0}</span>
              </Link>
              
              <button 
                className="btn btn-secondary logout-btn" 
                onClick={onLogout}
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary login-btn">
                Đăng Nhập
              </Link>
              <Link to="/register" className="btn btn-secondary register-btn">
                Đăng Ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

