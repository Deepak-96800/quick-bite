import "./checkout.css";
import axios from "axios";
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

const handlePayment = async () => {
  try {
    const { data: order } = await axios.post(
      "https://quick-bite-backend-g4k9.onrender.com/payment/create-order",
      {
        amount: total,
      }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Quick Bite",
      description: "Food Order Payment",
      order_id: order.id,

      handler: async function (response) {
        alert("Payment Successful!");

        console.log(response);

        // Next step:
        // Verify payment with backend
        // Save order
        // Empty cart
      },

      prefill: {
        name: address.name,
        contact: address.phone,
      },

      theme: {
        color: "#E23744",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (err) {
    console.log(err);
    alert("Payment failed.");
  }
};

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

<button type="button" onClick={handlePayment}>
  Pay ₹{total.toFixed(2)}
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