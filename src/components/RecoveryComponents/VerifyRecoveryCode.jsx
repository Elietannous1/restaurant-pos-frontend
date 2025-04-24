import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { verifyRecoveryCode } from "../../services/RecoveryApiRequest"; // API call to validate recovery code
import { useNavigate } from "react-router-dom";

/**
 * VerifyRecoveryCode component renders a form for entering
 * and validating the 6-digit recovery code sent to the user's email.
 * Props:
 *  - email: the user's email to which the code was sent
 *  - onVerified: optional callback invoked when verification succeeds
 */
export default function VerifyRecoveryCode({ email, onVerified }) {
  // State for the input recovery code
  const [code, setCode] = useState("");
  // State for error messages
  const [error, setError] = useState("");
  // State for success message
  const [message, setMessage] = useState("");
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles form submission: validates code length,
   * calls API to verify code, handles callbacks/navigation.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous feedback
    setError("");
    setMessage("");

    // Client-side validation: ensure 6 digits entered
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    try {
      // Call service to verify code against email
      await verifyRecoveryCode(email, code);
      // Show success message
      setMessage("Code verified successfully!");
      // Invoke callback if provided
      if (onVerified) {
        onVerified();
      } else {
        // Otherwise navigate to reset password page, passing email
        navigate("/ResetPassword", { state: { email } });
      }
    } catch (err) {
      // Show error feedback on failure
      setError("Verification failed. Please check your code and try again.");
    }
  };

  return (
    // Fullscreen centered container with light background
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      {/* Card wrapper for verification form */}
      <Card
        className="shadow rounded"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body>
          {/* Header and description */}
          <h1 className="text-center mb-4">Verify Recovery Code</h1>
          <p className="text-center">
            A 6-digit recovery code was sent to <strong>{email}</strong>.
          </p>

          {/* Display error or success alerts */}
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {/* Verification form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="recoveryCode" className="mb-3">
              <Form.Label>Recovery Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6} // limit input length
                required
              />
            </Form.Group>
            {/* Submit button spans full width */}
            <Button variant="primary" type="submit" className="w-100">
              Verify Code
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
