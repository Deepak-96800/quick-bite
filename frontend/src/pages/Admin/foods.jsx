import "./foods.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Foods() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/foods`
      );

      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

const deleteFood = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this food?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/food/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("✅ Food Deleted");

    fetchFoods();

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Unable to delete food."
    );
  }
};

  return (
    <div className="foods-page">

      <div className="foods-header">
        <h1>Food Management</h1>

        <Link to="/admin/add-food" className="add-btn">+ Add Food</Link>

      </div>

      <table>

        <thead>

          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {foods.map(food => (

            <tr key={food.id}>

              <td>
                <img
                  src={`${import.meta.env.VITE_API_URL}/${food.image}`}
                  alt={food.name}
                />
              </td>

              <td>{food.name}</td>

              <td>₹{food.price}</td>

              <td>

                <Link to={`/admin/edit-food/${food.id}`} className="edit">Edit</Link>

                <button className="delete" onClick={() => deleteFood(food.id)}>Delete</button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Foods;