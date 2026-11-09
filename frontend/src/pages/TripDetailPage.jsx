import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Bus, Clock, MapPin, Calendar, Wifi, Zap, Coffee, ShieldCheck, 
  ArrowRight, Users, ChevronLeft, Sparkles 
} from 'lucide-react';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await tripApi.getTripById(tripId);
      const data = res.data?.trip || res.data || res;
      setTrip(data);
    } catch (err) {
      setError(err.message || 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Fetching trip information..." size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <ErrorMessage message={error || 'Trip not found'} />
        <div className="mt-4">
          <Link to="/search" className="text-indigo-600 font-semibold hover:underline flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const bus = trip.Bus || trip.bus || {};
  const route = trip.Route || trip.route || {};
  const stops = route.stops || route.Stops || trip.stops || [];
  const amenities = [
    { icon: <Wifi className="w-4 h-4 text-indigo-600" />, label: 'High Speed Wi-Fi' },
    { icon: <Zap className="w-4 h-4 text-indigo-600" />, label: 'Individual USB Charging' },
    { icon: <Coffee className="w-4 h-4 text-indigo-600" />, label: 'Complimentary Water Bottle' },
    { icon: <Sparkles className="w-4 h-4 text-indigo-600" />, label: 'Fresh Blanket & Pillow' },
    { icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />, label: 'Live GPS Vehicle Tracking' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Results
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Bus className="w-3.5 h-3.5" />
                <span>{bus.bus_type || 'AC Multi-Axle Sleeper'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {bus.name || 'Premium Express'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Vehicle No: <span className="font-semibold text-gray-800">{bus.bus_number || 'MH-12-AB-1234'}</span> • Operated by <span className="font-semibold text-gray-800">{bus.operator?.name || 'BusMitra Partner'}</span>
              </p>
            </div>

            <div className="flex flex-col md:items-end">
              <span className="text-xs text-gray-400">Starting Fare</span>
              <div className="text-3xl font-black text-indigo-600">
                ₹{trip.fare || trip.base_fare || 550}
              </div>
              <span className="text-xs text-emerald-600 font-semibold mt-1">
                {trip.available_seats ?? 24} seats left
              </span>
            </div>
          </div>

          {/* Schedule Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 items-center">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Departure</p>
                <p className="text-lg font-bold text-gray-900">{trip.departure_time || '08:00 AM'}</p>
                <p className="text-xs text-gray-600">{route.source || 'Source'}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-gray-400">Duration</span>
              <span className="text-sm font-bold text-gray-800 my-1">{trip.duration || route.duration || '6 hours'}</span>
              <div className="w-28 h-0.5 bg-indigo-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600" />
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:justify-end">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Arrival</p>
                <p className="text-lg font-bold text-gray-900">{trip.arrival_time || '02:00 PM'}</p>
                <p className="text-xs text-gray-600">{route.destination || 'Destination'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Details & Boarding Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>Journey Route & Major Stops</span>
            </h2>

            {/* Stops Timeline */}
            <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                <h4 className="font-bold text-gray-900">{route.source || 'Departure Origin'}</h4>
                <p className="text-xs text-gray-500">Scheduled Departure: {trip.departure_time || '08:00 AM'}</p>
              </div>

              {stops.map((stop, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-500" />
                  <h4 className="font-semibold text-gray-800">{stop.name || stop.stop_name || `Intermediate Halt ${i+1}`}</h4>
                  <p className="text-xs text-gray-500">Estimated Halt: {stop.time || `${i * 1.5 + 2} hrs from origin`}</p>
                </div>
              ))}

              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                <h4 className="font-bold text-gray-900">{route.destination || 'Final Destination'}</h4>
                <p className="text-xs text-gray-500">Expected Arrival: {trip.arrival_time || '02:00 PM'}</p>
              </div>
            </div>

            {/* Boarding & Dropping Points Note */}
            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">Boarding & Dropping Point Selection:</p>
              <p>You can choose your precise pick-up and drop-off locations in the upcoming passenger details step.</p>
            </div>
          </div>

          {/* Bus Amenities & Book Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Bus Amenities</h3>
              <div className="space-y-3">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-xs text-gray-700">
                    <div className="p-1.5 rounded-lg bg-indigo-50">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proceed to Seat Selection Button */}
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <div>
                <span className="text-xs text-indigo-200">Fare per person</span>
                <div className="text-2xl font-black">₹{trip.fare || trip.base_fare || 550}</div>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Choose your favorite window or aisle seat with real-time seat availability.
              </p>
              <Link
                to={`/trips/${tripId}/seats`}
                className="w-full block py-3 text-center bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all transform active:scale-95"
              >
                Proceed to Seat Selection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
