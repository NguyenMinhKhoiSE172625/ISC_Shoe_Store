import { motion } from "framer-motion"
import "./LoadingSpinner.css"

const LoadingSpinner = ({ size = "medium", color = "primary", text }) => {
  // Xác định kích thước dựa trên prop
  const sizeMap = {
    small: { width: 20, height: 20, borderWidth: 2 },
    medium: { width: 30, height: 30, borderWidth: 3 },
    large: { width: 40, height: 40, borderWidth: 4 }
  }

  // Xác định màu sắc dựa trên prop
  const colorMap = {
    primary: "#4a90e2",
    secondary: "#6c757d",
    success: "#38a169",
    danger: "#e53e3e",
    white: "#ffffff"
  }

  const spinnerSize = sizeMap[size] || sizeMap.medium
  const spinnerColor = colorMap[color] || colorMap.primary

  return (
    <div className="loading-spinner-container">
      <motion.div
        className="loading-spinner"
        style={{
          width: spinnerSize.width,
          height: spinnerSize.height,
          borderWidth: spinnerSize.borderWidth,
          borderTopColor: spinnerColor
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
}

export default LoadingSpinner 