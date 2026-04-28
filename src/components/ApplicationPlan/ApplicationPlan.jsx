import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ApplicationPlan = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    status: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchApplications = async (page = 1, limit = 10, status = '') => {
    try {
      setLoading(true);
      setError('');

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      }).toString();

      const response = await axiosInstance.get(`v1/application-plan/applications-get?${queryParams}`);
      
      const data = response.data;
      console.log("application data are", data);
      
      if (data.success) {
        setApplications(data.data || []);
        setPagination(prev => ({
          ...prev,
          page: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          totalItems: data.pagination?.totalItems || 0,
          limit: data.pagination?.itemsPerPage || limit
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch applications';
      setError(errorMessage);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(pagination.page, pagination.limit, filters.status);
  }, [pagination.page, pagination.limit, filters.status]);

  const handlePageChange = (value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleStatusFilterChange = (event) => {
    setFilters({ ...filters, status: event.target.value });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      under_review: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[paymentStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const StatusBadge = ({ status, payment }) => (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
        {status ? status.replace('_', ' ').toUpperCase() : 'N/A'}
      </span>
      {payment && (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment)}`}>
          {payment ? payment.toUpperCase() : 'N/A'}
        </span>
      )}
    </div>
  );

  const SkeletonLoader = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-16"></div>
      ))}
    </div>
  );

  // Application Details Modal
  const ApplicationDetailsModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
      <div className="fixed inset-0 bg-[#FFB3C5]/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Information</h3>
                <div className="space-y-2">
                  <DetailRow label="Application ID" value={application.id} />
                  <DetailRow label="Plan Name" value={application.planName || application.plans?.planName} />
                  <DetailRow label="Plan Type" value={application.plans?.planType} />
                  <DetailRow label="Penalty Type" value={application.penaltyType} />
                  <DetailRow label="Application Date" value={formatDate(application.applicationDate)} />
                  <DetailRow label="Created At" value={formatDate(application.createdAt)} />
                  <DetailRow label="Updated At" value={formatDate(application.updatedAt)} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <DetailRow label="Payment Status" value={application.paymentStatus} badge={getPaymentStatusColor(application.paymentStatus)} />
                  <DetailRow label="Application Fee" value={formatCurrency(application.applicationFee)} />
                  <DetailRow label="Payment Amount" value={formatCurrency(application.paymentAmount)} />
                  <DetailRow label="Payment Reference" value={application.paymentReference || 'N/A'} />
                  {application.plans?.price && (
                    <DetailRow label="Plan Price" value={formatCurrency(application.plans.price)} />
                  )}
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <DetailRow label="Full Name" value={application.nom} />
                  <DetailRow label="Father's Name" value={application.fatherName} />
                  <DetailRow label="Mobile Number" value={application.yourMobNo} />
                  
                  <DetailRow label="Village/City/Town" value={application.villageCityTown} />
                  <DetailRow label="District" value={application.district} />
                  <DetailRow label="Pincode" value={application.pincode} />
                  <DetailRow label="State" value={application.state} />
                  <DetailRow label="Country" value={application.country} />


                </div>
              
              </div>
            </div>

            {/* Partner Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Partner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <DetailRow label="Full Name" value={application.partnerName} />
                  <DetailRow label="Father's Name" value={application.partnerFatherName} />
                  
                  
                  <DetailRow label="Venue Name" value={application.venueName} />
                  <DetailRow label="Venue Village/City/Town" value={application.venueVillageCityTown} />
                  <DetailRow label="Venue District" value={application.venueDistrict} />
                  <DetailRow label="Venue Pincode" value={application.venuePincode} />
                  <DetailRow label="Venue State" value={application.venueState} />
                  <DetailRow label="Venue Country" value={application.venueCountry} />


                </div>
                
              </div>
            </div>

            

            {/* Plan Features */}
            {application.plans?.featureList && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Plan Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {application.plans.featureList.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DetailRow = ({ label, value, badge }) => (
    <div className="flex justify-between items-start py-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      {badge ? (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm text-gray-900 text-right max-w-xs">{value || 'N/A'}</span>
      )}
    </div>
  );

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Plans</h1>
          <p className="mt-2 text-gray-600">Manage and track all marriage application plans</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
              <select 
                value={filters.status}
                onChange={handleStatusFilterChange}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <span className="text-sm text-blue-700 font-medium">
                Total: {pagination.totalItems} applications
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan & Penalty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment & Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8">
                      <SkeletonLoader />
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">#</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              ID: {application.id?.substring(0, 8)}...
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(application.applicationDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {application.planName || application.plans?.planName}
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {application.penaltyType || 'N/A'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {application.nom || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Father: {application.fatherName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            📱 {application.yourMobNo || 'N/A'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {application.partnerName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Father: {application.partnerFatherName || 'N/A'}
                          </div>
                          
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <StatusBadge 
                            status={application.status} 
                            payment={application.paymentStatus} 
                          />
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(application.paymentAmount || application.applicationFee)}
                          </div>
                          <button
                            onClick={() => handleViewDetails(application)}
                            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium py-1 px-2 rounded transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
              </span> of{' '}
              <span className="font-medium">{pagination.totalItems}</span> results
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4)) + i;
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.page === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Application Details Modal */}
        {showModal && (
          <ApplicationDetailsModal 
            application={selectedApplication} 
            onClose={closeModal} 
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationPlan;