import LoginForm from "../../components/LoginForm/LoginForm"
import "./LoginPage.css"

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-page">
      <LoginForm onLogin={onLogin} />
    </div>
  )
}

export default LoginPage

