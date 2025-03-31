import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { verifyRecoveryCode } from "../../services/RecoveryApiRequest"; // adjust the path if needed
import { useNavigate } from "react-router-dom";

export default function VerifyRecoveryCode({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate that the code is exactly 6 digits
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    try {
      // Call the API to verify the code with the provided email
      await verifyRecoveryCode(email, code);
      setMessage("Code verified successfully!");
      if (onVerified) {
        onVerified();
      } else {
        // Optionally navigate to the next step, e.g., password reset
        navigate("/recovery/reset");
      }
    } catch (err) {
      setError("Verification failed. Please check your code and try again.");
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
          <h1 className="text-center mb-4">Verify Recovery Code</h1>
          <p className="text-center">
            A 6-digit recovery code was sent to <strong>{email}</strong>.
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="recoveryCode" className="mb-3">
              <Form.Label>Recovery Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Verify Code
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
