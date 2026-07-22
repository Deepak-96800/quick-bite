import { Link } from "react-router-dom";
import "./ordersuccess.css";

function OrderSuccess() {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for ordering with <strong>Quick Bite</strong>.
        </p>

        <p>
          Your payment has been received and your order is being prepared.
        </p>

        <div className="success-buttons">
          <Link to="/my-orders" className="btn-primary">
            View My Orders
          </Link>

          <Link to="/" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;