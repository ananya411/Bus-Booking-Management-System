import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import Logo from '../components/Logo';
import { 
  Bus, Printer, Ticket, CheckCircle2, MapPin, Calendar, 
  Clock, User, ArrowRight, Share2 
} from 'lucide-react';

export default function TicketPage() {
  const { bookingId } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      // Check if bookingId looks like a PNR or numerical ID
      if (isNaN(bookingId)) {
        res = await bookingApi.getBookingByPnr(bookingId).catch(() => bookingApi.getBookingById(bookingId));
      } else {
        res = await bookingApi.getBookingById(bookingId);
      }
      const data = res.data?.booking || res.data || res;
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Generating your electronic ticket..." size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <ErrorMessage message={error || 'Ticket could not be found'} />
        <div className="mt-4">
          <Link to="/my-bookings" className="text-brand-accent font-bold hover:underline">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const resolveText = (val, fallback = '') => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val.city || val.name || fallback;
    return String(val);
  };

  const pnr = booking.pnr || booking.PNR || booking.booking_number || `BM-${booking.id || '987654'}`;
  const trip = booking.Trip || booking.trip || {};
  const bus = trip.Bus || trip.bus || booking.Bus || {};
  const route = trip.Route || trip.route || booking.Route || {};
  const passengers = booking.Passengers || booking.passengers || [];
  const status = booking.status || 'CONFIRMED';
  const totalFare = booking.total_fare || booking.fare_amount || booking.amount || 0;
  
  const sourceName = resolveText(route.source, 'Origin City');
  const destName = resolveText(route.destination, 'Destination City');
  const boarding = resolveText(booking.boarding_point || booking.boardingPoint || route.source, 'Main Station');
  const dropping = resolveText(booking.dropping_point || booking.droppingPoint || route.destination, 'City Terminal');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top actions (Hidden in print) */}
        <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Booking Confirmed Successfully!</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark text-sm font-extrabold rounded-xl flex items-center space-x-2 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <Link
              to="/my-bookings"
              className="px-4 py-2 bg-brand-dark hover:bg-brand-dark-card border border-gray-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* The Printable E-Ticket Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-gray-800">
          {/* Header Banner with Official BusMitra Branding */}
          <div className="bg-gradient-to-r from-brand-darker via-brand-dark to-[#0A261D] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-accent/30">
            <div>
              <Logo className="h-12 sm:h-14 w-auto" />
              <p className="text-[11px] text-gray-300 mt-1.5 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
                <span>Official Electronic Passenger Ticket</span>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-gray-400 uppercase font-semibold block">PNR Reference</span>
              <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-brand-accent">
                {pnr}
              </div>
              <div className="mt-1">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Journey Details Bar */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departure Point</span>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{sourceName}</p>
                <p className="text-xs text-gray-600 font-medium mt-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent mr-1" />
                  {boarding}
                </p>
                <p className="text-xs text-brand-accent font-bold mt-1">
                  Time: {trip.departure_time || '08:00 AM'}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-center">
                <Bus className="w-5 h-5 text-brand-accent mb-1" />
                <div className="w-24 h-0.5 bg-brand-accent/40 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-accent" />
                </div>
                <span className="text-[10px] text-gray-400 mt-1">Direct Bus</span>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Arrival Destination</span>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{destName}</p>
                <p className="text-xs text-gray-600 font-medium mt-1 flex items-center sm:justify-end">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent mr-1" />
                  {dropping}
                </p>
                <p className="text-xs text-brand-accent font-bold mt-1">
                  Time: {trip.arrival_time || '02:00 PM'}
                </p>
              </div>
            </div>

            {/* Bus & Operator Specifics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-xs">
              <div>
                <span className="text-gray-400 font-medium">Bus Name</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{bus.name || 'Express Service'}</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Bus Type</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{bus.bus_type || 'AC Semi-Sleeper'}</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Vehicle Reg No.</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{bus.bus_number || 'DL-01-AB-1234'}</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Travel Date</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{trip.trip_date || trip.date || 'Today'}</p>
              </div>
            </div>

            {/* Passenger Table */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Passenger & Seat Details</h4>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Seat No.</th>
                      <th className="py-2.5 px-4">Passenger Name</th>
                      <th className="py-2.5 px-4">Age / Gender</th>
                      <th className="py-2.5 px-4 text-right">Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {passengers.length > 0 ? (
                      passengers.map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-black text-brand-dark">
                            Seat {p.seat_number || p.seatNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">
                            {p.age} yrs • {p.gender}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            ₹{p.fare || (totalFare / (passengers.length || 1)).toFixed(0)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                          {booking.seat_numbers?.join(', ') || 'Seats confirmed'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Fare & Terms */}
            <div className="border-t border-dashed border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-semibold text-gray-700">Important Guidelines:</p>
                <p>• Please report at the boarding point 15 minutes before scheduled departure.</p>
                <p>• Carry a valid government photo ID along with this e-ticket copy.</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Total Amount Paid</span>
                <span className="text-2xl font-black text-brand-dark">₹{totalFare}</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">Payment Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="no-print text-center pt-2">
          <Link
            to="/my-bookings"
            className="text-sm font-semibold text-brand-dark hover:text-brand-accent transition-colors"
          >
            ← Back to all bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
