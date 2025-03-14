import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>Anh Bán Giày</h3>
          <p>Cửa hàng giày dép chất lượng hàng đầu.</p>
        </div>

        <div className="footer-section">
          <h4>Liên Kết Nhanh</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Trang Chủ</a>
            </li>
            <li>
              <a href="/products">Sản Phẩm</a>
            </li>
            <li>
              <a href="/login">Đăng Nhập</a>
            </li>
            <li>
              <a href="/register">Đăng Ký</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Liên Hệ</h4>
          <p>Email: info@anhbangiay.com</p>
          <p>Điện thoại: (123) 456-7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Anh Bán Giày. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

