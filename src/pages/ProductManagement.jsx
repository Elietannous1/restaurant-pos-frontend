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
import {
  fetchProducts,
  createProduct,
  deleteProduct,
} from "../services/ProductApiRequest";
import { getCategories } from "../services/CategoryApiRequest";
import "../styles/ProductManagement.css";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // Form fields for creating a product
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState("");

  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Load products and categories on mount
  useEffect(() => {
    async function loadData() {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].categoryId);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    loadData();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        productName,
        price: parseFloat(price),
        description,
        isAvailable, // using isAvailable as expected by the backend DTO
        categoryId,
      };
      await createProduct(newProduct);
      // Refresh products list after creation
      const productsData = await fetchProducts();
      setProducts(productsData);
      // Clear the form
      setProductName("");
      setPrice("");
      setDescription("");
      setIsAvailable(true);
      if (categories.length > 0) setCategoryId(categories[0].categoryId);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      // Refresh products list after deletion
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div
      className="products-management-layout d-flex"
      style={{ minHeight: "100vh" }}
    >
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1 p-4">
        <Container className="products-management-container">
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
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Available</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products && products.length > 0 ? (
                        products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                            <td>${product.price}</td>
                            <td>{product.description}</td>
                            <td>{product.isAvailable ? "Yes" : "No"}</td>
                            <td>{product.categoryName || "-"}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
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
              <h2 className="mb-4 text-center">Create New Product</h2>
              <Card className="shadow">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formProductName" className="mb-3">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formPrice" className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter product description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formAvailable" className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Available"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formCategory" className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Create Product
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
