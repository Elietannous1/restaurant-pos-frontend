import React from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import '../styles/Register.css';

function Register() {
  return (
    <div className="form-wrapper">
      <Container className="h-100 d-flex align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-4"> {/* Adjusted width for better fit */}
          <Card className="register-card p-3 shadow-lg"> {/* Reduced padding */}
            <Card.Body>
              <h2 className="text-center mb-3">Create Account</h2>
              <Form>
                {/* Username Field */}
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Choose a username" 
                    name="username"
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
                    className="form-control-lg"
                    required 
                  />
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    className="form-control-lg"
                    required 
                  />
                </Form.Group>

                {/* Terms and Conditions Checkbox */}
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check 
                    type="checkbox" 
                    label="I agree to the Terms and Conditions" 
                    className="user-select-none"
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
                  Already have an account? <a href="/" className="text-primary text-decoration-none">Login here</a>
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
