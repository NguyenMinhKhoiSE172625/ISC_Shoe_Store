import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft, faQrcode, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { ordersAPI, authAPI, paymentAPI } from "../../services/api";
import "./OrderDetailsPage.css";
import { toast } from "react-toastify";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatePaymentLoading, setUpdatePaymentLoading] = useState(false);
  const [payosInfo, setPayosInfo] = useState(null);

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

  const handleCancelOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        setLoading(true);
        
        // Nếu đơn hàng thanh toán qua PayOS, hủy payment link
        if (order.paymentMethod === 'payos' && order.paymentLinkId) {
          await paymentAPI.cancelPayment(id, 'Hủy bởi người dùng');
        }
        
        // Hủy đơn hàng
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

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      
      // Tạo payment link cho đơn hàng với timeout dài hơn
      const paymentLinkOptions = {
        returnUrl: `${window.location.origin}/order-success/${id}`,
        cancelUrl: `${window.location.origin}/order-cancel/${id}`
      };
      
      try {
        const response = await paymentAPI.createPaymentLink(id, paymentLinkOptions);
        
        if (response.success) {
          // Lưu thông tin PayOS để hiển thị
          setPayosInfo(response.data);
          
          // Làm mới thông tin đơn hàng
          const updatedOrder = await ordersAPI.getOrder(id);
          setOrder(updatedOrder.data);
        } else {
          toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Chi tiết lỗi thanh toán:", error);
        
        if (error.response?.status === 500) {
          toast.error("Có lỗi từ cổng thanh toán. Vui lòng thử lại sau ít phút.");
        } else {
          toast.error("Không thể kết nối với cổng thanh toán. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo payment link:", error);
      toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.");
      setLoading(false);
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

  const closePayosInfo = () => {
    setPayosInfo(null);
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await ordersAPI.getOrder(id);
      setOrder(response.data);
    } catch (err) {
      console.error("Lỗi khi làm mới thông tin đơn hàng:", err);
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

  // Nếu đang hiển thị thông tin PayOS
  if (payosInfo) {
    return (
      <div className="order-details-page">
        <div className="page-header">
          <button className="back-button" onClick={closePayosInfo}>
            <FontAwesomeIcon icon={faArrowLeft} className="icon-left" />
            Quay lại đơn hàng
          </button>
          <h1>Thanh toán đơn hàng #{order._id}</h1>
        </div>

        <div className="payos-checkout-container">
          <div className="payos-checkout-header">
            <h2>Thanh toán qua PayOS</h2>
            <p>Vui lòng quét mã QR hoặc nhấn vào nút bên dưới để thanh toán</p>
          </div>
          
          <div className="payos-checkout-qr">
            {payosInfo.qrCode && (
              <img 
                src={payosInfo.qrCode} 
                alt="QR Code" 
                className="payos-qr-image" 
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                  e.target.onError = null;
                }}
              />
            )}
          </div>
          
          <div className="payos-checkout-info">
            <div className="info-row">
              <span>Số tiền:</span>
              <span>{Number(payosInfo.amount).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="info-row">
              <span>Mô tả:</span>
              <span>{payosInfo.description}</span>
            </div>
            {payosInfo.accountNumber && (
              <div className="info-row">
                <span>Số tài khoản:</span>
                <span>{payosInfo.accountNumber}</span>
              </div>
            )}
            {payosInfo.accountName && (
              <div className="info-row">
                <span>Tên tài khoản:</span>
                <span>{payosInfo.accountName}</span>
              </div>
            )}
          </div>
          
          <div className="payos-checkout-actions">
            <a 
              href={payosInfo.checkoutUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary payos-checkout-btn"
            >
              Thanh toán ngay
            </a>
            <button 
              className="btn btn-outline payos-cancel-btn"
              onClick={closePayosInfo}
            >
              Quay lại
            </button>
          </div>
        </div>
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
          <h3>
            Trạng thái thanh toán 
            <span className="payment-method-badge">
              {order.paymentMethod === 'COD' ? 'COD' : 
               order.paymentMethod === 'payos' ? 'PayOS' : 
               order.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Không xác định'}
            </span>
          </h3>
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

        {/* Hiển thị nút thanh toán nếu đơn hàng chưa thanh toán và chưa hủy */}
        {!order.isPaid && order.status !== "cancelled" && (
          <div className="payment-actions">
            {/* Nếu đơn hàng đã có sẵn thông tin PayOS */}
            {order.paymentMethod === 'payos' && order.checkoutUrl && (
              <a 
                href={order.checkoutUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pay-now-button"
              >
                <FontAwesomeIcon icon={faQrcode} className="icon-left" />
                Thanh toán bằng PayOS
              </a>
            )}
            
            {/* Nếu đơn hàng chưa có thông tin PayOS hoặc sử dụng phương thức khác */}
            {(!order.checkoutUrl || order.paymentMethod !== 'payos') && (
              <button 
                className="create-payment-button"
                onClick={handleCreatePayment}
              >
                <FontAwesomeIcon icon={faQrcode} className="icon-left" />
                Thanh toán bằng PayOS
              </button>
            )}
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