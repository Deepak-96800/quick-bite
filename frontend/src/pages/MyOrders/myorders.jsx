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
                  : order.items;
            } catch {
              items = [];
            }

            return (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <h3>Order #{order.id}</h3>

                  <span className="status">
                    {order.payment_status}
                  </span>
                </div>

                <p>
                  <strong>Total:</strong> ₹
                  {Number(order.total_price).toFixed(2)}
                </p>

                <p>
                  <strong>Delivery Address:</strong>
                </p>

                <p>{order.delivery_address}</p>

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

                <p className="order-date">
                  Ordered on{" "}
                  {new Date(order.created_at).toLocaleString()}
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