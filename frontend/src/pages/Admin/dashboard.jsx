import "./dashboard.css";
import { FaHamburger, FaUsers, FaClipboardList, FaRupeeSign } from "react-icons/fa";

function AdminDashboard() {
  const stats = [
    {
      title: "Foods",
      value: "0",
      icon: <FaHamburger />,
      color: "#FF9800",
    },
    {
      title: "Users",
      value: "0",
      icon: <FaUsers />,
      color: "#2196F3",
    },
    {
      title: "Orders",
      value: "0",
      icon: <FaClipboardList />,
      color: "#4CAF50",
    },
    {
      title: "Revenue",
      value: "₹0",
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
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          {stats.map((card, index) => (
            <div className="stat-card" key={index}>
              <div
                className="icon"
                style={{ background: card.color }}
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