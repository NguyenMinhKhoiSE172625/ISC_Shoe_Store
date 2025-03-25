import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft, faQrcode, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { ordersAPI, authAPI } from "../../services/api";
import "./OrderDetailsPage.css";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatePaymentLoading, setUpdatePaymentLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Lấy thông tin người dùng để xác định vai trò
        const userResponse = await authAPI.getCurrentUser();
        setIsAdmin(userResponse.data.role === 'admin');
        
        // Lấy thông tin đơn hàng
        const response = await ordersAPI.getOrder(id);
        setOrder(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
        setError("Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleCheckPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.checkPaymentStatus(id);
      
      if (response.data && response.data.isPaid) {
        // Nếu thanh toán đã được cập nhật, làm mới thông tin đơn hàng
        const updatedOrder = await ordersAPI.getOrder(id);
        setOrder(updatedOrder.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      setError("Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        setLoading(true);
        await ordersAPI.cancelOrder(id);
        // Làm mới thông tin đơn hàng
        const updatedOrder = await ordersAPI.getOrder(id);
        setOrder(updatedOrder.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        setError("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    }
  };

  const handleUpdatePaymentStatus = async () => {
    try {
      setUpdatePaymentLoading(true);
      
      // Sử dụng API mới đã hỗ trợ toggle trạng thái thanh toán
      console.log('Toggling payment status for order:', id);
      await ordersAPI.updatePaymentStatus(id);
      
      // Lấy lại thông tin đơn hàng sau khi cập nhật
      const updatedOrder = await ordersAPI.getOrder(id);
      setOrder(updatedOrder.data);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", err);
      alert("Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại sau.");
    } finally {
      setUpdatePaymentLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setLoading(true);
      
      // Lưu trạng thái isPaid hiện tại
      const currentIsPaid = order.isPaid;
      
      // Gửi cả status và isPaid để đảm bảo không mất thông tin thanh toán
      await ordersAPI.updateOrderStatus(id, { 
        status: newStatus,
        isPaid: currentIsPaid
      });
      
      // Lấy lại thông tin đơn hàng sau khi cập nhật
      const updatedOrder = await ordersAPI.getOrder(id);
      setOrder(updatedOrder.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-details-page loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <h2>Đang tải thông tin đơn hàng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page error">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <Link to="/profile" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="icon-left" />
          Quay lại
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page not-found">
        <h2>Không tìm thấy đơn hàng</h2>
        <p>Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.</p>
        <Link to="/profile" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="icon-left" />
          Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="page-header">
        <Link to="/orders" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="icon-left" />
          Quay lại
        </Link>
        <h1>Chi tiết đơn hàng #{order._id}</h1>
      </div>

      <div className="order-status-card">
        <div className="status-header">
          <h2>Trạng thái đơn hàng</h2>
          <span className={`status-badge ${order.status}`}>
            {order.status === "pending" ? "Chờ xử lý" :
             order.status === "processing" ? "Đang xử lý" :
             order.status === "shipped" ? "Đang giao hàng" :
             order.status === "delivered" ? "Đã giao hàng" :
             order.status === "cancelled" ? "Đã hủy" : "Không xác định"}
          </span>
          
          {isAdmin && (
            <div className="admin-status-actions">
              <select 
                className="status-select"
                value={order.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={loading}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="payment-status">
          <h3>Trạng thái thanh toán</h3>
          <span className={`payment-badge ${order.isPaid ? "paid" : "unpaid"}`}>
            {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
          {order.isPaid && order.paidAt && (
            <p className="paid-time">Thời gian thanh toán: {new Date(order.paidAt).toLocaleString('vi-VN')}</p>
          )}
          
          {isAdmin && (
            <div className="admin-payment-actions">
              <button 
                className={`payment-toggle-btn ${order.isPaid ? 'mark-unpaid' : 'mark-paid'}`}
                onClick={handleUpdatePaymentStatus}
                disabled={updatePaymentLoading}
              >
                {updatePaymentLoading ? (
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
          )}
        </div>

        {!order.isPaid && order.checkoutUrl && order.status !== "cancelled" && (
          <div className="payment-actions">
            <a 
              href={order.checkoutUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="pay-now-button"
            >
              <FontAwesomeIcon icon={faQrcode} className="icon-left" />
              Thanh toán ngay
            </a>
            <button 
              className="check-payment-button"
              onClick={handleCheckPaymentStatus}
            >
              Kiểm tra trạng thái thanh toán
            </button>
          </div>
        )}

        {order.status === "pending" && !order.isPaid && (
          <div className="cancel-order">
            <button 
              className="cancel-order-button"
              onClick={handleCancelOrder}
            >
              Hủy đơn hàng
            </button>
          </div>
        )}
      </div>

      <div className="order-info-section">
        <div className="order-items">
          <h2>Sản phẩm ({order.items.length})</h2>
          {order.items.map((item) => (
            <div key={item._id} className="order-item">
              <div className="item-name">
                <h3>{item.name}</h3>
                <p>Kích cỡ: {item.size}</p>
              </div>
              <div className="item-quantity">
                <span>x{item.quantity}</span>
              </div>
              <div className="item-price">
                <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                <p className="unit-price">{item.price.toLocaleString('vi-VN')}đ / sản phẩm</p>
              </div>
            </div>
          ))}
        </div>

        <div className="shipping-info">
          <h2>Thông tin giao hàng</h2>
          <div className="info-item">
            <span>Địa chỉ:</span>
            <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province}</span>
          </div>
          <div className="info-item">
            <span>Mã bưu điện:</span>
            <span>{order.shippingAddress.postalCode}</span>
          </div>
          <div className="info-item">
            <span>Số điện thoại:</span>
            <span>{order.phone}</span>
          </div>
        </div>

        <div className="order-summary">
          <h2>Tổng giá trị đơn hàng</h2>
          <div className="summary-item">
            <span>Tạm tính:</span>
            <span>{(order.totalPrice * 0.9).toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="summary-item">
            <span>Thuế (10%):</span>
            <span>{(order.totalPrice * 0.1).toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="summary-item">
            <span>Phí vận chuyển:</span>
            <span>0đ</span>
          </div>
          <div className="summary-item total">
            <span>Tổng cộng:</span>
            <span>{order.totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage; 