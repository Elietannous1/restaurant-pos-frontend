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

/**
 * Sidebar component provides navigation buttons for the app.
 * It allows toggling open/closed state, navigating between routes,
 * and logging out by clearing auth token.
 */
export default function Sidebar() {
  // Consume sidebar open state and toggle function from context
  const { sidebarOpen, toggleSidebar } = useSidebar();
  // Hook for programmatic route navigation
  const navigate = useNavigate();

  /**
   * Handle user logout: clear stored token and redirect to login page
   */
  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    // Apply CSS classes based on sidebar open/closed state
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* Button to toggle sidebar collapse/expand */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Navigation buttons section */}
      <nav className="sidebar-nav">
        {/* Dashboard navigation */}
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

        {/* Create Order navigation */}
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

        {/* View Orders navigation */}
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

        {/* Product Management navigation */}
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

        {/* Category Management navigation */}
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

        {/* Logout button */}
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
