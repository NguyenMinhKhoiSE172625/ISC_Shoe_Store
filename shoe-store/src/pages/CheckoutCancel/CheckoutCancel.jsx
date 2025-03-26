import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ordersAPI } from "../../services/api";
import "./CheckoutCancel.css";

const CheckoutCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy orderId từ URL nếu có
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy orderId từ URL params hoặc từ query string
    let orderId = id;
    if (!orderId) {
      const searchParams = new URLSearchParams(location.search);
      orderId = searchParams.get("orderId");
    }

    // Xử lý trang checkout bị hủy
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          // Lấy thông tin đơn hàng từ API
          const response = await ordersAPI.getOrder(orderId);
          
          if (response.data) {
            setOrderDetails(response.data);
          } else {
            setError("Không tìm thấy thông tin đơn hàng");
          }
        } catch (err) {
          console.error("Lỗi lấy thông tin đơn hàng:", err);
          setError("Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else {
      setError("Không tìm thấy thông tin đơn hàng");
      setLoading(false);
    }
  }, [location, navigate, id]);

  if (loading) {
    return (
      <div className="checkout-cancel loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <h2>Đang tải thông tin đơn hàng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-cancel error">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <Link to="/" className="home-button">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-cancel">
      <div className="cancel-icon">
        <FontAwesomeIcon icon={faTimesCircle} />
      </div>
      <h1>Thanh toán đã bị hủy</h1>
      <p>Quá trình thanh toán không thành công hoặc đã bị hủy.</p>
      
      {orderDetails && (
        <div className="order-info">
          <h3>Thông tin đơn hàng:</h3>
          <div className="order-detail-row">
            <span>Mã đơn hàng:</span>
            <span>#{orderDetails._id}</span>
          </div>
          <div className="order-detail-row">
            <span>Phương thức thanh toán:</span>
            <span>
              {orderDetails.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 
               orderDetails.paymentMethod === 'payos' ? 'Thanh toán qua PayOS' : 
               orderDetails.paymentMethod === 'banking' ? 'Chuyển khoản ngân hàng' : 'Không xác định'}
            </span>
          </div>
          <div className="order-detail-row">
            <span>Tổng tiền:</span>
            <span>{orderDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="order-detail-row">
            <span>Trạng thái đơn hàng:</span>
            <span className={`status-badge ${orderDetails.status}`}>
              {orderDetails.status === "pending" ? "Chờ xử lý" : 
               orderDetails.status === "processing" ? "Đang xử lý" : 
               orderDetails.status === "shipped" ? "Đang giao hàng" : 
               orderDetails.status === "delivered" ? "Đã giao hàng" :
               orderDetails.status === "cancelled" ? "Đã hủy" : "Không xác định"}
            </span>
          </div>
        </div>
      )}
      
      <div className="action-buttons">
        {orderDetails && (
          <Link to={`/orders/${orderDetails._id}`} className="btn-view-order">
            Xem chi tiết đơn hàng
          </Link>
        )}
        <Link to="/checkout" className="btn-try-again">
          Thử thanh toán lại
        </Link>
        <Link to="/products" className="btn-continue-shopping">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCancel; 