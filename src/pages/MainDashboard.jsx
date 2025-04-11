import React from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SideBarContext";
import SalesMetrics from "../components/SalesMetrics";
import TopSellingChart from "../components/ChartComponents/TopSellingChart";
import SalesOverTimeChart from "../components/ChartComponents/SalesOverTimeChart";
import "../styles/dashboard.css";

export default function MainDashboard() {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="dashboard-container">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        {/* Sales metrics at the top */}
        <SalesMetrics />
        <div className="charts-container">
          <TopSellingChart />
          <SalesOverTimeChart />
        </div>
      </div>
    </div>
  );
}
