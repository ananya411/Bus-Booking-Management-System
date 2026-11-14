import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { resolveCityName, resolvePointName } from '../../utils/formatters';
import { Ticket, Search, Filter, Calendar, ChevronDown, ChevronUp, XCircle, Printer } from 'lucide-react';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [searchPnr, setSearchPnr] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Cancellation Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.getAllBookings();
      const list = res.data?.bookings || res.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancel = (booking, e) => {
    e.stopPropagation();
    setBookingToCancel(booking);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      const id = bookingToCancel.id || bookingToCancel.booking_id;
      await bookingApi.cancelBooking(id, cancelReason);
      setSuccess('Booking has been cancelled by admin.');
      setCancelModalOpen(false);
      setBookingToCancel(null);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all') {
      const bStatus = (b.status || 'confirmed').toLowerCase();
      if (bStatus !== statusFilter.toLowerCase()) return false;
    }
    if (searchPnr.trim()) {
      const q = searchPnr.toLowerCase();
      const pnr = (b.pnr || b.PNR || `BM-${b.id}`).toLowerCase();
      const email = (b.contact_email || b.user?.email || '').toLowerCase();
      const name = (b.user?.name || '').toLowerCase();
      if (!pnr.includes(q) && !email.includes(q) && !name.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Booking Management</h1>
          <p className="text-sm text-gray-500 mt-1">Audit passenger reservations, track cancellations, and oversee revenue.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 flex items-center w-full">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={searchPnr}
            onChange={(e) => setSearchPnr(e.target.value)}
            placeholder="Search by PNR, customer email, or passenger name..."
            className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Retrieving booking database..." />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <Ticket className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No bookings found matching current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">PNR</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Trip Route & Date</th>
                  <th className="py-3 px-4">Seat(s)</th>
                  <th className="py-3 px-4">Fare</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((b, bIdx) => {
                  const bookingId = b._id || b.id || b.booking_id || b.pnr || `booking-${bIdx}`;
                  const pnr = b.pnr || b.PNR || (b._id ? `BM-${String(b._id).slice(-6).toUpperCase()}` : `BM-${bIdx + 1}`);
                  const trip = b.Trip || b.trip || {};
                  const route = trip.Route || trip.route || b.Route || b.route || {};
                  const passengers = b.Passengers || b.passengers || [];
                  const isExpanded = expandedId === bookingId;
                  const isCancelled = String(b.status).toUpperCase() === 'CANCELLED';
                  const userDisplay = (typeof b.user === 'object' && b.user !== null ? (b.user.name || b.user.email) : null) || b.contact_name || b.contact_email || 'Passenger';
                  const userEmail = (typeof b.user === 'object' && b.user !== null ? b.user.email : null) || b.contact_email || '';
                  const seatsDisplay = passengers.length > 0
                    ? passengers.map((p) => (typeof p === 'object' ? (p.seat_number || p.seatNumber) : p)).filter(Boolean).join(', ')
                    : (Array.isArray(b.seat_numbers) ? b.seat_numbers.join(', ') : '1');

                  return (
                    <React.Fragment key={bookingId}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : bookingId)}
                        className="hover:bg-gray-50/50 cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                          {pnr}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900">{userDisplay}</p>
                          {userEmail && <p className="text-gray-500 text-[11px]">{userEmail}</p>}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-700">
                          <p className="font-semibold text-gray-900">
                            {resolveCityName(route.source, 'Origin')} → {resolveCityName(route.destination, 'Destination')}
                          </p>
                          <p className="text-gray-400 text-[11px]">{trip.trip_date || trip.travelDate || trip.date || 'Scheduled'}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-dark">
                          {seatsDisplay}
                        </td>
                        <td className="py-3.5 px-4 font-black text-gray-900">
                          ₹{b.total_fare || b.totalFare || b.fare_amount || 0}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={b.status || 'CONFIRMED'} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded View */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="bg-gray-50/80 p-5 border-t border-b border-gray-100">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <span className="font-bold text-gray-400 uppercase">Boarding Location:</span>
                                  <p className="font-semibold text-gray-900 mt-0.5">
                                    {resolvePointName(b.boardingPoint || b.boarding_point, 'Terminal Station')}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-400 uppercase">Dropping Location:</span>
                                  <p className="font-semibold text-gray-900 mt-0.5">
                                    {resolvePointName(b.droppingPoint || b.dropping_point, 'City Destination Hub')}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-400 uppercase">Contact Phone:</span>
                                  <p className="font-semibold text-gray-900 mt-0.5">
                                    {b.contact_phone || (typeof b.user === 'object' ? b.user?.phone : null) || 'N/A'}
                                  </p>
                                </div>
                              </div>

                              {/* Passengers list */}
                              <div>
                                <h4 className="font-bold text-gray-700 text-xs mb-1.5 uppercase">
                                  Manifest Passengers:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {passengers.map((p, pIdx) => (
                                    <span
                                      key={pIdx}
                                      className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                                    >
                                      Seat {p.seat_number || p.seatNumber || (pIdx + 1)}: {p.name || 'Passenger'} ({p.age || '—'}y, {p.gender || '—'})
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {!isCancelled && (
                                <div className="pt-2 flex justify-end">
                                  <button
                                    onClick={(e) => handleOpenCancel(b, e)}
                                    className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Force Admin Cancellation</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Force Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Admin Booking Cancellation"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to administratively cancel booking{' '}
            <strong className="text-gray-900 font-mono">
              {bookingToCancel?.pnr || bookingToCancel?.PNR || `BM-${bookingToCancel?.id}`}
            </strong>
            ? This will release reserved seats immediately.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Cancellation Reason for Logs *
            </label>
            <textarea
              required
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Bus breakdown, passenger requested via support..."
              rows="3"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
            >
              Close
            </button>
            <button
              type="button"
              disabled={cancelling}
              onClick={handleConfirmCancel}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
