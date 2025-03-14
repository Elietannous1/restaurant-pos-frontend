import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import "../styles/Register.css";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/RegisterApiRequest";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/MainDashboard");
    } catch (e) {
      setError(e.message || "Registration failed");
    }
  };

  return (
    <div className="form-wrapper">
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <Card className="register-card p-3 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-3">Create Account</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit}>
                {/* Username Field */}
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group
                  className="mb-3"
                  controlId="formBasicConfirmPassword"
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control-lg"
                    required
                  />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Register
                  </Button>
                </div>

                {/* Login Link */}
                <p className="text-center mt-3 mb-0">
                  Already have an account?{" "}
                  <Link to="/" className="text-primary text-decoration-none">
                    Login here
                  </Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Register;
