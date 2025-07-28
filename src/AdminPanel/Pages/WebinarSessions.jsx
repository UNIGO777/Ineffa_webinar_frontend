import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Video, Eye, Edit3, Trash2, RefreshCw, Plus, Copy, ExternalLink, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock as ClockIcon } from 'lucide-react';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';

function WebinarSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  
  useEffect(() => {
    fetchWebinarSessions();
  }, []);
  
  const fetchWebinarSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/webinar-sessions/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch webinar sessions');
      }
      
      const data = await response.json();
      setSessions(data.data.sessions || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching webinar sessions:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleExpandSession = (id) => {
    setExpandedSession(expandedSession === id ? null : id);
  };
  
  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };
  
  const handleCopyMeetingLink = async (meetingLink) => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopySuccess('Meeting link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy meeting link:', err);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" />, text: 'Upcoming' },
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" />, text: 'Active' },
      completed: { color: 'bg-gray-100 text-gray-800', icon: <CheckCircle className="w-3 h-3" />, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-3 h-3" />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };
  
  const isSessionActive = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.sessionDate);
    const [hours, minutes] = session.sessionTime.split(':');
    
    const sessionStart = new Date(sessionDate);
    sessionStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + session.duration);
    
    return now >= sessionStart && now <= sessionEnd;
  };
  
  if (loading) {
    return <LoadingState message="Loading webinar sessions..." />;
  }
  
  if (error) {
    return <ErrorState message={error} retry={fetchWebinarSessions} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Webinar Sessions</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your UI/UX design webinar sessions</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchWebinarSessions} 
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Copy Success Message */}
      {copySuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {copySuccess}
        </motion.div>
      )}
      
      {/* Sessions List */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
                isSessionActive(session) ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Session Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        UI/UX Design Webinar
                      </h3>
                      {getStatusBadge(session.status)}
                      {isSessionActive(session) && (
                        <span className="animate-pulse bg-red-500 text-xs text-white px-2 py-1 rounded-full">
                          LIVE
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{formatDate(session.sessionDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        <span>{formatTime(session.sessionTime)} ({session.duration}min)</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{session.registeredCount}/{session.maxParticipants} registered</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>Meeting ID: {session.meetingId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopyMeetingLink(session.meetingLink)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy meeting link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a 
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="Open meeting"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => handleViewDetails(session)}
                      className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleExpandSession(session._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {expandedSession === session._id ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
                
                {/* Meeting Link */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Meeting Link:</p>
                      <p className="text-sm font-mono text-gray-700 break-all">{session.meetingLink}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleCopyMeetingLink(session.meetingLink)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Copy
                      </button>
                      <a 
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Join
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedSession === session._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 p-6 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Session Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="text-gray-900 text-right max-w-xs">{session.description}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="text-gray-900">{session.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Participants:</span>
                          <span className="text-gray-900">{session.maxParticipants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meeting Password:</span>
                          <span className="text-gray-900 font-mono">{session.meetingPassword || 'Not set'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Topics Covered</h4>
                      <ul className="space-y-1">
                        {session.topics && session.topics.map((topic, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No webinar sessions found</h3>
          <p className="text-gray-500">Recent webinar sessions will appear here.</p>
        </div>
      )}
      
      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Session Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedSession.sessionDate)} at {formatTime(selectedSession.sessionTime)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {getStatusBadge(selectedSession.status)}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedSession.meetingLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => handleCopyMeetingLink(selectedSession.meetingLink)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registered</label>
                  <p className="text-2xl font-bold text-blue-600">{selectedSession.registeredCount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                  <p className="text-2xl font-bold text-gray-600">{selectedSession.maxParticipants}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default WebinarSessions; 