import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  User,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  AlertCircle,
  Loader,
  Link
} from 'lucide-react';
import { consultationService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../Components/LoadingState';
import ErrorState from '../Components/ErrorState';
import ConsultationDetail from '../Components/ConsultationDetail';

const Consultations = () => {
  const navigate = useNavigate();
  
  // State for date range picker
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for API data
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Fetch consultations from API with filters
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build filters object
        const filters = {
          status: statusFilter,
          date: showDatePicker ? format(selectedDate, 'yyyy-MM-dd') : null
        };
        
        const response = await consultationService.getAllConsultations(currentPage, 10, filters);

        console.log(response.data.consultations); // Add this line to check the response data
        
        // Transform the data to match our component's expected format
        const formattedConsultations = response.data.consultations.map(consultation => ({
          id: consultation._id,
          date: consultation.slotDate,
          time: consultation.slotStartTime,
          duration: calculateDuration(consultation.slotStartTime, consultation.slotEndTime),
          customer: consultation.name,
          email: consultation.email,
          phone: consultation.phone,
          type: consultation.service,
          status: consultation.status,
          paymentStatus: consultation.paymentStatus,
          notes: consultation.message,
          createdAt: consultation.createdAt,
          meetingLink: consultation.meetingLink // Added meetingLink
        }));
        
        setConsultations(formattedConsultations);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('Error fetching consultations:', err);
        setError('Failed to load consultations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultations();
  }, [currentPage, statusFilter, selectedDate, showDatePicker]);

  // Helper function to calculate duration from start and end time
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const durationMinutes = endMinutes - startMinutes;
    return `${durationMinutes} min`;
  };
  
  // Handle view consultation details
  const handleViewConsultation = async (id) => {
    try {
      setLoading(true);
      const response = await consultationService.getConsultation(id);
      setSelectedConsultation(response.data.consultation);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching consultation details:', err);
      setError('Failed to load consultation details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit consultation
  const handleEditConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setShowEditModal(true);
  };
  
  // Handle update consultation status
  const handleUpdateStatus = async (id, newStatus, newPaymentStatus) => {
    try {
      setUpdatingStatus(true);
      await consultationService.updateConsultationStatus(id, newStatus, newPaymentStatus);
      
      // Update the local state to reflect the change
      setConsultations(prevConsultations => 
        prevConsultations.map(consultation => 
          consultation.id === id 
            ? { ...consultation, status: newStatus, paymentStatus: newPaymentStatus || consultation.paymentStatus }
            : consultation
        )
      );
      
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating consultation status:', err);
      setError('Failed to update consultation status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Filter consultations based on status and search query
  const filteredConsultations = consultations.filter(consultation => {
    // Filter by status
    if (statusFilter !== 'all' && consultation.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !(
      (consultation.id && consultation.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (consultation.customer && consultation.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (consultation.email && consultation.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )) {
      return false;
    }
    
    return true;
  });

  // State for upcoming consultations
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  
  // Fetch upcoming consultations
  useEffect(() => {
    const fetchUpcomingConsultations = async () => {
      try {
        setLoadingUpcoming(true);
        const response = await consultationService.getUpcomingConsultations(3);
        
        // Transform the data to match our component's expected format
        const formattedUpcoming = response.data.consultations.map(consultation => ({
          id: consultation._id,
          date: consultation.slotDate,
          time: consultation.slotStartTime,
          duration: calculateDuration(consultation.slotStartTime, consultation.slotEndTime),
          customer: consultation.name,
          email: consultation.email,
          phone: consultation.phone,
          type: consultation.service,
          status: consultation.status,
          paymentStatus: consultation.paymentStatus,
          meetingLink: consultation.meetingLink // Added meetingLink
        }));
        
        setUpcomingConsultations(formattedUpcoming);
      } catch (err) {
        console.error('Error fetching upcoming consultations:', err);
      } finally {
        setLoadingUpcoming(false);
      }
    };
    
    fetchUpcomingConsultations();
  }, []);
  
  // Animation variants
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
      case 'booked':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <CalendarIcon size={12} className="mr-1" />
            Booked
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={12} className="mr-1" />
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <Loader size={40} className="text-blue-600 animate-spin mb-4" />
            <p className="text-gray-700">Loading consultations...</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <motion.div variants={itemVariants} className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Consultations</h1>
          <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <button 
              className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar size={18} className="mr-2 text-blue-600" />
              {format(selectedDate, 'MMM d, yyyy')}
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                {/* Date picker would go here */}
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <button 
                      key={day}
                      className={`w-8 h-8 rounded-full text-sm ${day === selectedDate.getDate() ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(day);
                        setSelectedDate(newDate);
                        setShowDatePicker(false);
                        // Reset to page 1 when date changes
                        setCurrentPage(1);
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          
          
          <div className="relative flex-1 sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Upcoming consultations sidebar */}
        <motion.div 
          className="lg:w-80 xl:w-96"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 sticky top-6">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <CalendarIcon size={18} className="mr-2" />
                Upcoming Consultations
              </h3>
              <p className="text-blue-100 text-sm mt-1">Next scheduled appointments</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {upcomingConsultations.length > 0 ? (
                upcomingConsultations.map((consultation) => (
                  <div key={consultation.id} className="p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{consultation.customer}</h4>
                      {renderStatusBadge(consultation.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1 text-blue-600" />
                      {format(new Date(consultation.date), 'MMM d, yyyy')} at {consultation.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Phone size={14} className="mr-1 text-blue-600" />
                      {consultation.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={14} className="mr-1 text-blue-600" />
                      {consultation.email}
                    </div>
                    {consultation.meetingLink && (
                      <div className="flex items-center text-sm text-blue-600 mt-2">
                        <Link size={14} className="mr-1" />
                        <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer">
                          Join Meeting
                        </a>
                      </div>
                    )}
                    <button
                        className="text-xs mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => handleViewConsultation(consultation.id)}
                      >
                        View Details
                      </button>
                    {consultation.notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {consultation.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No upcoming consultations scheduled.
                </div>
              )}
            </div>
            
           
          </div>
        </motion.div>
        
        
        {/* Consultations list */}
        <motion.div 
          className="flex-1"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <LoadingState message="Loading consultations..." />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <ErrorState 
                          message={error} 
                          onRetry={() => {
                            setLoading(true);
                            setError(null);
                            
                            // Build filters object
                            const filters = {
                              status: statusFilter,
                              date: showDatePicker ? format(selectedDate, 'yyyy-MM-dd') : null
                            };
                            
                            consultationService.getAllConsultations(currentPage, 10, filters)
                              .then(response => {
                                const formattedConsultations = response.data.consultations.map(consultation => ({
                                  id: consultation._id,
                                  date: consultation.slotDate,
                                  time: consultation.slotStartTime,
                                  duration: calculateDuration(consultation.slotStartTime, consultation.slotEndTime),
                                  customer: consultation.name,
                                  email: consultation.email,
                                  phone: consultation.phone,
                                  type: consultation.service,
                                  status: consultation.status,
                                  paymentStatus: consultation.paymentStatus,
                                  notes: consultation.message,
                                  createdAt: consultation.createdAt,
                                  meetingLink: consultation.meetingLink
                                }));
                                setConsultations(formattedConsultations);
                                setTotalPages(response.totalPages || 1);
                              })
                              .catch(err => {
                                console.error('Error fetching consultations:', err);
                                setError('Failed to load consultations. Please try again.');
                              })
                              .finally(() => setLoading(false));
                          }}
                        />
                      </td>
                    </tr>
                  ) : filteredConsultations.length > 0 ? (
                    filteredConsultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consultation.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User size={20} className="text-blue-600" />
                            </div>
                            <div className="ml-4 text-left">
                              <div className="text-sm font-medium text-gray-900">{consultation.customer}</div>
                              <div className="text-sm text-gray-500">{consultation.email}</div>
                              {consultation.meetingLink && (
                                <a 
                                  href={consultation.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                                >
                                  <Link size={14} className="mr-1" />
                                  Join Meeting
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{format(new Date(consultation.date), 'MMM d, yyyy')}</div>
                          <div className="text-sm text-gray-500">{consultation.time} ({consultation.duration})</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consultation.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(consultation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => handleViewConsultation(consultation.id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No consultations found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredConsultations.length}</span> of <span className="font-medium">{consultations.length}</span> consultations
              </div>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button 
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Upcoming consultations sidebar */}
        
      </div>
      
      {/* View/Edit Consultation Modal using the ConsultationDetail component */}
      {showViewModal && selectedConsultation && (
        <ConsultationDetail 
          consultationId={selectedConsultation.id || selectedConsultation._id}
          onClose={() => setShowViewModal(false)}
          onUpdate={(updatedConsultation) => {
            // Update the local state to reflect changes
            setConsultations(prevConsultations => 
              prevConsultations.map(consultation => 
                consultation.id === updatedConsultation.id 
                  ? { ...consultation, status: updatedConsultation.status, paymentStatus: updatedConsultation.paymentStatus }
                  : consultation
              )
            );
          }}
        />
      )}
    </motion.div>
  );
};

export default Consultations;