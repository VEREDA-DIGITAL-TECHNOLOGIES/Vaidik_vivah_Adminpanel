import React from 'react';

// StatsCard Component
function StatsCard({ title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-1/4 text-center">
      <div className="font-semibold text-lg text-gray-700 mb-2">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className={`font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change > 0 ? `+${change}% last month` : `-${change}% last month`}
      </div>
    </div>
  );
}

// StatsWidget Component
function StatsWidget({totalUser,newUser,deleted}) {
  return (
    <div className="flex space-x-6">
      {/* Stats cards inside a horizontal container */}
      <StatsCard title="Total User" value={totalUser} change={5} />
      <StatsCard title="New User" value={newUser} change={5} />
    <StatsCard title="Deleted" value={deleted} change={-5} />
    </div>
  );
}

export default StatsWidget;
