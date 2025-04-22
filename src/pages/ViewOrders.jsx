// src/pages/ViewOrders.jsx

import React, { useState, useEffect } from "react";
import { fetchAllOrders } from "../services/OrderApiRequest";
import { Accordion, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "../styles/viewOrders.css";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="view-orders-layout">
      <Sidebar />
      <div className="main-content">
        <div className="view-orders-container">
          <h1 className="view-orders-title">All Orders</h1>

          <Accordion defaultActiveKey="0">
            {orders.map((order, idx) => (
              <Accordion.Item eventKey={String(idx)} key={order.orderId}>
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
                        <tr>
                          <td colSpan="5">No items found.</td>
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
