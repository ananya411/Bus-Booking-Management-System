import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Search,
  X,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Printer,
  Ban,
  ArrowRight
} from 'lucide-react';
import { bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { resolveCityName } from '../utils/formatters';
import Logo from './Logo';

export default function ManageBookingModal({ isOpen, onClose, onTrackBus }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [pnrInput, setPnrInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [myRecentBookings, setMyRecentBookings] = useState([]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMyBookings();
    }
    if (!isOpen) {
      setBooking(null);
      setError('');
      setPnrInput('');
      setEmailInput('');
    }
  }, [isOpen, isAuthenticated]);

  const fetchMyBookings = async () => {
    try {
      const res = await bookingApi.getMyBookings();
      const list = res.data?.bookings || res.data || [];
      if (Array.isArray(list)) {
        setMyRecentBookings(list.slice(0, 3));
      }
    } catch {
      // ignore silent error
    }
  };

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) {
      setError('Please enter your 8-character PNR or Booking ID');
      return;
    }

    setLoading(true);
    setError('');
    setBooking(null);

    const cleanPnr = pnrInput.trim().toUpperCase();

    try {
      const res = await bookingApi.getBookingByPnr(cleanPnr);
      if (res?.data?.booking || res?.data) {
        setBooking(res.data.booking || res.data);
      } else {
        throw new Error('Booking not found');
      }
    } catch (err) {
      // Check demo/fallback for presentation if backend mock PNR
      const demoBookings = {
        'BM782910': {
          _id: 'bm-demo-1',
          pnr: 'BM782910',
          status: 'confirmed',
          trip: {
            bus: { name: 'Royal Volvo Multi-Axle AC', busNumber: 'DL-01-AB-1234' },
            route: { source: 'Delhi', destination: 'Lucknow' },
            departureTime: '06:00 AM',
            arrivalTime: '02:15 PM',
            travelDate: new Date().toISOString()
          },
          seats: ['L4', 'L5'],
          passengerDetails: [
            { name: 'Aditya Sharma', age: 29, gender: 'male' },
            { name: 'Priya Sharma', age: 27, gender: 'female' }
          ],
          totalFare: 1850,
          createdAt: new Date().toISOString()
        },
        'BM449120': {
          _id: 'bm-demo-2',
          pnr: 'BM449120',
          status: 'confirmed',
          trip: {
            bus: { name: 'Scania AC Multi-Axle Sleeper', busNumber: 'MH-02-CD-5678' },
            route: { source: 'Mumbai', destination: 'Pune' },
            departureTime: '07:30 AM',
            arrivalTime: '11:00 AM',
            travelDate: new Date().toISOString()
          },
          seats: ['U2'],
          passengerDetails: [{ name: 'Rohan Deshmukh', age: 34, gender: 'male' }],
          totalFare: 450,
          createdAt: new Date().toISOString()
        }
      };

      if (demoBookings[cleanPnr]) {
        setBooking(demoBookings[cleanPnr]);
      } else {
        setError(err.message || 'No booking found matching this PNR. Please check and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (b) => {
    setBooking(b);
    setPnrInput(b.pnr || '');
  };

  const handleViewTicket = (bookingId) => {
    onClose();
    navigate(`/booking/ticket/${bookingId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-darker border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-800 flex items-center justify-between bg-brand-dark">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <h3 className="text-sm font-bold text-white">Manage My Booking</h3>
              <p className="text-[11px] text-gray-400">View ticket, download e-ticket, or track your bus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Lookup Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Booking Reference / PNR
                </label>
                <div className="relative">
                  <Ticket className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                    placeholder="e.g. BM782910"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-brand-accent transition-all"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Find Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="text-brand-accent font-semibold">Demo PNRs:</span>
              <button
                type="button"
                onClick={() => setPnrInput('BM782910')}
                className="underline hover:text-white transition-colors font-mono"
              >
                BM782910
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setPnrInput('BM449120')}
                className="underline hover:text-white transition-colors font-mono"
              >
                BM449120
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Found Card */}
          {booking && (
            <div className="bg-gray-900/90 border border-brand-accent/40 rounded-xl p-5 space-y-4 animate-fade-in shadow-xl">
              <div className="flex items-start justify-between pb-3 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase font-semibold">PNR:</span>
                    <span className="font-mono font-bold text-brand-accent text-sm tracking-wider">
                      {booking.pnr}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {booking.status || 'Confirmed'}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-base mt-1">
                    {booking.trip?.bus?.name || 'Luxury Express Coach'}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono">
                    Bus No: {booking.trip?.bus?.busNumber || 'DL-01-AB-1234'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Fare</span>
                  <span className="text-lg font-extrabold text-white">
                    ₹{booking.totalFare || booking.fare || 1850}
                  </span>
                </div>
              </div>

              {/* Route & Times */}
              <div className="grid grid-cols-2 gap-4 bg-black/40 p-3.5 rounded-lg border border-gray-800 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">From</span>
                  <p className="font-bold text-white text-sm">
                    {resolveCityName(booking.trip?.route?.source || booking.source, 'Delhi')}
                  </p>
                  <p className="text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{booking.trip?.departureTime || '06:00 AM'}</span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">To</span>
                  <p className="font-bold text-white text-sm">
                    {resolveCityName(booking.trip?.route?.destination || booking.destination, 'Lucknow')}
                  </p>
                  <p className="text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{booking.trip?.arrivalTime || '02:15 PM'}</span>
                  </p>
                </div>
              </div>

              {/* Seats & Passengers */}
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-300 pt-1">
                <div>
                  <span className="text-gray-400 mr-2">Seats:</span>
                  <span className="font-bold text-white bg-gray-800 px-2.5 py-1 rounded-md border border-gray-700">
                    {Array.isArray(booking.seats)
                      ? booking.seats.map((s) => s.seatNumber || s).join(', ')
                      : 'L4, L5'}
                  </span>
                </div>
                <div className="text-gray-400">
                  <span>Passengers: </span>
                  <span className="text-white font-medium">
                    {booking.passengerDetails?.length || 2} Passenger(s)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-800 flex flex-wrap gap-2 justify-end">
                {onTrackBus && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onTrackBus(booking.trip?.bus?.busNumber || 'DL-01-AB-1234');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-brand-accent border border-brand-accent/40 flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Track Live Bus</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleViewTicket(booking._id || 'bm-demo-1')}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-brand-dark flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View E-Ticket</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick links for logged-in users */}
          {isAuthenticated && myRecentBookings.length > 0 && !booking && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                Your Recent Bookings
              </h4>
              <div className="space-y-2">
                {myRecentBookings.map((b) => (
                  <div
                    key={b._id}
                    onClick={() => handleSelectRecent(b)}
                    className="p-3 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors group"
                  >
                    <div>
                      <span className="font-mono text-brand-accent font-bold">
                        {b.pnr}
                      </span>
                      <p className="text-white font-medium mt-0.5">
                        {resolveCityName(b.trip?.route?.source, 'Origin')} ➔ {resolveCityName(b.trip?.route?.destination, 'Destination')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">
                        {new Date(b.trip?.travelDate || b.createdAt).toLocaleDateString()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-accent transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-brand-dark border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span>Need cancellation assistance? Call 1800 200 4455</span>
          <button
            onClick={() => {
              onClose();
              navigate('/support');
            }}
            className="text-brand-accent hover:underline"
          >
            Cancellation Policy
          </button>
        </div>
      </div>
    </div>
  );
}

