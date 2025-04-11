// src/components/Sidebar.js
import React from "react";
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SideBarContext";
import { clearToken } from "../utils/storage";
import "../styles/sidebar.css";
export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className="sidebar-nav">
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/MainDashboard")}
        >
          Dashboard
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/CreateOrder")}
        >
          Create Order
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/ViewOrders")}
        >
          View Orders
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/ProductManagement")}
        >
          Product Management
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/CategoryManagement")}
        >
          Category Management
        </Button>
        <Button onClick={handleLogout} style={{ backgroundColor: "red" }}>
          Logout
        </Button>
      </nav>
    </div>
  );
}
