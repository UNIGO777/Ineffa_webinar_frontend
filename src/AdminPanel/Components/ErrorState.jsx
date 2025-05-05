import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle size={40} className="text-red-500 mb-4" />
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorState;