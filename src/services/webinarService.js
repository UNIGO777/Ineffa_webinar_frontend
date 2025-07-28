import { API_URL } from '../config/config';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Webinar API services
export const webinarService = {
  // Get upcoming webinar dates (using sessions)
  getWebinarDates: async () => {
    try {
      const response = await fetch(`${API_URL}/webinar-sessions/upcoming-mondays`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await handleResponse(response);
      
      // Transform session data to match the expected format
      return {
        ...data,
        data: {
          dates: data.data.sessions.map(session => ({
            date: session.sessionDate,
            formattedDate: new Date(session.sessionDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            time: `${session.sessionTime.split(':').map((part, i) => i === 0 ? (part % 12 || 12) : part).join(':')} ${session.sessionTime.split(':')[0] >= 12 ? 'PM' : 'AM'}`,
            session: session
          }))
        }
      };
    } catch (error) {
      console.error('Error fetching webinar dates:', error);
      throw error;
    }
  },
  
  // Book a webinar
  bookWebinar: async (webinarData) => {
    try {
      const response = await fetch(`${API_URL}/webinars/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webinarData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error booking webinar:', error);
      throw error;
    }
  },
  
  // Initiate payment for a webinar
  initiatePayment: async (webinarId) => {
    try {
      const response = await fetch(`${API_URL}/webinars/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webinarId }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  },
  
  // Verify payment for a webinar
  verifyPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/webinars/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}; 