import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

import UsersList from './pages/UsersList';
import MedicinesList from './pages/MedicinesList';
import Acknowledgements from './pages/Acknowledgements';
import UserAnalytics from './pages/UserAnalytics';
import Calculator from './pages/Calculator';
import QualityIssues from './pages/operations/QualityIssues';
import ExtemporaneousPrep from './pages/operations/ExtemporaneousPrep';
import ExpiryStock from './pages/operations/ExpiryStock';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="medicines" element={<MedicinesList />} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="users" element={<UsersList />} />
                <Route path="analytics" element={<UserAnalytics />} />
                <Route path="acknowledgements" element={<Acknowledgements />} />
                
                {/* Operations */}
                <Route path="operations/quality" element={<QualityIssues />} />
                <Route path="operations/extemporaneous" element={<ExtemporaneousPrep />} />
                <Route path="operations/stock" element={<ExpiryStock />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
