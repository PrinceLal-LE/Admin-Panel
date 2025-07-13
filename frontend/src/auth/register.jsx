import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

// This component will handle user registration
const RegisterPage = ({ onRegisterSuccess, onGoToLogin }) => {
    const [email, setEmail] = useState(''); // This field is for display, backend uses 'username' for email
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!agreeTerms) {
            setError('You must agree to the Terms & Conditions.');
            return;
        }

        setLoading(true);
        try {
            // Send 'email' from the form as 'username' to the backend, as per our schema
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Backend expects 'username' for the email and 'password'.
                // We'll send the 'email' state variable as 'username' to the backend.
                // For simplicity, 'country' and 'actual username field' are not sent to backend schema.
                // If you need them, you'd extend your backend User model.
                body: JSON.stringify({ username: email, password, role: 'user' }), // Defaulting to 'user' role for registration
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Registration successful! Please log in.');
                // Optionally, clear form fields
                setEmail('');
                setPassword('');
                setAgreeTerms(false);
                // Automatically navigate to login page after a short delay
                setTimeout(() => {
                    if (onRegisterSuccess) {
                        onRegisterSuccess();
                    }
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please check server connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-white p-4">
            <Card className="shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Title as="h2" className="text-center mb-2">Purple</Card.Title>
                <Card.Text className="text-center text-muted mb-4">New here?<br />Signing up is easy, it only takes a few steps</Card.Text>
                <Form onSubmit={handleSubmit}>


                    {/* Email field (this will be sent as 'username' to backend) */}
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>



                    {/* Password field */}
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Terms & Conditions Checkbox */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            id="agreeTerms"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            label="I agree to all Terms & Conditions"
                        />
                    </Form.Group>

                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                        style={{ backgroundColor: '#8a2be2', borderColor: '#8a2be2' }} // Purple color
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
                                Signing Up...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                </Form>
                <Card.Text className="text-center text-muted mt-3">
                    Already have an account?
                    <Button type="button"
                        onClick={onGoToLogin}
                        className="btn btn-link p-0">
                        Login
                    </Button>
                </Card.Text>
            </Card>
        </Container>
    );
};

export default RegisterPage;
