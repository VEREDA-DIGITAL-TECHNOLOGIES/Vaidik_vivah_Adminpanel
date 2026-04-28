import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const TOTAL_DOTS = 20;

const GenderRatioChart = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleDots, setVisibleDots] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('admin-dashboard/user-details/gender-ratio');



        const transformedData = {
          maleRatio: response.data.data.maleRatio,
          femaleRatio: response.data.data.femaleRatio,
          maleCount: response.data.data.maleCount,
          femaleCount: response.data.data.femaleCount,
          totalUsersWithGender: response.data.data.totalUsersWithGender,
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

  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        setVisibleDots((prev) => {
          if (prev >= TOTAL_DOTS) {
            clearInterval(interval);
            return TOTAL_DOTS;
          }
          return prev + 1;
        });
      }, 15);
      return () => clearInterval(interval);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="relative w-[280px] h-[260px] bg-gradient-to-br from-[#101010] to-[#000000] rounded-3xl shadow-lg overflow-hidden flex items-center justify-center">
        <div className="text-white animate-pulse">Loading gender data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[280px] h-[260px] bg-gradient-to-br from-[#101010] to-[#000000] rounded-3xl shadow-lg overflow-hidden flex items-center justify-center">
        <div className="text-red-400 text-center p-4">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  const malePercentage = parseFloat(data.maleRatio);
  const dots = Array.from({ length: TOTAL_DOTS }, (_, i) => {
    const angle = (Math.PI * i) / (TOTAL_DOTS - 1);
    const radius = 80;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const isMale = i < (TOTAL_DOTS * malePercentage) / 100;
    return { x, y, isMale };
  });

  return (
    <div className="relative w-[280px] h-[260px] bg-gradient-to-br from-[#101010] to-[#000000] rounded-3xl shadow-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="-100 -100 200 180"
        className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-6"
      >
        {dots.map((dot, idx) => (
          <circle
            key={idx}
            cx={dot.x}
            cy={-dot.y}
            r="6"
            fill={dot.isMale ? '#FF5E92' : '#7ED6DF'}
            style={{
              opacity: idx < visibleDots ? 1 : 0,
              transformOrigin: `${dot.x}px ${-dot.y}px`,
              transformBox: 'fill-box',
              transform: `scale(${idx < visibleDots ? 1 : 0.3})`,
              transition: `all 0.3s ease ${idx * 0.01}s`,
              filter: `drop-shadow(0 0 6px ${dot.isMale ? '#FF5E92aa' : '#7ED6DFaa'})`,
            }}
          />
        ))}
      </svg>

      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-[35%] text-center">
        <div className="text-white text-xs opacity-60 tracking-wide">GENDER RATIO</div>
        <div className="text-3xl font-extrabold text-white">{data.totalUsersWithGender}</div>
        <div className="text-xs text-gray-400 mt-1">Total Users</div>
      </div>

      <div className="absolute bottom-3 left-0 w-full flex justify-around px-4 text-sm font-semibold text-white">
        <div className="flex flex-col items-center">
          <div className="text-[#FF5E92]">Male</div>
          <div className="text-gray-300">
            {data.maleCount} ({data.maleRatio}%)
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[#7ED6DF]">Female</div>
          <div className="text-gray-300">
            {data.femaleCount} ({data.femaleRatio}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderRatioChart;
