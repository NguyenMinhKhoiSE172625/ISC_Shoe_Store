import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ordersAPI, paymentAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import "./CheckoutSuccess.css";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy orderId từ URL nếu có
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sử dụng useRef để theo dõi trạng thái xóa giỏ hàng
  const cartCleared = useRef(false);
  const maxPaymentChecks = useRef(5); // Số lần tối đa kiểm tra thanh toán
  const currentPaymentCheck = useRef(0);
  const paymentCheckIntervalId = useRef(null);

  // Kiểm tra trạng thái thanh toán tự động
  const checkPaymentStatus = useCallback(async (orderId) => {
    if (currentPaymentCheck.current >= maxPaymentChecks.current) {
      // Đã kiểm tra quá số lần cho phép
      if (paymentCheckIntervalId.current) {
        clearInterval(paymentCheckIntervalId.current);
        paymentCheckIntervalId.current = null;
      }
      return;
    }

    currentPaymentCheck.current += 1;
    console.log(`Tự động kiểm tra thanh toán lần ${currentPaymentCheck.current}/${maxPaymentChecks.current}`);

    try {
      const response = await paymentAPI.getPaymentStatus(orderId);
      
      if (response.isPaid) {
        console.log('Đơn hàng đã được thanh toán. Cập nhật trạng thái...');
        
        // Cập nhật thông tin đơn hàng
        const orderData = await ordersAPI.getOrder(orderId);
        setOrderDetails(orderData.data);
        
        // Xóa giỏ hàng nếu chưa xóa
        if (!cartCleared.current) {
          clearCart();
          cartCleared.current = true;
        }
        
        // Dừng việc kiểm tra
        if (paymentCheckIntervalId.current) {
          clearInterval(paymentCheckIntervalId.current);
          paymentCheckIntervalId.current = null;
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error('Lỗi khi tự động kiểm tra thanh toán:', error);
    }
  }, [clearCart]);

  const fetchOrderDetails = useCallback(async () => {
    try {
      if (!id) return;
      
      setLoading(true);
      
      console.log(`Đang lấy thông tin đơn hàng: ${id}`);
      const orderData = await ordersAPI.getOrder(id);
      console.log(`Thông tin đơn hàng:`, orderData);
      
      setOrderDetails(orderData.data);
      
      // Nếu đơn hàng chưa được đánh dấu là đã thanh toán
      if (!orderData.data.isPaid) {
        console.log(`Đơn hàng ${id} chưa được đánh dấu là đã thanh toán. Bắt đầu kiểm tra tự động...`);
        
        // Khởi động kiểm tra thanh toán tự động
        currentPaymentCheck.current = 0;
        
        // Kiểm tra ngay lần đầu
        await checkPaymentStatus(id);
        
        // Thiết lập kiểm tra định kỳ
        if (!paymentCheckIntervalId.current) {
          paymentCheckIntervalId.current = setInterval(() => {
            checkPaymentStatus(id);
          }, 5000); // Kiểm tra mỗi 5 giây
        }
      } else {
        console.log(`Đơn hàng ${id} đã được đánh dấu là đã thanh toán.`);
        
        // Xóa giỏ hàng nếu chưa xóa
        if (!cartCleared.current) {
          clearCart();
          cartCleared.current = true;
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin đơn hàng:`, error);
      setLoading(false);
      setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
    }
  }, [id, clearCart, checkPaymentStatus]);

  useEffect(() => {
    // Lấy orderId từ URL params hoặc từ query string
    let orderId = id;
    if (!orderId) {
      const searchParams = new URLSearchParams(location.search);
      orderId = searchParams.get("orderId");
    }

    fetchOrderDetails();

    // Cleanup khi component unmount
    return () => {
      if (paymentCheckIntervalId.current) {
        clearInterval(paymentCheckIntervalId.current);
        paymentCheckIntervalId.current = null;
      }
    };
  }, [id, location.search, fetchOrderDetails]);

  if (loading) {
    return (
      <div className="checkout-success loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <h2>Đang xử lý đơn hàng...</h2>
        <p>Vui lòng đợi trong khi chúng tôi kiểm tra trạng thái thanh toán</p>
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
            <span>Trạng thái thanh toán:</span>
            <span className={`status-badge ${orderDetails.isPaid ? 'paid' : 'unpaid'}`}>
              {orderDetails.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
            </span>
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
        <Link to={`/orders/${orderDetails?._id}`} className="btn-view-order">
          Xem chi tiết đơn hàng
        </Link>
        <Link to="/products" className="btn-continue-shopping">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess; 