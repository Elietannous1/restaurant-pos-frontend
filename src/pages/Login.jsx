import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { login } from "../services/LoginApiRequest";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData.email, formData.password);
      navigate("/MainDashboard");
    } catch (e) {
      setError(e.message || "Login failed");
    }
  };

  return (
    <main className="form-wrapper">
      <Container className="d-flex justify-content-center">
        <Card className="login-card p-4 shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
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
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Sign In
                </Button>
              </div>

              <p className="text-center mt-2">
                New here?{" "}
                <Link to="/Register" className="text-primary">
                  Register here
                </Link>
              </p>
            </Form>
            <div className="text-center mt-3">
              <a href="/account-recovery">Forgot Password?</a>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
