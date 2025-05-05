import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BarChart, LineChart, Calendar, Users, DollarSign, Clock, TrendingUp, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  
  const todayDate = new Date();
  const formattedDate = format(todayDate, 'EEEE, MMMM d, yyyy');
  const currentYear = todayDate.getFullYear();
  
  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardStats();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const navigate = useNavigate();

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setAnalyticsLoading(true);
        const response = await dashboardService.getMonthlyAnalytics(currentYear);
        setAnalyticsData(response.data);
        setAnalyticsError(null);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setAnalyticsError('Failed to load analytics data. Please try again later.');
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [currentYear]);
  
  // Default values in case data is still loading
  const paymentStats = dashboardData?.paymentStats || {
    total: 0,
    pending: 0,
    completed: 0,
    growth: 0
  };
  
  const consultationStats = dashboardData?.consultationStats || {
    total: 0,
    completed: 0,
    upcoming: 0,
    growth: 0
  };
  
  const todaysAppointments = dashboardData?.todaysAppointments || [];
  const recentPayments = dashboardData?.recentPayments || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <motion.div variants={itemVariants} className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Dashboard</h1>
          <p className="text-gray-500 mt-1">{formattedDate}</p>
        </motion.div>
        
      </div>
      
      {/* Stats Overview */}
      {loading ? (
        <div className="flex items-center justify-center h-40 bg-white rounded-2xl shadow mb-8">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-40 bg-white rounded-2xl shadow mb-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Payment Stats */}
          <motion.div 
            className="bg-white p-6 rounded-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-4">
                <IndianRupee size={28} className="text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 flex items-center"><IndianRupee className='w-5'/>{paymentStats.total.toLocaleString()}</h3>
               
              </div>
            </div>
          </motion.div>
          
          {/* Total Consultations */}
          <motion.div 
            className="bg-white p-6 rounded-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-gradient-to-br from-purple-100 to-purple-200 p-4">
                <Users size={28} className="text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-500">Total Consultations</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{consultationStats.total}</h3>
               
              </div>
            </div>
          </motion.div>

          {/* Pending Payments */}
          <motion.div 
            className="bg-white p-6 rounded-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-gradient-to-br from-amber-100 to-amber-200 p-4">
                <AlertCircle size={28} className="text-amber-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 flex items-center"><IndianRupee className='w-5'/>{paymentStats.pending.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-2">Requires attention</p>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Consultations */}
          <motion.div 
            className="bg-white p-6 rounded-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 p-4">
                <Clock size={28} className="text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-500">Upcoming Today</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{consultationStats.upcoming}</h3>
                <p className="text-xs text-gray-500 mt-2">Consultations scheduled</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40 bg-white rounded-2xl shadow mb-8">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-40 bg-white rounded-2xl shadow mb-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Today's Consultations</h2>
                <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {todaysAppointments.length} Total
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-xs uppercase tracking-wider text-gray-700">
                    <th className="px-6 py-4 text-left">Time</th>
                    <th className="px-6 py-4 text-left">Patient</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {todaysAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No consultations scheduled for today
                      </td>
                    </tr>
                  ) : (
                    todaysAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {appointment.slotTime}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {appointment.patientName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {appointment.consultationType}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'completed' 
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                              : appointment.status === 'in-progress' 
                              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' 
                              : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800'
                          }`}>
                            {appointment.status === 'completed' ? 'Completed' : 
                             appointment.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Recent Payments */}
          <motion.div 
            className="bg-white rounded-2xl overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Recent Payments</h2>
                <button onClick={()=>navigate("/admin/payments")} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentPayments.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No recent payments found
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment._id} className="mb-4 last:mb-0 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className='text-left'>
                        <p className="text-sm font-medium text-gray-900">{payment._id}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'completed' 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                          : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800'
                      }`}>
                        {payment.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-lg font-bold text-gray-900 flex items-center"><IndianRupee className='w-4'/>{payment.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Analytics Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        variants={containerVariants}
      >
        {/* Payment Analytics */}
        <motion.div 
          className="bg-white p-6 rounded-2xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Payment Analytics</h2>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></span>
              <span className="text-sm text-gray-500">Revenue</span>
            </div>
          </div>
          <div className="h-72 flex items-center justify-center">
            {analyticsLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-500">Loading analytics data...</p>
              </div>
            ) : analyticsError ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-red-500">{analyticsError}</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-end justify-around">
                {analyticsData?.monthlyPayments?.length > 0 ? (
                  analyticsData.monthlyPayments.map((data) => {
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = monthNames[data.month - 1];
                    return (
                      <div key={month} className="flex flex-col items-center group">
                        <div 
                          className="w-14 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300" 
                          style={{ height: `${(data.totalAmount / 1000) * 2 + 30}px` }}
                        ></div>
                        <span className="text-sm mt-2 text-gray-500">{month}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-gray-500">No payment data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Consultation Analytics */}
        <motion.div 
          className="bg-white p-6 rounded-2xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Consultation Analytics</h2>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></span>
              <span className="text-sm text-gray-500">Consultations</span>
            </div>
          </div>
          <div className="h-72 flex items-center justify-center">
            {analyticsLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-500">Loading analytics data...</p>
              </div>
            ) : analyticsError ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-red-500">{analyticsError}</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-end justify-around">
                {analyticsData?.monthlyConsultations?.length > 0 ? (
                  analyticsData.monthlyConsultations.map((data) => {
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = monthNames[data.month - 1];
                    return (
                      <div key={month} className="flex flex-col items-center group">
                        <div 
                          className="w-14 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg group-hover:from-purple-600 group-hover:to-purple-500 transition-all duration-300" 
                          style={{ height: `${data.count * 3 + 20}px` }}
                        ></div>
                        <span className="text-sm mt-2 text-gray-500">{month}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-gray-500">No consultation data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;