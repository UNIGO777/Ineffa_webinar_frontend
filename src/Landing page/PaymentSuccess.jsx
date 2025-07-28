import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Video, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Set payment verified flag for protected route
    localStorage.setItem('paymentVerified', 'true');

    // Extract payment details from location state
    const paymentDetails = location.state?.paymentDetails;
    
    if (paymentDetails) {
      setBookingDetails({
        name: paymentDetails.name || '',
        email: paymentDetails.email || '',
        date: paymentDetails.date || format(new Date(), 'MMMM d, yyyy'),
        time: paymentDetails.time || '12:00 PM',
        service: 'UI/UX Design Webinar',
        zoomLink: paymentDetails.zoomLink || '#',
        payment: {
          amount: paymentDetails.amount || '99',
          transactionId: paymentDetails.transactionId || 'N/A'
        }
      });
    }
    
    setLoading(false);
  }, [location.state]);

  // Handle add to calendar
  const handleAddToCalendar = () => {
    if (!bookingDetails) return;
    
    const eventTitle = 'UI/UX Design Webinar';
    const eventDescription = 'Join us for an interactive webinar on UI/UX design principles and best practices.';
    const eventLocation = bookingDetails.zoomLink || 'Online';
    
    // Format date for Google Calendar
    const eventDate = new Date(bookingDetails.date);
    const [hours, minutes] = bookingDetails.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1); // 1 hour webinar
    
    const startTime = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  // Handle share event
  const handleShareEvent = async () => {
    if (!bookingDetails) return;
    
    const shareData = {
      title: 'UI/UX Design Webinar',
      text: `Join me at the UI/UX Design Webinar on ${bookingDetails.date} at ${bookingDetails.time}.`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-purple-600">In</span>effa
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 px-6 text-white text-center">
                <motion.div 
                  className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle size={32} className="text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-lg text-white text-opacity-90">
                  Thank you for registering for the UI/UX Design Webinar. We're excited to have you join us!
                </p>
              </div>
              
              {/* Booking Details */}
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Webinar Details</h2>
                
                <div className="space-y-6">
                  {/* Event Info */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Date & Time */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-5">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-3 rounded-lg mr-4">
                          <Calendar size={24} className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                          <p className="text-lg font-semibold text-gray-800">{bookingDetails?.date}</p>
                          <div className="flex items-center mt-1">
                            <Clock size={16} className="text-gray-400 mr-1" />
                            <span className="text-gray-600">{bookingDetails?.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Service */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-5">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-3 rounded-lg mr-4">
                          <Video size={24} className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Event</h3>
                          <p className="text-lg font-semibold text-gray-800">{bookingDetails?.service}</p>
                          <p className="text-gray-600 text-sm mt-1">Interactive online session</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Meeting Link */}
                  {bookingDetails?.zoomLink && (
                    <div className="border border-gray-200 rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Zoom Meeting Link</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <a 
                          href={bookingDetails.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all transition-colors"
                        >
                          {bookingDetails.zoomLink}
                        </a>
                        <a 
                          href={bookingDetails.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 sm:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg inline-flex items-center transition-colors"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleAddToCalendar}
                      className="flex-1 px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg inline-flex items-center justify-center font-medium transition-colors"
                    >
                      <Calendar size={18} className="mr-2 text-gray-700" />
                      Add to Calendar
                    </button>
                    <button
                      onClick={handleShareEvent}
                      className="flex-1 px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg inline-flex items-center justify-center font-medium transition-colors"
                    >
                      <Share2 size={18} className="mr-2 text-gray-700" />
                      Share Event
                    </button>
                  </div>
                  
                  {/* Payment Receipt */}
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Receipt</h3>
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount Paid</span>
                        <span className="text-gray-900 font-semibold">₹{bookingDetails?.payment?.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="text-gray-900 font-medium">{bookingDetails?.payment?.transactionId}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Next Steps */}
                  <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Next Steps</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="inline-block mr-2 mt-1">•</span>
                        <span>Check your email for webinar details and preparation tips</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block mr-2 mt-1">•</span>
                        <span>Add the event to your calendar to receive reminders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block mr-2 mt-1">•</span>
                        <span>Prepare your questions about UI/UX design in advance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block mr-2 mt-1">•</span>
                        <span>Join 5 minutes early on the day of the webinar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="p-6 bg-gray-50 text-center border-t border-gray-200">
                <Link 
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Ineffa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentSuccess;