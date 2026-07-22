import "./popularfoods.css";
import FoodCard from "../FoodCard/foodcard";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { CartContext } from "../../context/cartcontext";

function PopularFoods() {

  const [foods, setFoods] = useState([]);

  const { addToCart } = useContext(CartContext);

// console.log(import.meta.env.VITE_API_URL);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/foods`)
      .then((res) => {
        setFoods(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="popular-foods">

      <h2>Popular Foods</h2>

      <div className="food-grid">

        {foods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            addToCart={(food) => {
              addToCart(food);
              toast.success(`${food.name} added to cart`);
            }}
          />
        ))}

      </div>

    </section>
  );
}

export default PopularFoods;