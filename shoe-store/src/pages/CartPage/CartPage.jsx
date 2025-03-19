import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingBag, faArrowLeft, faTruck, faShieldAlt } from "@fortawesome/free-solid-svg-icons"
import CartItem from "../../components/CartItem/CartItem"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { useProducts } from "../../contexts/ProductContext"
import "./CartPage.css"

const CartPage = () => {
  const { isLoggedIn } = useAuth()
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { formatVND } = useProducts()
  
  const total = getCartTotal()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!isLoggedIn) {
    return (
      <motion.div 
        className="cart-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-required">
          <FontAwesomeIcon icon={faShoppingBag} className="login-icon" />
          <h2>Yêu Cầu Đăng Nhập</h2>
          <p>Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
          <Link to="/login" className="btn btn-primary">
            Đăng Nhập
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Giỏ Hàng Của Bạn
      </motion.h1>

      {cart.length === 0 ? (
        <motion.div 
          className="empty-cart"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faShoppingBag} className="empty-cart-icon" />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng.</p>
          <Link to="/products" className="btn btn-primary">
            Tiếp Tục Mua Sắm
          </Link>
        </motion.div>
      ) : (
        <div className="cart-container">
          <motion.div 
            className="cart-items"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cart.map((item) => (
              <motion.div key={item._id} variants={itemVariants}>
                <CartItem 
                  item={{
                    _id: item._id,
                    name: item.product?.name,
                    brand: item.product?.brand,
                    image: item.product?.image,
                    price: item.product?.price,
                    priceVND: item.product?.priceVND || item.price,
                    quantity: item.quantity,
                    size: item.size
                  }} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="cart-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2>Tóm Tắt Đơn Hàng</h2>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatVND(total)}</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{formatVND(0)}</span>
            </div>

            <div className="summary-row">
              <span>Thuế:</span>
              <span>{formatVND(total * 0.1)}</span>
            </div>

            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{formatVND(total + total * 0.1)}</span>
            </div>

            <div className="cart-benefits">
              <div className="benefit-item">
                <FontAwesomeIcon icon={faTruck} className="benefit-icon" />
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="benefit-item">
                <FontAwesomeIcon icon={faShieldAlt} className="benefit-icon" />
                <span>Bảo hành 30 ngày</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="checkout-btn-container"
            >
              <Link to="/checkout" className="checkout-btn">
                Tiến Hành Thanh Toán
              </Link>
            </motion.div>

            <Link to="/products" className="continue-shopping">
              <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
              <span>Tiếp Tục Mua Sắm</span>
            </Link>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default CartPage

