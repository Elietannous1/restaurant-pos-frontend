// src/pages/ProductsManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SideBarContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct as createProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
} from "../store/productSlice";
import { fetchCategories } from "../store/categorySlice";
import "../styles/ProductManagement.css";

export default function ProductsManagement() {
  const dispatch = useDispatch();
  const {
    items: products,
    status: prodStatus,
    error: prodError,
  } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  // form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // load initial data
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // default category once categories arrive
  useEffect(() => {
    if (categories.length && !categoryId) {
      setCategoryId(categories[0].categoryId);
    }
  }, [categories, categoryId]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setIsAvailable(true);
    setIsEditing(false);
    setEditId(null);
    if (categories.length) setCategoryId(categories[0].categoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      productName: name.trim(),
      price: parseFloat(price) || 0,
      description: description.trim(),
      isAvailable,
      categoryId,
    };

    if (isEditing) {
      await dispatch(updateProductAction({ id: editId, productData: data }));
    } else {
      await dispatch(createProductAction(data));
    }
    resetForm();
  };

  const startEdit = (p) => {
    setName(p.productName || "");
    setPrice(p.price != null ? String(p.price) : "");
    setDescription(p.description || "");
    setIsAvailable(!!p.isAvailable);
    setCategoryId(p.categoryId || "");
    setIsEditing(true);
    setEditId(p.id);
  };

  return (
    <div
      className="products-management-layout d-flex"
      style={{ minHeight: "100vh" }}
    >
      <Sidebar
        sidebarOpen={useSidebar().sidebarOpen}
        toggleSidebar={useSidebar().toggleSidebar}
      />
      <div className="main-content flex-grow-1 p-4">
        <Container className="products-management-container">
          {prodStatus === "loading" && <p>Loading products…</p>}
          {prodStatus === "failed" && (
            <p className="text-danger">Error: {prodError}</p>
          )}

          <Row>
            <Col md={7}>
              <h2 className="mb-4 text-center">Available Products</h2>
              <Card className="shadow mb-4">
                <Card.Body>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="products-table"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Available</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length ? (
                        products.map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.productName}</td>
                            <td>${p.price}</td>
                            <td>{p.description}</td>
                            <td>{p.isAvailable ? "Yes" : "No"}</td>
                            <td>{p.categoryName || "-"}</td>
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => startEdit(p)}
                                className="me-1"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  dispatch(deleteProductAction(p.id))
                                }
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5}>
              <h2 className="mb-4 text-center">
                {isEditing ? "Edit Product" : "Create New Product"}
              </h2>
              <Card className="shadow">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formProductName">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPrice">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAvailable">
                      <Form.Check
                        type="checkbox"
                        label="Available"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCategory">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      {isEditing ? "Update Product" : "Create Product"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
