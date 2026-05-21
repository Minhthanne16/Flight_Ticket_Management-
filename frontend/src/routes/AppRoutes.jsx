import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import AdminLayout from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// --- Staff Pages ---
import StaffDashboard from '../pages/Staff/StaffDashboard';
import FlightSchedulePage from '../pages/Staff/FlightSchedulePage';
import BookingPage from '../pages/Staff/BookingPage';
import BookingDetailPage from '../pages/Staff/BookingDetailPage';
import PromotionPage from '../pages/Staff/PromotionPage';
import CustomerSupportPage from '../pages/Staff/CustomerSupportPage';
import ProfilePage from '../pages/Staff/ProfilePage';
import RegulationsPage from '../pages/Staff/RegulationsPage';

// --- Customer Pages ---
import Homepage from '../pages/Customer/Homepage';
import SignIn from '../pages/Customer/SignIn';
import SignUp from '../pages/Customer/SignUp';

// --- Admin Pages ---
import AdminDashboard from '../pages/Admin/Dashboard';
import FlightManage from '../pages/Admin/FlightManage';
import BookingManage from '../pages/Admin/BookingManage';
import AirportManage from '../pages/Admin/AirportManage';
import UserManage from '../pages/Admin/UserManage';
import RegulationManage from '../pages/Admin/RegulationManage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Customer Routes (Protected) */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Routes>
                <Route path="home" element={<Homepage />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Staff Routes (Protected) */}
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
          <Route path="promotion" element={<PromotionPage />} />
          <Route path="customer-support" element={<CustomerSupportPage />} />
          <Route path="personal-info" element={<ProfilePage />} />
          <Route path="regulations" element={<RegulationsPage />} />
        </Route>

        {/* Admin Routes (Protected) - với AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="flight-schedule" element={<FlightManage />} />
          <Route path="bookings" element={<BookingManage />} />
          <Route path="airports" element={<AirportManage />} />
          <Route path="staff" element={<UserManage />} />
          <Route path="regulations" element={<RegulationManage />} />
          {/* Redirect legacy paths */}
          <Route path="booking" element={<Navigate to="/admin/bookings" replace />} />
          <Route path="profile" element={<Navigate to="/admin/staff" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;