import Navbar from "./components/Navbar/navbar";
import Hero from "./components/Hero/hero";
import Categories from "./components/Categories/categories";
import PopularFoods from "./components/PopularFoods/popularfoods";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <PopularFoods />
      <ToastContainer
        position="top-right"
        autoClose={2000}
      />
    </>
  );
}

export default App;