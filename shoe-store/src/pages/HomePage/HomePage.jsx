import { Link } from "react-router-dom"
import "./HomePage.css"

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Step into Style with ShoeStore</h1>
          <p>Discover the perfect shoes for every occasion</p>
          <Link to="/products" className="btn btn-primary hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Quality Products</h3>
              <p>We offer only the highest quality footwear from trusted brands.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Get your shoes delivered to your doorstep in no time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices and regular discounts on all our products.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return your purchase within 30 days.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>

          <div className="categories-grid">
            <Link to="/products" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=300&width=300" alt="Men's Shoes" />
              </div>
              <h3>Men's Shoes</h3>
            </Link>

            <Link to="/products" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=300&width=300" alt="Women's Shoes" />
              </div>
              <h3>Women's Shoes</h3>
            </Link>

            <Link to="/products" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=300&width=300" alt="Sports Shoes" />
              </div>
              <h3>Sports Shoes</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

