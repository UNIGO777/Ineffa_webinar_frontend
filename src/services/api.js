// API service for making requests to the backend

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

// Consultation API services
export const consultationService = {
  // Get all consultations with optional pagination and filtering
  getAllConsultations: async (page = 1, limit = 10, filters = {}) => {
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
      
      if (filters.upcoming) {
        queryParams.append('upcoming', 'true');
      }
      
      const response = await fetch(`${API_URL}/consultations?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },
  
  // Get upcoming consultations
  getUpcomingConsultations: async (limit = 5) => {
    try {
      const response = await fetch(`${API_URL}/consultations?upcoming=true&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching upcoming consultations:', error);
      throw error;
    }
  },

  // Get consultation by ID
  getConsultation: async (id) => {
    try {
      const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching consultation ${id}:`, error);
      throw error;
    }
  },

  // Update consultation status
  updateConsultationStatus: async (id, status, paymentStatus) => {
    try {
      const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status, paymentStatus }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating consultation ${id}:`, error);
      throw error;
    }
  },

  // Delete consultation
  deleteConsultation: async (id) => {
    try {
      const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete consultation');
      }
      
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting consultation ${id}:`, error);
      throw error;
    }
  },

  // Get consultation statistics
  getConsultationStats: async () => {
    try {
      const response = await fetch(`${API_URL}/consultations/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching consultation stats:', error);
      throw error;
    }
  },
};