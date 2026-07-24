import "./login.css";
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );

      // Save JWT Token
      localStorage.setItem("token", res.data.token);

      // Save Logged-in User
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("✅ Login Successful");

      // Redirect to Home
      navigate("/");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🍔 Quick Bite</h1>

        <h2>Welcome Back</h2>

        <input
          type="email"
          placeholder="Email Address"
          value={data.email}
          onChange={(e) =>
            setData({
              ...data,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) =>
            setData({
              ...data,
              password: e.target.value,
            })
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;