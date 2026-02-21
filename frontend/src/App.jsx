import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import VehicleRegistry from './pages/VehicleRegistry';
import TripDispatcher from './pages/TripDispatcher';
import Maintenance from './pages/Maintenance';
import ExpenseFuel from './pages/ExpenseFuel';
import DriverProfiles from './pages/DriverProfiles';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

// Component to redirect logged-in users away from auth pages
function AuthRedirect({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <AuthRedirect>
            <LandingPage />
          </AuthRedirect>
        } />
        <Route path="/login" element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        } />
        <Route path="/signup" element={
          <AuthRedirect>
            <Signup />
          </AuthRedirect>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/vehicles" element={
          <ProtectedRoute>
            <VehicleRegistry />
          </ProtectedRoute>
        } />
        <Route path="/trips" element={
          <ProtectedRoute>
            <TripDispatcher />
          </ProtectedRoute>
        } />
        <Route path="/maintenance" element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <ExpenseFuel />
          </ProtectedRoute>
        } />
        <Route path="/drivers" element={
          <ProtectedRoute>
            <DriverProfiles />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}