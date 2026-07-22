import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      alert("✅ Login Successful");

      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="auth">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
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
    </div>
  );
}

export default Login;