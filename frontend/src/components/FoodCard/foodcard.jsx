import "./foodcard.css";

function FoodCard({ food, addToCart }) {
  return (
    <div className="food-card">

      <img
        src={food.image}
        alt={food.name}
      />

      <div className="food-info">

        <h3>{food.name}</h3>

        <p className="rating">
          ⭐ 4.8
        </p>

        <h2>₹{food.price}</h2>

        <button
          onClick={() => addToCart(food)}
        >
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default FoodCard;