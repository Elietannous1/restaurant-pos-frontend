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
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { getBarChartData } from "../services/DashboardApiRequest";
import "../styles/dashboard.css";
import { fetchProductNames } from "../services/ProductApiRequest";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MainDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Function to calculate start and end dates based on timePeriod
  const getDateRange = () => {
    const today = new Date();
    let startDate, endDate;

    switch (timePeriod) {
      case "daily":
        startDate = endDate = today.toISOString().split("T")[0]; // Today's date
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

  // Fetch top-selling items
  const fetchChartData = async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const productNames = await fetchProductNames();
      const data = await getBarChartData(startDate, endDate, productNames);
      console.log("Fetched data:", data);
      // Ensure data is structured properly
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

  // Fetch data when component mounts or timePeriod changes
  useEffect(() => {
    fetchChartData();
  }, [timePeriod]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <nav className="sidebar-nav">
          <Button variant="primary" className="sidebar-btn">
            Home
          </Button>
          <Button variant="primary" className="sidebar-btn">
            Reports
          </Button>
          <Button variant="primary" className="sidebar-btn">
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Bottom Bar Chart Section */}
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
      </div>
    </div>
  );
}
