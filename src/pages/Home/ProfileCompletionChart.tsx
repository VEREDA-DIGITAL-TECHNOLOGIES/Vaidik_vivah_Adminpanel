import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { adminStatsApi } from '../../api/adminStatsApi';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { label, rawValue } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md text-sm text-gray-800">
        <div className="font-semibold">{label} complete</div>
        <div>{rawValue} of users</div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 px-4">
    {payload.map((entry, index) => (
      <div key={`legend-${index}`} className="flex items-center">
        <span
          className="inline-block w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-gray-600">
          {entry.value}{' '}
          <span className="text-gray-400">({entry.payload.rawValue})</span>
        </span>
      </div>
    ))}
  </div>
);

const transformData = (stats) => {
  return Object.entries(stats).map(([label, value]) => ({
    label,
    value: parseFloat(value),
    rawValue: value,
  }));
};

export const UserProgressChart = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await adminStatsApi.getProfileCompletionStats();
        console.log(`the response is ${JSON.stringify(response)}`);
    
        const transformedData = {
          profileCompletionStats: response.profileCompletionStats,
          totalUsers: response.totalUsers,
        };
    
        setData(transformedData);
        setError(null);
      } catch (err) {
        setError(err?.toString() || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl shadow-lg bg-white max-w-md mx-auto h-64">
        <div className="animate-pulse text-gray-500">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl shadow-lg bg-white max-w-md mx-auto h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data || !data.profileCompletionStats) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl shadow-lg bg-white max-w-md mx-auto h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const chartData = transformData(data.profileCompletionStats);

  const averageCompletion = chartData.reduce((sum, item) => {
    const rangeMidpoint = {
      '0-29%': 15,
      '30-49%': 40,
      '50-79%': 65,
      '80-99%': 90,
      '100%': 100,
    }[item.label];
    return sum + (rangeMidpoint * item.value) / 100;
  }, 0);

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        User Profile Completion
      </h3>

      <div className="relative w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {averageCompletion.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Average Completion
          </div>
        </div>
      </div>

      <CustomLegend
        payload={chartData.map((entry, index) => ({
          value: entry.label,
          color: COLORS[index % COLORS.length],
          payload: entry,
        }))}
      />

      <div className="mt-4 text-sm text-gray-500">
        Total Users: {data.totalUsers}
      </div>
    </div>
  );
};