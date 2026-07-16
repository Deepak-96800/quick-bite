import "./checkout.css";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/cartcontext";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

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

  const handlePayment = async () => {
    // Validate Address
    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      // Create Razorpay Order
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
        image: "/logo.png",
        order_id: order.id,

        handler: async function (response) {
          try {
            // Verify Payment
            const verify = await axios.post(
              "https://quick-bite-backend-g4k9.onrender.com/payment/verify-payment",
              response
            );

            if (!verify.data.success) {
              alert("Payment verification failed.");
              return;
            }

            // Save Order
            await axios.post(
              "https://quick-bite-backend-g4k9.onrender.com/order",
              {
                items: cartItems,
                total_price: total,
                payment_id: response.razorpay_payment_id,
                payment_status: "Paid",
                delivery_address: `${address.name}, ${address.address}, ${address.city} - ${address.pincode}`,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            // Clear Cart
            clearCart();

            // Success Message
            alert("🎉 Order Placed Successfully!");

            // Redirect
            navigate("/success");

          } catch (error) {
            console.error(error);
            alert("Failed to save order.");
          }
        },

        prefill: {
          name: address.name,
          contact: address.phone,
        },

        notes: {
          address: `${address.address}, ${address.city} - ${address.pincode}`,
        },

        theme: {
          color: "#E23744",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(response.error);

        alert("❌ Payment Failed");
      });

      razorpay.open();

    } catch (error) {
      console.error(error);

      alert("Unable to initiate payment.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-form">
        <h2>Delivery Address</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={address.name}
          onChange={(e) =>
            setAddress({ ...address, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={address.phone}
          onChange={(e) =>
            setAddress({ ...address, phone: e.target.value })
          }
        />

        <textarea
          placeholder="Full Address"
          value={address.address}
          onChange={(e) =>
            setAddress({ ...address, address: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) =>
            setAddress({ ...address, city: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Pincode"
          value={address.pincode}
          onChange={(e) =>
            setAddress({ ...address, pincode: e.target.value })
          }
        />

        <button
          className="payment-btn"
          type="button"
          onClick={handlePayment}
        >
          Pay ₹{total.toFixed(2)}
        </button>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <div className="summary-item" key={item.id}>
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <hr />

        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Delivery: ₹{delivery.toFixed(2)}</p>
        <p>GST (5%): ₹{gst.toFixed(2)}</p>

        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default Checkout;