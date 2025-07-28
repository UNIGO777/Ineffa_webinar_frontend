import React, { useState, useEffect } from 'react';
import { DownloadCloud, Trash2, ChevronDown, ChevronUp, Search, Filter, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';

function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedWebinar, setExpandedWebinar] = useState(null);
  
  useEffect(() => {
    fetchWebinars();
  }, []);
  
  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
              const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/admin/webinars`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch webinars');
      }
      
      const data = await response.json();
      setWebinars(data.data.webinars || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching webinars:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this webinar registration?')) {
      try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/admin/webinars/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete webinar');
        }
        
        // Remove the deleted webinar from the state
        setWebinars(webinars.filter(webinar => webinar._id !== id));
      } catch (err) {
        console.error('Error deleting webinar:', err);
        alert('Failed to delete webinar: ' + err.message);
      }
    }
  };
  
  const handleExpandWebinar = (id) => {
    setExpandedWebinar(expandedWebinar === id ? null : id);
  };
  
  const filteredWebinars = webinars
    .filter(webinar => {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase();
      if (searchTerm && !(
        webinar.name.toLowerCase().includes(searchLower) || 
        webinar.email.toLowerCase().includes(searchLower) || 
        webinar.phone.toLowerCase().includes(searchLower)
      )) {
        return false;
      }
      
      // Apply status filter
      if (filterStatus !== 'all') {
        return webinar.paymentStatus === filterStatus;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === 'webinarDate') {
        return sortDirection === 'asc' 
          ? new Date(a.webinarDate) - new Date(b.webinarDate)
          : new Date(b.webinarDate) - new Date(a.webinarDate);
      }
      
      if (sortField === 'createdAt') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      // For name, email, phone
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  // Get payment status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center"><CheckCircle size={12} className="mr-1" /> Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center"><Clock size={12} className="mr-1" /> Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center"><XCircle size={12} className="mr-1" /> Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };
  
  if (loading) {
    return <LoadingState message="Loading webinars..." />;
  }
  
  if (error) {
    return <ErrorState message={error} retry={fetchWebinars} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Webinar Registrations</h1>
        <button 
          onClick={fetchWebinars} 
          className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="completed">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      {/* Webinars Table */}
      {filteredWebinars.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortField === 'email' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('webinarDate')}
                  >
                    <div className="flex items-center">
                      Webinar Date
                      {sortField === 'webinarDate' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWebinars.map(webinar => (
                  <React.Fragment key={webinar._id}>
                    <tr 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleExpandWebinar(webinar._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{webinar.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{webinar.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(webinar.webinarDate)}</div>
                        <div className="text-xs text-gray-500">12:00 PM</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(webinar.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(webinar._id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    {expandedWebinar === webinar._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                              <div className="text-sm mb-1"><span className="font-medium">Phone:</span> {webinar.phone}</div>
                              <div className="text-sm mb-1"><span className="font-medium">Email:</span> {webinar.email}</div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Webinar Details</h4>
                              <div className="text-sm mb-1"><span className="font-medium">Registration Date:</span> {formatDate(webinar.createdAt)}</div>
                              <div className="text-sm mb-1">
                                <span className="font-medium">Meeting Link:</span> 
                                {webinar.meetingLink ? (
                                  <a 
                                    href={webinar.meetingLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline ml-1"
                                  >
                                    Open Zoom Link
                                  </a>
                                ) : (
                                  <span className="text-gray-500 ml-1">No meeting link available</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No webinar registrations found</p>
        </div>
      )}
    </div>
  );
}

export default Webinars; 