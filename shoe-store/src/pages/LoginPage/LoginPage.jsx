import LoginForm from "../../components/LoginForm/LoginForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoePrints } from "@fortawesome/free-solid-svg-icons"
import "./LoginPage.css"

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image">
          <div className="login-image-content">
            <h1>Anh Bán Giày</h1>
            <p>Trải nghiệm mua sắm giày dép tuyệt vời với những mẫu giày thời thượng và chất lượng.</p>
            <FontAwesomeIcon 
              icon={faShoePrints} 
              style={{ 
                fontSize: '4rem', 
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))'
              }} 
            />
          </div>
        </div>
        <div className="login-form-wrapper">
          <LoginForm onLogin={onLogin} />
        </div>
      </div>
    </div>
  )
}

export default LoginPage

