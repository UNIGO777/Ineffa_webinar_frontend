import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Gift, Calendar, Clock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { animate, timeline } from '@motionone/dom';
import logoImg from './assets/Logo.png';
import './LandingPage.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const successRef = useRef(null);
  const checkmarkRef = useRef(null);
  const messageRef = useRef(null);
  const detailsRef = useRef(null);
  const confettiRef = useRef(null);
  
  // Get payment details from location state or use defaults
  const paymentDetails = location.state?.paymentDetails || {
    name: 'Valued Customer',
    service: 'Consultation',
    amount: '₹99',
    date: 'Please contact support',
    time: 'Please contact support'
  };

  // Create confetti effect
  const createConfetti = () => {
    const confettiColors = ['#9333ea', '#c084fc', '#f0abfc', '#e879f9', '#d946ef'];
    const confettiContainer = confettiRef.current;
    
    if (!confettiContainer) return;
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  };

  useEffect(() => {
    // Track purchase event with Facebook Pixel
    if (window.fbq) {
      fbq('track', 'Purchase', {currency: "USD", value: 30.00});
    }
    
    // Animate the success elements when component mounts
    if (successRef.current && checkmarkRef.current && messageRef.current && detailsRef.current) {
      // Animate the checkmark with a bounce effect
      timeline([
        [checkmarkRef.current, { opacity: [0, 1], scale: [0.5, 1.2, 1] }, { duration: 0.8, easing: 'ease-out' }],
        [messageRef.current, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, at: "-0.4" }],
        [detailsRef.current, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, at: "-0.2" }]
      ]);
      
      // Animate the success container
      animate(
        successRef.current,
        { opacity: [0, 1] },
        { duration: 0.5 }
      );
      
      // Create confetti effect
      createConfetti();
    }
    
    // Add CSS for confetti animation
    const style = document.createElement('style');
    style.textContent = `
      .confetti {
        position: fixed;
        top: -10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        animation: fall linear forwards;
        z-index: 1;
      }
      
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col relative overflow-hidden">
      {/* Confetti container */}
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none"></div>
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="Ineffa" className="h-8" />
        </Link>
      </header>

      {/* Success Content */}
      <div 
        ref={successRef}
        className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center"
      >
        <motion.div 
          ref={checkmarkRef}
          className="mb-8 relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 200 
          }}
        >
          <div className="absolute -inset-4 rounded-full bg-purple-100 animate-pulse"></div>
          <CheckCircle size={80} className="text-purple-600 relative z-10 success-checkmark" />
          <motion.div 
            className="absolute -inset-8 rounded-full border-2 border-purple-300 z-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatType: "loop"
            }}
          />
        </motion.div>

        <motion.div 
          ref={messageRef}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Thank you for booking a consultation with us. We're excited to work with you!
          </p>
        </motion.div>

        <motion.div 
          ref={detailsRef}
          className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full mb-8 success-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">Payment Details</h2>
          
          <div className="space-y-4 text-left">
            <motion.div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="p-2 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-grow flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{paymentDetails.name}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="p-2 bg-purple-100 rounded-full">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-grow flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium text-gray-900">{paymentDetails.service}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="p-2 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-grow flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">{paymentDetails.amount}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-grow flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{paymentDetails.date}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-grow flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-900">{paymentDetails.time}</span>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              A confirmation email has been sent to your registered email address with all the details.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Ineffa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PaymentSuccess;