import { Link } from "react-router-dom";
import "./ordersuccess.css";

function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">
        <h1>🎉 Order Placed Successfully!</h1>

        <p>
          Thank you for ordering from <strong>Quick Bite</strong>.
        </p>

        <p>Your payment was successful.</p>

        <p>Your food is now being prepared. 🍕🍔🍟</p>

        <Link to="/">
          <button className="home-btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;