import "./categories.css";

import {
  FaHamburger,
  FaPizzaSlice,
  FaIceCream,
  FaCoffee,
} from "react-icons/fa";

import { GiChickenOven } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";

const categories = [
  {
    id:1,
    name:"Burger",
    icon:<FaHamburger/>
  },
  {
    id:2,
    name:"Pizza",
    icon:<FaPizzaSlice/>
  },
  {
    id:3,
    name:"Chicken",
    icon:<GiChickenOven/>
  },
  {
    id:4,
    name:"Healthy",
    icon:<LuSalad/>
  },
  {
    id:5,
    name:"Drinks",
    icon:<FaCoffee/>
  },
  {
    id:6,
    name:"Desserts",
    icon:<FaIceCream/>
  }
];

function Categories() {

    return (

        <section className="categories">

            <h2>Browse by Category</h2>

            <div className="category-container">

                {categories.map(category => (

                    <div
                        className="category-card"
                        key={category.id}
                    >

                        <div className="icon">
                            {category.icon}
                        </div>

                        <p>{category.name}</p>

                    </div>

                ))}

            </div>

        </section>

    )

}

export default Categories;