// Slot service for fetching available time slots

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_APP_API_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Slot API services
export const slotService = {
  // Get available slots for a specific date
  getAvailableSlots: async (date) => {
    try {
      const response = await fetch(`${API_URL}/slots/available?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },
  
  // Get business configuration (working hours, days, etc.)
  getBusinessConfig: async () => {
    try {
      const response = await fetch(`${API_URL}/slots/business-config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching business configuration:', error);
      throw error;
    }
  },
  
  // Check if a specific slot is available
  checkSlotAvailability: async (date, startTime, endTime) => {
    try {
      const response = await fetch(`${API_URL}/consultations/check-slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, startTime, endTime }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      throw error;
    }
  },
};

// Payment API services for public use (no authentication required)
export const publicPaymentService = {
  // Initiate payment for a consultation
  initiatePayment: async (consultationId, amount) => {
    try {
      const response = await fetch(`${API_URL}/consultations/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consultationId, amount }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  },
  
  // Verify payment and update consultation status
  verifyPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/razorpay/verify-payment`, {
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
  },
  
  // Create a new consultation
  createConsultation: async (consultationData) => {
    try {
      const response = await fetch(`${API_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },
  
  // Update payment status after Razorpay redirect
  updatePaymentStatus: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/public/payment/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },
  
  // Get payment status by order ID
  getPaymentStatus: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/public/payment/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },
};