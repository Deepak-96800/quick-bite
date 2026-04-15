import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/register", data);
    alert("Registered ✅");
    window.location.href = "/login";
  };

  return (
    <div className="auth">
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={(e) => setData({ ...data, name: e.target.value })} />

      <input placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })} />

      <input type="password" placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })} />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;