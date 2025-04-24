import React, { useState } from "react"; // React core and useState hook
import { Form, Button, Container, Card } from "react-bootstrap"; // Bootstrap components
import { Link, useNavigate } from "react-router-dom"; // Routing/navigation
import "../styles/Login.css"; // Login-specific styles
import { login } from "../services/LoginApiRequest"; // API call for authentication

export default function Login() {
  // formData holds email & password inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // error message state
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // hook to programmatically navigate

  // Update formData when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler: attempt login, navigate on success, show error on failure
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData.email, formData.password); // call login API
      navigate("/MainDashboard"); // go to dashboard on success
    } catch (e) {
      setError(e.message || "Login failed"); // display error message
    }
  };

  return (
    <main className="form-wrapper">
      <Container className="d-flex justify-content-center">
        <Card className="login-card p-4 shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>

            {/* Display error alert if login fails */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Email input */}
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control-lg"
                  required // make input required
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              {/* Password input */}
              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-lg"
                  required // make input required
                />
              </Form.Group>

              {/* Submit button */}
              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Sign In
                </Button>
              </div>

              {/* Link to registration */}
              <p className="text-center mt-2">
                New here?{" "}
                <Link to="/Register" className="text-primary">
                  Register here
                </Link>
              </p>
            </Form>

            {/* Forgot password link */}
            <div className="text-center mt-3">
              <Link to="/recovery/AccountRecovery">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
