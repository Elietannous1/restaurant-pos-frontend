import React, { useState, useEffect } from "react"; // React core + hooks
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  Form,
} from "react-bootstrap"; // Bootstrap UI components
import Sidebar from "../components/Sidebar"; // Sidebar navigation
import { useSidebar } from "../context/SideBarContext"; // Hook to control sidebar state
import {
  fetchProducts, // API: GET all products
  createProduct, // API: POST new product
  updateProduct, // API: PUT update existing
  deleteProduct, // API: DELETE product
} from "../services/ProductApiRequest";
import { getCategories } from "../services/CategoryApiRequest"; // API: GET all categories
import "../styles/ProductManagement.css"; // CSS for this page

export default function ProductsManagement() {
  // State for list of products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form fields for create / edit
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState("");

  // Editing mode flags
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Sidebar open/close
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Load products & categories once on mount
  useEffect(() => {
    // Fetch products
    async function loadData() {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    // Fetch categories
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
        // Default select first category
        if (data.length > 0) setCategoryId(data[0].categoryId);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    loadData();
    loadCategories();
  }, []);

  // Handle form submission for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build DTO
      const productData = {
        productName,
        price: parseFloat(price),
        description,
        isAvailable,
        categoryId,
      };

      if (isEditing) {
        // Update existing product
        await updateProduct(editingProductId, productData);
      } else {
        // Create new product
        await createProduct(productData);
      }
      // Refresh product list
      const productsData = await fetchProducts();
      setProducts(productsData);

      // Reset form & editing state
      setProductName("");
      setPrice("");
      setDescription("");
      setIsAvailable(true);
      if (categories.length > 0) setCategoryId(categories[0].categoryId);
      setIsEditing(false);
      setEditingProductId(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete a product and refresh list
  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Prepare form for editing a product
  const handleEdit = (product) => {
    setProductName(product.productName);
    setPrice(product.price);
    setDescription(product.description);
    setIsAvailable(product.isAvailable);
    setCategoryId(
      product.categoryId ||
        (categories.length > 0 ? categories[0].categoryId : "")
    );
    setIsEditing(true);
    setEditingProductId(product.id);
  };

  return (
    <div
      className="products-management-layout d-flex"
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="main-content flex-grow-1 p-4">
        <Container className="products-management-container">
          <Row>
            {/* Product table */}
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
                      {products.length > 0 ? (
                        products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                            <td>${product.price}</td>
                            <td>{product.description}</td>
                            <td>{product.isAvailable ? "Yes" : "No"}</td>
                            <td>{product.categoryName || "-"}</td>
                            <td>
                              {/* Edit button */}
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEdit(product)}
                                className="me-1"
                              >
                                Edit
                              </Button>
                              {/* Delete button */}
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

            {/* Create / Edit form */}
            <Col md={5}>
              <h2 className="mb-4 text-center">
                {isEditing ? "Edit Product" : "Create New Product"}
              </h2>
              <Card className="shadow">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    {/* Name field */}
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

                    {/* Price field */}
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

                    {/* Description */}
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

                    {/* Availability */}
                    <Form.Group controlId="formAvailable" className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Available"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                      />
                    </Form.Group>

                    {/* Category selector */}
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

                    {/* Submit */}
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
