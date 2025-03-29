import React from "react";
import { useSidebar } from "../context/SideBarContext";
import Sidebar from "../components/Sidebar";

export default function CategoryManagement() {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <div
        className="create-order-layout d-flex"
        style={{ minHeight: "100vh" }}
      >
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
    </>
  );
}
