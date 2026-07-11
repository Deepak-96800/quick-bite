import "./foodcard.css";

function FoodCard({ food, addToCart }) {
  return (
    <div className="food-card">

      <div className="favorite">❤</div>

      <img
        src={food.image}
        alt={food.name}
      />

      <div className="food-content">

        <h3>{food.name}</h3>

        <p>{food.description || "Delicious food"}</p>

        <div className="rating">
          ⭐ {food.rating || 4.8}
        </div>

        <div className="bottom">

          <span>₹{food.price}</span>

          <button onClick={() => addToCart(food)}>
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;