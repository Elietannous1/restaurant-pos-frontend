// src/pages/ViewOrders.jsx

import React, { useState, useEffect } from "react"; // React core + hooks for state and lifecycle
import { fetchAllOrders } from "../services/OrderApiRequest"; // API call to retrieve all orders
import { Accordion, Table } from "react-bootstrap"; // Bootstrap components for collapsible panels and tables
import Sidebar from "../components/Sidebar"; // Sidebar navigation component
import "../styles/viewOrders.css"; // CSS specific to the View Orders page

export default function ViewOrders() {
  // Local state to hold the list of orders fetched from the backend
  const [orders, setOrders] = useState([]);

  // On component mount, load all orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchAllOrders(); // Fetch orders via API
        setOrders(data); // Store them in state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    loadOrders();
  }, []); // Empty dependency array → run once on mount

  return (
    <div className="view-orders-layout">
      {/* Sidebar for navigation */}
      <Sidebar />

      {/* Main content area to the right of the sidebar */}
      <div className="main-content">
        <div className="view-orders-container">
          {/* Page title */}
          <h1 className="view-orders-title">All Orders</h1>

          {/* Accordion to show each order in a collapsible panel */}
          <Accordion defaultActiveKey="0">
            {orders.map((order, idx) => (
              <Accordion.Item eventKey={String(idx)} key={order.orderId}>
                {/* Header shows order ID, status, total, and date */}
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>Order #{order.orderId}</strong> –{" "}
                      {order.orderStatus}
                    </div>
                    <div>
                      Total: ${order.totalPrice} |{" "}
                      {new Date(order.orderDate).toLocaleString()}
                    </div>
                  </div>
                </Accordion.Header>

                {/* Body shows the line items in a table */}
                <Accordion.Body>
                  <h5>Order Items</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Order Item ID</th>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.length ? (
                        order.orderItems.map((item) => (
                          <tr key={item.orderItemId}>
                            <td>{item.orderItemId}</td>
                            <td>{item.productId}</td>
                            <td>{item.productName}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        ))
                      ) : (
                        // Fallback row if there are no items in this order
                        <tr>
                          <td colSpan="5" className="text-center">
                            No items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
