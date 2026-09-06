import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,} from "recharts";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
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

const [analytics, setAnalytics] = useState({
  todayOrders: 0,
  todayRevenue: 0,
  orderStatus: [],
  revenueLast7Days: [],
  ordersLast7Days: [],
  topSellingFoods: [],
});

const [loading, setLoading] = useState(true);

const [salesOverview, setSalesOverview] = useState({
  orders: 0,
  revenue: 0,
  sales: [],
});

const [salesLoading, setSalesLoading] = useState(false);

const [salesPeriod, setSalesPeriod] = useState("30");

const [customStartDate, setCustomStartDate] = useState("");
const [customEndDate, setCustomEndDate] = useState("");

  const token = localStorage.getItem("token");

const fetchSalesOverview = async (
  startDate = null,
  endDate = null
) => {
  try {
    setSalesLoading(true);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let url = `${import.meta.env.VITE_API_URL}/admin/sales-overview`;

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await axios.get(url, {
      headers,
    });

    setSalesOverview({
      orders: response.data.summary?.orders || 0,
      revenue: response.data.summary?.revenue || 0,
      sales: response.data.sales || [],
    });

  } catch (error) {
    console.error("Sales Overview Error:", error);
  } finally {
    setSalesLoading(false);
  }
};

  // EXPORT SALES AS CSV
  const exportCSV = () => {
    if (salesOverview.sales.length === 0) {
      alert("No sales data available to export.");
      return;
    }

    const csvData = salesOverview.sales.map((item) => ({
      Date: item.date,
      Orders: Number(item.orders || 0),
      Revenue: Number(item.revenue || 0),
    }));

    const headers = ["Date", "Orders", "Revenue"];

    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        [
          row.Date,
          row.Orders,
          row.Revenue,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quick-bite-sales-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

// EXPORT PROFESSIONAL SALES REPORT AS EXCEL
const exportExcel = () => {
  if (salesOverview.sales.length === 0) {
    alert("No sales data available to export.");
    return;
  }

  // Daily sales data
  const salesData = salesOverview.sales.map((item) => ({
    Date: item.date,
    Orders: Number(item.orders || 0),
    Revenue: Number(item.revenue || 0),
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // ================= SUMMARY SHEET =================

  const summaryData = [
    ["QUICK BITE - SALES REPORT"],
    [],
    ["Report Information", ""],
    ["Generated On", new Date().toLocaleString("en-IN")],
    ["Total Orders", Number(salesOverview.orders || 0)],
    [
      "Total Revenue",
      `₹${Number(salesOverview.revenue || 0).toLocaleString("en-IN")}`,
    ],
    [],
    ["Daily Sales", "", ""],
    ["Date", "Orders", "Revenue"],
    ...salesData.map((item) => [
      item.Date,
      item.Orders,
      `₹${item.Revenue.toLocaleString("en-IN")}`,
    ]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Column widths
  summarySheet["!cols"] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
  ];

  // Merge report title
  summarySheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 2 },
    },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Sales Summary"
  );

  // ================= DAILY SALES SHEET =================

  const dailySheet = XLSX.utils.json_to_sheet(salesData);

  dailySheet["!cols"] = [
    { wch: 18 },
    { wch: 12 },
    { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    dailySheet,
    "Daily Sales"
  );

// ================= FOOD SALES SHEET =================

const foodSalesData = analytics.topSellingFoods.map(
  (food, index) => ({
    Rank: index + 1,
    Food: food.name,
    "Quantity Sold": Number(food.quantity || 0),
    Revenue: Number(food.revenue || 0),
  })
);

const foodSheet = XLSX.utils.json_to_sheet(foodSalesData);

foodSheet["!cols"] = [
  { wch: 10 },
  { wch: 30 },
  { wch: 18 },
  { wch: 18 },
];

XLSX.utils.book_append_sheet(
  workbook,
  foodSheet,
  "Food Sales"
);

  // ================= EXPORT =================

  XLSX.writeFile(
    workbook,
    "quick-bite-sales-report.xlsx"
  );
};

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

const [dashboardRes, ordersRes, topFoodsRes] = await Promise.all([
  axios.get(
    `${import.meta.env.VITE_API_URL}/admin/dashboard`,
    { headers }
  ),

  axios.get(
    `${import.meta.env.VITE_API_URL}/admin/orders`,
    { headers }
  ),

  axios.get(
    `${import.meta.env.VITE_API_URL}/admin/top-selling-foods`,
    { headers }
  ),
]);

setStats(dashboardRes.data);

setAnalytics({
  todayOrders: dashboardRes.data.todayOrders || 0,
  todayRevenue: dashboardRes.data.todayRevenue || 0,
  orderStatus: dashboardRes.data.orderStatus || [],
  revenueLast7Days: dashboardRes.data.revenueLast7Days || [],
  ordersLast7Days: dashboardRes.data.ordersLast7Days || [],
  topSellingFoods: topFoodsRes.data.topSellingFoods || [],  
});
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

// SALES OVERVIEW
useEffect(() => {
  fetchSalesOverview();
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

<div className="today-grid">

  <div className="today-card">
    <div className="today-icon orders">
      <FaClipboardList />
    </div>

    <div>
      <p>Today's Orders</p>
      <h2>
        {loading ? "..." : analytics.todayOrders}
      </h2>
    </div>
  </div>

  <div className="today-card">
    <div className="today-icon revenue">
      <FaRupeeSign />
    </div>

    <div>
      <p>Today's Revenue</p>
      <h2>
        {loading
          ? "..."
          : `₹${Number(
              analytics.todayRevenue
            ).toLocaleString("en-IN")}`}
      </h2>
    </div>
  </div>

</div>

<div className="charts-section">

  {/* REVENUE CHART */}
  <div className="chart-card">

    <div className="chart-header">
      <h2>Revenue - Last 7 Days</h2>
    </div>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={analytics.revenueLast7Days}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            )
          }
        />

        <YAxis />

        <Tooltip
          formatter={(value) => [
            `₹${Number(value).toLocaleString("en-IN")}`,
            "Revenue",
          ]}
        />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#E23744"
          strokeWidth={3}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>

  </div>


  {/* ORDERS CHART */}
  <div className="chart-card">

    <div className="chart-header">
      <h2>Orders - Last 7 Days</h2>
    </div>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={analytics.ordersLast7Days}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            )
          }
        />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Bar
          dataKey="orders"
          fill="#176291"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>

  </div>

</div>

<div className="status-chart-card">

  <div className="chart-header">
    <h2>Order Status</h2>
  </div>

  {analytics.orderStatus.length === 0 ? (
    <div className="no-chart-data">
      No order status data available.
    </div>
  ) : (
    <div className="status-chart">

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>

<Pie
  data={analytics.orderStatus.map((item) => ({
    ...item,
    count: Number(item.count),
  }))}
  dataKey="count"
  nameKey="status"
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={110}
  paddingAngle={3}
  label
>
  {analytics.orderStatus.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={[
        "#FF9800",
        "#2196F3",
        "#9C27B0",
        "#03A9F4",
        "#4CAF50",
        "#E23744",
      ][index % 6]}
    />
  ))}
</Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  )}

