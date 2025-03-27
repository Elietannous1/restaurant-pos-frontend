import React, { useState, useEffect } from "react";
import { fetchAllOrders } from "../services/OrderApiRequest";
import { Container, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SideBarContext";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const { sidebarOpen, toggleSidebar } = useSidebar();

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
    <div className="view-orders-layout d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1 p-4">
        <Container className="py-4">
          <h1>All Orders</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
}
