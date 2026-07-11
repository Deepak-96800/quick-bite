import Navbar from "../../components/Navbar/navbar";
import Hero from "../../components/Hero/hero";
import Categories from "../../components/Categories/categories";
import PopularFoods from "../../components/PopularFoods/popularfoods";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <PopularFoods />
    </>
  );
}

export default Home;