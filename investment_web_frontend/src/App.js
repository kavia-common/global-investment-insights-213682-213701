import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './components/ui.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import AppLayout from './layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Suggestions from './pages/Suggestions';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';

// PUBLIC_INTERFACE
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/onboarding"
                element={
                  <AppLayout>
                    <Onboarding />
                  </AppLayout>
                }
              />
              <Route
                path="/"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/suggestions"
                element={
                  <AppLayout>
                    <Suggestions />
                  </AppLayout>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <AppLayout>
                    <Portfolio />
                  </AppLayout>
                }
              />
              <Route
                path="/pricing"
                element={
                  <AppLayout>
                    <Pricing />
                  </AppLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                }
              />
            </Route>
            <Route
              path="*"
              element={
                <div className="container">
                  <h1>404 - Not Found</h1>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
