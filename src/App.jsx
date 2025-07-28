import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import LoadingSpinner from './LoadingSpinner';

// Using lazy loading for components
const LandingPage = React.lazy(() => import('./Landing page/LandingPage1'));
const AdminPanel = React.lazy(() => import('./AdminPanel/Index'));
const PaymentSuccess = React.lazy(() => import('./Landing page/PaymentSuccess'));
const WebinarPage = React.lazy(() => import('./Landing page/WebinarPage'));

// Protected route component for PaymentSuccess page
const ProtectedPaymentRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    // Check if payment was verified
    const paymentVerified = localStorage.getItem('paymentVerified');
    
    // If not verified, redirect to home
    if (!paymentVerified) {
      navigate('/');
    } else {
      // Clear the flag after checking
      localStorage.removeItem('paymentVerified');
    }
  }, [navigate]);
  
  // Return the component or null while checking
  return location.state?.paymentDetails ? <PaymentSuccess /> : <LoadingSpinner />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/webinar" />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/payment-success" element={<ProtectedPaymentRoute />} />
            <Route path="/webinar" element={<WebinarPage />} />
            <Route path="/landing" element={<LandingPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;