import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import {
  getBarChartData,
  getLineChartData,
} from "../services/DashboardApiRequest";
import "../styles/dashboard.css";
import { fetchProductNames } from "../services/ProductApiRequest";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function MainDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timePeriod, setTimePeriod] = useState("daily");
  const [lineTimePeriod, setLineTimePeriod] = useState("daily");
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
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
      console.log("Fetched bar chart data:", data);

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
      console.error("Error loading chart data:", error);
    }
  };

  const fetchLineChartData = async () => {
    try {
      const { startDate, endDate } = getDateRange(lineTimePeriod);

      // Fetch the line chart data from your backend
      const data = await getLineChartData(startDate, endDate);
      // data will be in the format: [{ saleDate: "YYYY-MM-DD", totalSales: number }, ...]

      // Extract labels and sales arrays for Chart.js
      const labels = data.map((item) => item.saleDate);
      const sales = data.map((item) => item.totalSales);

      // Update state for lineChartData
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
    fetchChartData();
  }, [timePeriod]);

  useEffect(() => {
    fetchLineChartData();
  }, [lineTimePeriod]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="charts-container">
          {/* Bar Chart Section */}
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

          {/* Line Chart Section - Full Width */}
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
      </div>
    </div>
  );
}
