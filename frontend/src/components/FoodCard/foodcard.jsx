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