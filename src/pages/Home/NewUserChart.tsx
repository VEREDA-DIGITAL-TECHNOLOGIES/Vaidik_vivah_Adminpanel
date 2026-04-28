import React, { useState, useEffect } from 'react';
import { adminStatsApi } from '../../api/adminStatsApi';

const NewUserCard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await adminStatsApi.getNewUserData();
        console.log('API Response:', response); // Debug log
        
        // Transform the API response to match your component's expected structure
        const transformedData = {
          today: response.data.today || { count: 0, users: [] },
          thisWeek: response.data.thisWeek || { count: 0, users: [] },
          thisMonth: response.data.thisMonth || { count: 0, users: [] },
          total: response.data.total || { count: 0 }
        };

        setData({ 
          data: transformedData,
          success: response.success
        });
        setError(null);
      } catch (err) {
        setError(err?.toString() || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabConfig = {
    today: { displayName: 'Today', dataKey: 'today' },
    thisWeek: { displayName: 'This Week', dataKey: 'thisWeek' },
    thisMonth: { displayName: 'This Month', dataKey: 'thisMonth' },
  };

  const getActiveData = () => {
    if (!data?.data) return { count: 0, users: [] };
    return data.data[tabConfig[activeTab].dataKey] || { count: 0, users: [] };
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDisplayName = (name) => {
    return !name || name === 'N/A' ? 'Anonymous' : name;
  };

  const activeData = getActiveData();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-[#FFD3DF] flex justify-center items-center h-64">
        <div className="animate-pulse text-[#FF5E92]">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-[#FFD3DF]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-[#FFD3DF]">
        <div className="text-red-500">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md border border-[#FFD3DF]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#FF5E92]">New Users</h2>
        <div className="flex space-x-2">
          {Object.keys(tabConfig).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-200 ${
                activeTab === tab
                  ? 'bg-[#FF5E92] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-[#FFE4EB]'
              }`}
            >
              {tabConfig[tab].displayName}
            </button>
          ))}
        </div>
      </div>

      <div className="text-4xl font-extrabold text-gray-800 mb-4">
        {activeData.count}
        <span className="text-base font-medium text-gray-500 ml-1">users</span>
      </div>

      {activeData.count === 0 ? (
        <div className="text-sm text-gray-400">No users joined in this period.</div>
      ) : (
        <>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Joined {tabConfig[activeTab].displayName}
          </h4>
          <div className="flex items-center -space-x-3 mb-3">
            {activeData.users.slice(0, 8).map((user, index) => {
              const hasPic = user.profilePic && user.profilePic.length > 0;
              return (
                <div key={user.userId + index} className="relative">
                  {hasPic ? (
                    <img
                      src={user.profilePic[0]}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center text-gray-600 font-medium">
                      {user.firstName ? user.firstName.charAt(0) : '?'}
                    </div>
                  )}
                </div>
              );
            })}
            {activeData.users.length > 8 && (
              <div className="w-10 h-10 rounded-full bg-[#FF5E92] text-white text-xs font-semibold flex items-center justify-center border-2 border-white shadow-md">
                +{activeData.users.length - 8}
              </div>
            )}
          </div>
        </>
      )}

      {activeData.users.length > 0 && (
        <div className="mt-4 border-t pt-3 border-[#FFD3DF]">
          <h4 className="text-xs font-semibold text-[#FF5E92] mb-1 py-2">👥 Recent Joins</h4>
          <div className="overflow-hidden relative h-8">
            <div className="animate-scroll flex space-x-6 absolute whitespace-nowrap">
              {[...activeData.users, ...activeData.users].map((user, i) => {
                const hasPic = user.profilePic && user.profilePic.length > 0;
                return (
                  <div key={`${user.userId}-${i}`} className="flex items-center space-x-2">
                    {hasPic ? (
                      <img
                        src={user.profilePic[0]}
                        alt={getDisplayName(user.firstName)}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-xs text-gray-600 font-medium">
                        {user.firstName ? user.firstName.charAt(0) : '?'}
                      </div>
                    )}
                    <span className="text-sm text-gray-600 font-medium">
                      {getDisplayName(user.firstName)}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewUserCard;