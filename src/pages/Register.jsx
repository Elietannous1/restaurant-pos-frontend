import React, { useState } from "react"; // React core + useState hook
import { Form, Button, Container, Card } from "react-bootstrap"; // Bootstrap form/layout components
import "../styles/Register.css"; // Page-specific styles
import { useNavigate, Link } from "react-router-dom"; // Navigation and link components
import { register } from "../services/RegisterApiRequest"; // API call to register new user

function Register() {
  // formData holds all input values
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // error message to display validation or request errors
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // hook to redirect on success

  // Update formData when any input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call register API with username, email, password
      await register(formData.username, formData.email, formData.password);
      // On success, navigate to main dashboard
      navigate("/MainDashboard");
    } catch (e) {
      // Display any error message from API or a default
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

              {/* Display error if present */}
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

                {/* Link to login for existing users */}
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
