import Navbar from "./components/Navbar/navbar";
import Hero from "./components/Hero/hero";
import Categories from "./components/Categories/categories";
import PopularFoods from "./components/PopularFoods/popularfoods";
import { ToastContainer } from "react-toastify";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Cart from "./pages/Cart/cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;