// src/pages/MainDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import SalesMetrics from "../components/SalesMetrics";
import TopSellingChart from "../components/ChartComponents/TopSellingChart";
import SalesOverTimeChart from "../components/ChartComponents/SalesOverTimeChart";
import { useSidebar } from "../context/SideBarContext";
import { loadDashboard } from "../store/dashboardSlice";
import "../styles/dashboard.css";

export default function MainDashboard() {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const dispatch = useDispatch();
  const { barData, lineData, todaySales, last30Days, status, error } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    // build dates & productNames however you need them
    const startDate = "2025-04-01";
    const endDate = "2025-04-30";
    const productNames = {}; // fetch or import your product map here

    dispatch(loadDashboard({ startDate, endDate, productNames }));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading dashboard…</div>;
  }
  if (status === "failed") {
    return <div>Error loading dashboard: {error.toString()}</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        <SalesMetrics todaySales={todaySales} last30Days={last30Days} />
        <div className="charts-container">
          <TopSellingChart data={barData} />
          <SalesOverTimeChart data={lineData} />
        </div>
      </div>
    </div>
  );
}
