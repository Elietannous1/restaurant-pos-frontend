// src/components/RecoveryComponents/VerifyRecoveryCode.jsx
import React from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { verifyRecovery } from "../../store/recoverySlice";

export default function VerifyRecoveryCode({ email, onVerified }) {
  const [code, setCode] = React.useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.recovery.verify);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;
    const result = await dispatch(verifyRecovery({ email, code }));
    if (verifyRecovery.fulfilled.match(result)) {
      onVerified();
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
          <h1 className="text-center mb-4">Verify Recovery Code</h1>
          <p className="text-center">
            A 6-digit recovery code was sent to <strong>{email}</strong>.
          </p>
          {status === "failed" && <Alert variant="danger">{error}</Alert>}
          {status === "succeeded" && (
            <Alert variant="success">Code verified successfully!</Alert>
          )}
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
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Verifying…" : "Verify Code"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
