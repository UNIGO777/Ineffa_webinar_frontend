// Dashboard API service for making requests to the backend

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

// Dashboard API services
export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get monthly analytics data
  getMonthlyAnalytics: async (year = new Date().getFullYear()) => {
    try {
      const response = await fetch(`${API_URL}/dashboard/analytics?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching monthly analytics:', error);
      throw error;
    }
  },
};