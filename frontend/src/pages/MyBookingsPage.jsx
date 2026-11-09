import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { 
  Bus, Ticket, Search, AlertCircle, ChevronDown, ChevronUp, 
  MapPin, Calendar, Clock, XCircle, Printer, ArrowRight 
} from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchPnr, setSearchPnr] = useState('');
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  // Cancellation Modal state
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
      const res = await bookingApi.getMyBookings();
      const list = res.data?.bookings || res.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelModal = (booking, e) => {
    e.stopPropagation();
    setBookingToCancel(booking);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      const bookingId = bookingToCancel.id || bookingToCancel.booking_id;
      const res = await bookingApi.cancelBooking(bookingId, cancelReason);
      setSuccess(res.message || 'Booking has been cancelled successfully. Refund will be processed in 3-5 business days.');
      setCancelModalOpen(false);
      setBookingToCancel(null);
      // Refresh list
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchPnr.trim()) return true;
    const pnr = (b.pnr || b.PNR || `BM-${b.id}`).toLowerCase();
    return pnr.includes(searchPnr.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your bus reservations and tickets.</p>
          </div>

          <Link
            to="/search"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
          >
            Book New Ticket
          </Link>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

        {/* PNR Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={searchPnr}
            onChange={(e) => setSearchPnr(e.target.value)}
            placeholder="Search by PNR Number..."
            className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
          />
          {searchPnr && (
            <button
              onClick={() => setSearchPnr('')}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm">
            <LoadingSpinner text="Retrieving your bookings..." />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No bookings found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {searchPnr ? `No reservations matching "${searchPnr}"` : "You haven't booked any bus trips yet."}
            </p>
            <div>
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm"
              >
                Explore Buses Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const bookingId = booking.id || booking.booking_id;
              const pnr = booking.pnr || booking.PNR || `BM-${bookingId}`;
              const trip = booking.Trip || booking.trip || {};
              const bus = trip.Bus || trip.bus || booking.Bus || {};
              const route = trip.Route || trip.route || booking.Route || {};
              const passengers = booking.Passengers || booking.passengers || [];
              const isExpanded = expandedBookingId === bookingId;
              const isCancelled = String(booking.status).toUpperCase() === 'CANCELLED';

              return (
                <div
                  key={bookingId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-all"
                >
                  {/* Card Header row */}
                  <div
                    onClick={() => toggleExpand(bookingId)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                          PNR: {pnr}
                        </span>
                        <StatusBadge status={booking.status || 'CONFIRMED'} />
                      </div>

                      <div className="flex items-center space-x-3 text-base font-bold text-gray-900">
                        <span>{route.source || 'Origin'}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span>{route.destination || 'Destination'}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {trip.trip_date || trip.date || booking.travel_date || 'Upcoming'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {trip.departure_time || '08:00 AM'}
                        </span>
                        <span>•</span>
                        <span>{bus.name || 'Express'} ({bus.bus_type || 'AC'})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 sm:text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400 block">Total Fare</span>
                        <span className="text-lg font-black text-gray-900">
                          ₹{booking.total_fare || booking.fare_amount || 0}
                        </span>
                      </div>

                      <div className="text-gray-400 p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50/60 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                          <span className="font-semibold text-gray-400 uppercase">Boarding Point</span>
                          <p className="font-bold text-gray-900 text-sm">
                            {booking.boarding_point || route.source || 'Main Terminal'}
                          </p>
                          <p className="text-gray-500">Time: {trip.departure_time || '08:00 AM'}</p>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                          <span className="font-semibold text-gray-400 uppercase">Dropping Point</span>
                          <p className="font-bold text-gray-900 text-sm">
                            {booking.dropping_point || route.destination || 'City Center'}
                          </p>
                          <p className="text-gray-500">Time: {trip.arrival_time || '02:00 PM'}</p>
                        </div>
                      </div>

                      {/* Passengers Table */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Passengers ({passengers.length || booking.seat_numbers?.length || 1})
                        </h4>
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                              <tr>
                                <th className="py-2 px-3">Seat</th>
                                <th className="py-2 px-3">Passenger</th>
                                <th className="py-2 px-3">Age / Gender</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {passengers.length > 0 ? (
                                passengers.map((p, idx) => (
                                  <tr key={idx}>
                                    <td className="py-2.5 px-3 font-bold text-indigo-600">
                                      Seat {p.seat_number || p.seatNumber}
                                    </td>
                                    <td className="py-2.5 px-3 font-medium text-gray-900">{p.name}</td>
                                    <td className="py-2.5 px-3 text-gray-600 capitalize">
                                      {p.age} yrs • {p.gender}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3" className="py-2.5 px-3 text-gray-600 font-medium">
                                    Seats: {booking.seat_numbers?.join(', ') || 'Confirmed'}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <Link
                          to={`/booking/ticket/${bookingId}`}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-indigo-200"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View & Print E-Ticket</span>
                        </Link>

                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={(e) => handleOpenCancelModal(booking, e)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-red-200"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Booking</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Confirm Ticket Cancellation"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel booking with PNR{' '}
              <strong className="text-gray-900 font-mono">
                {bookingToCancel?.pnr || bookingToCancel?.PNR || `BM-${bookingToCancel?.id}`}
              </strong>
              ?
            </p>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 space-y-1">
              <p className="font-bold">Refund Policy Notice:</p>
              <p>As per the cancellation policy, a standard 10% fee may apply. The remaining amount will be refunded directly to your original payment method.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Change of travel plans, unexpected event..."
                rows="3"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
