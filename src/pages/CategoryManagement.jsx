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
  getCategories,
  createCategory,
  deleteCategory, // Function to delete a category by ID
} from "../services/CategoryApiRequest";
import "../styles/ProductManagement.css";

/**
 * CategoryManagement component provides UI for listing,
 * creating, and deleting product categories.
 */
export default function CategoryManagement() {
  // State to hold list of categories fetched from API
  const [categories, setCategories] = useState([]);
  // State to hold new category name input
  const [categoryName, setCategoryName] = useState("");
  // State to hold new category description input
  const [description, setDescription] = useState("");

  // Consume sidebar open state and toggle function from context
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Fetch categories once on component mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    loadCategories();
  }, []); // empty dependency array ensures this runs only once

  /**
   * Handle form submission to create a new category.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = { categoryName, description };
      // Call API to create category
      await createCategory(newCategory);
      // Refresh list after creation
      const data = await getCategories();
      setCategories(data);
      // Clear form inputs
      setCategoryName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  /**
   * Handle deleting a category by its ID.
   */
  const handleDelete = async (categoryId) => {
    try {
      // Call API to delete
      await deleteCategory(categoryId);
      // Refresh list after deletion
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div
      className="category-management-layout d-flex"
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar with collapse control */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area grows to fill space */}
      <div className="main-content flex-grow-1 p-4">
        <Container className="category-management-container">
          <Row>
            {/* Left column: display existing categories */}
            <Col md={6}>
              <h2 className="mb-4 text-center">Available Categories</h2>
              <Card className="shadow mb-4">
                <Card.Body>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="categories-table"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render rows if categories exist */}
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <tr key={cat.categoryId}>
                            <td>{cat.categoryId}</td>
                            <td>{cat.categoryName}</td>
                            <td>{cat.description}</td>
                            <td>
                              {/* Delete button triggers handleDelete */}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(cat.categoryId)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Show placeholder when no categories
                        <tr>
                          <td colSpan="4" className="text-center">
                            No categories found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Right column: form to create a new category */}
            <Col md={6}>
              <h2 className="mb-4 text-center">Create New Category</h2>
              <Card className="shadow">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formCategoryName" className="mb-3">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>
                    {/* Submit button for form */}
                    <Button variant="primary" type="submit">
                      Create Category
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
