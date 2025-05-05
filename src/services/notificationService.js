// Notification API service for making requests to the backend

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

// Notification API services
export const notificationService = {
  // Get all notifications
  getAllNotifications: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/unread`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  // Get notification by ID
  getNotification: async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete notification');
      }
      
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },

  // Delete read notifications
  deleteReadNotifications: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/read`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete read notifications');
      }
      
      return true; // Successfully deleted
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }
  },
};