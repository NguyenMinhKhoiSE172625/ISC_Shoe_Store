import { useState, useEffect } from 'react'
import './OrderTracking.css'

const OrderTracking = () => {
  const [orders, setOrders] = useState([
    // Dữ liệu mẫu, sau này sẽ được thay thế bằng dữ liệu từ API
    {
      id: "ORD001",
      date: "2024-03-15",
      total: 299.99,
      status: "confirmed", // confirmed, shipping, delivered
      items: [
        { name: "Áo thun nam", quantity: 2, price: 149.99 }
      ]
    }
  ])

  return (
    <div className="order-tracking-container">
      <h2>Theo Dõi Đơn Hàng</h2>
      
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <h3>Đơn hàng #{order.id}</h3>
              <p>Ngày đặt: {order.date}</p>
            </div>
            <div className="order-total">
              ${order.total.toFixed(2)}
            </div>
          </div>

          <div className="tracking-status">
            <div className={`status-step ${order.status === 'confirmed' ? 'active' : ''} ${order.status === 'shipping' || order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="step-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="step-label">Đã xác nhận</div>
            </div>
            <div className="status-line"></div>
            <div className={`status-step ${order.status === 'shipping' ? 'active' : ''} ${order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="step-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="step-label">Đang giao hàng</div>
            </div>
            <div className="status-line"></div>
            <div className={`status-step ${order.status === 'delivered' ? 'active completed' : ''}`}>
              <div className="step-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="step-label">Đã giao hàng</div>
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderTracking 