import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import OperatorLayout from './layouts/OperatorLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Customer Pages
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import TripDetailPage from './pages/TripDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PassengerDetailsPage from './pages/PassengerDetailsPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import TicketPage from './pages/TicketPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BusManagement from './pages/admin/BusManagement';
import RouteManagement from './pages/admin/RouteManagement';
import StopManagement from './pages/admin/StopManagement';
import TripManagement from './pages/admin/TripManagement';
import BookingManagement from './pages/admin/BookingManagement';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';

// Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorBuses from './pages/operator/OperatorBuses';
import OperatorScheduleTrip from './pages/operator/OperatorScheduleTrip';
import OperatorTrips from './pages/operator/OperatorTrips';
import PassengerManifest from './pages/operator/PassengerManifest';

function PolicySupportPage() {
  return (
    <div className="w-full bg-brand-gray text-gray-800">
      <section className="bg-brand-darker text-white py-14 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
            BusMitra Customer Support &amp; Policies
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cancellation rules, luggage allowances &amp; how to reach us
          </h1>
          <p className="mt-3 text-sm text-gray-300 max-w-2xl leading-relaxed">
            Transparent travel conditions apply consistently across every route. Refund
            percentages are calculated automatically based on time remaining before departure.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div id="cancellation" className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Cancellation Refund Slabs</h2>
            <p className="text-xs text-gray-500">Instant automated refund credit to original payment method.</p>
          </div>

          <div className="divide-y divide-gray-200 text-sm">
            <div className="py-3.5 flex items-center justify-between">
              <span className="text-gray-700 font-medium">More than 24 hours before departure</span>
              <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                80% refund
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between">
              <span className="text-gray-700 font-medium">12 to 24 hours before departure</span>
              <span className="font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs">
                50% refund
              </span>
            </div>
            <div className="py-3.5 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Less than 12 hours before departure</span>
              <span className="font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs">
                No refund
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Luggage Guidelines</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every passenger ticket includes 1 free carry-on bag (up to 7 kg) plus 1 large stowed
              luggage item (up to 20 kg). Additional bags may be added prior to boarding for ₹150.
            </p>
          </div>
        </div>

        <div id="contact" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Contact 24/7 Support</h2>
              <p className="text-xs text-gray-500">
                Support runs 24 hours daily, including live boarding assistance at all major terminals.
              </p>
            </div>

            <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">Toll-Free Helpline</span>
                <span className="font-mono text-sm font-bold text-gray-900">1800 200 4455</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">Support Email</span>
                <span className="font-medium text-brand-dark">support@busmitra.in</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">WhatsApp Assistance</span>
                <span className="font-medium text-emerald-600">+91 98200 12345</span>
              </div>
            </div>
          </div>

          <Link
            to="/my-bookings"
            className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-xs transition-colors shadow-md"
          >
            Manage Your Bookings
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public & Customer Routes with Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/support" element={<PolicySupportPage />} />
          <Route path="/policy" element={<PolicySupportPage />} />
          <Route path="/track" element={<HomePage />} />

          {/* Authenticated Customer Routes */}
          <Route
            path="/trips/:tripId/seats"
            element={
              <ProtectedRoute>
                <SeatSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/passenger-details"
            element={
              <ProtectedRoute>
                <PassengerDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/confirm"
            element={
              <ProtectedRoute>
                <BookingConfirmPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/ticket/:bookingId"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Pages (Independent full screen) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Portal (Protected, role: admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="stops" element={<StopManagement />} />
          <Route path="trips" element={<TripManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        {/* Operator Portal (Protected, role: operator or admin) */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['operator', 'admin']}>
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/operator/dashboard" replace />} />
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="buses" element={<OperatorBuses />} />
          <Route path="schedule-trip" element={<OperatorScheduleTrip />} />
          <Route path="trips" element={<OperatorTrips />} />
          <Route path="trips/:tripId/manifest" element={<PassengerManifest />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
