import React from "react";

const FinancialReportTable = ({ data }) => {
  // Sort by createdAt descending (newest first)
  const sortedData = [...data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 shadow rounded-lg">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Price</th>
            <th className="p-3">Subscribed On</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sortedData.map((item, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.email}</td>
              <td className="p-3">{item.plan}</td>
              <td className="p-3">₹{item.price}</td>
              <td className="p-3">{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialReportTable;
