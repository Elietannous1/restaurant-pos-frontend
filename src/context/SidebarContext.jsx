// src/context/SidebarContext.js
import React, { createContext, useState, useContext } from "react";

// Create a Context for sidebar state (open/closed)
const SidebarContext = createContext();

/**
 * SidebarProvider wraps parts of the app that need access
 * to sidebarOpen state and toggleSidebar function.
 * It manages the sidebar's open/closed state.
 */
export const SidebarProvider = ({ children }) => {
  // Holds whether the sidebar is open (true) or closed (false)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * Toggles the sidebarOpen boolean between true/false
   */
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    // Provide sidebarOpen and toggleSidebar to descendant components
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Custom hook to access sidebar context values.
 * Throws an error if used outside of SidebarProvider.
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
