import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'
import Calandry from './Calandry'
import RescheduleConsultaion from './Landing page/RescheduleConsultaion'

const LandingPage = React.lazy(() => import('./Landing page/LandingPage1'))
const AdminPanel = React.lazy(() => import('./AdminPanel/Index'))
const PaymentSuccess = React.lazy(() => import('./Landing page/PaymentSuccess'))

// Protected route component for PaymentSuccess page
const ProtectedPaymentRoute = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Check if user has payment verification in localStorage
  const hasPaymentVerification = localStorage.getItem('paymentVerified') === 'true'
  
  // If no verification, redirect to home with a message
  useEffect(() => {
    if (!hasPaymentVerification && !location.state?.paymentDetails) {
      // Set a message in localStorage to display on the landing page
      localStorage.setItem('paymentRedirectMessage', 'Direct access to payment success page is not allowed. Please complete the payment process first.')
      navigate('/', { replace: true })
    }
  }, [hasPaymentVerification, location.state, navigate])
  
  // Clear the verification after successful access
  useEffect(() => {
    return () => {
      localStorage.removeItem('paymentVerified')
    }
  }, [])
  
  // If verification checks pass, render the PaymentSuccess component
  if (!hasPaymentVerification && !location.state?.paymentDetails) {
    return null // Return null while redirect happens in useEffect
  }
  
  return <PaymentSuccess />
}

// Scroll to top component that executes on route change
const ScrollToTop = () => {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return null
}

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
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/calandry" element={<Calandry />} />
          <Route path="/payment-success" element={<ProtectedPaymentRoute />} />
          <Route path="/reshedule-consultaion" element={<RescheduleConsultaion />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App