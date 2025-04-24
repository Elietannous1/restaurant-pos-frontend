import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { resetPassword } from "../../services/RecoveryApiRequest"; // API call to reset password
import { useNavigate } from "react-router-dom";

/**
 * ResetPassword component allows a user to set a new password
 * after verifying their email. It displays a form with
 * password and confirm password fields, handles validation,
 * calls the reset API, and redirects on success.
 *
 * Props:
 *  - email: the user's email address (from previous step)
 */
export default function ResetPassword({ email }) {
  // State for new password input
  const [newPassword, setNewPassword] = useState("");
  // State for confirm password input
  const [confirmPassword, setConfirmPassword] = useState("");
  // State for error messages
  const [error, setError] = useState("");
  // State for success message
  const [message, setMessage] = useState("");
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  /**
   * Handles form submission: validates matching passwords,
   * calls resetPassword API, shows feedback, and redirects.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setError("");
    setMessage("");

    // Validate that both passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Call service to reset password on backend
      await resetPassword(email, newPassword);
      // Show success message on UI
      setMessage("Password reset successfully!");
      // Redirect to login after brief delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      // Show error alert on failure
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    // Full-screen centered container with light background
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* Card wrapper for form */}
      <Card
        className="shadow rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body>
          {/* Header and instructions */}
          <h1 className="text-center mb-4">Reset Password</h1>
          <p className="text-center">Please enter your new password.</p>

          {/* Display feedback alerts */}
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {/* Password reset form */}
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

            {/* Submit button spans full width */}
            <Button variant="primary" type="submit" className="w-100">
              Reset Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
