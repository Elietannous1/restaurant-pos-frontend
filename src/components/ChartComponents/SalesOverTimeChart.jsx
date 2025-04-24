import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getLineChartData } from "../../services/DashboardApiRequest";

// Register Chart.js components to enable required chart features
ChartJS.register(
  CategoryScale, // x-axis labels
  LinearScale, // y-axis values
  PointElement, // points on the line
  LineElement, // the line itself
  Tooltip, // hover tooltips
  Legend // chart legend
);

/**
 * SalesOverTimeChart component renders a line chart of total sales
 * over a selected time period (daily, weekly, monthly, yearly).
 */
export default function SalesOverTimeChart() {
  // State to track the selected time period for the chart
  const [lineTimePeriod, setLineTimePeriod] = useState("daily");

  // State to hold chart data (labels and dataset)
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Sales Over Time",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)", // line color
        backgroundColor: "rgba(255, 99, 132, 0.2)", // fill under line
        fill: true,
      },
    ],
  });

  /**
   * Computes the start and end dates based on the selected period.
   * @param {string} period - "daily" | "weekly" | "monthly" | "yearly"
   * @returns {{ startDate: string, endDate: string }} ISO date strings
   */
  const getDateRange = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case "daily":
        // For daily, both start and end are today
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "weekly":
        // Last 7 days
        startDate = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "monthly":
        // From first day of current month to today
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "yearly":
        // From Jan 1 of current year to today
        startDate = new Date(today.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      default:
        // Fallback to today if unknown period
        startDate = endDate = today.toISOString().split("T")[0];
    }

    return { startDate, endDate };
  };

  /**
   * Fetches sales data from the API and updates chart state.
   */
  const fetchLineData = async () => {
    try {
      // Determine date range based on user selection
      const { startDate, endDate } = getDateRange(lineTimePeriod);
      // Call service to get data
      const data = await getLineChartData(startDate, endDate);

      // Extract labels (dates) and sales values
      const labels = data.map((item) => item.saleDate);
      const sales = data.map((item) => item.totalSales);

      // Update chart data state
      setLineChartData({
        labels,
        datasets: [
          {
            label: "Total Sales Over Time",
            data: sales,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error loading line chart data:", error);
    }
  };

  // Re-fetch data whenever the selected time period changes
  useEffect(() => {
    fetchLineData();
    // Disable exhaustive-deps warning for fetchLineData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineTimePeriod]);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Total Sales Over Time</h3>
        {/* Dropdown to select time period */}
        <select
          value={lineTimePeriod}
          onChange={(e) => setLineTimePeriod(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {/* Container with fixed height for responsive chart */}
      <div style={{ height: "300px" }}>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true, // y-axis starts at zero
              },
            },
          }}
        />
      </div>
    </div>
  );
}
