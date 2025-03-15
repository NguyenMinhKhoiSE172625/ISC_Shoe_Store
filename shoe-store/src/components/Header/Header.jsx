import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart, faTruck } from "@fortawesome/free-solid-svg-icons"
import "./Header.css"

const Header = ({ isLoggedIn, user, onLogout, cartItemCount }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>Anh Bán Giày</h1>
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Trang Chủ
              </Link>
            </li>
            {user?.role === 'staff' ? (
              <li className="nav-item">
                <Link to="/staff/orders" className="nav-link">
                  Quản lý đơn hàng
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/products" className="nav-link">
                    Sản Phẩm
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/orders" className="nav-link">
                    Đơn hàng của tôi
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <span className="welcome-text">
                Xin chào, {user.username} ({user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'})!
              </span>
              {user.role !== 'staff' && (
                <Link to="/cart" className="cart-link">
                  <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                  <span className="cart-count">{cartItemCount}</span>
                </Link>
              )}
              <button className="btn btn-secondary logout-btn" onClick={onLogout}>
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

