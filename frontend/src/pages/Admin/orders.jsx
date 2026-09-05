import "./orders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEye,
  FaUser,
  FaRupeeSign,
  FaCalendarAlt,
  FaBoxOpen,
} from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  /* ===========================
     Fetch All Orders
  =========================== */
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders || []);

    } catch (error) {
      console.error("Fetch Orders Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load orders."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===========================
     Parse Items
  =========================== */
  const parseItems = (items) => {
    if (Array.isArray(items)) return items;

    if (!items) return [];

    try {
      return JSON.parse(items);
    } catch (error) {
      console.error("Items Parse Error:", error);
      return [];
    }
  };

  /* ===========================
     Item Count
  =========================== */
  const getItemCount = (items) => {
    const parsedItems = parseItems(items);

    return parsedItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 1),
      0
    );
  };

  /* ===========================
     Format Date
  =========================== */
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ===========================
     Update Order Status
  =========================== */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        // Update only the changed order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        alert("✅ Order status updated");
      }

    } catch (error) {
      console.error("Update Status Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update order status."
      );

      // Reload orders in case of error
      fetchOrders();

    } finally {
      setUpdatingId(null);
    }
  };

  /* ===========================
     Status Class
  =========================== */
  const getStatusClass = (status) => {
    if (!status) return "pending";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* ===========================
     Loading
  =========================== */
  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loader"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      {/* ===========================
          Header
      =========================== */}
      <div className="orders-header">

        <div>
          <h1>Order Management</h1>
          <p>Manage and monitor customer orders</p>
        </div>

        <div className="order-count">
          <FaBoxOpen />
          <span>{orders.length} Orders</span>
        </div>

      </div>

      {/* ===========================
          No Orders
      =========================== */}
      {orders.length === 0 ? (
        <div className="no-orders">

          <FaBoxOpen />

          <h2>No Orders Found</h2>

          <p>
            There are currently no customer orders.
          </p>

        </div>
      ) : (

        /* ===========================
           Orders Table
        =========================== */

        <div className="orders-table-container">

          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  {/* Order ID */}
                  <td>
                    <span className="order-id">
                      #{order.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td>

                    <div className="customer-info">

                      <div className="customer-icon">
                        <FaUser />
                      </div>

                      <div>
                        <strong>
                          {order.name || "Unknown"}
                        </strong>

                        <small>
                          {order.email || "-"}
                        </small>
                      </div>

                    </div>

                  </td>

                  {/* Items */}
                  <td>
                    <span className="items-count">
                      {getItemCount(order.items)} Items
                    </span>
                  </td>

                  {/* Total */}
                  <td>

                    <span className="order-total">
                      <FaRupeeSign />
                      {Number(
                        order.total_price || 0
                      ).toFixed(2)}
                    </span>

                  </td>

                  {/* Payment */}
                  <td>

                    <span
                      className={`status-badge ${
                        order.payment_status
                          ?.toLowerCase() || "pending"
                      }`}
                    >
                      {order.payment_status || "Pending"}
                    </span>

                  </td>

                  {/* Order Status */}
                  <td>

                    <select
                      value={order.status || "Pending"}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className={`status-select ${getStatusClass(
                        order.status
                      )}`}
                    >

                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}

                    </select>

                    {updatingId === order.id && (
                      <small className="updating-text">
                        Updating...
                      </small>
                    )}

                  </td>

                  {/* Date */}
                  <td>

                    <div className="date-info">

                      <FaCalendarAlt />

                      <span>
                        {formatDate(
                          order.created_at
                        )}
                      </span>

                    </div>

                  </td>

                  {/* Action */}
                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        alert(
                          `Order #${order.id}\n\n` +
                          `Customer: ${
                            order.name || "-"
                          }\n` +
                          `Email: ${
                            order.email || "-"
                          }\n` +
                          `Total: ₹${Number(
                            order.total_price || 0
                          ).toFixed(2)}\n` +
                          `Payment: ${
                            order.payment_status ||
                            "-"
                          }\n` +
                          `Status: ${
                            order.status || "Pending"
                          }\n` +
                          `Address: ${
                            order.delivery_address ||
                            "-"
                          }`
                        )
                      }
                    >
                      <FaEye />
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Orders;