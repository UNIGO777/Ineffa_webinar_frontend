import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'
import Calandry from './Calandry'
import RescheduleConsultaion from './Landing page/RescheduleConsultaion'
import logoImg from './Landing page/assets/Logo.png'

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
  const logoVariants = {
    animate: {
      scale:5,
      
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const glowVariants = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const textVariants = {
    animate: {
      opacity: [0, 1],
      y: [10, 0],
      transition: {
        duration: 1,
        delay: 0.5
      }
    }
  }

  return (
    <div className="loading-container">
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0
          }}
        />
        <motion.img 
          src={logoImg}
          alt="Ineffa Logo"
          variants={logoVariants}
          animate="animate"
          style={{ 
            width: '100px', 
            height: 'auto',
            zIndex: 1,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
          }}
        />
      </div>
      <motion.p
        variants={textVariants}
        animate="animate"
        style={{
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#333',
          letterSpacing: '1px'
        }}
      >
        Loading amazing experiences...
      </motion.p>
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