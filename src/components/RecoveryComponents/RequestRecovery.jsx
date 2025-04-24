import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { requestRecoveryEmail } from "../../services/RecoveryApiRequest";

/**
 * RequestRecovery component renders a form for users to request
 * an account recovery code by entering their registered email.
 * Props:
 *  - onSuccess: callback invoked with the email when request succeeds
 */
export default function RequestRecovery({ onSuccess }) {
  // State to hold the email input value
  const [email, setEmail] = useState("");
  // State to hold any error message for display
  const [error, setError] = useState("");
  // State to hold success message after sending recovery code
  const [message, setMessage] = useState("");

  /**
   * Form submit handler: sends recovery email request,
   * updates messages, and calls onSuccess callback.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous feedback
    setError("");
    setMessage("");
    try {
      // Call API service to request recovery email
      await requestRecoveryEmail(email);
      // Show success message
      setMessage("A verification code has been sent to your email.");
      // Notify parent component of successful request
      onSuccess(email);
      // Optionally navigate to verification page
      // navigate("/recovery/verify");
    } catch (err) {
      // Show error feedback on failure
      setError("Failed to send recovery email. Please try again.");
    }
  };

  return (
    // Centered container with light background filling full viewport height
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* Card to hold the recovery form */}
      <Card
        className="shadow rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body>
          {/* Title and instructions */}
          <h1 className="text-center mb-4">Account Recovery</h1>
          <p className="text-center">
            Enter your registered email to receive a recovery code.
          </p>
          {/* Display error or success alerts */}
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          {/* Recovery request form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="recoveryEmail" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            {/* Submit button spans full width */}
            <Button variant="primary" type="submit" className="w-100">
              Send Recovery Code
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
