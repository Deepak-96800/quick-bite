import "./dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHamburger,
  FaUsers,
  FaClipboardList,
  FaRupeeSign,
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        console.log(error);
        alert("Unable to load dashboard.");
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Foods",
      value: stats.totalFoods,
      icon: <FaHamburger />,
      color: "#FF9800",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: "#2196F3",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: <FaClipboardList />,
      color: "#4CAF50",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: <FaRupeeSign />,
      color: "#E23744",
    },
  ];

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <h2>🍔 Quick Bite</h2>

        <ul>
          <li>Dashboard</li>
          <li>Foods</li>
          <li>Orders</li>
          <li>Users</li>
          <li>Logout</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <h1>Dashboard</h1>

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

              <h3>{card.title}</h3>

              <h2>{card.value}</h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;