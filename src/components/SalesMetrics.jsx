// src/components/SalesMetrics.jsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  getTotalSalesLast30Days,
  getTodaysSales,
} from "../services/DashboardApiRequest";

/**
 * SalesMetrics component displays two key sales metrics:
 *  - Total sales over the last 30 days
 *  - Today's sales
 * It fetches data on mount and updates the UI accordingly.
 */
const SalesMetrics = () => {
  // State to hold cumulative sales for the past 30 days
  const [totalSales, setTotalSales] = useState(0);
  // State to hold today's sales amount
  const [todaysSales, setTodaysSales] = useState(0);

  // useEffect runs once on component mount to fetch metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // API call: get total sales over last 30 days
        const total = await getTotalSalesLast30Days();
        // API call: get today's sales
        const today = await getTodaysSales();
        // Update state with fetched values
        setTotalSales(total);
        setTodaysSales(today);
      } catch (error) {
        console.error("Error fetching sales metrics:", error);
      }
    };
    fetchMetrics();
  }, []); // Empty dependency array ensures this runs only once

  return (
    // Bootstrap Row to layout the two metric cards side by side
    <Row className="mb-4">
      {/* Column for 30-day total sales */}
      <Col md={8}>
        <Card className="text-center shadow">
          <Card.Body>
            <Card.Title>Total Sales (30 Days)</Card.Title>
            <Card.Text
              style={{
                fontSize: "2rem", // Large number display
                fontWeight: "bold", // Emphasize value
                whiteSpace: "nowrap", // Prevent line wrap
                paddingLeft: "15px", // Space on left side
                paddingRight: "25px", // Space on right side
              }}
            >
              {/* Display formatted total sales with currency prefix */}
              LL{totalSales.toFixed(2)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Column for today's sales */}
      <Col md={8}>
        <Card className="text-center shadow">
          <Card.Body>
            <Card.Title>Today's Sales</Card.Title>
            <Card.Text
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              {/* Display formatted today's sales with currency prefix */}
              LL{todaysSales.toFixed(2)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SalesMetrics;
