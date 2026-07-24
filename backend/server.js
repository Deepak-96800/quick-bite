require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const authMiddleware = require("./auth");
const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors());
app.use(express.json());

/* ===========================
   Register
=========================== */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   Login
=========================== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   Profile
=========================== */
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome user",
    userId: req.user.id,
    is_admin: req.user.is_admin,
  });
});

/* ===========================
   Add Food
=========================== */
app.post("/add-food", async (req, res) => {
  const { name, price, image } = req.body;

  try {
    await db.query(
      "INSERT INTO foods (name, price, image) VALUES ($1, $2, $3)",
      [name, price, image]
    );

    res.json({
      success: true,
      message: "Food added successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   Get Foods
=========================== */
app.get("/foods", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM foods ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   Place Order
=========================== */
app.post("/order", authMiddleware, async (req, res) => {
  const {
    items,
    total_price,
    payment_id,
    payment_status,
    delivery_address,
  } = req.body;

  const user_id = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO orders
      (user_id, items, total_price, payment_id, payment_status, delivery_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        user_id,
        JSON.stringify(items),
        total_price,
        payment_id,
        payment_status,
        delivery_address,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   My Orders
=========================== */
app.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   Admin Dashboard
=========================== */
app.get("/admin/dashboard", authMiddleware, async (req, res) => {
  try {
    // Allow only admins
    if (!req.user.is_admin) {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const foods = await db.query(
      "SELECT COUNT(*) FROM foods"
    );

    const users = await db.query(
      "SELECT COUNT(*) FROM users"
    );

    const orders = await db.query(
      "SELECT COUNT(*) FROM orders"
    );

    const revenue = await db.query(
      "SELECT COALESCE(SUM(total_price),0) FROM orders WHERE payment_status='Paid'"
    );

    res.json({
      totalFoods: Number(foods.rows[0].count),
      totalUsers: Number(users.rows[0].count),
      totalOrders: Number(orders.rows[0].count),
      totalRevenue: Number(revenue.rows[0].coalesce),
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ===========================
   Home
=========================== */
app.get("/", (req, res) => {
  res.send("🚀 Quick Bite Backend is Running");
});

/* ===========================
   Payment Routes
=========================== */
app.use("/payment", paymentRoutes);

/* ===========================
   Server
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});