import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../App'; // Import useAuth from App.js

const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [adminMessage, setAdminMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');

  // Function to fetch admin-only data
  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAdminMessage('No token found. Please log in.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/protected/admin-dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAdminMessage(data.message);
      } else {
        setAdminMessage(`Error: ${data.message || 'Failed to fetch admin data'}`);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setAdminMessage('Network error or server unavailable.');
    }
  };

  // Function to fetch user-only data
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUserMessage('No token found. Please log in.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/protected/user-dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUserMessage(data.message);
      } else {
        setUserMessage(`Error: ${data.message || 'Failed to fetch user data'}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserMessage('Network error or server unavailable.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData(); // Always try to fetch user data
      if (isAdmin) {
        fetchAdminData(); // Only fetch admin data if user is admin
      }
    }
  }, [user, isAdmin]); // Re-run when user or isAdmin status changes

  if (!user) {
    return <p className="text-center text-danger mt-4">You are not logged in. Please go to the login page.</p>;
  }

  return (
    <Container className="d-flex flex-column align-items-center min-vh-100 bg-light p-4">
      <Card className="shadow-sm p-4 mt-4" style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Title as="h2" className="text-center mb-4">Welcome, {user.username}!</Card.Title>
        <Card.Text className="text-center lead mb-4">Your role: <span className="fw-bold text-primary">{user.role}</span></Card.Text>

        {/* Conditional rendering based on role */}
        <div className="mt-4 pt-4 border-top">
          <h3 className="h4 mb-3">Role-Based Content:</h3>
          {isAdmin ? (
            <Alert variant="info" className="mb-4">
              <p className="fw-bold">Admin Content:</p>
              <p>You have full administrative privileges. You can manage users, settings, and all data.</p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle-fill me-2"></i>View all users</li>
                <li><i className="bi bi-check-circle-fill me-2"></i>Edit user roles</li>
                <li><i className="bi bi-check-circle-fill me-2"></i>Delete content</li>
              </ul>
              <p className="mt-2 fw-bold text-info">Admin Data from Backend: {adminMessage}</p>
            </Alert>
          ) : (
            <Alert variant="success" className="mb-4">
              <p className="fw-bold">User Content:</p>
              <p>You have standard user access. You can view your own data and perform basic operations.</p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle-fill me-2"></i>View your profile</li>
                <li><i className="bi bi-check-circle-fill me-2"></i>Update your password</li>
                <li><i className="bi bi-check-circle-fill me-2"></i>Access public resources</li>
              </ul>
            </Alert>
          )}
          <Alert variant="warning">
             <p className="mt-2 fw-bold text-warning">User Data from Backend: {userMessage}</p>
          </Alert>
        </div>

        <Button
          onClick={logout}
          variant="danger"
          className="w-100 mt-4"
        >
          Logout
        </Button>
      </Card>
    </Container>
  );
};

export default DashboardPage;
