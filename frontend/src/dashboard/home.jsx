import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../AuthProvider'; // Import useAuth from App.js

// Define the backend URL from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth(); // Removed logout as it's handled by layout
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
      const response = await fetch(`${BACKEND_URL}/api/protected/admin-dashboard`, { // Use BACKEND_URL
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
      const response = await fetch(`${BACKEND_URL}/api/protected/user-dashboard`, { // Use BACKEND_URL
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
    // This case should ideally not be reached if AppRouter handles redirection
    return <p className="text-center text-danger mt-4">You are not logged in. Please go to the login page.</p>;
  }

  return (
    // IMPORTANT: This component should NOT have its own Container, min-vh-100, or full-width Card wrappers.
    // It should only contain the content you want to display INSIDE the dashboard layout.
    <>
      {/* Example Dashboard Content - You can replace this with your actual dashboard widgets */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome, {user.username}!</h2>
      <p className="text-center text-lg text-gray-600 mb-4">Your role: <span className="font-semibold text-indigo-600">{user.role}</span></p>

      {/* Conditional rendering based on role */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Role-Based Content:</h3>
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

      {/* Logout button is now in DashboardLayout */}
    </>
  );
};

export default DashboardPage;
