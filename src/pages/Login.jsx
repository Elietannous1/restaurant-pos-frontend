// src/pages/Login.jsx
import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/Login.css";
import { loginUser } from "../store/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate("/MainDashboard");
    }
    // On failure, error is handled via Redux state
  };

  return (
    <main className="form-wrapper">
      <Container className="d-flex justify-content-center">
        <Card className="login-card p-4 shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>

            {status === "failed" && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control-lg"
                  required
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-lg"
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Signing In…" : "Sign In"}
                </Button>
              </div>

              <p className="text-center mt-2">
                New here?{" "}
                <Link to="/register" className="text-primary">
                  Register here
                </Link>
              </p>
            </Form>

            <div className="text-center mt-3">
              <Link to="/recovery/AccountRecovery">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
