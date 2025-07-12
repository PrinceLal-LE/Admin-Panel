import React, { createContext, useContext, useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap'; // Keep necessary react-bootstrap imports for App.js
import LoginPage from './auth/sign'; // Import the new LoginPage component
import DashboardPage from './dashboard/home'; // Import the new DashboardPage component

// User Context for managing global user state and roles
export const AuthContext = createContext(null); // Export AuthContext
// Custom hook to use the AuthContext
export const useAuth = () => { // Export useAuth
  return useContext(AuthContext);
};

// AuthProvider component to wrap the application
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user object { id, username, role, token }
  const [loading, setLoading] = useState(true); // To manage initial loading state

  useEffect(() => {
    // On initial load, check for a token in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Set loading to false after initial loading
  }, []);

  // Function to handle user login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }), // Backend expects 'username'
      });

      const data = await response.json();

      if (response.ok) { // Check if the response status is 2xx
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        // If response is not ok, it means there was an error from the backend
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred. Please check server connection.' };
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after initial loading */}
    </AuthContext.Provider>
  );
};

// Simple Router component
const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-primary fs-4 fw-bold">
          <Spinner animation="border" role="status" className="me-2">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          Loading authentication...
        </div>
      </Container>
    );
  }

  // If user is logged in, show Dashboard, otherwise show Login
  return user ? <DashboardPage /> : <LoginPage />;
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
