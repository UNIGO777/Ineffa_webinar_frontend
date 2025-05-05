import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Settings, ChevronDown, User, MessageSquare, HelpCircle,
  Menu, X, LayoutDashboard, CreditCard, Calendar, LogOut, CheckCircle,
  XCircle, AlertCircle, Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  // Fetch unread notifications
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificationService.getUnreadNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    // Get admin data from localStorage
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const parsedData = JSON.parse(adminData);
        if (parsedData && parsedData.name) {
          setAdminName(parsedData.name);
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
      }
    }
    
    // Fetch notifications
    fetchNotifications();
    
    // Set up interval to check for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'consultations', label: 'Consultations', icon: <Calendar size={18} /> },
    
  ];
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    // Redirect to login page
    navigate('/admin/login');
    
    // Close user menu
    setShowUserMenu(false);
  };

  // Handle mark as read
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      // Remove from the list of unread notifications
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Navigate to notifications page
  const navigateToNotifications = () => {
    setShowNotifications(false);
    navigate('/admin/notifications');
  };
  
  // Helper function to render notification icon based on type
  const renderNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-amber-500" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };
  
  // Format time
  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };
  
  return (
    <>
      <motion.nav 
        className="bg-white  px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <motion.button
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden mr-2"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={24} />
          </motion.button>
          <div className='text-left'>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, <span className="text-blue-600 font-medium">{adminName}</span></p>
          </div>
        </div>
        
        
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <motion.button 
              className="p-2 rounded-full hover:bg-gray-100 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </motion.button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-80 bg-white rounded-lg shadow-lg py-2 z-30 border border-gray-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex justify-between items-center text-left">
                      <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                      <button 
                        className="text-xs text-blue-600 cursor-pointer hover:underline text-left"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="px-4 py-3 text-left">
                        <p className="text-sm text-gray-500">Loading notifications...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification._id} 
                          className="px-4 py-3 hover:bg-gray-50 border-l-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer text-left"
                          onClick={() => {
                            handleMarkAsRead(notification._id, event);
                            navigate('/admin/notifications');
                          }}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-2">
                              {renderNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 text-left">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2 text-left">{notification.message}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500 text-left">{formatNotificationTime(notification.createdAt)}</span>
                                <button 
                                  className="text-xs text-blue-600 hover:text-blue-800 text-left"
                                  onClick={(e) => handleMarkAsRead(notification._id, e)}
                                >
                                  Mark read
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-left">
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100 text-left">
                    <button 
                      onClick={navigateToNotifications}
                      className="text-xs text-blue-600 hover:underline text-left"
                    >
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Quick Actions - Hidden on mobile */}
         
          
          {/* User Profile */}
          <div className="relative">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer bg-gray-50 rounded-full pl-2 pr-3 py-1 border border-gray-200"
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-semibold shadow-sm">
                A
              </div>
              <span className="text-gray-700 text-sm hidden md:inline-block">Admin</span>
              <ChevronDown size={16} className="text-gray-500" />
            </motion.div>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-30 border border-gray-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100 text-left">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800">{adminName}</p>
                  </div>
                  
                
                  
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2 text-red-500" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Menu</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/admin/${item.id}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="text-gray-700">{item.label}</span>
                  </Link>
                ))}
                <Link
                  to="/admin/notifications"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-500"><Bell size={18} /></span>
                  <span className="text-gray-700">Notifications</span>
                  {notifications.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                  )}
                </Link>
              </div>

              <div className="mt-8 space-y-2">
                <a href="#" className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare size={18} className="text-gray-500" />
                    <span>Messages</span>
                  </div>
                </a>
                <a href="#" className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HelpCircle size={18} className="text-gray-500" />
                    <span>Help & Support</span>
                  </div>
                </a>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-4 py-2 text-sm text-gray-500">Admin Panel</div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowMobileMenu(false)}>
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowMobileMenu(false)}>
                  Settings
                </Link>
                <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowMobileMenu(false)}>
                  Help Center
                </Link>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center" 
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;