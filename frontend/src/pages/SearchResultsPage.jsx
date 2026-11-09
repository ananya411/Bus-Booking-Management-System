import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { tripApi } from '../services/api';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Bus, Clock, MapPin, IndianRupee, Users, ArrowRight, 
  Filter, SlidersHorizontal, Check, RefreshCw, AlertCircle 
} from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [departureTimeRange, setDepartureTimeRange] = useState('all'); // all, morning, afternoon, evening, night
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('departure_asc'); // departure_asc, fare_asc, seats_desc

  useEffect(() => {
    fetchTrips();
  }, [source, destination, date]);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await tripApi.searchTrips({ source, destination, date });
      // Response structure could be res.data.trips or res.data
      const rawData = res.data?.trips || res.data || [];
      const tripList = Array.isArray(rawData) ? rawData : [];
      setTrips(tripList);

      // Dynamically calculate max fare from results
      if (tripList.length > 0) {
        const highestFare = Math.max(...tripList.map((t) => Number(t.fare || t.base_fare || 1500)));
        if (highestFare > 0) setMaxPrice(Math.ceil(highestFare * 1.2));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch available buses');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filter & Sort Logic
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Filter by bus type
      const busType = trip.Bus?.bus_type || trip.bus_type || trip.type || '';
      if (selectedTypes.length > 0) {
        const matchesType = selectedTypes.some((t) =>
          busType.toLowerCase().includes(t.toLowerCase())
        );
        if (!matchesType) return false;
      }

      // Filter by price
      const fare = Number(trip.fare || trip.base_fare || 0);
      if (fare > maxPrice) return false;

      // Filter by departure time range
      if (departureTimeRange !== 'all') {
        const depTime = trip.departure_time || trip.departureTime || '00:00';
        const hour = parseInt(depTime.split(':')[0], 10);
        if (departureTimeRange === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (departureTimeRange === 'afternoon' && (hour < 12 || hour >= 17)) return false;
        if (departureTimeRange === 'evening' && (hour < 17 || hour >= 21)) return false;
        if (departureTimeRange === 'night' && (hour < 21 && hour >= 6)) return false;
      }

      return true;
    }).sort((a, b) => {
      const fareA = Number(a.fare || a.base_fare || 0);
      const fareB = Number(b.fare || b.base_fare || 0);
      const seatsA = Number(a.available_seats ?? a.availableSeats ?? 0);
      const seatsB = Number(b.available_seats ?? b.availableSeats ?? 0);
      const timeA = a.departure_time || a.departureTime || '';
      const timeB = b.departure_time || b.departureTime || '';

      if (sortBy === 'fare_asc') return fareA - fareB;
      if (sortBy === 'fare_desc') return fareB - fareA;
      if (sortBy === 'seats_desc') return seatsB - seatsA;
      if (sortBy === 'departure_desc') return timeB.localeCompare(timeA);
      return timeA.localeCompare(timeB); // departure_asc
    });
  }, [trips, selectedTypes, maxPrice, departureTimeRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top search modification bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-gray-900 font-bold text-lg">
              <span className="capitalize">{source || 'Any origin'}</span>
              <ArrowRight className="w-5 h-5 text-indigo-500" />
              <span className="capitalize">{destination || 'Any destination'}</span>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Found <strong className="text-indigo-600">{filteredTrips.length}</strong> buses
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Main Grid: Filters + Trip list */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2 text-gray-900 font-bold">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTypes([]);
                  setDepartureTimeRange('all');
                  setMaxPrice(3000);
                  setSortBy('departure_asc');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Bus Type Filter */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Bus Type</h4>
              <div className="space-y-2">
                {['AC', 'Non-AC', 'Sleeper', 'Seater', 'Volvo', 'BharatBenz'].map((type) => (
                  <label key={type} className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time Range */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Departure Time</h4>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Any Time' },
                  { id: 'morning', label: 'Morning (6 AM - 12 PM)' },
                  { id: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
                  { id: 'evening', label: 'Evening (5 PM - 9 PM)' },
                  { id: 'night', label: 'Night (9 PM - 6 AM)' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDepartureTimeRange(slot.id)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                      departureTimeRange === slot.id
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{slot.label}</span>
                    {departureTimeRange === slot.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-gray-900">Max Fare</h4>
                <span className="text-sm font-bold text-indigo-600">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="3500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹200</span>
                <span>₹3500</span>
              </div>
            </div>
          </div>

          {/* Right Bus List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort toolbar */}
            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase">Sort By:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'departure_asc', label: 'Departure (Earliest)' },
                  { id: 'fare_asc', label: 'Cheapest' },
                  { id: 'fare_desc', label: 'Highest Fare' },
                  { id: 'seats_desc', label: 'Seats Available' },
                ].map((sortOption) => (
                  <button
                    key={sortOption.id}
                    onClick={() => setSortBy(sortOption.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sortBy === sortOption.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading state skeleton */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-32 h-10 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredTrips.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                  <Bus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No buses found for this route</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  We couldn't find any scheduled buses matching your criteria for {source} to {destination} on {date}. Try modifying your filters or selecting a different journey date.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setDepartureTimeRange('all');
                      setMaxPrice(3500);
                    }}
                    className="px-6 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Clear Applied Filters
                  </button>
                </div>
              </div>
            )}

            {/* Bus Cards List */}
            {!loading && filteredTrips.length > 0 && (
              <div className="space-y-4">
                {filteredTrips.map((trip) => {
                  const tripId = trip.trip_id || trip.id;
                  const bus = trip.Bus || trip.bus || {};
                  const route = trip.Route || trip.route || {};
                  const busName = bus.name || bus.bus_name || trip.bus_name || 'Express Line';
                  const busNumber = bus.bus_number || trip.bus_number || '';
                  const busType = bus.bus_type || trip.bus_type || 'AC Semi-Sleeper';
                  const departure = trip.departure_time || trip.departureTime || '08:00';
                  const arrival = trip.arrival_time || trip.arrivalTime || '14:00';
                  const duration = trip.duration || route.duration || '6h';
                  const fare = trip.fare || trip.base_fare || 500;
                  const availableSeats = trip.available_seats ?? trip.availableSeats ?? 24;
                  const operatorName = bus.operator?.name || trip.operator_name || 'BusMitra Partner';

                  return (
                    <div
                      key={tripId}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
                    >
                      {/* Left: Operator & Times */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between md:justify-start md:space-x-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {busName}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                              <span className="font-medium text-gray-700">{operatorName}</span>
                              <span>•</span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                                {busType}
                              </span>
                              {busNumber && (
                                <>
                                  <span>•</span>
                                  <span>{busNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Schedule & Route display */}
                        <div className="flex items-center space-x-6">
                          <div>
                            <div className="text-xl font-extrabold text-gray-900">{departure}</div>
                            <div className="text-xs text-gray-500 font-medium">{route.source || source}</div>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-semibold text-gray-400">{duration}</span>
                            <div className="w-20 sm:w-28 h-0.5 bg-gray-200 relative my-1">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            </div>
                            <span className="text-[10px] text-emerald-600 font-medium">Direct</span>
                          </div>

                          <div>
                            <div className="text-xl font-extrabold text-gray-900">{arrival}</div>
                            <div className="text-xs text-gray-500 font-medium">{route.destination || destination}</div>
                          </div>
                        </div>

                        {/* Features / Seats remaining */}
                        <div className="flex items-center space-x-4 text-xs">
                          <span
                            className={`font-semibold ${
                              availableSeats < 5 ? 'text-red-600' : 'text-emerald-700'
                            } flex items-center`}
                          >
                            <Users className="w-3.5 h-3.5 mr-1" />
                            {availableSeats} seats left
                          </span>
                          <span className="text-gray-300">•</span>
                          <Link
                            to={`/trips/${tripId}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                          >
                            View Trip Details
                          </Link>
                        </div>
                      </div>

                      {/* Right: Fare & Action */}
                      <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3">
                        <div className="text-left md:text-right">
                          <span className="text-xs text-gray-400 block">Per Seat</span>
                          <div className="text-2xl font-black text-gray-900 text-indigo-600">
                            ₹{fare}
                          </div>
                        </div>

                        <Link
                          to={`/trips/${tripId}/seats`}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/20 transition-all transform active:scale-95 text-center whitespace-nowrap"
                        >
                          Select Seats
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
