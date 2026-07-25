import "./editfood.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/food/${id}`
      );

      setFood(res.data);
    } catch (error) {
      console.log(error);
      alert("Food not found.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/food/${id}`,
        food,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Food Updated Successfully");
      navigate("/admin/foods");

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Update failed"
      );
    }
  };

  return (
    <div className="add-food-page">
      <div className="form-card">

        <h1>Edit Food</h1>

        <form onSubmit={handleUpdate}>

          <input
            type="text"
            placeholder="Food Name"
            value={food.name}
            onChange={(e) =>
              setFood({ ...food, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={food.price}
            onChange={(e) =>
              setFood({ ...food, price: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Image"
            value={food.image}
            onChange={(e) =>
              setFood({ ...food, image: e.target.value })
            }
          />

          <textarea
            rows="4"
            placeholder="Description"
            value={food.description || ""}
            onChange={(e) =>
              setFood({
                ...food,
                description: e.target.value,
              })
            }
          />

          <button type="submit">
            Update Food
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditFood;