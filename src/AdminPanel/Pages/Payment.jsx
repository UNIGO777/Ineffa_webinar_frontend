import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  IndianRupee,
  Loader,
  FileText,
  X
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

const Payment = () => {
  // State for date range picker
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for API data
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for payment view modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);
  
  // State for receipt modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Fetch payments from API with filters
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare filters object
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      };
      
      const response = await paymentService.getAllPayments(currentPage, 10, filters);
      setPayments(response.data.payments);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, startDate, endDate]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  };

  // Filter payments based on status and search query
  const filteredPayments = payments.filter(payment => {
    // Filter by status
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !(
      payment.consultationId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment._id?.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600">
          <XCircle size={40} className="mx-auto mb-4" />
          <p>{error}</p>
          <button
            onClick={fetchPayments}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle view payment details
  const handleViewPayment = async (id) => {
    try {
      setLoadingPaymentDetails(true);
      const response = await paymentService.getPayment(id);
      setSelectedPayment(response.data.payment);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching payment details:', err);
    } finally {
      setLoadingPaymentDetails(false);
    }
  };

  // Handle generate receipt
  const handleGenerateReceipt = (payment) => {
    setReceiptData(payment);
    setShowReceiptModal(true);
  };

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
          <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Payments</h1>
          <p className="text-gray-500 mt-1">Manage and track all payment transactions</p>
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
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center shadow-sm">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </motion.div>
      </div>
      
      {/* Filters and Search */}
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
        className="bg-white rounded-xl shadow-sm mb-6 p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          {/* Date Range Picker */}
          <div className="relative">
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Calendar size={16} />
              <span>
                {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {showDatePicker && (
              <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-72">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Select Date Range</h3>
                  <button 
                    onClick={() => setShowDatePicker(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={format(startDate, 'yyyy-MM-dd')}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={format(endDate, 'yyyy-MM-dd')}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => {
                      setShowDatePicker(false);
                      setCurrentPage(1); // Reset to page 1 when applying date filters
                      fetchPayments(); // Fetch payments with new date range
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <div className="relative">
              <button 
                onClick={() => setShowStatusFilter(!showStatusFilter)}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Filter size={16} />
                <span>
                  {statusFilter === 'all' ? 'All Status' : 
                   statusFilter === 'completed' ? 'Completed' : 
                   statusFilter === 'pending' ? 'Pending' : 'Failed'}
                </span>
                <ChevronDown size={16} />
              </button>
              
              {showStatusFilter && (
                <div className="absolute z-10 mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-200 w-48 right-0">
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'all' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      setStatusFilter('all');
                      setShowStatusFilter(false);
                      // Reset to page 1 when changing filters
                      setCurrentPage(1);
                    }}
                  >
                    All Status
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'completed' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      setStatusFilter('completed');
                      setShowStatusFilter(false);
                      // Reset to page 1 when changing filters
                      setCurrentPage(1);
                    }}
                  >
                    Completed
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'pending' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      setStatusFilter('pending');
                      setShowStatusFilter(false);
                      // Reset to page 1 when changing filters
                      setCurrentPage(1);
                    }}
                  >
                    Pending
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === 'failed' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      setStatusFilter('failed');
                      setShowStatusFilter(false);
                      // Reset to page 1 when changing filters
                      setCurrentPage(1);
                    }}
                  >
                    Failed
                  </button>
                </div>
              )}
            </div>
            
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by ID or customer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Payments Table */}
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr >
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium text-blue-600">
                      {payment._id}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-800">
                      {payment.consultationId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-800">
                      <div className="flex items-center">
                        <IndianRupee size={14} className="mr-1" />
                        {payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left w-fit">
                      {renderStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleViewPayment(payment._id)}
                      >
                        View
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => handleGenerateReceipt(payment)}
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-left text-sm text-gray-500">
                    No payment records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{Math.min(1 + (currentPage - 1) * 10, filteredPayments.length)}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, filteredPayments.length)}</span> of{' '}
                <span className="font-medium">{filteredPayments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Payment View Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
              <button 
                className="text-gray-400 hover:text-gray-500 text-xl"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {loadingPaymentDetails ? (
                <div className="flex justify-center items-center py-8">
                  <Loader size={24} className="animate-spin text-blue-600 mr-2" />
                  <p>Loading payment details...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment ID</p>
                      <p className="text-base font-medium text-gray-900">{selectedPayment._id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-base text-gray-900">{format(new Date(selectedPayment.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Customer</p>
                      <p className="text-base text-gray-900">{selectedPayment.consultationId?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="text-base font-medium text-gray-900 flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {selectedPayment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <p className="text-base text-gray-900">{selectedPayment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="mt-1">{renderStatusBadge(selectedPayment.status)}</div>
                    </div>
                  </div>
                  
                  {selectedPayment.transactionId && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                      <p className="text-base text-gray-900">{selectedPayment.transactionId}</p>
                    </div>
                  )}
                  
                  {selectedPayment.consultationId && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-3">Consultation Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Service</p>
                          <p className="text-base text-gray-900">{selectedPayment.consultationId.service || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date & Time</p>
                          <p className="text-base text-gray-900">
                            {selectedPayment.consultationId.slotDate ? 
                              `${format(new Date(selectedPayment.consultationId.slotDate), 'MMM dd, yyyy')} at ${selectedPayment.consultationId.slotStartTime}` : 
                              'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Payment Receipt</h3>
              <button 
                className="text-gray-400 hover:text-gray-500 text-xl"
                onClick={() => setShowReceiptModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Payment Receipt</h2>
                  <p className="text-gray-500">{format(new Date(receiptData.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt No:</span>
                    <span className="text-gray-900 font-medium">{receiptData._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="text-gray-900">{receiptData.consultationId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="text-gray-900">{receiptData.consultationId?.service || 'Consultation'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">{receiptData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`${receiptData.status === 'completed' ? 'text-green-600' : 'text-amber-600'} font-medium`}>
                      {receiptData.status.charAt(0).toUpperCase() + receiptData.status.slice(1)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-800">Total Amount:</span>
                      <span className="text-gray-900 flex items-center">
                        <IndianRupee size={16} className="mr-1" />
                        {receiptData.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  onClick={() => window.print()}
                >
                  <FileText size={16} className="mr-2" />
                  Print Receipt
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Payment;