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
  const [customerName, setCustomerName] = useState(""); // Moved here
  const [quantityInputs, setQuantityInputs] = useState({});
  const [orders, setOrders] = useState([]); // holds added orders
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // States for categories and category products
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

  // Add product to current order summary
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

  // Calculate total cost for a given set of items
  const calculateTotalCost = (items) => {
    return items
      .reduce(
        (total, item) => total + (item.product.price || 0) * item.quantity,
        0
      )
      .toFixed(2);
  };

  // Add current order summary to orders list
  const addOrder = () => {
    if (orderItems.length === 0) return; // nothing to add

    const newOrder = {
      items: orderItems,
      status: orderStatus,
      date: new Date().toLocaleString(),
      totalCost: calculateTotalCost(orderItems),
      customerName: customerName, // store the name if provided
    };

    setOrders((prev) => [...prev, newOrder]);

    // Clear the current order summary fields
    setOrderItems([]);
    setOrderStatus("");
    setCustomerName(""); // Reset name for next order
  };

  // Finalize orders (trigger actual order creation)
  const finalizeOrders = () => {
    console.log("Finalizing orders:", orders);
    // Here, call your API or perform finalization logic as needed.
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

          {/* CSS Grid with auto auto 1fr columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto 1fr",
              gap: "1rem",
              width: "100%",
              alignItems: "start",
            }}
          >
            {/* Available Products */}
            <Card className="shadow">
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

            {/* Order Summary */}
            <Card className="shadow">
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

                {/* Customer Name moved here */}
                <Form.Group controlId="customerName" className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Form.Group>

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

                <Button variant="primary" className="w-100" onClick={addOrder}>
                  Add Order
                </Button>
              </Card.Body>
            </Card>

            {/* Order Details */}
            <Card className="shadow">
              <Card.Header as="h5" className="bg-info text-white">
                Order Details
              </Card.Header>
              <Card.Body>
                {orders.length ? (
                  <ListGroup variant="flush" className="mb-3">
                    {orders.map((order, index) => (
                      <ListGroup.Item key={index}>
                        <div>
                          <strong>
                            {order.customerName
                              ? `Order for ${order.customerName}`
                              : `Order ${index + 1}`}
                          </strong>
                        </div>
                        <div>
                          <small>{order.date}</small>
                        </div>
                        <div>
                          Items:
                          <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.product.productName} (x{item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>Total: {order.totalCost} LL</div>
                        <div>Status: {order.status}</div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No orders added yet.</p>
                )}
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={finalizeOrders}
                >
                  Finalize Order
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
}
