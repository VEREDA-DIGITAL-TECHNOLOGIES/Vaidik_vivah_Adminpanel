import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { adminStatsApi } from '../../api/adminStatsApi';
import axiosInstance from '../../api/axiosInstance';
const TotalUsersChart = () => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Week');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
  
        const response = await axiosInstance.get('admin-dashboard/user-details/user-stats');
        const data = response.data;
      
        
        const sortedWeeks = [...data.weeksStats].sort((a, b) => b.week - a.week);
        const sortedMonths = [...data.monthsStats].sort(
          (a, b) => new Date(b.startOfMonth) - new Date(a.startOfMonth)
        );
  
        setStatsData({
          weeksStats: sortedWeeks,
          monthsStats: sortedMonths,
          yearsStats: data.yearsStats,
        });
  
        setCurrentIndex(0);
        setError(null);
      } catch (err) {
        setError(err?.toString() || 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStats();
  }, []);
  

// import ReactECharts from 'echarts-for-react';
// import axios from 'axios';
// import store from '../../redux/store';// adjust path if needed

// const TotalUsersChart = () => {
//   const [statsData, setStatsData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('Week');
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setIsLoading(true);

//         const token = store.getState().auth.accessToken;
//         const response = await axios.get('http://localhost:3007/api/admin-dashboard/user-details/user-stats', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//           withCredentials: true
//         });

//         const data = response.data;

//         const sortedWeeks = [...data.weeksStats].sort((a, b) => b.week - a.week);
//         const sortedMonths = [...data.monthsStats].sort(
//           (a, b) => new Date(b.startOfMonth) - new Date(a.startOfMonth)
//         );

//         setStatsData({
//           weeksStats: sortedWeeks,
//           monthsStats: sortedMonths,
//           yearsStats: data.yearsStats,
//         });

//         setCurrentIndex(0);
//         setError(null);
//       } catch (err) {
//         setError(err?.toString() || 'Failed to fetch stats');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

  const handlePrev = () => {
    if (!statsData) return;
    if (activeTab === 'Week' && currentIndex + 3 < statsData.weeksStats.length) {
      setCurrentIndex(prev => prev + 1);
    } else if (activeTab === 'Month' && currentIndex + 3 < statsData.monthsStats.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const getVisibleData = () => {
    if (!statsData) return [];

    if (activeTab === 'Week') {
      return statsData.weeksStats
        .slice(currentIndex, currentIndex + 3)
        .map(week => [`W${week.week}`, week.users, week.startOfWeek, week.endOfWeek]);
    } else if (activeTab === 'Month') {
      return statsData.monthsStats
        .slice(currentIndex, currentIndex + 3)
        .map(month => [
          month.month.substring(0, 3),
          month.users,
          month.startOfMonth,
          month.endOfMonth,
        ]);
    } else {
      const yearData = statsData.yearsStats[0];
      if (yearData && yearData.users !== undefined) {
        return [[
          yearData.year || '2025',
          yearData.users,
          yearData.startOfYear || '2025-01-01',
          yearData.endOfYear || '2025-12-31',
        ]];
      }
      return [['2025', 0, '2025-01-01', '2025-12-31']];
    }
  };

  const visibleData = getVisibleData();

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const data = params[0];
        return `
          <strong>${data.name}</strong><br/>
          Users: ${data.value}<br/>
          ${data.data[2]} to ${data.data[3]}
        `;
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: visibleData.map(d => d[0]),
      axisTick: { alignWithLabel: true },
      axisLabel: {
        color: '#ff5e92',
        fontWeight: 600,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ffe0ec',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#a85b75',
        fontWeight: 500,
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: visibleData.map(d => d[1]),
        barWidth: '55%',
        itemStyle: {
          borderRadius: [12, 12, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(255, 94, 146, 0.4)',
          shadowOffsetY: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#FF5E92' },
              { offset: 1, color: '#FFB3C5' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#ff8eb1',
            shadowBlur: 15,
            shadowColor: 'rgba(255, 0, 100, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#ff5e92',
          fontWeight: 600
        },
        animationDelay: (idx) => idx * 100,
        animationEasing: 'elasticOut'
      }
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 50
  };

  if (isLoading) {
    return <div className="w-full h-64 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="w-full h-64 flex items-center justify-center text-red-500">Failed to load data</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">User Statistics</h2>

      <div className="flex justify-end space-x-3 mb-4">
        {['Week', 'Month', 'Year'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentIndex(0);
            }}
            className={`px-4 py-1 rounded-full font-semibold text-sm transition duration-300 ease-in-out transform ${
              activeTab === tab
                ? 'bg-[#FF5E92] text-white shadow-lg scale-105'
                : 'text-gray-500 hover:text-[#FF5E92] hover:scale-105'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {statsData && (
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={handleNext}
              disabled={currentIndex === 0}
              className={`px-3 py-1 rounded-full ${
                currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#FF5E92] hover:bg-pink-50'
              }`}
            >
              &larr; Older
            </button>
            <div className="text-sm text-gray-500">
              {activeTab === 'Week' && visibleData.length > 0 &&
                `Showing weeks ${visibleData[0][0].replace('W', '')} to ${visibleData[visibleData.length - 1][0].replace('W', '')}`}
              {activeTab === 'Month' && visibleData.length > 0 &&
                `Showing ${visibleData[0][0]} to ${visibleData[visibleData.length - 1][0]}`}
            </div>
            <button
              onClick={handlePrev}
              disabled={
                (activeTab === 'Week' && currentIndex + 3 >= statsData.weeksStats.length) ||
                (activeTab === 'Month' && currentIndex + 3 >= statsData.monthsStats.length)
              }
              className={`px-3 py-1 rounded-full ${
                (activeTab === 'Week' && currentIndex + 3 >= statsData.weeksStats.length) ||
                (activeTab === 'Month' && currentIndex + 3 >= statsData.monthsStats.length)
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#FF5E92] hover:bg-pink-50'
              }`}
            >
              Newer &rarr;
            </button>
          </div>

          <ReactECharts
            option={options}
            style={{ height: '400px', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      )}
    </div>
  );
};

export default TotalUsersChart;