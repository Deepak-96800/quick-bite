import "./myorders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/navbar";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setOrders(res.data);
      } catch (error) {
        console.log(error);
        alert("Please login first.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div className="orders-page">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Order #{order.id}</h3>

              <p>
                <strong>Status:</strong>{" "}
                {order.payment_status}
              </p>

              <p>
                <strong>Total:</strong> ₹
                {order.total_price}
              </p>

              <p>
                <strong>Delivery Address:</strong>
              </p>

              <p>{order.delivery_address}</p>

              <div className="order-items">
                <h4>Items</h4>

                {JSON.parse(order.items).map((item, index) => (
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
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyOrders;