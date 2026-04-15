import { useEffect, useState } from "react";
import axios from "axios";



function Home() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/foods")
      .then((res) => setFoods(res.data))
      .catch((err) => console.log(err));
  }, []);

const addToCart = (food) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(food);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
};
  
  return (
    <div className="container">
      <h1 className="title">Food Menu <i class="fi fi-sr-menu-food" style={{color:"orange"}}></i></h1>

      <div className="grid">
        {foods.map((food) => (
          <div className="card" key={food.id}>
            <img
              src={food.image}
              alt={food.name}
              className="image"
            />

            <h2>{food.name}</h2>
            <p className="price">₹{food.price}</p>

<button className="btn" onClick={() => addToCart(food)}>
  Add to Cart <i class="fi fi-rr-shopping-cart-add"></i>
</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;