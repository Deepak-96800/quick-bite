const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    console.log("BODY:", req.body);
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, "secretkey", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
    });
  });
});

const authMiddleware = require("./auth");

// Protected route
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome user",
    userId: req.user.id,
  });
});

app.post("/add-food", (req, res) => {
  const { name, price, image } = req.body;

  const sql = "INSERT INTO foods (name, price, image) VALUES (?, ?, ?)";

  db.query(sql, [name, price, image], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Food added" });
  });
});

app.get("/foods", (req, res) => {
  const sql = "SELECT * FROM foods";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

app.post("/order", authMiddleware, (req, res) => {
  const { items, total_price } = req.body;
  const user_id = req.user.id;

  const sql =
    "INSERT INTO orders (user_id, items, total_price) VALUES (?, ?, ?)";

  db.query(sql, [user_id, JSON.stringify(items), total_price], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Order placed successfully" });
  });
});

app.get("/my-orders", authMiddleware, (req, res) => {
  const user_id = req.user.id;

  const sql = "SELECT * FROM orders WHERE user_id = ?";

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});