// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Create and export AuthContext
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true); // Changed from 'loading' for clarity

  // Check for existing user in localStorage on first load
  useEffect(() => {
    const initialize = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ ...parsedUser, token: storedToken });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }), // Backend expects 'username'
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Auth context value
  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    initializing,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
