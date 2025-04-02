import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { resetPassword } from "../../services/RecoveryApiRequest"; // adjust path if needed
import { useNavigate } from "react-router-dom";

export default function ResetPassword({ email }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Call the API to reset the password
      await resetPassword(email, newPassword);
      setMessage("Password reset successfully!");
      // Optionally, navigate to the login page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="shadow rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body>
          <h1 className="text-center mb-4">Reset Password</h1>
          <p className="text-center">Please enter your new password.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Reset Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
