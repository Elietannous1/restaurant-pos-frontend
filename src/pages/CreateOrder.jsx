import React, { useState, useEffect } from "react";
import { fetchProductNames } from "../services/ProductApiRequest";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Form,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";

export default function CreateOrder() {
  const [products, setProducts] = useState([]);
  // Order items are stored as objects: { product, quantity }
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("COMPLETED");
  // This state holds the quantity input for each product (keyed by product id)
  const [quantityInputs, setQuantityInputs] = useState({});
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Fetch all products on mount
  useEffect(() => {
    async function getProducts() {
      try {
        const { rawProducts } = await fetchProductNames();
        setProducts(rawProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }
    getProducts();
  }, []);

  // Handle changes to the quantity input field
  const handleQuantityChange = (productId, value) => {
    // Ensure the quantity is at least 1
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantityInputs((prev) => ({ ...prev, [productId]: quantity }));
  };

  // Add a product with a specified quantity to the order
  const addToOrder = (product) => {
    const quantityToAdd = quantityInputs[product.id] || 1;
    setOrderItems((prevItems) => {
      // Check if product already exists in orderItems
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        // Update the quantity of the existing product by replacing it with the new quantity
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity = quantityToAdd;
        return updatedItems;
      } else {
        // Add as a new order item
        return [...prevItems, { product, quantity: quantityToAdd }];
      }
    });
    // Reset the input for that product to 1 after adding
    setQuantityInputs((prev) => ({ ...prev, [product.id]: 1 }));
  };

  // Remove a product from the order summary
  const removeOrderItem = (productId) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  // Placeholder handler for creating the order
  const createOrder = () => {
    console.log(
      "Creating order with items:",
      orderItems,
      "and status:",
      orderStatus
    );
  };

  return (
    <div className="create-order-layout d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar on the left */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content on the right */}
      <div className="main-content flex-grow-1 p-4">
        <Container fluid>
          <Row>
            {/* Available Products */}
            <Col md={orderItems.length ? 7 : 12}>
              <Card className="shadow mb-4">
                <Card.Header as="h5" className="bg-primary text-white">
                  Available Products
                </Card.Header>
                <Card.Body>
                  {products.length ? (
                    <ListGroup variant="flush">
                      {products.map((product) => (
                        <ListGroup.Item
                          key={product.id}
                          className="d-flex justify-content-between align-items-center flex-wrap"
                        >
                          <div style={{ flex: "1 1 auto" }}>
                            {product.productName}
                          </div>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type="number"
                              min="1"
                              value={quantityInputs[product.id] || 1}
                              onChange={(e) =>
                                handleQuantityChange(product.id, e.target.value)
                              }
                              style={{ width: "80px", marginRight: "10px" }}
                            />
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => addToOrder(product)}
                            >
                              Add to Order
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>Loading products...</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Order Summary */}
            {orderItems.length > 0 && (
              <Col md={5}>
                <Card className="shadow mb-4">
                  <Card.Header as="h5" className="bg-success text-white">
                    Order Summary
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Selected Products</Card.Title>
                    {orderItems.length ? (
                      <ListGroup variant="flush" className="mb-3">
                        {orderItems.map((item) => (
                          <ListGroup.Item
                            key={item.product.id}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <span>
                              {item.product.productName} (x{item.quantity})
                            </span>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeOrderItem(item.product.id)}
                            >
                              Remove
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p>No products added yet.</p>
                    )}
                    <Form.Group controlId="orderStatus" className="mb-3">
                      <Form.Label>Order Status</Form.Label>
                      <Form.Select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="PENDING">PENDING</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </Form.Select>
                    </Form.Group>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={createOrder}
                    >
                      Create Order
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
}
