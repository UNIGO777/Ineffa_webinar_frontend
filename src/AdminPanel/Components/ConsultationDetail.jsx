import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { consultationService } from '../../services/api';

const ConsultationDetail = ({ consultationId, onClose, onUpdate }) => {
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchConsultationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await consultationService.getConsultation(consultationId);
        setConsultation(response.data.consultation);
        setUpdatedStatus(response.data.consultation.status);
        setUpdatedPaymentStatus(response.data.consultation.paymentStatus);
      } catch (err) {
        console.error('Error fetching consultation details:', err);
        setError('Failed to load consultation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchConsultationDetails();
    }
  }, [consultationId]);

  const handleUpdateConsultation = async () => {
    try {
      setUpdating(true);
      await consultationService.updateConsultationStatus(
        consultationId, 
        updatedStatus, 
        updatedPaymentStatus
      );
      
      // Update the local state
      setConsultation(prev => ({
        ...prev,
        status: updatedStatus,
        paymentStatus: updatedPaymentStatus
      }));
      
      // Notify parent component about the update
      if (onUpdate) {
        onUpdate({
          id: consultationId,
          status: updatedStatus,
          paymentStatus: updatedPaymentStatus
        });
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating consultation:', err);
      setError('Failed to update consultation. Please try again.');
    } finally {
      setUpdating(false);
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
      case 'scheduled':
      case 'pending':
        return (
          <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle size={12} className="mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex justify-center items-center">
            <Loader size={24} className="animate-spin text-blue-600 mr-2" />
            <p>Loading consultation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="text-red-500 flex items-center justify-center">
            <AlertCircle size={24} className="mr-2" />
            <p>{error}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Consultation' : 'Consultation Details'}
          </h3>
          <button 
            className="text-gray-400 hover:text-gray-500 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex flex-col space-y-2">
                  {['pending', 'completed', 'cancelled'].map((status) => (
                    <label key={status} className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-blue-600" 
                        name="status" 
                        value={status} 
                        checked={updatedStatus === status}
                        onChange={() => setUpdatedStatus(status)}
                      />
                      <span className="ml-2 text-gray-700">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <div className="flex flex-col space-y-2">
                  {['pending', 'completed', 'failed'].map((status) => (
                    <label key={status} className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-blue-600" 
                        name="paymentStatus" 
                        value={status} 
                        checked={updatedPaymentStatus === status}
                        onChange={() => setUpdatedPaymentStatus(status)}
                      />
                      <span className="ml-2 text-gray-700">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className='text-left'>
                  <h4 className="text-sm  font-medium text-gray-500">Customer</h4>
                  <p className="text-base font-medium">{consultation.name}</p>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-base">{consultation.email}</p>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="text-base">{consultation.phone}</p>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Service</h4>
                  <p className="text-base">{consultation.service}</p>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p className="text-base">{format(new Date(consultation.slotDate), 'MMM d, yyyy')}</p>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Time</h4>
                  <p className="text-base">{consultation.slotStartTime} - {consultation.slotEndTime}</p>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">{renderStatusBadge(consultation.status)}</div>
                </div>
                <div className='text-left'>
                  <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${consultation.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : consultation.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {consultation.paymentStatus.charAt(0).toUpperCase() + consultation.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="text-base mt-1 p-3 bg-gray-50 rounded">{consultation.message}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          {isEditing ? (
            <>
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mr-2"
                onClick={() => setIsEditing(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                onClick={handleUpdateConsultation}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mr-2"
                onClick={onClose}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ConsultationDetail;