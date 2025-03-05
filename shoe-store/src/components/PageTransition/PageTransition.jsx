import { motion } from "framer-motion"
import { pageVariants } from "./variants"

const PageTransition = ({ children, variants = pageVariants }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition 