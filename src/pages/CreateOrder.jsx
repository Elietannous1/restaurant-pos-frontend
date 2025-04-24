import React, { useState, useEffect } from "react";
import {
  getCategories,
  getProductsByCategory,
} from "../services/CategoryApiRequest"; // API calls to fetch categories and products
import {
  createOrder, // API call: POST /order/create
  fetchAllOrders, // API call: GET /order
  updateOrderStatus, // API call: PUT /order/update/status/:orderId
} from "../services/OrderApiRequest";
import { fetchProductNames } from "../services/ProductApiRequest"; // API call to map product IDs → names/prices
import {
  Container,
  Row,
  Card,
  ListGroup,
  Button,
  Form,
  Nav,
  Col,
} from "react-bootstrap"; // UI components
import Sidebar from "../components/Sidebar"; // Sidebar component
import { useSidebar } from "../context/SideBarContext"; // Hook for sidebar toggle state

export default function CreateOrder() {
  // Local state for current (unsubmitted) order items and form fields
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({});

  // Local list of orders added but not yet finalized
  const [orders, setOrders] = useState([]);

  // Orders fetched from backend that are still active
  const [activeOrders, setActiveOrders] = useState([]);

  // Sidebar open/close state and toggle function
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Category/product selection state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  // Fetch all categories on component mount
  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories();
        setCategories(data);
        // default to first category if available
        if (data.length > 0) setSelectedCategory(data[0].categoryId);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    }
    fetchCats();
  }, []);

  // Fetch products whenever selectedCategory changes
  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!selectedCategory) return;
      try {
        const data = await getProductsByCategory(selectedCategory);
        setCategoryProducts(data);
      } catch (error) {
        console.error("Error fetching products for category", error);
      }
    }
    fetchCategoryProducts();
  }, [selectedCategory]);

  // Load active orders from backend (excluding COMPLETED)
  const loadActiveOrders = async () => {
    try {
      const data = await fetchAllOrders();
      setActiveOrders(data.filter((o) => o.orderStatus !== "COMPLETED"));
    } catch (error) {
      console.error("Error fetching active orders:", error);
    }
  };

  // Enrich orders with productName & price using productMapping
  useEffect(() => {
    async function enrichActiveOrders() {
      if (
        activeOrders.length === 0 ||
        !activeOrders[0].orderItems?.length ||
        "productName" in activeOrders[0].orderItems[0]
      ) {
        return;
      }
      try {
        const productMapping = await fetchProductNames();
        const enriched = activeOrders.map((order) => ({
          ...order,
          orderItems: order.orderItems.map((item) => ({
            ...item,
            productName:
              productMapping[item.product]?.productName ?? item.product,
            productPrice: productMapping[item.product]?.price,
          })),
        }));
        setActiveOrders(enriched);
      } catch (error) {
        console.error("Error enriching active orders:", error);
      }
    }
    enrichActiveOrders();
  }, [activeOrders]);

  // Handle quantity input change, enforce minimum of 1
  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantityInputs((prev) => ({ ...prev, [productId]: qty }));
  };

  // Add or update an item in the current order summary
  const addToOrder = (product) => {
    const qty = quantityInputs[product.id] || 1;
    setOrderItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity = qty;
        return copy;
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });
    // reset input for that product
    setQuantityInputs((prev) => ({ ...prev, [product.id]: 1 }));
  };

  // Remove an item from current order summary
  const removeOrderItem = (productId) => {
    setOrderItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Compute total cost of given items array
  const calculateTotalCost = (items) =>
    items
      .reduce((sum, itm) => sum + (itm.productPrice || 0) * itm.quantity, 0)
      .toFixed(2);

  // Add current summary as a new local order
  const addOrder = () => {
    if (!orderItems.length) return;
    const newOrder = {
      orderDate: new Date().toISOString(),
      orderItems: orderItems.map((i) => ({
        productId: i.product.id,
        productName: i.product.productName,
        productPrice: i.product.price,
        quantity: i.quantity,
      })),
      orderStatus,
      customerName,
    };
    setOrders((prev) => [...prev, newOrder]);
    // clear form
    setOrderItems([]);
    setOrderStatus("");
    setCustomerName("");
  };

  // Delete a local (unsubmitted) order by index
  const deleteOrder = (idx) => {
    setOrders((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit all local orders to backend, then reload active orders
  const finalizeOrders = async () => {
    if (!orders.length) return;
    try {
      await Promise.all(
        orders.map(({ customerName, ...payload }) => createOrder(payload))
      );
      console.log("Orders created successfully.");
      setOrders([]);
      await loadActiveOrders();
    } catch (error) {
      console.error("Error finalizing orders:", error);
    }
  };

  // Update status of an existing active order
  const handleActiveOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadActiveOrders();
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
    }
  };

  // Initial load of active orders
  useEffect(() => {
    loadActiveOrders();
  }, []);

  return (
    <div className="create-order-layout d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar toggle */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="main-content flex-grow-1 p-4">
        <Container fluid>
          {/* Category tabs */}
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

          {/* Grid: Products, Summary, Details, Active Orders */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto auto 1fr",
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
                    {orderItems.map((item, idx) => (
                      <ListGroup.Item
                        key={idx}
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

            {/* Order Details (Local) */}
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
                          <small>{order.orderDate}</small>
                        </div>
                        <div>
                          Items:
                          <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                            {order.orderItems.map((itm, i2) => (
                              <li key={i2}>
                                {itm.productName} (x{itm.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          Total: ${calculateTotalCost(order.orderItems)}
                        </div>
                        <div>Status: {order.orderStatus}</div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteOrder(index)}
                          style={{ marginTop: "0.5rem" }}
                        >
                          Delete Order
                        </Button>
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

            {/* Active Orders from DB */}
            <Card className="shadow" style={{ gridColumn: "4 / 5" }}>
              <Card.Header as="h5" className="bg-warning text-dark">
                Active Orders
              </Card.Header>
              <Card.Body>
                {activeOrders.length ? (
                  <ListGroup variant="flush">
                    {activeOrders.map((order) => (
                      <ListGroup.Item key={order.orderId}>
                        <div>
                          <strong>
                            {order.customerName
                              ? `Order for ${order.customerName}`
                              : `Order #${order.orderId}`}
                          </strong>
                        </div>
                        <div>
                          <small>{order.orderDate}</small>
                        </div>
                        <div>
                          Items:
                          <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                            {order.orderItems.map((itm, i) => (
                              <li key={i}>
                                {itm.productName} (x{itm.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>Total: ${order.totalPrice}</div>
                        <div>Status: {order.orderStatus}</div>
                        <Form.Group
                          controlId={`status-${order.orderId}`}
                          className="mt-2"
                        >
                          <Form.Label>Update Status</Form.Label>
                          <Form.Select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleActiveOrderStatusChange(
                                order.orderId,
                                e.target.value
                              )
                            }
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </Form.Select>
                        </Form.Group>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No active orders found.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
}
