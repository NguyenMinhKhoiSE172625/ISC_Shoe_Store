import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import "./HomePage.css"

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Step into Style with ShoeStore
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the perfect shoes for every occasion
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/products" className="btn btn-primary hero-btn">
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us
          </motion.h2>

          <div className="features-grid">
            {[
              {
                icon: "🌟",
                title: "Quality Products",
                description: "We offer only the highest quality footwear from trusted brands."
              },
              {
                icon: "🚚",
                title: "Fast Shipping",
                description: "Get your shoes delivered to your doorstep in no time."
              },
              {
                icon: "💰",
                title: "Best Prices",
                description: "Competitive prices and regular discounts on all our products."
              },
              {
                icon: "🔄",
                title: "Easy Returns",
                description: "Not satisfied? Return your purchase within 30 days."
              }
            ].map((feature, index) => (
              <motion.div 
                className="feature-card"
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Shop by Category
          </motion.h2>

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

