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
            Bước Vào Phong Cách Cùng <br />Anh Bán Giày
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Khám phá những đôi giày hoàn hảo cho mọi dịp
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/products" className="btn btn-primary hero-btn">
              Mua Ngay
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
            Tại Sao Chọn Chúng Tôi
          </motion.h2>

          <div className="features-grid">
            {[
              {
                icon: "🌟",
                title: "Sản Phẩm Chất Lượng",
                description: "Chúng tôi chỉ cung cấp giày dép chất lượng cao từ các thương hiệu uy tín."
              },
              {
                icon: "🚚",
                title: "Giao Hàng Nhanh",
                description: "Nhận giày của bạn tại nhà trong thời gian ngắn nhất."
              },
              {
                icon: "💰",
                title: "Giá Tốt Nhất",
                description: "Giá cả cạnh tranh và thường xuyên giảm giá trên tất cả sản phẩm."
              },
              {
                icon: "🔄",
                title: "Đổi Trả Dễ Dàng",
                description: "Không hài lòng? Trả lại sản phẩm trong vòng 30 ngày."
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
            Mua Sắm Theo Danh Mục
          </motion.h2>

          <div className="categories-grid">
            <Link to="/products" className="category-card">
              <div className="category-image">
                <img src="https://i.ytimg.com/vi/0jvt8Js0OU0/maxresdefault.jpg" alt="Giày Nam" />
              </div>
              <h3>Giày Nam</h3>
            </Link>

            <Link to="/products" className="category-card">
              <div className="category-image">
                <img src="https://i.redd.it/wck5ryuztfq31.png" alt="Giày Nữ" />
              </div>
              <h3>Giày Nữ</h3>
            </Link>

            <Link to="/products" className="category-card">
              <div className="category-image">
                <img src="https://i.natgeofe.com/n/f4456538-ddd4-401f-946d-0dca7e450d9b/2024-0228-29_HOKA_F24BRAND_ROAD_MMF_MACHX2_LIBRARY7_FULL_RGB_4x3.jpg?w=1224&h=918" alt="Giày Thể Thao" />
              </div>
              <h3>Giày Thể Thao</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

