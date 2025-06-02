import { Heart, Github, Twitter, Play, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react'
import { animate, stagger, inView, timeline } from '@motionone/dom'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import logoImg from './assets/Logo.png'
import genAIImg from './assets/GenAi.svg'
import mobileAppImg from './assets/MobileAplication.png'
import image2 from './assets/ResponsiveProduct.jpg'
import image3 from './assets/mobileAplication2.jpg'
import image4 from './assets/Webdesign.jpg'
import figmaLogo from './assets/figma-logo-svg-150px.svg'
import micro from './assets/miro-logo-svg-150px.svg'
import stach from './assets/Frame 20623.svg'
import video from './assets/video.mp4'
import { slotService, publicPaymentService } from '../services/slotService.js'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

// Import required Swiper modules
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'

// Add Helmet for dynamic SEO management
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'

function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const genAIBadgeRef = useRef(null)
  const videoSectionRef = useRef(null)
  const whyChooseUsRef = useRef(null)
  const servicesOverviewRef = useRef(null)
  const pricingSectionRef = useRef(null)
  const testimonialSectionRef = useRef(null)
  const portfolioSectionRef = useRef(null)
  const formSectionRef = useRef(null)
  const faqSectionRef = useRef(null)
  const portfolioCardsRef = useRef([])
  const formFieldsRef = useRef([])
  const faqItemsRef = useRef([])

  // State for FAQ section
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // State for consultation booking form
  const [currentStep, setCurrentStep] = useState(0)
  const [bookingData, setBookingData] = useState({})
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  })
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [formError, setFormError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [consultationId, setConsultationId] = useState(null)

  // State for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  // FAQ data
  const faqItems = [
    {
      question: "How can a better UI/UX improve my fintech app's performance ?",
      answer: "A seamless UI/UX enhances user experience, increases trust, reduces drop-offs and boosts conversions, leading to higher retention and revenue."
    },
    {
      question: "How long does it take to revamp my fintech app's design ?",
      answer: "Typically, a comprehensive fintech app redesign takes 6-12 weeks depending on complexity, features, and the scope of user testing required. We provide a detailed timeline during our initial consultation."
    },
    {
      question: "Will the new design affect my app's current funtionality ?",
      answer: "No, our redesign process preserves all existing functionality while enhancing the user experience. We ensure a seamless transition with zero functionality loss and can implement the changes incrementally to minimize disruption."
    },
    {
      question: "Can you optimize our app for both web and mobile users ?",
      answer: "Absolutely! We specialize in responsive design that provides a consistent, optimized experience across all devices. Our approach ensures your fintech solution works flawlessly on desktops, tablets, and smartphones with platform-specific optimizations."
    },
    {
      question: "What metrics improve after implementing a better UI/UX ?",
      answer: "After implementing improved UI/UX, clients typically see increases in user engagement (30-50%), conversion rates (15-40%), customer satisfaction scores (25-45%), and significant decreases in support tickets (20-35%) and user errors (40-60%)."
    }
  ]

  // Function to toggle FAQ items
  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      quote: "Amazing experience! The design perfectly matched our needs. Great work!",
      name: "Nikhil Kela",
      company: "Jaivik Setu"
    },
    {
      id: 2,
      quote: "UX design boosted our app. Engagement up 25%, conversions grew fast!",
      name: "Priya Sharma",
      company: "FinEdge Solutions"
    },
    {
      id: 3,
      quote: "Ineffa's design helped us secure funding. Great transformation!",
      name: "Rahul Mehta",
      company: "PayQuick"
    }
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // State for notification message
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Handle scroll to contact form when #contact is present in URL
    const scrollToContact = () => {
      if (window.location.hash === '#contact' && formSectionRef.current) {
        setTimeout(() => {
          formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure DOM is ready
      }
    };

    // Check for hash on initial load
    scrollToContact();

    // Add event listener for hash changes
    window.addEventListener('hashchange', scrollToContact);

    // Check for redirect message
    const redirectMessage = localStorage.getItem('paymentRedirectMessage');
    if (redirectMessage) {
      setNotificationMessage(redirectMessage);
      setShowNotification(true);

      // Remove the message from localStorage
      localStorage.removeItem('paymentRedirectMessage');

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }

    // Add Facebook Pixel tracking for the payment button
    const handlePurchaseEvent = function () {
      if (window.fbq) {
        fbq('track', 'Purchase', { currency: "USD", value: 30.00 });
      }
    };


    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', handlePurchaseEvent);
    }

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('hashchange', scrollToContact);

      // Clean up Facebook Pixel event listener
      const addToCartButton = document.getElementById('addToCartButton');
      if (addToCartButton) {
        addToCartButton.removeEventListener('click', handlePurchaseEvent);
      }
    };
  }, []);

  // Function to close notification
  const closeNotification = () => {
    setShowNotification(false);
  };

  // Separate useEffect for animations to avoid early return
  useEffect(() => {
    // Animate the hero section when it comes into view
    if (heroRef.current) {
      inView(heroRef.current, () => {
        animate(
          heroRef.current,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.8, delay: 0.2 }
        )
        return () => { }
      })
    }

    // Animate the heading with staggered effect
    if (headingRef.current && subheadingRef.current) {
      const elements = [headingRef.current, subheadingRef.current]
      animate(
        elements,
        { opacity: [0, 1], x: [-20, 0] },
        { delay: stagger(0.2), duration: 0.7, easing: 'ease-out' }
      )
    }

    // Animate the Gen AI badge
    if (genAIBadgeRef.current) {
      timeline([
        [genAIBadgeRef.current, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5 }],
        [genAIBadgeRef.current, { borderColor: ['rgba(147, 51, 234, 0)', 'rgba(147, 51, 234, 0.7)', 'rgba(147, 51, 234, 0)'] }, { duration: 2, repeat: Infinity, delay: 0.5 }]
      ])
    }

    // Animate the video section when it comes into view
    if (videoSectionRef.current) {
      inView(videoSectionRef.current, () => {
        animate(
          videoSectionRef.current,
          { opacity: [0, 1], y: [30, 0] },
          { duration: 0.8, delay: 0.3 }
        )
        return () => { }
      })
    }

    // Animate the Why Choose Us section when it comes into view
    if (whyChooseUsRef.current) {
      inView(whyChooseUsRef.current, () => {
        // Animate the heading and subheading
        animate(
          whyChooseUsRef.current.querySelector('.text-center'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.2 }
        )

        // Animate the feature cards with staggered effect
        animate(
          whyChooseUsRef.current.querySelectorAll('.bg-gray-50'),
          { opacity: [0, 1], scale: [0.95, 1], y: [15, 0] },
          { delay: stagger(0.1), duration: 0.6, easing: 'ease-out' }
        )

        // Animate the CTA button
        animate(
          whyChooseUsRef.current.querySelector('.mt-10'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.6 }
        )

        return () => { }
      })
    }

    // Animate the Services Overview section when it comes into view
    if (servicesOverviewRef.current) {
      inView(servicesOverviewRef.current, () => {
        // Animate the heading and subheading
        animate(
          servicesOverviewRef.current.querySelector('.text-center'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.2 }
        )

        // Animate the benefit cards with staggered effect
        animate(
          servicesOverviewRef.current.querySelectorAll('.bg-gray-50'),
          { opacity: [0, 1], scale: [0.95, 1], y: [15, 0] },
          { delay: stagger(0.1), duration: 0.6, easing: 'ease-out' }
        )

        // Animate the CTA button
        animate(
          servicesOverviewRef.current.querySelector('.mt-10'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.6 }
        )

        return () => { }
      })
    }

    // Animate the pricing section when it comes into view
    if (pricingSectionRef.current) {
      inView(pricingSectionRef.current, () => {
        animate(
          pricingSectionRef.current.querySelector('h2'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.2 }
        )

        animate(
          pricingSectionRef.current.querySelector('.bg-white'),
          { opacity: [0, 1], scale: [0.95, 1] },
          { duration: 0.6, delay: 0.4 }
        )

        animate(
          pricingSectionRef.current.querySelector('a'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.6 }
        )

        return () => { }
      })
    }

    // Animate the testimonial section when it comes into view
    if (testimonialSectionRef.current) {
      inView(testimonialSectionRef.current, () => {
        animate(
          testimonialSectionRef.current,
          { opacity: [0, 1], y: [30, 0] },
          { duration: 0.8, delay: 0.3 }
        )
        return () => { }
      })
    }

    // Animate the portfolio section when it comes into view
    if (portfolioSectionRef.current) {
      inView(portfolioSectionRef.current, () => {
        animate(
          portfolioSectionRef.current.querySelector('h2'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7, delay: 0.2 }
        )

        // Animate portfolio cards with staggered effect
        if (portfolioCardsRef.current.length > 0) {
          animate(
            portfolioCardsRef.current,
            { opacity: [0, 1], scale: [0.95, 1], y: [20, 0] },
            { delay: stagger(0.1), duration: 0.6, easing: 'ease-out' }
          )
        }

        return () => { }
      })
    }

    // Animate the form section when it comes into view
    if (formSectionRef.current) {
      inView(formSectionRef.current, () => {
        animate(
          formSectionRef.current.querySelector('h2'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7 }
        )

        // Animate form fields with staggered effect
        if (formFieldsRef.current.length > 0) {
          animate(
            formFieldsRef.current,
            { opacity: [0, 1], x: [-10, 0] },
            { delay: stagger(0.08), duration: 0.5, easing: 'ease-out' }
          )
        }

        return () => { }
      })
    }

    // Animate the FAQ section when it comes into view
    if (faqSectionRef.current) {
      inView(faqSectionRef.current, () => {
        animate(
          faqSectionRef.current.querySelector('h2'),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.7 }
        )

        // Animate search bar
        animate(
          faqSectionRef.current.querySelector('.relative'),
          { opacity: [0, 1], scale: [0.98, 1] },
          { duration: 0.6, delay: 0.2 }
        )

        // Animate FAQ items with staggered effect
        if (faqItemsRef.current.length > 0) {
          animate(
            faqItemsRef.current,
            { opacity: [0, 1], y: [15, 0] },
            { delay: stagger(0.1), duration: 0.5, easing: 'ease-out' }
          )
        }

        return () => { }
      })
    }
  }, [])


  // Fetch available slots for a given date
  const fetchAvailableSlots = async (date) => {
    try {
      setLoadingSlots(true);
      setFormError('');
      const response = await slotService.getAvailableSlots(date);

      // Filter out lunch time slots (13:00-14:00)
      const filteredSlots = (response.data.slots || []).filter(slot => {
        // Extract hour from slot time (format: HH:MM)
        const hour = parseInt(slot.startTime.split(':')[0], 10);
        // Filter out slots that start at 13:00
        return hour !== 13;
      });

      setAvailableSlots(filteredSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setFormError('Failed to load available time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    setFormError('');

    // Check if all required fields are filled
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.message) {
      setFormError('Please fill in all required fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }

    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/[^0-9]/g, ''))) {
      setFormError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  // Create consultation and proceed to payment
  const handleCreateConsultation = async () => {
    try {
      setPaymentLoading(true);
      setFormError('');

      // Create consultation
      const response = await publicPaymentService.createConsultation(bookingData);

      // Store consultation ID for payment
      setConsultationId(response.data.consultation._id);

      // Move to payment step
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating consultation:', error);
      setFormError('Failed to create consultation. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setFormError('');

      // Initiate payment
      const response = await publicPaymentService.initiatePayment(consultationId);

      // Get Razorpay order details
      const { order, key_id } = response.data;

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Ineffa',
        description: `Consultation for ${bookingData.service}`,
        order_id: order.id,
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: bookingData.phone
        },
        theme: {
          color: '#9333ea'
        },
        handler: async function (razorpayResponse) {
          try {
            // Verify payment and update consultation status
            const verifyResponse = await publicPaymentService.verifyPayment({
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              consultationId: consultationId
            });

            if (verifyResponse.data) {
              // Payment verification successful
              // Prepare payment details to pass to success page
              const paymentDetails = {
                name: bookingData.name,
                service: bookingData.service || 'Consultation',
                amount: '₹99',
                date: new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
                time: new Date().toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              };

              // Set payment verification flag in localStorage
              localStorage.setItem('paymentVerified', 'true');

              // Redirect to success page with payment details
              navigate('/payment-success', {
                state: {
                  paymentDetails: {
                    name: bookingData.name,
                    service: bookingData.service || 'Consultation',
                    amount: '₹99',
                    date: bookingData.slotDate && new Date(bookingData.slotDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }),
                    time: `${bookingData.slotStartTime} - ${bookingData.slotEndTime}`
                  }
                }
              });
            } else {
              // Payment verification failed
              setFormError('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            setFormError('Error verifying payment. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      setFormError('Failed to initialize payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Handle form submission (old contact form - keeping for reference)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = 'Sending...';
      submitButton.disabled = true;

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Success message
        setPopupMessage('Thank you for your submission! We will get back to you soon.');
        setShowSuccessPopup(true);
        form.reset();

        // Auto hide popup after 5 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 5000);
      } else {
        // Error message
        alert('Something went wrong: ' + (data.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      // Reset button state
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.innerHTML = 'Get in touch with us';
      submitButton.disabled = false;
    }
  };

  return (
    <>
      {/* Payment Redirect Error Notification */}
      {showNotification && (
        <div
          className="fixed top-4 right-4 z-50 bg-red-50 rounded-lg shadow-xl p-4 sm:p-6 max-w-sm w-full border-l-4 border-red-500"
          style={{
            animation: 'slideIn 0.5s forwards',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-red-800 text-left">{notificationMessage}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-red-50 rounded-md inline-flex text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={closeNotification}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-sm w-full border-l-4 border-black-600"
          style={{
            animation: 'slideIn 0.5s forwards',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-black/60" aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900 text-left">{popupMessage}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
                onClick={() => setShowSuccessPopup(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Dynamic SEO with React Helmet */}
      <Helmet>
        <title>Ineffa - Fix UX & Skyrocket Revenue for Fintech Apps</title>
        <meta name="description" content="Transform your fintech platform with high-converting UX/UI that drives engagement, boosts revenue and funds unstoppable growth" />
        <meta name="keywords" content="fintech UX, UI design, UX optimization, financial app design, revenue growth, user experience, fintech solutions" />
        <link rel="canonical" href="https://ineffa.com/" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Logo and Gen AI Badge */}
          <div className="flex justify-center items-center gap-4 sm:justify-between mb-8 sm:mb-16">
            <a href="/" aria-label="Ineffa Home">
              <img src={logoImg} alt="Ineffa - Fintech UX/UI Design Agency" className="h-4 sm:h-10" />
            </a>
            <span className='h-6 border-r-2 sm:hidden border-r-black w-1 mt-1'></span>
            <div ref={genAIBadgeRef} className="flex items-center mt-1 space-x-2 border-2 border-transparent rounded-full transition-all duration-300 hover:scale-105">
              <img src={genAIImg} alt="Powered by Generative AI Technology" className="h-5 sm:h-10" />
            </div>
          </div>

          {/* Hero Section */}
          
          <section ref={heroRef} className="mt-2 sm:mt-20 text-center max-w-4xl mx-auto">
            <h1 ref={headingRef} className="text-md sm:text-2xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Struggling With UI/UX? Get Expert Help in 30 Minutes.
            </h1>
            <p ref={subheadingRef} className="text-sm sm:text-xl text-gray-700 mb-2 sm:mb-10">
              Book a 1-on-1 consultation with our UI/UX experts to identify pain points and actionable solutions for your business.
            </p>
            <div className="flex justify-center mt-8">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-black hover:bg-black text-black hover:text-white font-medium rounded-full transition-colors duration-300 text-sm sm:text-base"
                aria-label="Jump to contact form"
              >
                Book Consultation Now
                <svg
                  className="ml-2  -mr-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </a>
            </div>
          </section>
        </header>

        <div>
          {/* Video Section */}
          <section ref={videoSectionRef} className="mt-8 sm:mt-24 mb-12 sm:mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative w-full aspect-video bg-black">
                <video
                  src={video}
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

          {/* Why Choose Us Section */}
          <section ref={whyChooseUsRef} className="mt-12 sm:mt-24 mb-12 sm:mb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl overflow-hidden  p-6 sm:p-10">
              <div className="text-center mb-10">
                <h2 className="text-xl sm:text-3xl font-bold mb-4">Why Choose Us for Your UI/UX Consultation?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Helping businesses design seamless and user-friendly experiences that drive results.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Feature 1 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="rounded-full bg-black/10 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Dedicated Design Team</h3>
                  <p className="text-gray-600">A dedicated team with a passion for great design</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="rounded-full bg-black/10 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Tailored Solutions</h3>
                  <p className="text-gray-600">Tailored recommendations based on your unique needs</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="rounded-full bg-black/10 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Results-Driven</h3>
                  <p className="text-gray-600">Focus on improving user experience and conversion rates</p>
                </div>

                {/* Feature 4 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="rounded-full bg-black/10 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Affordable Pricing</h3>
                  <p className="text-gray-600">Affordable pricing for expert-level service</p>
                </div>
              </div>

              <div className="mt-10 text-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-black-600 text-black border-2 border-black hover:bg-black-700 hover:text-white font-medium rounded-full hover:bg-black transition-colors duration-300 text-sm sm:text-base"
                  aria-label="Start your consultation"
                >
                  Start Your Consultation Today
                  <svg
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Services Overview Section */}
          <section ref={servicesOverviewRef} className="mt-12 sm:mt-0 mb-12 sm:mb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl overflow-hidden p-6 sm:p-10">
              <div className="text-center mb-10">
                <h2 className="text-xl sm:text-3xl font-bold mb-4">What You'll Gain from This Consultation Call</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">During the 30-minute session, you'll receive personalized advice to improve your UI/UX and achieve better user engagement.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {/* Benefit 1 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="rounded-full bg-black/10 w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">Review of your website/app's current UI/UX</p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="rounded-full bg-black/10 w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">Actionable suggestions for enhancing design and user flow</p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="rounded-full bg-black/10 w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">Tips for increasing conversions and user satisfaction</p>
                  </div>
                </div>

                {/* Benefit 4 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="rounded-full bg-black/10 w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">Clear roadmap for next steps, including potential collaboration</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <a
                  href="#contact"
                                      className="inline-flex items-center justify-center px-6 py-3  hover:bg-black rounded-full hover:bg-black-700 border-black border-2 hover:text-white font-medium transition-colors duration-300 text-sm sm:text-base"

                  aria-label="Book consultation session"
                >
                  Book My Session Now
                  <svg
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Pricing & Limited Time Offer Section */}
          <section ref={pricingSectionRef} className="mt-12 sm:mt-20 mb-12 sm:mb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-black-50 to-black-100 rounded-2xl overflow-hidden p-6 sm:p-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-xl sm:text-3xl font-bold mb-4">Get a High-Impact Consultation for Just ₹99</h2>
                <p className="text-gray-600 mb-8">
                  Regular Price: <span className="line-through">₹1500</span> | Limited Offer: <span className="font-bold text-black-600">₹99</span> for a 30-minute session. Offer valid until June 30, 2024.
                </p>

                <div className="bg-white p-6 shadow-sm inline-block mb-8 bg-black/10">
                  <div className="flex flex-col items-center justify-center ">
                    <span className="text-gray-500 line-through text-lg">₹1500</span>
                    <span className="text-3xl sm:text-5xl font-bold text-black mt-2">₹99</span>
                    <span className="text-gray-600 mt-2">30-minute expert consultation</span>
                  </div>
                </div>

                <div>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-3  hover:bg-black rounded-full hover:bg-black-700 border-black border-2 hover:text-white font-medium transition-colors duration-300 text-sm sm:text-base"
                    aria-label="Claim limited time offer"
                  >
                    Claim My Offer Now
                    <svg
                      className="ml-2 -mr-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Consultation Booking Form Section */}
          <section ref={formSectionRef} id="contact" className="mt-2 sm:mt-24 mb-5 sm:mb-16 max-w-3xl mx-auto px-4">
            <h2 className="text-xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Book a Consultation</h2>
            <p className="text-center text-gray-600 mb-8">Schedule a 30-minute consultation with our experts for just ₹99</p>

            {/* Multi-step Booking Form */}
            <div className="bg-white rounded-xl  p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {['Service', 'Schedule', 'Details', 'Payment'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index < currentStep ? 'bg-black/60 text-white' : index === currentStep ? 'bg-black/10 text-black-600 border-2 border-black-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {index + 1}
                    </div>
                    <span className={`mt-2 text-xs ${index === currentStep ? 'text-black/60 font-medium' : 'text-gray-500'}`}>{step}</span>
                  </div>
                ))}
              </div>

              {/* Step 1: Service Selection */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Service</h3>

                  <div className="space-y-3">
                    {['UX/UI Consultation', 'App Design Review', 'Website Audit'].map((service) => (
                      <div
                        key={service}
                        onClick={() => setBookingData({ ...bookingData, service })}
                        className={`p-4 border rounded-full cursor-pointer transition-all ${bookingData.service === service ? 'border-black-600 bg-black-50' : 'border-gray-200 hover:border-black-300'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${bookingData.service === service ? 'border-black-600' : 'border-gray-300'}`}>
                            {bookingData.service === service && (
                              <div className="w-3 h-3 rounded-full bg-black/80"></div>
                            )}
                          </div>
                          <span className="ml-3 font-medium">{service}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        if (bookingData.service) {
                          setCurrentStep(1);
                          // Fetch available slots when moving to scheduling step
                          fetchAvailableSlots(selectedDate);
                        } else {
                          setFormError('Please select a service to continue');
                        }
                      }}
                      className="px-6 py-2 bg-black-600 text-black border-2 border-black rounded-full hover:bg-black hover:text-white hover:bg-black-700 transition-colors duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Schedule Selection */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h3>

                  {/* Date Picker */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <div className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4'>
                      <div className="relative w-full sm:w-[80%]">
                        <input
                          type="date"
                          value={selectedDate}
                          min={(() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            return tomorrow.toISOString().split('T')[0];
                          })()}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            fetchAvailableSlots(e.target.value);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-full focus:ring-black/50 focus:border-black-500 cursor-pointer"
                        />
                      </div>
                      <div className='w-full sm:w-[18%] h-full'>
                        <button
                          onClick={() => document.querySelector('input[type="date"]').showPicker()}
                          className="w-full right-2 border-black/70 border-2 text-black/70 rounded-full p-2 sm:p-2 sm:px-8 hover:text-black-500 focus:outline-none"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>

                    {loadingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black-600"></div>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableSlots.map((slot, index) => (
                          <div
                            key={index}
                            onClick={() => slot.isAvailable && setBookingData({
                              ...bookingData,
                              slotDate: selectedDate,
                              slotStartTime: slot.startTime,
                              slotEndTime: slot.endTime
                            })}
                            className={`p-2 border rounded text-center cursor-pointer ${!slot.isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : bookingData.slotStartTime === slot.startTime ? 'border-black-600 bg-black-50 text-black-700' : 'hover:border-black-300'}`}
                          >
                            {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-gray-500">No available slots for this date. Please select another date.</p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (bookingData.slotStartTime) {
                          setCurrentStep(2);
                        } else {
                          setFormError('Please select a time slot to continue');
                        }
                      }}
                      className="px-6 py-2 bg-black-600 text-white rounded-lg hover:bg-black-700 transition-colors duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Personal Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Details</h3>

                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-black-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={bookingData.name || ''}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black-500 focus:border-black-500"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-black-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={bookingData.email || ''}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black-500 focus:border-black-500"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-black-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={bookingData.phone || ''}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      placeholder="Your phone number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black-500 focus:border-black-500"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-black-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={bookingData.message || ''}
                      onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                      placeholder="Tell us about your project or questions"
                      rows="3"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black-500 focus:border-black-500"
                    ></textarea>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (validateForm()) {
                          handleCreateConsultation();
                        }
                      }}
                      className="px-6 py-2 bg-black-600 text-white rounded-lg hover:bg-black-700 transition-colors duration-200"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment</h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">{bookingData.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{bookingData.slotDate && new Date(bookingData.slotDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{bookingData.slotStartTime} - {bookingData.slotEndTime}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-800 font-medium">Total Amount:</span>
                        <span className="font-bold text-black-600">₹99</span>
                      </div>
                    </div>
                  </div>

                  {paymentLoading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black-600 mb-3"></div>
                      <p className="text-gray-600">Initializing payment...</p>
                    </div>
                  ) : (
                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        id="addToCartButton"
                        onClick={handlePayment}
                        className="px-6 py-2 bg-black-600 text-white rounded-lg hover:bg-black-700 transition-colors duration-200 flex items-center"
                      >
                        <span className="mr-2">Pay ₹99</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 10H21M7 15H8M12 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Success Message */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-6">Your consultation has been successfully booked. We've sent the details to your email.</p>
                  <button
                    onClick={() => {
                      // Reset form
                      setCurrentStep(0);
                      setBookingData({});
                      setSelectedDate(new Date().toISOString().split('T')[0]);
                    }}
                    className="px-6 py-2 bg-black-600 text-white rounded-lg hover:bg-black-700 transition-colors duration-200"
                  >
                    Book Another Consultation
                  </button>
                </motion.div>
              )}

              {/* Error Message */}
              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-full text-sm">
                  {formError}
                </div>
              )}
            </div>
          </section>


          {/* Portfolio Section - Full Width */}
          <section ref={portfolioSectionRef} className="w-full bg-[#0e172d] sm:bg-white py-5 md:py-6 lg:py-12">
            <div className="mx-auto px-4 sm:px-6">
              <h2 className="text-md sm:text-3xl md:text-4xl text-white sm:text-black font-bold text-center mb-6 sm:mb-8 md:mb-12">Our portfolio showcases a diverse<br className="hidden sm:block" /> range of successful projects</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Portfolio cards with responsive text and spacing */}
                {/* Mobile App Design Card - Ineffa */}
                <article ref={(el) => portfolioCardsRef.current[0] = el} className="portfolio-card bg-white text-black rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                  <div>
                    <img src={mobileAppImg} alt="Mobile App UX/UI Design for Fintech Wallet Application" className="w-full h-[30vh] sm:h-[35vh] object-cover" loading="lazy" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img src={figmaLogo} alt="Designed with Figma" className="h-5 sm:h-6 mr-2" loading="lazy" />
                    </div>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-2 text-start">Mobile Application Design</h3>
                    <p className="text-xs sm:text-sm opacity-80 mb-3 text-start">
                      Intuitive and secure, our mobile wallet helps users track expenses, manage budgets, and make in-app payments. Our design prioritizes simplicity and transparency for a frictionless experience.
                    </p>
                  </div>
                </article>

                {/* Responsive Product Design - Ineffa */}
                <article ref={(el) => portfolioCardsRef.current[1] = el} className="portfolio-card rounded-xl bg-white overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                  <div>
                    <img src={image2} alt="Responsive Product Design for File Management Application" className="w-full h-[30vh] sm:h-[35vh] object-cover" loading="lazy" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img src={figmaLogo} alt="Designed with Figma" className="h-5 sm:h-6 mr-2" loading="lazy" />
                    </div>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-2 text-start">Responsive Product Design</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 text-start">
                      Our file utility app design, inspired by industry leaders like Notion, enables seamless organization, collaboration, and file management. With a user-centric approach, our design simplifies complex workflows for maximum customer satisfaction.
                    </p>
                  </div>
                </article>

                {/* Mobile Application Design - Sketch */}
                <article ref={(el) => portfolioCardsRef.current[2] = el} className="portfolio-card text-black bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                  <div>
                    <img src={image3} alt="UPI Payment App Interface Design" className="w-full h-[30vh] sm:h-[35vh] object-cover" loading="lazy" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img src={stach} alt="Designed with Sketch" className="h-5 sm:h-6 mr-2" loading="lazy" />
                    </div>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-2 text-start">Mobile Application Design</h3>
                    <p className="text-xs sm:text-sm opacity-80 mb-3 text-start">
                      Our UPI app design provides an intuitive and secure platform for instant transactions, bill payments, and money transfers. With a focus on simplicity and speed, our design creates a frictionless experience for adoption and retention.
                    </p>
                  </div>
                </article>

                {/* Website Design - Miro */}
                <article ref={(el) => portfolioCardsRef.current[3] = el} className="portfolio-card rounded-xl bg-white overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                  <div>
                    <img src={image4} alt="Financial Website Design and Development" className="w-full h-[30vh] sm:h-[35vh] object-cover" loading="lazy" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img src={micro} alt="Designed with Miro" className="h-5 sm:h-6 mr-2" loading="lazy" />
                      <img src={figmaLogo} alt="Designed with Figma" className="h-5 sm:h-6 mr-2" loading="lazy" />
                    </div>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-2 text-start">Website Design</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 text-start">
                      Our UPI app design provides an intuitive and secure platform for instant transactions, bill payments, and money transfers. With a focus on simplicity and speed, our design creates a frictionless experience for adoption and retention.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Jump to Contact Button */}
          <div className="flex justify-center mt-8">
            <a
              href="#contact"
                                  className="inline-flex items-center justify-center px-6 py-3  hover:bg-black rounded-full hover:bg-black-700 border-black border-2 hover:text-white font-medium transition-colors duration-300 text-sm sm:text-base"

              aria-label="Jump to contact form"
            >
              Get Started
              <svg
                className="ml-2 rotate-180 -mr-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>

          {/* Testimonials Section */}
          <section ref={testimonialSectionRef} className="mt-16 sm:mt-24 mb-12 sm:mb-16 max-w-5xl mx-auto px-4" aria-label="Testimonials"></section>

          <h2 className="text-xl sm:text-4xl font-bold text-center mb-8 px-2 sm:mb-12">See what our clients say</h2>

          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="testimonial-swiper "
            aria-label="Client testimonials carousel"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className='py-5'>
                <div className="bg-white rounded-xl  overflow-hidden p-4 sm:p-8">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-center justify-center">
                    <div className="w-full md:w-3/4 bg-gray-50 h-[220px] sm:h-auto rounded-xl p-4 sm:p-6 shadow-sm">
                      <div className="mb-4 sm:mb-6">
                        <span className="text-3xl sm:text-5xl text-gray-300 font-serif leading-none" aria-hidden="true">&ldquo;</span>
                        <p className="text-sm sm:text-xl text-gray-700 italic">
                          {testimonial.quote}
                        </p>
                        <span className="text-3xl sm:text-5xl text-gray-300 font-serif leading-none" aria-hidden="true">&rdquo;</span>
                      </div>

                      <div className="flex items-center ">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 flex items-center justify-center mr-3 sm:mr-4">
                          <span className="text-black-600 font-bold text-sm sm:text-base">{testimonial.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base">{testimonial.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <section />

        </div>

        <div className="flex justify-center mt-8">
          <a
            href="#contact"
                                className="inline-flex items-center justify-center px-6 py-3  hover:bg-black rounded-full hover:bg-black-700 border-black border-2 hover:text-white font-medium transition-colors duration-300 text-sm sm:text-base"

            aria-label="Jump to contact form"
          >
            Get Started
            <svg
              className="ml-2 rotate-180 -mr-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>

        {/* Sticky Contact Button */}
        <div className="fixed top-4 right-4 z-50">
          <a
            href="#contact"
            className="flex items-center gap-2 bg-black/50 hover:bg-black text-white px-[13px] py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </a>
        </div>

        {/* FAQ Section */}
        <div ref={faqSectionRef} className="mt-16 sm:mt-24 mb-12 sm:mb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">How can we help you?</h2>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your keyword"
                className="w-full px-10 sm:px-12 py-3 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black-600 focus:border-transparent text-sm sm:text-base"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {faqItems.filter(item =>
              searchQuery === '' ||
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((item, index) => (
              <div
                key={index}
                ref={(el) => faqItemsRef.current[index] = el}
                className="border border-gray-200  overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="font-medium">{item.question}</h3>
                  <span className="ml-4 sm:ml-6 flex-shrink-0">
                    {expandedFAQ === index ?
                      <ChevronLeft className="transform rotate-90 w-4 h-4 sm:w-5 sm:h-5" /> :
                      <ChevronRight className="transform rotate-90 w-4 h-4 sm:w-5 sm:h-5" />}
                  </span>
                </button>
                {expandedFAQ === index && (
                  <div
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 overflow-hidden"
                    style={{
                      animation: 'faqSlideDown 0.3s ease-out forwards'
                    }}
                  >
                    <p className="text-gray-700 text-xs sm:text-sm text-right">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

}

export default LandingPage
