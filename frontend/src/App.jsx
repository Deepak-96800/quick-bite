import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Cart from "./pages/Cart/cart";
import Checkout from "./pages/Checkout/checkout";
import OrderSuccess from "./pages/OrderSuccess/ordersuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />        
        <Route path="/order-success" element={<OrderSuccess />} />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;