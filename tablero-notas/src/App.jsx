import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Users from './pages/Users';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tablero"
              element={
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}