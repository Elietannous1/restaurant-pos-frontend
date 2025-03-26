import React, { useState, useEffect } from "react";
import {
  getCategories,
  getProductsByCategory,
} from "../services/CategoryApiRequest";
import {
  createOrder, // API call: POST /order/create
  fetchAllOrders, // API call: GET /order
  updateOrderStatus, // API call: PUT /order/update/status/:orderId
} from "../services/OrderApiRequest";
import { fetchProductNames } from "../services/ProductApiRequest";
import {
  Container,
  Row,
  Card,
  ListGroup,
  Button,
  Form,
  Nav,
  Col,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SideBarContext";

export default function CreateOrder() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({});
  const [orders, setOrders] = useState([]); // Local orders (not yet finalized)
  const [activeOrders, setActiveOrders] = useState([]); // Orders fetched from DB

  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Category and product states
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

  // Load active orders from backend
  const loadActiveOrders = async () => {
    try {
      const data = await fetchAllOrders();
      setActiveOrders(
        data.filter((order) => order.orderStatus !== "COMPLETED")
      );
    } catch (error) {
      console.error("Error fetching active orders:", error);
    }
  };

  // Enrich active orders with product details if they aren't enriched already
  useEffect(() => {
    async function enrichActiveOrders() {
      try {
        if (
          activeOrders.length > 0 &&
          activeOrders[0].orderItems &&
          activeOrders[0].orderItems.length > 0 &&
          !("productName" in activeOrders[0].orderItems[0])
        ) {
          const productMapping = await fetchProductNames(); // mapping: { id: { productName, price, ... } }
          const enriched = activeOrders.map((order) => ({
            ...order,
            orderItems: order.orderItems.map((item) => ({
              ...item,
              productName: productMapping[item.product]
                ? productMapping[item.product].productName
                : item.product,
              productPrice: productMapping[item.product]
                ? productMapping[item.product].price
                : undefined,
            })),
          }));
          setActiveOrders(enriched);
        }
      } catch (error) {
        console.error("Error enriching active orders:", error);
      }
    }
    enrichActiveOrders();
  }, [activeOrders]);

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

  // Calculate total cost using productPrice from each order item
  const calculateTotalCost = (items) => {
    return items
      .reduce(
        (total, item) => total + (item.productPrice || 0) * item.quantity,
        0
      )
      .toFixed(2);
  };

  // Build an order object matching the backend DTO, including product details for display
  const addOrder = () => {
    if (orderItems.length === 0) return;
    const newOrder = {
      orderDate: new Date().toISOString(),
      orderItems: orderItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.productName,
        productPrice: item.product.price, // include price
        quantity: item.quantity,
      })),
      orderStatus: orderStatus,
      customerName: customerName, // display only
    };
    setOrders((prev) => [...prev, newOrder]);
    // Clear the current order summary
    setOrderItems([]);
    setOrderStatus("");
    setCustomerName("");
  };

  // Delete an order from local orders (Order Details container)
  const deleteOrder = (orderIndex) => {
    setOrders((prev) => prev.filter((_, idx) => idx !== orderIndex));
  };

  // Finalize orders: send them to backend and reload active orders
  const finalizeOrders = async () => {
    if (orders.length === 0) return;
    try {
      await Promise.all(
        orders.map((order) => {
          const { customerName, ...payload } = order;
          return createOrder(payload);
        })
      );
      console.log("Orders created successfully.");
      setOrders([]);
      await loadActiveOrders();
    } catch (error) {
      console.error("Error finalizing orders:", error);
    }
  };

  // Update status for an active order
  const handleActiveOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      await loadActiveOrders();
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
    }
  };

  return (
    <div className="create-order-layout d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
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
          {/* Grid Layout */}
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

            {/* Order Summary (Local Order) */}
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

            {/* Order Details (Local Orders) */}
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
                            {order.orderItems.map((itm, idx2) => (
                              <li key={idx2}>
                                {itm.productName} (x{itm.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          Total: ${calculateTotalCost(order.orderItems)}
                        </div>
                        <div>Status: {order.orderStatus}</div>
                        {/* Delete button to remove order */}
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

            {/* Active Orders from the DB */}
            <Card className="shadow" style={{ gridColumn: "4 / 5" }}>
              <Card.Header as="h5" className="bg-warning text-dark">
                Active Orders
              </Card.Header>
              <Card.Body>
                {activeOrders.length ? (
                  <ListGroup variant="flush">
                    {activeOrders.map((order) => (
                      <ListGroup.Item key={order.id}>
                        <div>
                          <strong>
                            {order.customerName
                              ? `Order for ${order.customerName}`
                              : `Order #${order.id}`}
                          </strong>
                        </div>
                        <div>
                          <small>{order.orderDate}</small>
                        </div>
                        <div>
                          Items:
                          <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                            {order.orderItems.map((item, idx) => (
                              <li key={idx}>
                                {item.productName} (x{item.quantity})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>Total: ${order.totalPrice}</div>
                        <div>Status: {order.orderStatus}</div>
                        <Form.Group
                          controlId={`status-${order.id}`}
                          className="mt-2"
                        >
                          <Form.Label>Update Status</Form.Label>
                          <Form.Select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleActiveOrderStatusChange(
                                order.id,
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
