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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SalesOverTimeChart() {
  const [lineTimePeriod, setLineTimePeriod] = useState("daily");
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Sales Over Time",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  });

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

  const fetchLineData = async () => {
    try {
      const { startDate, endDate } = getDateRange(lineTimePeriod);
      const data = await getLineChartData(startDate, endDate);

      const labels = data.map((item) => item.saleDate);
      const sales = data.map((item) => item.totalSales);

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

  useEffect(() => {
    fetchLineData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineTimePeriod]);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Total Sales Over Time</h3>
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
      <div style={{ height: "300px" }}>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
