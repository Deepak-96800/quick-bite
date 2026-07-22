import "./navbar.css";
import { useContext } from "react";
import { CartContext } from "../../context/cartcontext";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  const { cartItems } = useContext(CartContext);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="logo">
        🍔 Quick Bite
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="#menu">Menu</a>
        </li>

        <li>
          <a href="#offers">Offers</a>
        </li>

        <li>
          <Link to="/my-orders">My Orders</Link>
        </li>
      </ul>

      <div className="nav-right">
        <Link to="/cart" className="cart">
          <FaShoppingCart />
          <span className="cart-count">
            {cartItems.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          </span>
        </Link>

        {!token ? (
          <Link to="/login" className="login-btn">
            <FaUserCircle />
            <span style={{ marginLeft: "6px" }}>Login</span>
          </Link>
        ) : (
          <button
            className="login-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;