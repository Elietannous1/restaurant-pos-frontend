import React from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SideBarContext";
import TopSellingChart from "../components/ChartComponents/TopSellingChart";
import SalesOverTimeChart from "../components/ChartComponents/SalesOverTimeChart";
import "../styles/dashboard.css";

export default function MainDashboard() {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="dashboard-container">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        {/* 
          Add any other dashboard stats or components (e.g., 
          total sales counters, pending orders count, etc.) 
        */}
        <div className="charts-container">
          <TopSellingChart />
          <SalesOverTimeChart />
        </div>
      </div>
    </div>
  );
}
