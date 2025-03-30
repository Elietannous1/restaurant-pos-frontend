import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { requestRecoveryEmail } from "../../services/RecoveryApiRequest";
import { useNavigate } from "react-router-dom";

export default function RequestRecovery() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await requestRecoveryEmail(email);
      setMessage("A verification code has been sent to your email.");
      // Optionally, navigate to the verification page:
      // navigate("/recovery/verify");
    } catch (err) {
      setError("Failed to send recovery email. Please try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        padding: "20px",
        background: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Card className="shadow rounded">
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
    </div>
  );
}
