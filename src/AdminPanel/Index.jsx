import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Payment from './Pages/Payment';
import Consultations from './Pages/Consultations';
import Login from './Pages/Login';
import Notifications from './Pages/Notifications';



// Component imports for routes


// Using the new Payment component instead of this placeholder
const Payments = Payment;



// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              
              <main className="flex-1 overflow-y-auto ">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Routes>
                    <Route path="dashboard" element={<Home/>} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="consultations" element={<Consultations />} />
                    <Route path="login" element={<Login />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </motion.div>
              </main>
              
              <Footer />
            </div>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default Index;