import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState(null);

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    // client-side password match validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError(null);

    // dispatch the registerUser thunk
    const result = await dispatch(
      registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/MainDashboard");
    }
    // on failure, `error` from Redux will show
  };

  return (
    <div className="form-wrapper">
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <Card className="register-card p-3 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-3">Create Account</h2>

              {localError && (
                <p className="text-danger text-center">{localError}</p>
              )}
              {!localError && status === "failed" && (
                <p className="text-danger text-center">{error}</p>
              )}

              <Form onSubmit={handleSubmit}>
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

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Registering…" : "Register"}
                  </Button>
                </div>

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
