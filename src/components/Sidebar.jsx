"use client";
import { Button } from "react-bootstrap";
import {
  FaBars,
  FaChartBar,
  FaShoppingCart,
  FaListAlt,
  FaBoxes,
  FaTags,
  FaSignOutAlt,
} from "react-icons/fa";
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
          <span className="icon">
            <FaChartBar />
          </span>
          <span className="text">Dashboard</span>
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/CreateOrder")}
        >
          <span className="icon">
            <FaShoppingCart />
          </span>
          <span className="text">Create Order</span>
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/ViewOrders")}
        >
          <span className="icon">
            <FaListAlt />
          </span>
          <span className="text">View Orders</span>
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/ProductManagement")}
        >
          <span className="icon">
            <FaBoxes />
          </span>
          <span className="text">Product Management</span>
        </Button>
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/CategoryManagement")}
        >
          <span className="icon">
            <FaTags />
          </span>
          <span className="text">Category Management</span>
        </Button>
        <Button className="sidebar-btn logout-btn" onClick={handleLogout}>
          <span className="icon">
            <FaSignOutAlt />
          </span>
          <span className="text">Logout</span>
        </Button>
      </nav>
    </div>
  );
}
