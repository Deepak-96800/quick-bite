const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Remove "Bearer "
    const cleanToken = token.split(" ")[1];

    const decoded = jwt.verify(cleanToken, "secretkey");

    req.user = decoded; // store user info
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;