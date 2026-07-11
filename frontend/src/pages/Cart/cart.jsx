import "./cart.css";
import { useContext } from "react";
import { CartContext } from "../../context/cartcontext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 40 : 0;
  const gst = subtotal * 0.05;
  const total = subtotal + deliveryFee + gst;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <button
                  className="remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="summary">
            <h3>Subtotal : ₹{subtotal.toFixed(2)}</h3>
            <h3>Delivery : ₹{deliveryFee}</h3>
            <h3>GST (5%) : ₹{gst.toFixed(2)}</h3>

            <hr />

            <h2>Total : ₹{total.toFixed(2)}</h2>

<button className="checkout-btn" onClick={() => navigate("/checkout")}>
  Proceed to Checkout
</button>

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;