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

<div className="food-card">

    <div className="favorite">

        ❤

    </div>

    <img
        src={food.image}
        alt={food.name}
    />

    <div className="food-content">

        <h3>{food.name}</h3>

        <p>{food.description}</p>

        <div className="rating">

            ⭐ {food.rating}

        </div>

        <div className="bottom">

            <span>

                ₹{food.price}

            </span>

            <button>

                Add

            </button>

        </div>

    </div>

</div>

export default FoodCard;