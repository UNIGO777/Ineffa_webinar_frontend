import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, CheckCircle, X, Monitor, Zap, Users, Award, ArrowRight, ThumbsUp, BookOpen, MessageCircle, Star, Download, ChevronDown, ChevronUp, Play, User, Phone, Mail, Gift } from 'lucide-react';
import './LandingPage.css';
import video2 from './assets/video.mp4'

// Import assets
import logoImg from './assets/Logo.png';
import genAIImg from './assets/GenAi.svg';
import webinarImg from './assets/GenAI.png';
import figmaLogo from './assets/figma-logo-svg-150px.svg';
import miroLogo from './assets/miro-logo-svg-150px.svg';

// Import service
import { webinarService } from '../services/webinarService';
import CarouselDemo from '../components/CarouselDemo';
import CurvedCarousel from '../Carosel';

const WebinarPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [webinarDates, setWebinarDates] = useState([]);
  const [formError, setFormError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: registration form, 2: payment, 3: success
  const [webinarId, setWebinarId] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  
  // Popup state management
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [popupStep, setPopupStep] = useState(1); // 1: promotional, 2: booking form, 3: payment, 4: success
  
  // Form data state
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    webinarDate: ''
  });
  
  // FAQ state
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Refs for animations
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  
  // FAQ data
  const faqItems = [
    {
      question: "What will I learn in the UI/UX Design webinar?",
      answer: "This webinar covers essential UI/UX design principles, wireframing techniques, prototyping methods, user research fundamentals, and practical design system implementation. You'll gain both theoretical knowledge and hands-on tips you can apply immediately."
    },
    {
      question: "Do I need prior design experience to join?",
      answer: "No prior experience is necessary! The webinar is structured to benefit both beginners and those with some design background. We explain concepts clearly and provide resources for all skill levels."
    },
    {
      question: "Will I receive a certificate after completion?",
      answer: "Yes, all participants will receive a certificate of completion that you can add to your portfolio or LinkedIn profile to showcase your commitment to improving your UI/UX design skills."
    },
    {
      question: "Is there a recording available if I can't attend live?",
      answer: "Yes, all registered participants will receive a recording of the webinar that will be available for 30 days after the live session, so you can review the content at your convenience."
    },
    {
      question: "What software or tools do I need for the webinar?",
      answer: "You don't need any specific software for the webinar itself. We'll demonstrate concepts using popular tools like Figma and Miro, but you only need a computer with internet access to participate."
    }
  ];
  
  // Fetch available webinar dates
  useEffect(() => {
    const fetchWebinarDates = async () => {
      try {
        setLoading(true);
        const response = await webinarService.getWebinarDates();
        setWebinarDates(response.data.dates);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch webinar dates. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchWebinarDates();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear form error when user starts typing
    if (formError) {
      setFormError('');
    }
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setBookingData((prev) => ({
      ...prev,
      webinarDate: date
    }));
    if (formError) {
      setFormError('');
    }
  };
  
  // Toggle FAQ items
  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };
  
  // Validate form inputs
  const validateForm = () => {
    setFormError('');
    
    // Check if all required fields are filled
    if (!bookingData.name.trim() || !bookingData.email.trim() || !bookingData.phone.trim() || !bookingData.webinarDate) {
      setFormError('Please fill in all required fields');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email.trim())) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/[^0-9]/g, ''))) {
      setFormError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    
    return true;
  };
  
  // Book webinar and proceed to payment
  const handleBookWebinar = async () => {
    if (!validateForm()) return;
    
    try {
      setPaymentLoading(true);
      setFormError('');
      
      // Create webinar booking
      const response = await webinarService.bookWebinar(bookingData);
      
      if (response.data && response.data.webinar && response.data.webinar._id) {
        // Store webinar ID for payment
        setWebinarId(response.data.webinar._id);
        
        // Move to payment step
        setPopupStep(3);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error booking webinar:', error);
      setFormError('Failed to book webinar. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!webinarId) {
      setFormError('Webinar booking not found. Please try again.');
      return;
    }
    
    try {
      setPaymentLoading(true);
      setFormError('');
      
      // Initiate payment
      const response = await webinarService.initiatePayment(webinarId);
      
      if (!response.data || !response.data.order) {
        throw new Error('Failed to initialize payment');
      }
      
      // Get Razorpay order details
      const { order, key_id } = response.data;
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }
      
      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Ineffa',
        description: 'UI/UX Design Webinar',
        order_id: order.id,
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: bookingData.phone
        },
        theme: {
          color: '#000000'
        },
        handler: async function (razorpayResponse) {
          try {
            // Verify payment and update webinar status
            const verifyResponse = await webinarService.verifyPayment({
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              webinarId: webinarId
            });
            
            if (verifyResponse.data) {
              setPopupMessage('Payment successful! You will receive the webinar details via email and WhatsApp.');
              setPopupStep(4);
              
              // Auto close after 5 seconds
              setTimeout(() => {
                setShowBookingPopup(false);
                setPopupStep(1);
                // Reset form
                setBookingData({ name: '', email: '', phone: '', webinarDate: '' });
                setWebinarId('');
              }, 5000);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setFormError('Payment verification failed. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            setFormError('Payment was cancelled');
          }
        }
      };
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      setFormError(error.message || 'Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Open booking popup
  const openBookingPopup = () => {
    setShowBookingPopup(true);
    setPopupStep(1);
  };

  // Close booking popup
  const closeBookingPopup = () => {
    setShowBookingPopup(false);
    setPopupStep(1);
    setFormError('');
    setPaymentLoading(false);
  };

  // Continue from promotional step to booking form
  const continueToBooking = () => {
    setPopupStep(2);
  };

  // Success Popup Component
  const SuccessPopup = () => (
    <div
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-sm w-full border-l-4 border-green-600"
      style={{
        animation: 'slideIn 0.5s forwards',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900 text-left">{popupMessage}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => setShowSuccessPopup(false)}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
  

  
  // Payment component
  const PaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment</h3>
      
      {formError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm mb-4">
          {formError}
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">UI/UX Design Webinar</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {webinarDates.find(d => new Date(d.date).toISOString() === new Date(bookingData.webinarDate).toISOString())?.formattedDate || new Date(bookingData.webinarDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">12:00 PM</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
            <span className="text-gray-800 font-medium">Total Amount:</span>
            <span className="font-bold text-black">₹100</span>
          </div>
        </div>
      </div>
      
      {paymentLoading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-3"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      ) : (
        <div className="pt-2 flex justify-between">
          <button
            onClick={() => setPopupStep(2)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            className="px-6 py-2 border-2 border-black hover:bg-black hover:text-white text-black rounded-lg transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">Pay ₹100</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10H21M7 15H8M12 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
  
  // Success component
  const SuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center py-8"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
      <p className="text-gray-600 mb-6">Your webinar registration has been successfully completed. We've sent the details to your email.</p>
      <button
        onClick={() => {
          // Reset form
          setCurrentStep(1);
          setBookingData({
            name: '',
            email: '',
            phone: '',
            webinarDate: ''
          });
        }}
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
      >
        Register for Another Webinar
      </button>
    </motion.div>
  );
  
  // Webinar syllabus component
  const WebinarSyllabus = () => (
    <div className="bg-gray-50 rounded-xl p-8 my-12">
      <h3 className="text-2xl font-bold mb-6 text-center">What You'll Learn</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="rounded-full bg-black/5 w-10 h-10 flex mb-4 items-center justify-center mr-4 flex-shrink-0">
              <span className="font-semibold">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">UI/UX Fundamentals</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Core design principles for digital interfaces</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Visual hierarchy and information architecture</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Color theory and typography in UI design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="rounded-full bg-black/5 w-10 h-10 mb-4 flex items-center justify-center mr-4 flex-shrink-0">
              <span className="font-semibold">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">User Research Techniques</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>User persona development and journey mapping</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Effective user testing methodologies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Analyzing user feedback and metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="rounded-full bg-black/5 w-10 h-10 flex mb-4 items-center justify-center mr-4 flex-shrink-0">
              <span className="font-semibold">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Wireframing & Prototyping</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Low to high-fidelity wireframing techniques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Interactive prototyping tools and methods</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Responsive design considerations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="rounded-full bg-black/5 w-10 h-10 flex mb-4 items-center justify-center mr-4 flex-shrink-0">
              <span className="font-semibold">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Design Systems</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Building scalable component libraries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Maintaining design consistency</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-black mr-2 mt-1 flex-shrink-0" />
                  <span>Documentation and collaboration workflows</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // FAQ component
  const FAQSection = () => (
    <div className="my-16">
      <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-lg">{item.question}</span>
              <span className="flex-shrink-0 ml-4">
                {expandedFAQ === index ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </button>
            {expandedFAQ === index && (
              <div 
                className="px-6 py-4 bg-gray-50"
                style={{ animation: 'faqSlideDown 0.3s ease-out forwards' }}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  // WebinarFeatures component
  const WebinarFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center hover:shadow-md transition-all duration-300"
      >
        <div className="rounded-full bg-black/5 w-12 h-12 flex items-center justify-center mb-4">
          <Zap className="h-6 w-6 text-black" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Expert-Led Training</h3>
        <p className="text-gray-600">Learn from experienced UI/UX designers with years of industry experience</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 p-6 rounded-xl flex flex-col justify-center items-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
      >
        <div className="rounded-full bg-black/5 w-12 h-12 flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-black" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Interactive Session</h3>
        <p className="text-gray-600">Ask questions in real-time and get personalized advice for your projects</p>
      </motion.div>

      
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 p-6 rounded-xl flex flex-col justify-center items-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
      >
        <div className="rounded-full bg-black/5 w-12 h-12 flex items-center justify-center mb-4">
          <Award className="h-6 w-6 text-black" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Certificate of Completion</h3>
        <p className="text-gray-600">Receive a certificate that recognizes your participation in the webinar</p>
      </motion.div>
    </div>
  );
  
  // Return section updated with the components
  return (
    <>
      {/* Dynamic SEO with React Helmet */}
      <Helmet>
        <title>UI/UX Design Webinar - Master Essential Design Skills for Just ₹100 | Ineffa</title>
        <meta name="description" content="Join our expert-led UI/UX Design webinar and learn essential design principles, prototyping techniques, and practical skills to create stunning user experiences." />
        <meta name="keywords" content="UI/UX webinar, design training, user experience, user interface, design workshop, online webinar" />
        <link rel="canonical" href="https://ineffa.com/webinar" />
      </Helmet>
      
      {/* Success Popup */}
      {showSuccessPopup && <SuccessPopup />}
      
      <div className="min-h-screen bg-white">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Logo and Gen AI Badge */}
          <div className="flex justify-between items-center mb-8 sm:mb-16">
            <a href="/" aria-label="Ineffa Home">
              <img src={logoImg} alt="Ineffa - UI/UX Design Experts" className="h-4 sm:h-10" />
            </a>
            <div className="flex items-center mt-1 space-x-2 border-2 border-transparent rounded-full transition-all duration-300 hover:scale-105">
              <img src={genAIImg} alt="Powered by Generative AI Technology" className="h-5 sm:h-10" />
            </div>
          </div>



          {/* Hero Section */}
          <section ref={headingRef} className="mt-2 sm:mt-20 text-center max-w-4xl mx-auto">
            <h1 ref={subheadingRef} className="text-2xl sm:text-2xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Master UI/UX Design: Interactive Live Webinar
            </h1>
            <p className="text-base sm:text-xl text-gray-700 mb-8">
              Learn essential design principles, prototyping techniques, and practical skills from industry experts for just ₹100.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={openBookingPopup}
                className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-full transition-colors duration-300 hover:bg-gray-800 text-sm sm:text-base"
                aria-label="Register for webinar"
              >
                Register Now - Only ₹100
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </section>
        </header>
        <section className="mt-8 sm:mt-24  max-w-5xl mx-auto ">
                    <div className="bg-gray-50 overflow-hidden ">
                      <div className="relative w-full aspect-video bg-black">
                        <video
                          src={video2}
                          title="Ineffa - How to improve your fintech app's UX design"
                          controls
                          muted
                          loop
                          playsInline
                          // autoPlay
                          className="w-full h-full object-cover"
                          allowFullScreen
                          onPlay={(e) => {
                            // Ensure video plays when play button is clicked
                            const playPromise = e.target.play();
                            if (playPromise !== undefined) {
                              playPromise.catch(error => {
                                console.log("Video play failed:", error);
                              });
                            }
                          }}
                        ></video>
                      </div>
                    </div>
                  </section>

        <CurvedCarousel/>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Event Details Section */}
          <section className="mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Transform Your Design Skills</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our exclusive UI/UX Design webinar and elevate your design skills with practical knowledge that you can apply immediately to your projects.
              </p>
              
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="rounded-full bg-black/5 w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-sm text-gray-600">Mondays only at</div>
                  <div className="font-semibold">12:00 PM IST</div>
                </div>
                
                <div className="text-center">
                  <div className="rounded-full bg-black/5 w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <Monitor className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-sm text-gray-600">Online via</div>
                  <div className="font-semibold">Zoom</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl max-w-md mx-auto mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Regular price:</span>
                  <span className="line-through text-gray-500">₹499</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Today's special:</span>
                  <span className="text-2xl font-bold">₹100</span>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  Limited time offer • 80% discount
                </div>
              </div>
              
              <button
                onClick={openBookingPopup}
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-full transition-colors duration-300 hover:bg-gray-800 text-lg"
              >
                Register Now - Only ₹100
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Join Our Webinar?</h2>
            <WebinarFeatures />
          </section>
          
          {/* Syllabus Section */}
          <section className="mb-16">
            <WebinarSyllabus />
          </section>
          
          {/* Tools Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Design Tools We'll Cover</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center">
                <img src={figmaLogo} alt="Figma" className="h-12" />
              </div>
              <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center">
                <img src={miroLogo} alt="Miro" className="h-12" />
              </div>
              <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">Adobe XD</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">Sketch</span>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="mb-16">
            <FAQSection />
          </section>
          
          {/* CTA Section */}
          <section className="mb-16">
            <div className="bg-black text-white rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Design Skills?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our webinar today and learn from industry experts. Limited seats available at our special price of just ₹100!
              </p>
              <button
                onClick={openBookingPopup}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium rounded-full transition-colors duration-300 hover:bg-gray-200 text-base"
              >
                Secure Your Spot Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </section>

          
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-50 py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 mb-2">© {new Date().getFullYear()} Ineffa. All rights reserved.</p>
            <p className="text-sm text-gray-500">
              Have questions? Email us at <a href="mailto:support@ineffa.com" className="underline hover:text-black">support@ineffa.com</a>
            </p>
          </div>
        </footer>

        {/* Booking Popup Modal */}
        {showBookingPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeBookingPopup}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Popup Content */}
              {popupStep === 1 && (
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Promotional content */}
                  <div className="flex-1 bg-gradient-to-br from-gray-900 to-black text-white p-8 flex flex-col justify-center">
                    <div className="text-center">
                      <div className="mb-6">
                        <Gift className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">
                        You're One Step Closer<br />
                        to Design Mastery!
                      </h2>
                      <p className="text-gray-300 mb-8">
                        We currently have a waitlist, but there's good news!
                      </p>
                      <div className="bg-yellow-400 text-black p-4 rounded-lg mb-8">
                        <p className="font-semibold">
                          Sign up today and get access to our exclusive UI/UX Design webinar.
                        </p>
                      </div>
                      <button
                        onClick={continueToBooking}
                        className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                  
                  {/* Right side - Phone mockup */}
                  <div className="flex-1 p-8 flex items-center justify-center bg-gray-50">
                    <div className="relative">
                      <div className="w-64 h-[500px] bg-black rounded-3xl p-2">
                        <div className="w-full h-full bg-white rounded-2xl p-4 overflow-hidden">
                          <div className="text-center">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-32 rounded-lg mb-4 flex items-center justify-center">
                              <span className="text-white font-bold">UI/UX Design</span>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="h-16 bg-purple-100 rounded"></div>
                              <div className="h-16 bg-blue-100 rounded"></div>
                              <div className="h-16 bg-green-100 rounded"></div>
                              <div className="h-16 bg-pink-100 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Form Step */}
              {popupStep === 2 && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Register for UI/UX Design Webinar
                    </h2>
                    <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full">
                      <span className="text-green-600 font-semibold text-lg">Only ₹100</span>
                      <span className="text-gray-600 ml-2">• Next Monday at 12:00 PM</span>
                    </div>
                  </div>

                  {/* Display error messages */}
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="max-w-md mx-auto">
                    {/* Full Name Field */}
                    <div className="mb-4">
                      <label htmlFor="popup-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="popup-name"
                        name="name"
                        value={bookingData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                      <label htmlFor="popup-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="popup-email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="mb-6">
                      <label htmlFor="popup-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="popup-phone"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    {/* Webinar Date Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Webinar Date <span className="text-red-500">*</span></label>
                      {loading ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                      ) : error ? (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                          {error}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {webinarDates.map((dateOption, index) => (
                            <div 
                              key={index}
                              className={`border p-3 rounded-md cursor-pointer transition-all ${
                                bookingData.webinarDate === dateOption.date ? 
                                'border-black bg-black/5' : 'hover:border-gray-400'
                              }`}
                              onClick={() => handleDateSelect(dateOption.date)}
                            >
                              <div className="flex items-center">
                                <div className={`mr-3 h-5 w-5 rounded-full border flex items-center justify-center ${
                                  bookingData.webinarDate === dateOption.date ? 
                                  'border-black bg-black' : 'border-gray-400'
                                }`}>
                                  {bookingData.webinarDate === dateOption.date && (
                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium">{dateOption.formattedDate}</span>
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> {dateOption.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPopupStep(1)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleBookWebinar}
                        disabled={paymentLoading}
                        className="flex-1 px-6 py-2 border-2 border-black hover:bg-black hover:text-white text-black rounded-lg transition-colors duration-200 flex items-center justify-center disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-500"
                      >
                        {paymentLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Continue to Payment
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {popupStep === 3 && (
                <div className="p-8">
                  <PaymentStep />
                </div>
              )}

              {/* Success Step */}
              {popupStep === 4 && (
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                    <p className="text-gray-600">{popupMessage}</p>
                  </div>
                  <button
                    onClick={closeBookingPopup}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

export default WebinarPage; 