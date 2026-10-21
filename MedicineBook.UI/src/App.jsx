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
import References from './pages/references';
import Announcements from './pages/Announcements';
import AdminConfig from './pages/AdminConfig';
import BugDrugNavigator from './pages/BugDrugNavigator';

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
                <Route path="spectra" element={<BugDrugNavigator />} />
                <Route path="bug-drug-navigator" element={<BugDrugNavigator />} />
                <Route path="bug-drug" element={<BugDrugNavigator />} />
                <Route path="antibiogram" element={<BugDrugNavigator />} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="users" element={<UsersList />} />
                <Route path="analytics" element={<UserAnalytics />} />
                <Route path="acknowledgements" element={<Acknowledgements />} />
                <Route path="references" element={<References />} />
                
                {/* Operations & Preparations */}
                <Route path="operations/quality" element={<QualityIssues />} />
                <Route path="magistral" element={<ExtemporaneousPrep />} />
                <Route path="operations/magistral" element={<ExtemporaneousPrep />} />
                <Route path="operations/extemporaneous" element={<ExtemporaneousPrep />} />
                <Route path="extemporaneous" element={<ExtemporaneousPrep />} />
                <Route path="extemporaneous-preparations" element={<ExtemporaneousPrep />} />
                <Route path="operations/stock" element={<ExpiryStock />} />

                <Route path="announcements" element={<Announcements />} />
                
                {/* Admin System Config */}
                <Route path="config" element={<AdminConfig />} />
                <Route path="admin/config" element={<AdminConfig />} />
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
