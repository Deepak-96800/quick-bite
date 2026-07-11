import "./hero.css";
import heroImage from "../../assets/images/hero.jpg";

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="overlay">
        <h1>Delicious Food Delivered to Your Doorstep</h1>

        <p>
          Order from your favourite restaurants with fast and reliable delivery.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for burgers, pizza, pasta..."
          />
          <button>Search</button>
        </div>

        <button className="explore-btn">
          Explore Menu
        </button>
      </div>
    </section>
  );
}

export default Hero;