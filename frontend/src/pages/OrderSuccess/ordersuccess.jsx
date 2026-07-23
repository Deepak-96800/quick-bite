import "./ordersuccess.css";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaHome, FaClipboardList } from "react-icons/fa";

function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">

        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          🎉 Thank you for ordering with <strong>Quick Bite</strong>.
        </p>

        <p className="success-subtext">
          Your payment was successful and we've started preparing your delicious meal.
        </p>

        <div className="success-info">
          <div className="info-box">
            <h4>Estimated Delivery</h4>
            <span>25 - 35 Minutes</span>
          </div>

          <div className="info-box">
            <h4>Payment Status</h4>
            <span className="paid">Paid ✅</span>
          </div>
        </div>

        <div className="success-buttons">

          <Link to="/my-orders" className="primary-btn">
            <FaClipboardList />
            View My Orders
          </Link>

          <Link to="/" className="secondary-btn">
            <FaHome />
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;