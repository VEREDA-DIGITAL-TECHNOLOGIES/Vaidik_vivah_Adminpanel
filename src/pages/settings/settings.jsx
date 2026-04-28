import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { adminStatsApi } from '../../api/adminStatsApi'; // Update this import path
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettingsPage = () => {
    const admin = useSelector((state) => state.auth.admin); 
  const [filter, setFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch logs when component mounts
  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        // Assuming you need to add a getLogs method to your adminStatsApi
        const response = await adminStatsApi.getLogs(); 
        setLogs(response.logs || []);
      } catch (error) {
        setIsError(true);
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = filter === 'current' && admin?.adminId 
    ? (logs || []).filter(log => log.admin_id === admin.adminId)
    : logs || [];

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleExpandLog = (id) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Admin Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 60 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-pink-200"
        >
          <h2 className="text-3xl font-bold text-center text-pink-800 mb-6">Admin Profile</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-800">
            <Detail label="Admin ID" value={admin?.adminId || 'N/A'} />
            <Detail label="Email" value={admin?.email || 'N/A'} />
            <Detail label="Role" value={admin?.role || 'N/A'} />
            <Detail label="Status" value={admin?.status || 'N/A'} />
          </div>
        </motion.div>

        {/* Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 60, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-pink-200"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-pink-800">API Logs</h2>
            
            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={toggleFilter}
                  className="flex items-center space-x-2 bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2 rounded-full transition-all shadow-sm"
                >
                  <span>{filter === 'all' ? 'All Logs' : 'My Logs'}</span>
                  <motion.span
                    animate={{ rotate: isFilterOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-pink-600"
                  >
                    ▼
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-pink-200 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setFilter('all');
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-pink-50 ${filter === 'all' ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-700'}`}
                      >
                        All Logs
                      </button>
                      <button
                        onClick={() => {
                          setFilter('current');
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-pink-50 ${filter === 'current' ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-700'}`}
                      >
                        My Logs
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-xl border-pink-200 max-h-[500px] overflow-y-auto shadow-inner">
            {isLoading ? (
              <div className="py-10 text-center text-gray-500">Loading logs...</div>
            ) : isError ? (
              <div className="py-10 text-center text-red-500">Failed to load logs</div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                {filter === 'current' ? 'No logs for current admin' : 'No logs available'}
              </div>
            ) : (
              <table className="min-w-full text-sm text-left text-gray-800">
                <thead className="bg-pink-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-pink-800">Method</th>
                    <th className="px-4 py-3 text-pink-800">Endpoint</th>
                    <th className="px-4 py-3 text-pink-800">Status</th>
                    <th className="px-4 py-3 text-pink-800">Time</th>
                    <th className="px-4 py-3 text-pink-800">Admin</th>
                    <th className="px-4 py-3 text-pink-800">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-pink-50 hover:bg-pink-50 cursor-pointer"
                        onClick={() => toggleExpandLog(log.id)}
                      >
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            log.method === 'POST' ? 'bg-green-100 text-green-800' :
                            log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            log.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 truncate max-w-[180px]">{log.endpoint}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            log.status_code >= 200 && log.status_code < 300 ? 'bg-green-100 text-green-800' :
                            log.status_code >= 400 && log.status_code < 500 ? 'bg-yellow-100 text-yellow-800' :
                            log.status_code >= 500 ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.status_code}
                          </span>
                        </td>
                        <td className="px-4 py-3">{log.response_time_ms}ms</td>
                        <td className="px-4 py-3">
                          {log.admin_id ? (
                            <span className="text-pink-700 font-medium">Yes</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <motion.span
                            animate={{ rotate: expandedLog === log.id ? 180 : 0 }}
                            className="inline-block text-pink-600"
                          >
                            ▼
                          </motion.span>
                        </td>
                      </motion.tr>
                      
                      {/* Expanded Log Details */}
                      {expandedLog === log.id && (
                        <tr className="bg-pink-50">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <Detail label="ID" value={log.id} />
                              <Detail label="Admin ID" value={log.admin_id || 'N/A'} />
                              <Detail label="Email" value={log.email || 'N/A'} />
                              <Detail label="Role" value={log.role || 'N/A'} />
                              <Detail label="IP Address" value={log.ip_address} />
                              <Detail label="User Agent" value={log.user_agent} />
                              <Detail label="Timestamp" value={new Date(log.timestamp).toLocaleString()} />
                              <Detail label="Created At" value={new Date(log.createdAt).toLocaleString()} />
                              <Detail label="Updated At" value={new Date(log.updatedAt).toLocaleString()} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-pink-600 font-medium">{label}</span>
    <span className="text-gray-800 truncate">{value}</span>
  </div>
);

export default AdminSettingsPage;