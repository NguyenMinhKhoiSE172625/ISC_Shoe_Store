import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ordersAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import "./CheckoutSuccess.css";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");

    // Xử lý trang checkout thành công
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          // Lấy thông tin đơn hàng từ API
          const response = await ordersAPI.getOrder(orderId);
          
          if (response.data) {
            setOrderDetails(response.data);
            
            // Kiểm tra trạng thái thanh toán
            if (!response.data.isPaid) {
              try {
                // Kiểm tra lại trạng thái thanh toán với PayOS
                const paymentStatus = await ordersAPI.checkPaymentStatus(orderId);
                
                // Nếu trạng thái đã cập nhật, lấy lại thông tin đơn hàng
                if (paymentStatus.data.isPaid) {
                  const updatedOrder = await ordersAPI.getOrder(orderId);
                  setOrderDetails(updatedOrder.data);
                }
              } catch (paymentCheckError) {
                console.error("Lỗi kiểm tra trạng thái thanh toán:", paymentCheckError);
              }
            }
            
            // Xóa giỏ hàng sau khi thanh toán thành công
            clearCart();
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
  }, [location, clearCart, navigate]);

  if (loading) {
    return (
      <div className="checkout-success loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <h2>Đang xử lý đơn hàng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-success error">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <Link to="/" className="home-button">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-success">
      <div className="success-icon">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      <h1>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã mua hàng tại Shoe Store.</p>
      
      {orderDetails && (
        <div className="order-info">
          <h3>Thông tin đơn hàng:</h3>
          <div className="order-detail-row">
            <span>Mã đơn hàng:</span>
            <span>#{orderDetails._id}</span>
          </div>
          <div className="order-detail-row">
            <span>Tổng tiền:</span>
            <span>{orderDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="order-detail-row">
            <span>Trạng thái:</span>
            <span className="status-badge">
              {orderDetails.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
            </span>
          </div>
          <div className="order-detail-row">
            <span>Đơn hàng:</span>
            <span className="status-badge">
              {orderDetails.status === "processing" ? "Đang xử lý" : 
               orderDetails.status === "shipped" ? "Đang giao hàng" : 
               orderDetails.status === "delivered" ? "Đã giao hàng" : "Chờ xử lý"}
            </span>
          </div>
        </div>
      )}
      
      <div className="action-buttons">
        <Link to="/products" className="btn-continue-shopping">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess; 