import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faShoppingCart, 
  faVenusMars, 
  faHome, 
  faShop, 
  faCog, 
  faBars, 
  faTimes, 
  faUser, 
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faAngleDown,
  faClipboardList,
  faUserEdit
} from "@fortawesome/free-solid-svg-icons"
import "./Header.css"
import { useState, useEffect, useRef } from "react"

const Header = ({ isLoggedIn, user, onLogout, cartItemCount = 0, isAdmin }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  // Cập nhật displayName mỗi khi user thay đổi
  useEffect(() => {
    if (user && user.name) {
      setDisplayName(user.name);
    }
  }, [user]);
  
  // Kiểm tra xem có phải trang sản phẩm không
  const isProductsPage = location.pathname === "/products";
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Đóng user menu khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Theo dõi sự kiện scroll để thay đổi style header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo-and-nav">
          <Link to="/" className="logo">
            Anh Bán Giày
          </Link>
          
          <nav className={`main-nav ${showMenu ? 'show' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faHome} />
                  <span>Trang Chủ</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faShop} />
                  <span>Sản Phẩm</span>
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item admin-nav-item">
                  <Link to="/admin/products" className={`admin-link ${location.pathname.includes('/admin') ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faCog} className="admin-icon" />
                    <span>Quản lý sản phẩm</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            <FontAwesomeIcon icon={showMenu ? faTimes : faBars} />
          </button>
        </div>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <div className="user-dropdown" ref={userMenuRef}>
                <button 
                  className={`user-dropdown-toggle ${showUserMenu ? 'active' : ''}`} 
                  onClick={toggleUserMenu}
                >
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                  <span className="user-name">{displayName}</span>
                  <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <FontAwesomeIcon icon={faUserEdit} />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <FontAwesomeIcon icon={faClipboardList} />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                    <button 
                      className="dropdown-item logout-item" 
                      onClick={onLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
              
              {isProductsPage && (
                <span className="gender-icon">
                  <FontAwesomeIcon icon={faVenusMars} />
                </span>
              )}
              
              <Link to="/cart" className="cart-link" aria-label="Giỏ hàng">
                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary login-btn">
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Đăng Nhập</span>
              </Link>
              <Link to="/register" className="btn btn-secondary register-btn">
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Đăng Ký</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

