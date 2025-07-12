import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { useAuth } from '../App'; // Import useAuth from App.js

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user'); // State for dropdown
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-white p-4">
      <Card className="shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Title as="h2" className="text-center mb-4">
          <Image src="/images/Logo_Navbar.png" width={150} alt="Logo" />
        </Card.Title>
        <Card.Text className="text-center text-muted mb-4">Sign in to continue.</Card.Text>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="signInAs">Sign in as</Form.Label>
            <Form.Select
              id="signInAs"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email ID</Form.Label>
            <Form.Control
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
