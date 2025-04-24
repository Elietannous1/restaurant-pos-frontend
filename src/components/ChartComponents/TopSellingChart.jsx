import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchProductNames } from "../../services/ProductApiRequest";
import { getBarChartData } from "../../services/DashboardApiRequest";

// Register necessary Chart.js components for bar chart rendering
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * TopSellingChart component renders a bar chart showing
 * the best selling items over a selectable time period.
 */
export default function TopSellingChart() {
  // State for selected time period: daily, weekly, monthly, yearly
  const [timePeriod, setTimePeriod] = useState("daily");

  // State for chart data: labels (product names) and dataset values
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Best Selling Items",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)", // bar color
      },
    ],
  });

  /**
   * Utility to compute ISO date strings for start and end dates
   * based on the selected time period.
   * @param {string} period - one of "daily", "weekly", "monthly", "yearly"
   */
  const getDateRange = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case "daily":
        // both start and end are today for daily view
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "weekly":
        // last 7 days
        startDate = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "monthly":
        // from first of current month to today
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "yearly":
        // from Jan 1 of current year to today
        startDate = new Date(today.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      default:
        // fallback: today
        startDate = endDate = today.toISOString().split("T")[0];
    }

    return { startDate, endDate };
  };

  /**
   * Fetches product names and sales data from API,
   * then updates the chartData state.
   */
  const fetchChartData = async () => {
    try {
      // Determine date range based on selected period
      const { startDate, endDate } = getDateRange(timePeriod);
      // Retrieve list of product names for labeling
      const { productNames } = await fetchProductNames();
      // Retrieve sales quantities for each product
      const data = await getBarChartData(startDate, endDate, productNames);

      // Extract labels and values from API response
      const labels = data.map((item) => item.productName);
      const quantities = data.map((item) => item.quantitySold);

      // Update chart dataset for rendering
      setChartData({
        labels,
        datasets: [
          {
            label: "Best Selling Items",
            data: quantities,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      console.error("Error loading bar chart data:", error);
    }
  };

  // Effect hook: refetch data whenever timePeriod changes
  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod]);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Best Selling Items</h3>
        {/* Dropdown selector to change time period */}
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {/* Render the bar chart with current data */}
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
}
