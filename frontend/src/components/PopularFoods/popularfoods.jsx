import "./popularfoods.css";
import FoodCard from "../FoodCard/foodcard";
import axios from "axios";
import { useEffect, useState } from "react";

function PopularFoods() {

    const [foods, setFoods] = useState([]);

    useEffect(() => {

        axios
            .get("https://quick-bite-backend-g4k9.onrender.com/foods")
            .then((res) => {

                setFoods(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    const addToCart = (food) => {

        alert(food.name + " added to cart");

    };

    return (

        <section className="popular-foods">

            <h2>Popular Foods</h2>

            <div className="food-grid">

                {foods.map(food => (

                    <FoodCard
                        key={food.id}
                        food={food}
                        addToCart={addToCart}
                    />

                ))}

            </div>

        </section>

    );

}

export default PopularFoods;