import "./checkout.css";
import { useContext, useState } from "react";
import { CartContext } from "../../context/cartcontext";

function Checkout() {
  const { cartItems } = useContext(CartContext);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 40 : 0;
  const gst = subtotal * 0.05;
  const total = subtotal + delivery + gst;

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      address,
      cartItems,
      total,
    });

    alert("Order details ready! Next we'll send them to the backend.");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-form">
        <h2>Delivery Address</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={address.name}
            onChange={(e) =>
              setAddress({ ...address, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) =>
              setAddress({ ...address, phone: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Full Address"
            value={address.address}
            onChange={(e) =>
              setAddress({ ...address, address: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
            required
          />

          <button type="submit">
            Continue to Payment
          </button>
        </form>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <hr />

        <p>Subtotal : ₹{subtotal}</p>
        <p>Delivery : ₹{delivery}</p>
        <p>GST : ₹{gst.toFixed(2)}</p>

        <h3>Total : ₹{total.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default Checkout;