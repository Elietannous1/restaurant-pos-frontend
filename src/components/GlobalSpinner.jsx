import React from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import "../styles/globalSpinner.css";

export default function GlobalSpinner() {
  const loadingCount = useSelector((state) => state.ui.loadingCount);
  if (loadingCount === 0) return null;

  return (
    <div className="global-spinner-overlay">
      <Spinner animation="border" role="status" />
    </div>
  );
}