</div>

{/* ================= TOP SELLING FOODS ================= */}

<div className="top-foods-card">

  <div className="chart-header">
    <h2>🔥 Top Selling Foods</h2>
    <p>Most ordered foods</p>
  </div>

  {analytics.topSellingFoods.length === 0 ? (
    <div className="no-chart-data">
      No sales data available.
    </div>
  ) : (
    <div className="top-foods-list">

      {analytics.topSellingFoods.map((food, index) => (
        <div
          className="top-food-item"
          key={`${food.name}-${index}`}
        >

          <div className="food-rank">
            #{index + 1}
          </div>

          <div className="food-info">
            <h3>{food.name}</h3>

            <p>
              {food.quantity} orders
            </p>
          </div>

          <div className="food-revenue">
            <span>Revenue</span>

            <strong>
              ₹{Number(food.revenue).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>
      ))}

    </div>
  )}

</div>

{/* ================= SALES OVERVIEW ================= */}

<div className="sales-overview-card">

  <div className="sales-header">

    <div>
      <h2>📊 Sales Overview</h2>
      <p>Track orders and revenue</p>
    </div>

<div className="sales-controls">

  <div className="sales-periods">

    <button
      className={salesPeriod === "1" ? "active" : ""}
      onClick={() => {
        setSalesPeriod("1");

        const today = new Date()
          .toISOString()
          .split("T")[0];

        fetchSalesOverview(today, today);
      }}
    >
      Today
    </button>

    <button
      className={salesPeriod === "7" ? "active" : ""}
      onClick={() => {
        setSalesPeriod("7");

        const end = new Date();

        const start = new Date();
        start.setDate(end.getDate() - 6);

        fetchSalesOverview(
          start.toISOString().split("T")[0],
          end.toISOString().split("T")[0]
        );
      }}
    >
      7 Days
    </button>

    <button
      className={salesPeriod === "30" ? "active" : ""}
      onClick={() => {
        setSalesPeriod("30");

        fetchSalesOverview();
      }}
    >
      30 Days
    </button>

  </div>

  <div className="custom-date-range">

    <input
      type="date"
      value={customStartDate}
      onChange={(e) => {
        setCustomStartDate(e.target.value);
        setSalesPeriod("custom");
      }}
    />

    <span>to</span>

    <input
      type="date"
      value={customEndDate}
      onChange={(e) => {
        setCustomEndDate(e.target.value);
        setSalesPeriod("custom");
      }}
    />

    <button
      className="apply-date-btn"
      onClick={() => {

        if (!customStartDate || !customEndDate) {
          alert("Please select both start and end dates.");
          return;
        }

        if (customStartDate > customEndDate) {
          alert("Start date cannot be after end date.");
          return;
        }

        fetchSalesOverview(
          customStartDate,
          customEndDate
        );
      }}
    >
      Apply
    </button>

  </div>

<div className="export-buttons">
  <button
    className="export-csv-btn"
    onClick={exportCSV}
    disabled={salesLoading || salesOverview.sales.length === 0}
  >
    📄 Export CSV
  </button>

  <button
    className="export-excel-btn"
    onClick={exportExcel}
    disabled={salesLoading || salesOverview.sales.length === 0}
  >
    📊 Export Excel
  </button>
</div>  

</div>

  </div>


  {/* SUMMARY */}

  <div className="sales-summary">

    <div className="sales-summary-box">

      <span>Total Orders</span>

      <strong>
        {salesLoading
          ? "..."
          : salesOverview.orders}
      </strong>

    </div>


    <div className="sales-summary-box">

      <span>Total Revenue</span>

      <strong>
        {salesLoading
          ? "..."
          : `₹${Number(
              salesOverview.revenue
            ).toLocaleString("en-IN")}`}
      </strong>

    </div>

  </div>


  {/* CHART */}

  <div className="sales-chart">

    {salesLoading ? (
      <div className="no-chart-data">
        Loading sales data...
      </div>
    ) : salesOverview.sales.length === 0 ? (
      <div className="no-chart-data">
        No sales data available.
      </div>
    ) : (

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart
          data={salesOverview.sales}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                }
              )
            }
          />

  {/* Revenue Axis */}
  <YAxis
    yAxisId="revenue"
    orientation="left"
    tickFormatter={(value) =>
      `₹${Number(value).toLocaleString("en-IN")}`
    }
  />

    {/* Orders Axis */}
  <YAxis
    yAxisId="orders"
    orientation="right"
    allowDecimals={false}
  />

          <Tooltip
            formatter={(value, name) => [
              name === "revenue"
                ? `₹${Number(
                    value
                  ).toLocaleString("en-IN")}`
                : value,
              name === "revenue"
                ? "Revenue"
                : "Orders",
            ]}
          />

          <Legend />

  <Line
    type="monotone"
    dataKey="revenue"
    name="Revenue"
    yAxisId="revenue"
    stroke="#E23744"
    strokeWidth={3}
    dot={{ r: 4 }}
  />

  <Line
    type="monotone"
    dataKey="orders"
    name="Orders"
    yAxisId="orders"
    stroke="#176291"
    strokeWidth={3}
    dot={{ r: 4 }}
  />

        </LineChart>

      </ResponsiveContainer>

    )}

  </div>

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