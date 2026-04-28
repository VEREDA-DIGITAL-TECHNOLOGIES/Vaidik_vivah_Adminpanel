import React, { useState, useEffect } from "react";
import FinancialReportTable from "./FinancialReportTable";
import { adminStatsApi } from "../../api/adminStatsApi";
import { unparse } from "papaparse";

const FinancialReports = () => {
  const [period, setPeriod] = useState("month");
  const [reportData, setReportData] = useState({ data: [], totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const loadFinancialReport = async () => {
    try {
      setIsLoading(true);
      const data = await adminStatsApi.getFinancialReport();
      setReportData(data);
    } catch (err) {
      console.error("Error loading financial report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSVReport = async () => {
    try {
      const res = await adminStatsApi.getFinancialReport();
      const csv = unparse(res.data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial_report_${period}.csv`;
      a.click();
    } catch (err) {
      console.error("Error exporting CSV", err);
    }
  };

  useEffect(() => {
    loadFinancialReport();
  }, [period]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Reports</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {["day", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg ${
                period === p
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={downloadCSVReport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <div className="text-lg font-semibold mb-2">
        Total Revenue:{" "}
        <span className="text-blue-600">
          ₹{reportData.totalRevenue?.toFixed(2) || "0.00"}
        </span>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <FinancialReportTable data={reportData.data || []} />
      )}
    </div>
  );
};

export default FinancialReports;