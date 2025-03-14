import { motion } from "framer-motion"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import "./LoadingButton.css"

const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = "Đang xử lý...",
  type = "button",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      className={`loading-button ${className} ${isLoading ? "is-loading" : ""}`}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="loading-button-content">
          <LoadingSpinner size="small" color="white" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default LoadingButton 