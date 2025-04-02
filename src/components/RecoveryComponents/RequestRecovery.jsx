import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { requestRecoveryEmail } from "../../services/RecoveryApiRequest";

export default function RequestRecovery({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await requestRecoveryEmail(email);
      setMessage("A verification code has been sent to your email.");
      onSuccess(email);
      // Optionally, navigate to the verification page:
      // navigate("/recovery/verify");
    } catch (err) {
      setError("Failed to send recovery email. Please try again.");
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
          <h1 className="text-center mb-4">Account Recovery</h1>
          <p className="text-center">
            Enter your registered email to receive a recovery code.
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
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
            <Button variant="primary" type="submit" className="w-100">
              Send Recovery Code
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
