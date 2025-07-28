import { API_URL } from '../config/config';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Payment API service
export const paymentService = {
  // Get all payments
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
      
      if (filters.webinarId) {
        queryParams.append('webinarId', filters.webinarId);
      }
      
      const response = await fetch(`${API_URL}/payments?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
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
          ...getAuthHeader()
        }
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(paymentData)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating payment:', error);
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
          ...getAuthHeader()
        },
        body: JSON.stringify({ status })
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
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete payment');
      }
      
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  },
  
  // Export payments to Excel
  exportPayments: async (filters = {}) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add filters if provided
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      
      if (filters.startDate && filters.endDate) {
        queryParams.append('startDate', filters.startDate);
        queryParams.append('endDate', filters.endDate);
      }
      
      // Set response type to blob to handle Excel file
      const response = await fetch(`${API_URL}/payments/export?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          ...getAuthHeader()
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export payments');
      }
      
      // Get the Excel file as a blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `payments_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error exporting payments:', error);
      throw error;
    }
  }
};