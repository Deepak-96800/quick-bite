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

/* Register */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Login */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Protected Route */
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome user",
    userId: req.user.id,
  });
});

/* Add Food */
app.post("/add-food", async (req, res) => {
  const { name, price, image } = req.body;

  try {
    await db.query(
      "INSERT INTO foods (name, price, image) VALUES ($1, $2, $3)",
      [name, price, image]
    );

    res.json({ message: "Food added" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Get Foods */
app.get("/foods", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM foods");

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Place Order */
app.post("/order", authMiddleware, async (req, res) => {
  const { items, total_price } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      "INSERT INTO orders (user_id, items, total_price) VALUES ($1, $2, $3)",
      [user_id, JSON.stringify(items), total_price]
    );

    res.json({ message: "Order placed successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* My Orders */
app.get("/my-orders", authMiddleware, async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Quick Bite Backend is Running 🚀");
});

app.use("/payment", paymentRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});