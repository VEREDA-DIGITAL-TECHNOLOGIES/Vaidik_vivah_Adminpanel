import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { adminStatsApi } from '../../api/adminStatsApi';

const COLORS = ['#4ADE80', '#F87171', '#60A5FA', '#FBBF24'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md text-sm text-gray-800">
        <div className="font-semibold">{name}</div>
        <div>{value} connections</div>
      </div>
    );
  }
  return null;
};

const ConnectionStatsCard = ({ title, value, color }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: color }} />
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

export const ConnectionDataChart = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await adminStatsApi.getConnectionStats();
        // console.log('Connection stats API response:', JSON.stringify(response));
        
        const transformedData = {
          acceptedConnections: response.data.acceptedConnections,
          rejectedConnections: response.data.rejectedConnections,
          pendingConnections: response.data.pendingConnections,
          cancelledConnections: response.data.cancelledConnections,
          totalConnections: response.data.acceptedConnections + response.data.rejectedConnections + response.data.pendingConnections + response.data.cancelledConnections
        };
        

        setData({ data: transformedData });
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
      <div className="flex items-center justify-center p-6 rounded-2xl shadow-lg bg-white max-w-4xl mx-auto h-64">
        <div className="animate-pulse text-gray-500">Loading connection data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl shadow-lg bg-white max-w-4xl mx-auto h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl shadow-lg bg-white max-w-4xl mx-auto h-64">
        <div className="text-gray-500">No connection data available</div>
      </div>
    );
  }

  const stats = data.data;

  const chartData = [
    { name: 'Accepted', value: stats.acceptedConnections },
    { name: 'Rejected', value: stats.rejectedConnections },
    { name: 'Pending', value: stats.pendingConnections },
    { name: 'Cancelled', value: stats.cancelledConnections },
  ];

  return (
    <div className="flex flex-col p-6 rounded-2xl shadow-lg bg-white max-w-4xl mx-auto w-full">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">
        Connection Status Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500 mb-3">Distribution</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500 mb-3">Comparison</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`bar-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <ConnectionStatsCard title="Accepted" value={stats.acceptedConnections} color="#4ADE80" />
        <ConnectionStatsCard title="Rejected" value={stats.rejectedConnections} color="#F87171" />
        <ConnectionStatsCard title="Pending" value={stats.pendingConnections} color="#60A5FA" />
        <ConnectionStatsCard title="Cancelled" value={stats.cancelledConnections} color="#FBBF24" />
      </div>
    </div>
  );
};