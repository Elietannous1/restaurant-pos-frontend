import React from 'react'
import { Form, Button, Container, Card } from 'react-bootstrap'
import '../styles/Login.css'

export default function Login() {
  return (
    <main className="form-wrapper">
      <Container className="d-flex justify-content-center">
        <Card className="login-card p-4 shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            <Form>
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  name="username"
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
                  className="form-control-lg" 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicCheckbox">
                <Form.Check 
                  type="checkbox" 
                  label="Remember me" 
                  className="user-select-none"
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Sign In
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}
