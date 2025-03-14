import "./CartItem.css"

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = Number.parseInt(e.target.value)
    updateQuantity(item.id, newQuantity)
  }

  // Hàm định dạng giá tiền VND
  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Sử dụng giá VND nếu có, nếu không thì quy đổi từ USD
  const priceVND = item.priceVND || item.price * 23000;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image || "/placeholder.svg"} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-brand">{item.brand}</p>
        <p className="cart-item-price">{formatVND(priceVND)}</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-control">
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />

          <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          <span>Thành tiền:</span> {formatVND(priceVND * item.quantity)}
        </div>

        <button className="btn btn-danger remove-btn" onClick={() => removeFromCart(item.id)}>
          Xóa
        </button>
      </div>
    </div>
  )
}

export default CartItem

