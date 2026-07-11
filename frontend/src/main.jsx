import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { CartContext } from "../../context/cartcontext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);