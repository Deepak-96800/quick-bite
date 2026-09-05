import "./dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaHamburger,
  FaUsers,
  FaClipboardList,
  FaRupeeSign,
  FaPlus,
  FaEye,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [dashboardRes, ordersRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/admin/dashboard`,
            { headers }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/admin/orders`,
            { headers }
          ),
        ]);

        setStats(dashboardRes.data);

        const orders = ordersRes.data.orders || [];

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.log(error);
        alert("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const cards = [
    {
      title: "Total Foods",
      value: stats.totalFoods,
      icon: <FaHamburger />,
      color: "#FF9800",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: "#2196F3",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaClipboardList />,
      color: "#4CAF50",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`,
      icon: <FaRupeeSign />,
      color: "#E23744",
    },
  ];

  const getStatusClass = (status) => {
    return status?.toLowerCase().replace(/\s+/g, "-") || "pending";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>🍔 Quick Bite</h2>

        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>

          <li>
            <Link to="/admin/foods">Foods</Link>
          </li>

          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>

          <li>
            <Link to="/admin/users">Users</Link>
          </li>

          <li>
            <Link
              to="/"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin 👋</p>
          </div>

          <Link to="/admin/foods" className="add-food-btn">
            <FaPlus />
            Add Food
          </Link>
        </div>

        {/* STAT CARDS */}
        <div className="stats-grid">
          {cards.map((card, index) => (
            <div className="stat-card" key={index}>

              <div
                className="icon"
                style={{
                  background: card.color,
                }}
              >
                {card.icon}
              </div>

              <div className="stat-info">
                <h3>{card.title}</h3>

                <h2>
                  {loading ? "..." : card.value}
                </h2>
              </div>

            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-actions">

          <Link to="/admin/foods" className="action-card">
            <div className="action-icon orange">
              <FaHamburger />
            </div>

            <div>
              <h3>Manage Foods</h3>
              <p>Add, edit or delete food items</p>
            </div>

            <FaArrowRight className="action-arrow" />
          </Link>

          <Link to="/admin/orders" className="action-card">
            <div className="action-icon green">
              <FaShoppingBag />
            </div>

            <div>
              <h3>Manage Orders</h3>
              <p>View and update customer orders</p>
            </div>

            <FaArrowRight className="action-arrow" />
          </Link>

          <Link to="/admin/users" className="action-card">
            <div className="action-icon blue">
              <FaUsers />
            </div>

            <div>
              <h3>Manage Users</h3>
              <p>View registered customers</p>
            </div>

            <FaArrowRight className="action-arrow" />
          </Link>

        </div>

        {/* RECENT ORDERS */}
        <div className="recent-orders">

          <div className="section-header">
            <h2>Recent Orders</h2>

            <Link to="/admin/orders" className="view-all">
              View All <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="empty-orders">
              Loading orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="empty-orders">
              No orders found.
            </div>
          ) : (
            <div className="orders-table-wrapper">

              <table className="orders-table">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>

                      <td>
                        <strong>#{order.id}</strong>
                      </td>

                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            <FaUsers />
                          </div>

                          <div>
                            <strong>
                              {order.name || "Customer"}
                            </strong>

                            <span>
                              {order.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {formatDate(order.created_at)}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            order.total_price || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <Link
                          to="/admin/orders"
                          className="view-order-btn"
                        >
                          <FaEye />
                          View
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;