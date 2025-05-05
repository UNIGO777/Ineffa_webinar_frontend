import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Trash2, 
  RefreshCw,
  Loader
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import LoadingState from '../Components/LoadingState';
import ErrorState from '../Components/ErrorState';

const Notifications = () => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getAllNotifications();
      setNotifications(response.data.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== id)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Delete all read notifications
  const handleDeleteReadNotifications = async () => {
    try {
      await notificationService.deleteReadNotifications();
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => !notification.isRead)
      );
    } catch (err) {
      console.error('Error deleting read notifications:', err);
    }
  };

  // Helper function to render notification icon based on type
  const renderNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  // Loading state
  if (loading && !refreshing) {
    return <LoadingState message="Loading notifications..." />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchNotifications} />;
  }

  return (
    <motion.div 
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <motion.div 
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }
          }} 
          className="mb-4 sm:mb-0 text-left"
        >
          <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Notifications</h1>
          <p className="text-gray-500 mt-1">Manage your system notifications</p>
        </motion.div>
        <motion.div 
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }
          }} 
          className="flex space-x-3"
        >
          <button 
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-sm"
            onClick={handleMarkAllAsRead}
          >
            <CheckCircle size={16} className="mr-2 text-green-500" />
            Mark All Read
          </button>
        
        </motion.div>
      </div>
      
      {/* Notifications List */}
      <motion.div 
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: "easeOut"
            }
          }
        }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {renderNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className={`text-sm  font-medium text-left ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 text-right">
                        {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 text-left">{notification.message}</p>
                    <div className="mt-2 flex justify-end space-x-2">
                      {!notification.isRead && (
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        className="text-xs text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteNotification(notification._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Notifications;