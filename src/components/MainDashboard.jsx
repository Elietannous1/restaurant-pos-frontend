import React, { useState } from "react";
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
import "../styles/dashboard.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MainDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timePeriod, setTimePeriod] = useState("daily");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const data = {
    labels: ["Item A", "Item B", "Item C", "Item D", "Item E"],
    datasets: [
      {
        label: "Best Selling Items",
        data: [100, 80, 60, 40, 20],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

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
          <Bar data={data} />
        </div>
      </div>
    </div>
  );
}
