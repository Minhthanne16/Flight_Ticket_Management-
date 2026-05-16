import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// --- Staff Pages ---
import StaffDashboard from '../pages/Staff/StaffDashboard';
import FlightSchedulePage from '../pages/Staff/FlightSchedulePage';
import BookingPage from '../pages/Staff/BookingPage';
import BookingDetailPage from '../pages/Staff/BookingDetailPage';
import WorkSchedulePage from '../pages/Staff/WorkSchedulePage';
import CustomerSupportPage from '../pages/Staff/CustomerSupportPage';
import ProfilePage from '../pages/Staff/ProfilePage';

// --- Customer Pages ---
import Homepage from '../pages/Customer/Homepage';
import SignIn from '../pages/Customer/SignIn';
import SignUp from '../pages/Customer/SignUp';

// --- Admin Pages ---
import AdminDashboard from '../pages/Admin/Dashboard';

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
          <Route path="work-schedule" element={<WorkSchedulePage />} />
          <Route path="customer-support" element={<CustomerSupportPage />} />
          <Route path="personal-info" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;