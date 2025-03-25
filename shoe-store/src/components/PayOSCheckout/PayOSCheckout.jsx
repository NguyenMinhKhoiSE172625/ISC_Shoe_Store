import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PayOSCheckout.css";

const PayOSCheckout = ({ checkoutUrl, onCancel }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (checkoutUrl) {
      // Chuyển hướng người dùng đến trang thanh toán PayOS
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/checkout/cancel");
    }
  };

  return (
    <div className="payos-checkout-container">
      <div className="payos-checkout-loader"></div>
      <h2>Đang chuyển hướng đến cổng thanh toán PayOS...</h2>
      <p>Vui lòng không đóng trang này.</p>
      <button
        onClick={handleCancel}
        className="payos-cancel-btn"
      >
        Hủy thanh toán
      </button>
    </div>
  );
};

export default PayOSCheckout; 