import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./CheckoutCancel.css";

const CheckoutCancel = () => {
  return (
    <div className="checkout-cancel">
      <div className="cancel-icon">
        <FontAwesomeIcon icon={faTimesCircle} />
      </div>
      <h1>Thanh toán đã bị hủy</h1>
      <p>Bạn đã hủy quá trình thanh toán. Giỏ hàng của bạn vẫn được giữ nguyên.</p>
      
      <div className="action-buttons">
        <Link to="/cart" className="btn-back-to-cart">
          <FontAwesomeIcon icon={faArrowLeft} className="icon-left" />
          Quay lại giỏ hàng
        </Link>
        <Link to="/products" className="btn-continue-shopping">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCancel; 