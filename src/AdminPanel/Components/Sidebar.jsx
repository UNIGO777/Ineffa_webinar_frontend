import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Calendar, Settings, LogOut, ChevronRight } from 'lucide-react';
import logoWhite from '../../Landing page/assets/WhiteLogo.png';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'consultations', label: 'Consultations', icon: <Calendar size={18} /> },
    
  ];

  const navigate = useNavigate(); // Add this line t

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    // Redirect to login page
    navigate('/admin/login');
    
    // Close user menu
    setShowUserMenu(false);
  };

  return (
    <motion.div 
      className="hidden lg:flex h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4  flex-col shadow-xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center mb-8 mt-4">
        <img src={logoWhite} alt="Ineffa Logo" className="h-12" />
      </div>
      
     
        
      
      <nav className="flex-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Main Menu</h3>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <motion.li 
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/admin/${item.id}`}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${currentPath === item.id ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700/50'}`}
              >
                <span className="mr-3 text-blue-300">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {currentPath === item.id ? (
                  <motion.div 
                    className="ml-auto"
                    layoutId="activeIndicator"
                  >
                    <ChevronRight size={16} className="text-blue-300" />
                  </motion.div>
                ) : (
                  <span className="ml-auto opacity-0 group-hover:opacity-100">
                    <ChevronRight size={16} className="text-gray-400" />
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700/50">
        <motion.button
          className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-3" />
          <span>Logout</span>
        </motion.button>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Ineffa Admin Panel</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;