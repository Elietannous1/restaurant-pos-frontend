// src/pages/ViewOrders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "../styles/viewOrders.css";
import { fetchOrders } from "../store/orderSlice";

export default function ViewOrders() {
  const dispatch = useDispatch();
  const { items: orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="view-orders-layout">
      <Sidebar />

      <div className="main-content">
        <div className="view-orders-container">
          <h1 className="view-orders-title">All Orders</h1>

          {status === "loading" && <p>Loading orders…</p>}
          {status === "failed" && <p className="text-danger">Error: {error}</p>}

          {status === "succeeded" && (
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
          )}
        </div>
      </div>
    </div>
  );
}
