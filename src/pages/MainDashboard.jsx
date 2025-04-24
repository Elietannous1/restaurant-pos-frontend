import React from "react"; // React core
import Sidebar from "../components/Sidebar"; // Sidebar component
import { useSidebar } from "../context/SideBarContext"; // Hook to read/toggle sidebar state
import SalesMetrics from "../components/SalesMetrics"; // Cards showing sales KPIs
import TopSellingChart from "../components/ChartComponents/TopSellingChart"; // Bar chart of top items
import SalesOverTimeChart from "../components/ChartComponents/SalesOverTimeChart"; // Line chart of sales over time
import "../styles/dashboard.css"; // Dashboard-specific styles

export default function MainDashboard() {
  // Get sidebar open/closed state and toggler
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main dashboard content */}
      <div className="dashboard-content">
        {/* Top row: summary metrics */}
        <SalesMetrics />

        {/* Charts row: side-by-side bar & line charts */}
        <div className="charts-container">
          {/* Chart showing best-selling items */}
          <TopSellingChart />

          {/* Chart showing total sales over selected time period */}
          <SalesOverTimeChart />
        </div>
      </div>
    </div>
  );
}
