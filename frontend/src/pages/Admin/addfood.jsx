import "./addfood.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddFood() {
  const navigate = useNavigate();

  const [food, setFood] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !food.name ||
      !food.price ||
      !food.image ||
      !food.description
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/add-food`,
        food,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      alert("✅ Food Added Successfully");

      navigate("/admin/foods");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to add food."
      );
    }
  };

  return (
    <div className="add-food-page">

      <div className="form-card">

        <h1>Add Food</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Food Name"
            value={food.name}
            onChange={(e) =>
              setFood({
                ...food,
                name: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={food.price}
            onChange={(e) =>
              setFood({
                ...food,
                price: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Image URL"
            value={food.image}
            onChange={(e) =>
              setFood({
                ...food,
                image: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            rows="4"
            value={food.description}
            onChange={(e) =>
              setFood({
                ...food,
                description: e.target.value,
              })
            }
          />

          <button type="submit">
            Add Food
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddFood;