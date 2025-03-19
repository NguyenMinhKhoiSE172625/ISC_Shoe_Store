import RegisterForm from "../../components/RegisterForm/RegisterForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import "./RegisterPage.css"

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-image">
          <div className="register-image-content">
            <h1>Anh Bán Giày</h1>
            <p>Đăng ký để trở thành khách hàng thân thiết và nhận nhiều ưu đãi hấp dẫn cùng thông tin về các bộ sưu tập mới nhất.</p>
            <FontAwesomeIcon 
              icon={faUserPlus} 
              style={{ 
                fontSize: '4rem', 
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))'
              }} 
            />
          </div>
        </div>
        <div className="register-form-wrapper">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

