// App.js
import React, { useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';

import { AuthProvider, useAuth } from './AuthProvider'; // Import AuthProvider + useAuth
import LoginPage from './auth/sign';
import RegisterPage from './auth/register';
import DashboardPage from './dashboard/home';
import DashboardLayout from './dashboard/layout';

const AppRouter = () => {
  const { user, initializing } = useAuth(); // using new 'initializing' flag
  const [showRegister, setShowRegister] = useState(false);

  if (initializing) {
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

  if (user) {
    return (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
      );
  }

  return showRegister ? (
    <RegisterPage
      onRegisterSuccess={() => setShowRegister(false)}
      onGoToLogin={() => setShowRegister(false)}
    />
  ) : (
    <LoginPage
      onGoToRegister={() => setShowRegister(true)}
    />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
