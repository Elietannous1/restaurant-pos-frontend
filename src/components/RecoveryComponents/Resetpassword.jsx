// src/components/RecoveryComponents/ResetPassword.jsx
import React from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordThunk } from "../../store/recoverySlice";
import { useNavigate } from "react-router-dom";

export default function ResetPassword({ email }) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.recovery.reset);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    const result = await dispatch(
      resetPasswordThunk({ email, password: newPassword })
    );
    if (resetPasswordThunk.fulfilled.match(result)) {
      setTimeout(() => navigate("/"), 2000);
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
          <h1 className="text-center mb-4">Reset Password</h1>
          {localError && <Alert variant="danger">{localError}</Alert>}
          {status === "failed" && <Alert variant="danger">{error}</Alert>}
          {status === "succeeded" && (
            <Alert variant="success">Password reset successfully!</Alert>
          )}
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
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Resetting…" : "Reset Password"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
