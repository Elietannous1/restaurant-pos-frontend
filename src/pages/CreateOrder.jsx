import React, { useState, useEffect } from "react";
import {
  getCategories,
  getProductsByCategory,
} from "../services/CategoryApiRequest";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  createOrder,
  updateOrderStatus,
} from "../store/orderSlice";
import { useVoiceCommands } from "../hooks/useVoiceCommands";

export default function CreateOrder() {
  // Local state for building orders
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantityInputs, setQuantityInputs] = useState({});
  const [orders, setOrders] = useState([]);

  // Local state for categories/products
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  // Enriched active orders for display
  const [enrichedActive, setEnrichedActive] = useState([]);

  // Sidebar toggle
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Redux hooks
  const dispatch = useDispatch();
  const {
    items: serverOrders,
    status,
    error,
  } = useSelector((state) => state.orders);

  // Map number-words to digits
  const numberMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  // Then wire up your voice commands *after* your handlers like so:
  const { start, stop } = useVoiceCommands((text) => {
    const lower = text.toLowerCase().trim();

    // “add X product” (X can be a digit or a word)
    const addMatch = lower.match(
      new RegExp(
        `^add\\s+((?:\\d+)|(?:${Object.keys(numberMap).join("|")}))\\s+(.+)$`
      )
    );
    if (addMatch) {
      const qtyToken = addMatch[1];
      const qty = /^\d+$/.test(qtyToken)
        ? parseInt(qtyToken, 10)
        : numberMap[qtyToken] || 1;
      const name = addMatch[2];
      const prod = categoryProducts.find((p) =>
        p.productName.toLowerCase().includes(name)
      );
      if (prod) addToOrder(prod, qty);
      return;
    }

    // “remove product”
    const remMatch = lower.match(/^remove\s+(.+)$/);
    if (remMatch) {
      const name = remMatch[1];
      const item = orderItems.find((i) =>
        i.product.productName.toLowerCase().includes(name)
      );
      if (item) removeOrderItem(item.product.id);
      return;
    }

    // “customer name X”
    if (lower.startsWith("customer name ")) {
      setCustomerName(lower.replace("customer name ", "").trim());
      return;
    }

    // “set status to X”
    if (lower.startsWith("set status to ")) {
      setOrderStatus(lower.replace("set status to ", "").trim().toUpperCase());
      return;
    }

    // “finalize order” or “submit order” (allows extra words)
    if (/^(?:finalize|submit)\b.*\border\b/.test(lower)) {
      finalizeOrders();
      return;
    }
  });

  // Fetch categories once
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].categoryId);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    (async () => {
      if (!selectedCategory) return;
      try {
        const data = await getProductsByCategory(selectedCategory);
        setCategoryProducts(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedCategory]);

  // Load server orders
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Enrich whenever the source data (serverOrders) changes
  useEffect(() => {
    (async () => {
      // Pull out only the active ones
      const active = serverOrders.filter((o) => o.orderStatus !== "COMPLETED");
      if (!active.length) {
        setEnrichedActive([]);
        return;
      }

      try {
        const mapping = await fetchProductNames();
        const enriched = active.map((order) => ({
          ...order,
          orderItems: order.orderItems.map((item) => ({
            productName:
              item.productName ??
              mapping[item.productId]?.productName ??
              String(item.productId),
            productPrice: item.price ?? mapping[item.productId]?.price ?? 0,
            ...item,
          })),
        }));
        setEnrichedActive(enriched);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [serverOrders]);

  // Handlers
  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantityInputs((prev) => ({ ...prev, [productId]: qty }));
  };

  const addToOrder = (product, qtyOverride) => {
    const qty =
      typeof qtyOverride === "number"
        ? qtyOverride
        : quantityInputs[product.id] || 1;
    setOrderItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity = qty;
        return copy;
      }
      return [...prev, { product, quantity: qty }];
    });
    setQuantityInputs((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const removeOrderItem = (productId) => {
    setOrderItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

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
    setOrderItems([]);
    setOrderStatus("");
    setCustomerName("");
  };

  const deleteOrder = (idx) => {
    setOrders((prev) => prev.filter((_, i) => i !== idx));
  };

  const finalizeOrders = async () => {
    if (!orders.length) return;
    try {
      await Promise.all(orders.map((o) => dispatch(createOrder(o))));
      setOrders([]);
      dispatch(fetchOrders());
    } catch (err) {
      console.error(err);
    }
  };

  const handleActiveOrderStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, newStatus }));
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotalCost = (items) =>
    items
      .reduce((sum, itm) => sum + (itm.productPrice || 0) * itm.quantity, 0)
      .toFixed(2);

  return (
    <div className="create-order-layout d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Voice controls */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
        <Button size="sm" onClick={start} className="me-2">
          🎤 Start Voice
        </Button>
        <Button size="sm" onClick={stop}>
          ⏹️ Stop Voice
        </Button>
      </div>

      <div className="main-content flex-grow-1 p-4">
        {status === "loading" && <div>Loading orders…</div>}
        {status === "failed" && (
          <div className="text-danger">Error: {error}</div>
        )}

        <Container fluid>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto auto 1fr",
              gap: "1rem",
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
                            style={{ width: "80px", marginRight: 10 }}
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

            {/* Local Order Details */}
            <Card className="shadow">
              <Card.Header as="h5" className="bg-info text-white">
                Order Details
              </Card.Header>
              <Card.Body>
                {orders.length ? (
                  <ListGroup variant="flush" className="mb-3">
                    {orders.map((order, idx) => (
                      <ListGroup.Item key={idx}>
                        <div>
                          <strong>
                            {order.customerName
                              ? `Order for ${order.customerName}`
                              : `Order ${idx + 1}`}
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
                          onClick={() => deleteOrder(idx)}
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
                  Finalize Orders
                </Button>
              </Card.Body>
            </Card>

            {/* Active Orders from Redux */}
            <Card className="shadow" style={{ gridColumn: "4 / 5" }}>
              <Card.Header as="h5" className="bg-warning text-dark">
                Active Orders
              </Card.Header>
              <Card.Body>
                {enrichedActive.length ? (
                  <ListGroup variant="flush">
                    {enrichedActive.map((order) => (
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
                        <div>
                          Total: ${calculateTotalCost(order.orderItems)}
                        </div>
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
