import React from "react";
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar(props) {
  const { sidebarOpen, toggleSidebar } = props;
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <nav className="sidebar-nav">
        <Button
          variant="primary"
          className="sidebar-btn"
          onClick={() => navigate("/CreateOrder")}
        >
          Create Order
        </Button>
        <Button variant="primary" className="sidebar-btn">
          Reports
        </Button>
        <Button variant="primary" className="sidebar-btn">
          Settings
        </Button>
      </nav>
    </div>
  );
}
