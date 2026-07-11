import Navbar from "../components/Navbar/navbar";
import Hero from "../components/Hero/hero";
import Categories from "../components/Categories/categories";
import PopularFoods from "../components/PopularFoods/popularfoods";
import { ToastContainer } from "react-toastify";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <PopularFoods />
      <ToastContainer />
    </>
  );
}

export default Home;