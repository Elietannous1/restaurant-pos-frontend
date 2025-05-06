// src/components/RecoveryComponents/RequestRecovery.jsx
import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { requestRecovery } from "../../store/recoverySlice";

export default function RequestRecovery({ onSuccess }) {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.recovery.request);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(requestRecovery(email));
    if (requestRecovery.fulfilled.match(result)) {
      onSuccess(email);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Card className="shadow rounded" style={{ maxWidth: 500, width: "100%" }}>
        <Card.Body>
          <h1 className="text-center mb-4">Account Recovery</h1>
          <p className="text-center">
            Enter your registered email to receive a recovery code.
          </p>
          {status === "failed" && <Alert variant="danger">{error}</Alert>}
          {status === "succeeded" && (
            <Alert variant="success">
              A verification code has been sent to your email.
            </Alert>
          )}
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
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : "Send Recovery Code"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
