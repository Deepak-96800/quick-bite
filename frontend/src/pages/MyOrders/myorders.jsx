import "./myorders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching My Orders...");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Orders:", res.data);

        setOrders(res.data);
      } catch (error) {
        console.error(error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 400
        ) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          alert(
            error.response?.data?.message ||
              "Unable to load orders."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const orderStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "Confirmed":
        return "status-confirmed";

      case "Preparing":
        return "status-preparing";

      case "Out for Delivery":
        return "status-delivery";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="orders-page">
          <h2>Loading Orders...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="orders-page">
        <h1>🍔 My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => {
            let items = [];

            try {
              items =
                typeof order.items === "string"
                  ? JSON.parse(order.items)
                  : order.items || [];
            } catch {
              items = [];
            }

            const currentStatus = order.status || "Pending";

            const currentStatusIndex =
              orderStatuses.indexOf(currentStatus);

            return (
              <div className="order-card" key={order.id}>
                {/* =========================
                    ORDER HEADER
                ========================== */}
                <div className="order-header">
                  <h3>Order #{order.id}</h3>

                  <span
                    className={`status ${getStatusClass(
                      currentStatus
                    )}`}
                  >
                    {currentStatus}
                  </span>
                </div>

                {/* =========================
                    ORDER TRACKING
                ========================== */}
                {currentStatus !== "Cancelled" && (
                  <div className="order-tracking">
                    <h4>Order Tracking</h4>

                    <div className="tracking-container">
                      {orderStatuses.map((status, index) => {
                        const completed =
                          currentStatusIndex >= index;

                        return (
                          <div
                            className={`tracking-step ${
                              completed ? "completed" : ""
                            }`}
                            key={status}
                          >
                            <div className="tracking-circle">
                              {completed ? "✓" : index + 1}
                            </div>

                            <p>{status}</p>

                            {index < orderStatuses.length - 1 && (
                              <div
                                className={`tracking-line ${
                                  currentStatusIndex > index
                                    ? "completed-line"
                                    : ""
                                }`}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* =========================
                    CANCELLED MESSAGE
                ========================== */}
                {currentStatus === "Cancelled" && (
                  <div className="cancelled-message">
                    ❌ This order has been cancelled.
                  </div>
                )}

                {/* =========================
                    PAYMENT STATUS
                ========================== */}
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.payment_status || "Pending"}
                </p>

                {/* =========================
                    TOTAL
                ========================== */}
                <p>
                  <strong>Total:</strong> ₹
                  {Number(order.total_price).toFixed(2)}
                </p>

                {/* =========================
                    DELIVERY ADDRESS
                ========================== */}
                <p>
                  <strong>Delivery Address:</strong>
                </p>

                <p>{order.delivery_address}</p>

                {/* =========================
                    ORDER ITEMS
                ========================== */}
                <div className="order-items">
                  <h4>Items</h4>

                  {items.map((item, index) => (
                    <div className="item" key={index}>
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div>
                        <h4>{item.name}</h4>

                        <p>
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* =========================
                    ORDER DATE
                ========================== */}
                <p className="order-date">
                  Ordered on{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default MyOrders;