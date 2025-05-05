// Payment API service for making requests to the backend

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

// Authentication header helper
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Payment API services
export const paymentService = {
  // Get all payments with optional pagination and filtering
  getAllPayments: async (page = 1, limit = 10, filters = {}) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      
      // Add filters if provided
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      
      if (filters.date) {
        queryParams.append('date', filters.date);
      }
      
      if (filters.startDate && filters.endDate) {
        queryParams.append('startDate', filters.startDate);
        queryParams.append('endDate', filters.endDate);
      }
      
      if (filters.consultationId) {
        queryParams.append('consultationId', filters.consultationId);
      }
      
      const response = await fetch(`${API_URL}/payments?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Get payment by ID
  getPayment: async (id) => {
    try {
      const response = await fetch(`${API_URL}/payments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/payments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
  },

  // Delete payment
  deletePayment: async (id) => {
    try {
      const response = await fetch(`${API_URL}/payments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete payment');
      }
      
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  },

  // Get payment statistics
  getPaymentStats: async () => {
    try {
      const response = await fetch(`${API_URL}/payments/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  },
};