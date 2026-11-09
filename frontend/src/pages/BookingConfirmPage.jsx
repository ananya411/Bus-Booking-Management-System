import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Bus, Clock, MapPin, Calendar, CreditCard, ShieldCheck, 
  User, CheckCircle2, AlertCircle, ChevronLeft, Lock 
} from 'lucide-react';

export default function BookingConfirmPage() {
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi, netbanking

  useEffect(() => {
    const raw = sessionStorage.getItem('bbms_booking');
    if (!raw) {
      navigate('/search');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.passengers || parsed.passengers.length === 0) {
        navigate(`/trips/${parsed.tripId}/seats`);
        return;
      }
      setBookingData(parsed);
    } catch (e) {
      navigate('/search');
    }
  }, [navigate]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Loading booking summary..." />
      </div>
    );
  }

  const { tripDetails, passengers, contact, boardingPoint, droppingPoint, totalFare, farePerSeat, tripId, selectedSeats } = bookingData;
  const bus = tripDetails?.Bus || tripDetails?.bus || {};
  const route = tripDetails?.Route || tripDetails?.route || {};

  const handleConfirmAndPay = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Prepare payload adhering to standard booking structure
      const payload = {
        trip_id: tripId,
        seats: selectedSeats,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: parseInt(p.age, 10),
          gender: p.gender,
          seat_number: p.seat_number,
        })),
        contact_email: contact.email,
        contact_phone: contact.phone,
        boarding_point: boardingPoint,
        dropping_point: droppingPoint,
        fare_amount: totalFare,
        total_fare: totalFare,
        payment_method: paymentMethod,
      };

      const res = await bookingApi.createBooking(payload);
      const createdBooking = res.data?.booking || res.data || res;
      const bookingId = createdBooking.id || createdBooking.booking_id || createdBooking.pnr || 'BK' + Date.now();

      // Clear the temporary booking draft
      sessionStorage.removeItem('bbms_booking');

      // Navigate to digital ticket page
      navigate(`/booking/ticket/${bookingId}`, {
        state: { booking: createdBooking },
      });
    } catch (err) {
      setError(err.message || 'Payment or seat reservation failed. The seat might have been taken. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Passenger Details
        </button>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Review & Confirm Booking</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please verify all journey information before completing simulated payment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Main Details (Left 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Trip summary card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{bus.name || 'Express Bus'}</h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {bus.bus_type || 'AC Seater/Sleeper'} • {bus.bus_number || ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">Seats</span>
                  <p className="text-sm font-bold text-indigo-600">{selectedSeats.join(', ')}</p>
                </div>
              </div>

              {/* Route & Times */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-gray-400 font-semibold uppercase">Departure</span>
                  <p className="font-bold text-gray-900 text-sm">{tripDetails?.departure_time || '08:00 AM'}</p>
                  <p className="text-gray-600">{route.source || 'Origin'}</p>
                  <p className="text-indigo-600 font-medium truncate">Boarding: {boardingPoint}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-gray-400 font-semibold uppercase">Arrival</span>
                  <p className="font-bold text-gray-900 text-sm">{tripDetails?.arrival_time || '02:00 PM'}</p>
                  <p className="text-gray-600">{route.destination || 'Destination'}</p>
                  <p className="text-indigo-600 font-medium truncate">Dropping: {droppingPoint}</p>
                </div>
              </div>
            </div>

            {/* Passenger table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Passenger Information</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Seat</th>
                      <th className="py-2.5 px-3">Passenger Name</th>
                      <th className="py-2.5 px-3">Age</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {passengers.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3 font-bold text-indigo-600">{p.seat_number}</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">{p.name}</td>
                        <td className="py-3 px-3 text-gray-600">{p.age} yrs</td>
                        <td className="py-3 px-3 capitalize text-gray-600">{p.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Contact confirmation */}
              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-4">
                <div>
                  <span className="font-medium text-gray-400">Confirmation Sent To: </span>
                  <span className="font-semibold text-gray-800">{contact.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400">Mobile SMS: </span>
                  <span className="font-semibold text-gray-800">{contact.phone}</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Simulated Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'upi', label: 'UPI / QR Code' },
                  { id: 'netbanking', label: 'Net Banking' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMethod(mode.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      paymentMethod === mode.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{mode.label}</span>
                      {paymentMethod === mode.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-gray-400">
                🔒 Testing Mode: No real funds will be deducted. Clicking Confirm & Pay will simulate an approved transaction.
              </p>
            </div>
          </div>

          {/* Right Summary / Pay Action */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h3 className="text-base font-bold text-gray-900">Fare Breakdown</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Base Fare ({passengers.length} × ₹{farePerSeat})</span>
                <span className="font-semibold text-gray-800">₹{totalFare}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST & Service Taxes</span>
                <span className="font-semibold text-emerald-600">Included</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Instant Online Discount</span>
                <span className="font-semibold text-emerald-600">-₹0</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="text-2xl font-black text-indigo-600">₹{totalFare}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAndPay}
              disabled={submitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" text="" className="py-0 mr-2 text-white" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Pay ₹{totalFare}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-gray-400 text-center space-y-1">
              <p>Safe & Encrypted 256-bit Connection</p>
              <p>Instant SMS & Email Confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
