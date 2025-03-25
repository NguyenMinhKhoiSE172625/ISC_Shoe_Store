import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faShoppingBag, faEye, faClock, faBox, faMoneyBill, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { ordersAPI, authAPI } from "../../services/api";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updatePaymentLoading, setUpdatePaymentLoading] = useState({});

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        setLoading(true);
        // Lấy thông tin người dùng hiện tại
        const userResponse = await authAPI.getCurrentUser();
        setUser(userResponse.data);
        
        // Nếu là admin, lấy tất cả đơn hàng
        if (userResponse.data.role === 'admin') {
          const allOrdersResponse = await ordersAPI.getAllOrders();
          setAllOrders(allOrdersResponse.data);
        }
        
        // Luôn lấy đơn hàng của người dùng hiện tại
        const myOrdersResponse = await ordersAPI.getOrders();
        setOrders(myOrdersResponse.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin:", err);
        setError("Không thể lấy dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdateLoading(true);
      
      // Tìm đơn hàng hiện tại để lấy trạng thái thanh toán
      const currentOrder = allOrders.find(order => order._id === orderId);
      if (!currentOrder) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      
      // Duy trì trạng thái thanh toán hiện tại
      const currentIsPaid = currentOrder.isPaid;
      
      await ordersAPI.updateOrderStatus(orderId, { 
        status: newStatus,
        isPaid: currentIsPaid
      });
      
      // Cập nhật danh sách đơn hàng sau khi cập nhật trạng thái
      const updatedOrders = allOrders.map(order => {
        if (order._id === orderId) {
          return { 
            ...order, 
            status: newStatus,
            // Giữ nguyên trạng thái thanh toán
            isPaid: currentIsPaid,
            paidAt: currentIsPaid ? (order.paidAt || new Date()) : null
          };
        }
        return order;
      });
      
      setAllOrders(updatedOrders);
      
      // Nếu đơn hàng hiện tại cũng thuộc về người dùng admin, cập nhật luôn
      const userOrderIndex = orders.findIndex(order => order._id === orderId);
      if (userOrderIndex >= 0) {
        const updatedUserOrders = [...orders];
        updatedUserOrders[userOrderIndex] = {
          ...updatedUserOrders[userOrderIndex],
          status: newStatus,
          // Giữ nguyên trạng thái thanh toán
          isPaid: currentIsPaid,
          paidAt: currentIsPaid ? (updatedUserOrders[userOrderIndex].paidAt || new Date()) : null
        };
        setOrders(updatedUserOrders);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId) => {
    try {
      setUpdatePaymentLoading(prev => ({ ...prev, [orderId]: true }));
      
      // Sử dụng API mới đã hỗ trợ toggle trạng thái thanh toán
      console.log('Toggling payment status for order:', orderId);
      await ordersAPI.updatePaymentStatus(orderId);
      
      // Lấy lại danh sách đơn hàng sau khi cập nhật để đảm bảo dữ liệu đồng bộ
      if (user && user.role === 'admin') {
        const allOrdersResponse = await ordersAPI.getAllOrders();
        setAllOrders(allOrdersResponse.data);
        
        // Cập nhật đơn hàng của người dùng nếu có thay đổi
        const myOrdersResponse = await ordersAPI.getOrders();
        setOrders(myOrdersResponse.data);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", err);
      alert("Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại sau.");
    } finally {
      setUpdatePaymentLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="orders-page loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <h2>Đang tải danh sách đơn hàng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page error">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0 && (!user || user.role !== 'admin' || allOrders.length === 0)) {
    return (
      <div className="orders-page empty">
        <div className="empty-icon">
          <FontAwesomeIcon icon={faShoppingBag} />
        </div>
        <h2>Bạn chưa có đơn hàng nào</h2>
        <p>Hãy mua sắm và quay lại đây để xem các đơn hàng của bạn.</p>
        <Link to="/products" className="shop-now-button">
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">Đơn hàng của tôi</h1>
      <p className="page-description">Quản lý và theo dõi trạng thái đơn hàng.</p>

      {/* Phần quản lý đơn hàng dành cho admin */}
      {user && user.role === 'admin' && allOrders.length > 0 && (
        <div className="admin-orders-section">
          <h2 className="admin-section-title">Quản lý đơn hàng (Admin)</h2>
          <div className="admin-orders-list">
            {allOrders.map((order) => (
              <div key={`admin-${order._id}`} className="admin-order-card">
                <div className="admin-order-header">
                  <div className="admin-order-info">
                    <h3>Đơn hàng #{order._id}</h3>
                    <p className="admin-order-customer">
                      Khách hàng: {order.user ? order.user.name : 'Không xác định'}
                    </p>
                    <p className="admin-order-date">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="admin-order-total">
                      Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className="admin-order-status">
                    <div className="current-status">
                      <span className={`status-badge ${order.status}`}>
                        {order.status === "pending" ? "Chờ xử lý" :
                         order.status === "processing" ? "Đang xử lý" :
                         order.status === "shipped" ? "Đang giao hàng" :
                         order.status === "delivered" ? "Đã giao hàng" :
                         order.status === "cancelled" ? "Đã hủy" : "Không xác định"}
                      </span>
                    </div>
                    
                    <div className="status-update-form">
                      <select 
                        className="status-select"
                        defaultValue={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        disabled={updateLoading}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đang giao hàng</option>
                        <option value="delivered">Đã giao hàng</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="admin-order-payment">
                  <div className="payment-status-display">
                    <span className={`payment-badge ${order.isPaid ? "paid" : "unpaid"}`}>
                      {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                    {order.isPaid && order.paidAt && (
                      <span className="payment-date">
                        {new Date(order.paidAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                  
                  <div className="payment-actions">
                    <button 
                      className={`payment-toggle-btn ${order.isPaid ? 'mark-unpaid' : 'mark-paid'}`}
                      onClick={() => handleUpdatePaymentStatus(order._id)}
                      disabled={updatePaymentLoading[order._id]}
                    >
                      {updatePaymentLoading[order._id] ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : order.isPaid ? (
                        <>
                          <FontAwesomeIcon icon={faTimesCircle} />
                          Đánh dấu chưa thanh toán
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Đánh dấu đã thanh toán
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="admin-order-footer">
                  <Link to={`/orders/${order._id}`} className="view-details-button">
                    <FontAwesomeIcon icon={faEye} className="icon-left" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phần đơn hàng của tôi */}
      {orders.length > 0 && (
        <>
          <h2 className="my-orders-title">Đơn hàng của tôi</h2>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faBox} className="text-blue-500" />
                      <h3>Đơn hàng #{order._id}</h3>
                    </div>
                    <div className="flex items-center gap-2 order-date">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                      <p>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="status-container">
                  <span className={`status-badge ${order.status}`}>
                    {order.status === "pending" ? "Chờ xử lý" :
                     order.status === "processing" ? "Đang xử lý" :
                     order.status === "shipped" ? "Đang giao hàng" :
                     order.status === "delivered" ? "Đã giao hàng" :
                     order.status === "cancelled" ? "Đã hủy" : "Không xác định"}
                  </span>
                </div>

                <div className="order-products">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBox} className="text-gray-500" />
                    <p>Số lượng sản phẩm: {order.items.length}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-green-500" />
                    <p className="order-total">Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>

                <div className="order-payment-status">
                  <span className={`payment-badge ${order.isPaid ? "paid" : "unpaid"}`}>
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>

                <div className="order-card-footer">
                  <Link to={`/orders/${order._id}`} className="view-details-button">
                    <FontAwesomeIcon icon={faEye} className="icon-left" />
                    Xem chi tiết
                  </Link>
                  
                  {!order.isPaid && order.checkoutUrl && order.status !== "cancelled" && (
                    <a 
                      href={order.checkoutUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="pay-now-button"
                    >
                      Thanh toán ngay
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage; 