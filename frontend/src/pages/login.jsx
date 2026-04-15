import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/login", data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login successful ✅");
    window.location.href = "/";
  };

  return (
    <div className="auth">
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })} />

      <input type="password" placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;