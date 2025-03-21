import React, { useState, useEffect } from "react";
import {
  getCategories,
  getProductsByCategory,
} from "../services/CategoryApiRequest";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Form,
  Nav,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SideBarContext";

export default function CreateOrder() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({});
  const [orderDate] = useState(new Date().toLocaleString());
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // New states for categories and category products
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].categoryId);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }
    fetchCats();
  }, []);

  // Fetch products for selected category
  useEffect(() => {
    async function fetchCategoryProducts() {
      if (selectedCategory) {
        try {
          const data = await getProductsByCategory(selectedCategory);
          setCategoryProducts(data);
        } catch (error) {
          console.error("Error fetching products for category", error);
        }
      }
    }
    fetchCategoryProducts();
  }, [selectedCategory]);

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantityInputs((prev) => ({ ...prev, [productId]: quantity }));
  };

  const addToOrder = (product) => {
    const quantityToAdd = quantityInputs[product.id] || 1;
    setOrderItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity = quantityToAdd;
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity: quantityToAdd }];
      }
    });
    setQuantityInputs((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const removeOrderItem = (productId) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const calculateTotalCost = () => {
    return orderItems
      .reduce(
        (total, item) => total + (item.product.price || 0) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const createOrder = () => {
    console.log("Creating order with items:", orderItems);
    console.log("Order status:", orderStatus);
    console.log("Customer name:", customerName);
    console.log("Order date:", orderDate);
    console.log("Total cost: $", calculateTotalCost());
  };

  return (
    <div className="create-order-layout d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar on the left */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main content on the right */}
      <div className="main-content flex-grow-1 p-4">
        <Container fluid>
          {/* Category Navigation */}
          <Row className="mb-4">
            <Col>
              <Nav variant="tabs" activeKey={selectedCategory}>
                {categories.map((cat) => (
                  <Nav.Item key={cat.categoryId}>
                    <Nav.Link
                      eventKey={cat.categoryId}
                      onClick={() => setSelectedCategory(cat.categoryId)}
                    >
                      {cat.categoryName}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
          </Row>
          {/* Content Row with gap classes added */}
          <Row className="gx-4 gy-4">
            {/* Available Products */}
            <Col md={6}>
              <Card className="shadow mb-4">
                <Card.Header as="h5" className="bg-primary text-white">
                  {categories.find((c) => c.categoryId === selectedCategory)
                    ?.categoryName || "Products"}
                </Card.Header>
                <Card.Body>
                  {categoryProducts.length ? (
                    <ListGroup variant="flush">
                      {categoryProducts.map((product) => (
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
                    <p>No products found in this category.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            {/* Order Summary */}
            <Col md={4}>
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
            {/* Order Details */}
            <Col md={2}>
              <Card className="shadow mb-4">
                <Card.Header as="h5" className="bg-info text-white">
                  Order Details
                </Card.Header>
                <Card.Body>
                  <Form.Group controlId="customerName" className="mb-3">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Form.Group>
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item>
                      <strong>Total Items:</strong>{" "}
                      {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Order Date:</strong> {orderDate}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Total Cost:</strong> ${calculateTotalCost()}
                    </ListGroup.Item>
                  </ListGroup>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={createOrder}
                  >
                    Finalize Order
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
