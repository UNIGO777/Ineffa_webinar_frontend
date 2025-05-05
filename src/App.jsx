import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'

const LandingPage = React.lazy(() => import('./Landing page/LandingPage1'))
const AdminPanel = React.lazy(() => import('./AdminPanel/Index'))

const LoadingSpinner = () => {
  const letterVariants = {
    initial: { y: -20, opacity: 0 },
    animate: i => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      color: "#646cff",
      transition: {
        duration: 0.3
      }
    }
  }

  const spinnerVariants = {
    animate: {
      rotate: 360,
      scale: [1, 1.1, 1],
      transition: {
        rotate: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }

  return (
    <div className="loading-container">
      <div className="loading-text">
        {['I', 'N', 'E', 'F', 'F', 'A'].map((letter, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            custom={i}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      {/* <motion.div
        className="loading-spinner"
        variants={spinnerVariants}
        animate="animate"
      /> */}
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App