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
  deleteCategory, // Import the delete function
} from "../services/CategoryApiRequest";
import "../styles/ProductManagement.css";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const { sidebarOpen, toggleSidebar } = useSidebar();

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = { categoryName, description };
      await createCategory(newCategory);
      // Refresh categories list after creation
      const data = await getCategories();
      setCategories(data);
      // Clear the form
      setCategoryName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Handler for deleting a category
  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      // Refresh the categories list after deletion
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
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1 p-4">
        <Container className="category-management-container">
          <Row>
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
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <tr key={cat.categoryId}>
                            <td>{cat.categoryId}</td>
                            <td>{cat.categoryName}</td>
                            <td>{cat.description}</td>
                            <td>
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
