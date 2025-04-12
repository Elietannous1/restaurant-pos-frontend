// src/components/SalesMetrics.jsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  getTotalSalesLast30Days,
  getTodaysSales,
} from "../services/DashboardApiRequest";

const SalesMetrics = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [todaysSales, setTodaysSales] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const total = await getTotalSalesLast30Days();
        const today = await getTodaysSales();
        setTotalSales(total);
        setTodaysSales(today);
      } catch (error) {
        console.error("Error fetching sales metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <Row className="mb-4">
      <Col md={8}>
        <Card className="text-center shadow">
          <Card.Body>
            <Card.Title>Total Sales (30 Days)</Card.Title>
            <Card.Text
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                whiteSpace: "nowrap", // Prevent wrapping
                paddingLeft: "15px", // Added left padding
                paddingRight: "25px", // Added right padding
              }}
            >
              LL{totalSales.toFixed(2)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
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
              LL{todaysSales.toFixed(2)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SalesMetrics;
