import "./navbar.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🍔 Quick Bite
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Menu</li>
        <li>Offers</li>
        <li>My Orders</li>
      </ul>

      <div className="nav-right">
        <div className="cart">
          <FaShoppingCart />
          <span className="cart-count">0</span>
        </div>

        <button className="login-btn">
          <FaUserCircle />
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;