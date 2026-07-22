import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Cart from "./pages/Cart/cart";
import Checkout from "./pages/Checkout/checkout";
import OrderSuccess from "./pages/OrderSuccess/ordersuccess";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;