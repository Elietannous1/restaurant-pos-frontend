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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TopSellingChart() {
  const [timePeriod, setTimePeriod] = useState("daily");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Best Selling Items",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  // Utility function: get startDate and endDate based on timePeriod
  const getDateRange = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case "daily":
        startDate = endDate = today.toISOString().split("T")[0];
        break;
      case "weekly":
        startDate = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      case "yearly":
        startDate = new Date(today.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date().toISOString().split("T")[0];
        break;
      default:
        startDate = endDate = today.toISOString().split("T")[0];
    }

    return { startDate, endDate };
  };

  const fetchChartData = async () => {
    try {
      const { startDate, endDate } = getDateRange(timePeriod);
      const { productNames } = await fetchProductNames();
      const data = await getBarChartData(startDate, endDate, productNames);

      const labels = data.map((item) => item.productName);
      const quantities = data.map((item) => item.quantitySold);

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

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod]);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Best Selling Items</h3>
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
      <Bar data={chartData} />
    </div>
  );
}
