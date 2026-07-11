import "./navbar.css";
import { useContext } from "react";
import { CartContext } from "../../context/cartcontext";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {

  const { cartItems } = useContext(CartContext);

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
<Link to="/cart" className="cart">
  <FaShoppingCart />
  <span className="cart-count">
    {cartItems.reduce((total, item) => total + item.quantity, 0)}
  </span>
</Link>

        <button className="login-btn">
          <FaUserCircle />
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;