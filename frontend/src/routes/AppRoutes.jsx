import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { STAFF_USER } from '../data/sharedData';

import StaffDashboard from '../pages/Staff/StaffDashboard';
import FlightSchedulePage from '../pages/Staff/FlightSchedulePage';
import BookingPage from '../pages/Staff/BookingPage';
import BookingDetailPage from '../pages/Staff/BookingDetailPage';
import WorkSchedulePage from '../pages/Staff/WorkSchedulePage';
import CustomerSupportPage from '../pages/Staff/CustomerSupportPage';
import ProfilePage from '../pages/Staff/ProfilePage';

function AppRoutes() {
  useEffect(() => {
    // Tự động gán quyền STAFF khi chạy ở localhost
    if (window.location.hostname === 'localhost') {
      localStorage.setItem('user', JSON.stringify({
        role: 'STAFF',
        name: STAFF_USER.name,
        fullName: STAFF_USER.fullName,
        email: STAFF_USER.email,
        department: STAFF_USER.department,
      }));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/staff/dashboard" replace />} />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="flight-schedule" element={<FlightSchedulePage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="booking/:id" element={<BookingDetailPage />} />
          <Route path="work-schedule" element={<WorkSchedulePage />} />
          <Route path="customer-support" element={<CustomerSupportPage />} />
          <Route path="personal-info" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;