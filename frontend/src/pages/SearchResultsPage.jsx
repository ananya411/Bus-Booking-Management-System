import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { tripApi } from '../services/api';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Bus, Clock, MapPin, IndianRupee, Users, ArrowRight,
  SlidersHorizontal, Check, RefreshCw, AlertCircle,
} from 'lucide-react';

const G = {
  forest:     '#1a3a16',
  forestMid:  '#1e5219',
  forestLight:'#2d6b27',
  accent:     '#7db575',
  beige50:    '#faf7f0',
  beige100:   '#f5f0e8',
  beige200:   '#ede4d0',
  beige300:   '#e0d3b5',
  beigeDark:  '#a08c5b',
};

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [departureTimeRange, setDepartureTimeRange] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('departure_asc');

  useEffect(() => { fetchTrips(); }, [source, destination, date]);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await tripApi.searchTrips({ source, destination, date });
      const rawData = res.data?.trips || res.data || [];
      const tripList = Array.isArray(rawData) ? rawData : [];
      setTrips(tripList);
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
    setSelectedTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const busType = trip.Bus?.bus_type || trip.bus_type || trip.type || '';
      if (selectedTypes.length > 0) {
        const matchesType = selectedTypes.some((t) => busType.toLowerCase().includes(t.toLowerCase()));
        if (!matchesType) return false;
      }
      const fare = Number(trip.fare || trip.base_fare || 0);
      if (fare > maxPrice) return false;
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
      return timeA.localeCompare(timeB);
    });
  }, [trips, selectedTypes, maxPrice, departureTimeRange, sortBy]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: G.beige100 }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Route summary bar */}
        <div className="p-4 rounded-2xl shadow-sm border" style={{ background: '#fff', borderColor: G.beige200 }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 font-bold text-lg" style={{ color: G.forest }}>
              <span className="capitalize">{source || 'Any origin'}</span>
              <ArrowRight className="w-5 h-5" style={{ color: G.accent }} />
              <span className="capitalize">{destination || 'Any destination'}</span>
              <span className="text-sm font-normal px-3 py-1 rounded-full" style={{ background: G.beige100, color: G.beigeDark }}>{date}</span>
            </div>
            <div className="text-sm font-medium" style={{ color: G.beigeDark }}>
              Found <strong style={{ color: G.forestMid }}>{filteredTrips.length}</strong> buses
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Sidebar Filters */}
          <div className="p-6 rounded-2xl shadow-sm border space-y-6" style={{ background: '#fff', borderColor: G.beige200 }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: G.beige200 }}>
              <div className="flex items-center space-x-2 font-bold" style={{ color: G.forest }}>
                <SlidersHorizontal className="w-5 h-5" style={{ color: G.forestLight }} />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedTypes([]); setDepartureTimeRange('all'); setMaxPrice(3000); setSortBy('departure_asc'); }}
                className="text-xs font-semibold transition-colors"
                style={{ color: G.forestMid }}
                onMouseEnter={(e) => { e.currentTarget.style.color = G.forest; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = G.forestMid; }}
              >
                Reset All
              </button>
            </div>

            {/* Bus Type */}
            <div>
              <h4 className="text-sm font-bold mb-3" style={{ color: G.forest }}>Bus Type</h4>
              <div className="space-y-2">
                {['AC', 'Non-AC', 'Sleeper', 'Seater', 'Volvo', 'BharatBenz'].map((type) => (
                  <label key={type} className="flex items-center space-x-3 text-sm cursor-pointer" style={{ color: '#5a4d2e' }}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 rounded border"
                      style={{ accentColor: G.forestLight }}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <h4 className="text-sm font-bold mb-3" style={{ color: G.forest }}>Departure Time</h4>
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
                    className="w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between"
                    style={
                      departureTimeRange === slot.id
                        ? { background: '#f0f5ef', color: G.forestMid, fontWeight: 700, border: `1px solid ${G.accent}` }
                        : { color: '#7d6c42', background: 'transparent', border: '1px solid transparent' }
                    }
                    onMouseEnter={(e) => { if (departureTimeRange !== slot.id) e.currentTarget.style.background = G.beige50; }}
                    onMouseLeave={(e) => { if (departureTimeRange !== slot.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{slot.label}</span>
                    {departureTimeRange === slot.id && <Check className="w-3.5 h-3.5" style={{ color: G.forestLight }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold" style={{ color: G.forest }}>Max Fare</h4>
                <span className="text-sm font-bold" style={{ color: G.forestMid }}>₹{maxPrice}</span>
              </div>
              <input
                type="range" min="200" max="3500" step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: G.forestLight }}
              />
              <div className="flex justify-between text-[11px] mt-1" style={{ color: G.beigeDark }}>
                <span>₹200</span><span>₹3500</span>
              </div>
            </div>
          </div>

          {/* Bus List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort Toolbar */}
            <div className="p-3.5 rounded-xl shadow-sm border flex flex-wrap items-center justify-between gap-3 text-sm" style={{ background: '#fff', borderColor: G.beige200 }}>
              <span className="text-xs font-bold uppercase" style={{ color: G.beigeDark }}>Sort By:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'departure_asc', label: 'Departure (Earliest)' },
                  { id: 'fare_asc', label: 'Cheapest' },
                  { id: 'fare_desc', label: 'Highest Fare' },
                  { id: 'seats_desc', label: 'Seats Available' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={
                      sortBy === opt.id
                        ? { background: G.forestMid, color: '#fff', boxShadow: '0 2px 8px rgba(30,82,25,0.3)' }
                        : { background: G.beige100, color: '#5a4d2e' }
                    }
                    onMouseEnter={(e) => { if (sortBy !== opt.id) e.currentTarget.style.background = G.beige200; }}
                    onMouseLeave={(e) => { if (sortBy !== opt.id) e.currentTarget.style.background = G.beige100; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-6 rounded-2xl shadow-sm border animate-pulse flex flex-col md:flex-row justify-between gap-6" style={{ background: '#fff', borderColor: G.beige200 }}>
                    <div className="space-y-3 flex-1">
                      <div className="h-5 rounded w-1/3" style={{ background: G.beige200 }} />
                      <div className="h-4 rounded w-1/4" style={{ background: G.beige100 }} />
                      <div className="h-8 rounded w-1/2" style={{ background: G.beige200 }} />
                    </div>
                    <div className="w-32 h-10 rounded-xl" style={{ background: G.beige200 }} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredTrips.length === 0 && (
              <div className="rounded-2xl p-12 text-center border shadow-sm space-y-4" style={{ background: '#fff', borderColor: G.beige200 }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: '#f0f5ef', color: G.forestLight }}>
                  <Bus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: G.forest }}>No buses found for this route</h3>
                <p className="text-sm max-w-md mx-auto" style={{ color: '#7d6c42' }}>
                  We couldn't find any scheduled buses matching your criteria for {source} to {destination} on {date}. Try modifying your filters or selecting a different journey date.
                </p>
                <button
                  onClick={() => { setSelectedTypes([]); setDepartureTimeRange('all'); setMaxPrice(3500); }}
                  className="px-6 py-2.5 font-semibold rounded-xl text-sm transition-colors"
                  style={{ background: '#f0f5ef', color: G.forestMid }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#d6e8d3'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f0f5ef'; }}
                >
                  Clear Applied Filters
                </button>
              </div>
            )}

            {/* Bus Cards */}
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
                      className="rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group transition-all"
                      style={{ background: '#fff', borderColor: G.beige200 }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = G.accent; e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,107,39,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = G.beige200; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
                    >
                      {/* Left: Bus info & times */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold transition-colors group-hover:text-forest-600" style={{ color: G.forest }}>{busName}</h3>
                          <div className="flex items-center space-x-2 text-xs mt-0.5" style={{ color: G.beigeDark }}>
                            <span className="font-semibold" style={{ color: '#5a4d2e' }}>{operatorName}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded font-medium" style={{ background: G.beige100, color: '#5a4d2e' }}>{busType}</span>
                            {busNumber && <><span>•</span><span>{busNumber}</span></>}
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-center space-x-6">
                          <div>
                            <div className="text-xl font-extrabold" style={{ color: G.forest }}>{departure}</div>
                            <div className="text-xs font-medium" style={{ color: G.beigeDark }}>{route.source || source}</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-semibold" style={{ color: G.beigeDark }}>{duration}</span>
                            <div className="w-20 sm:w-28 h-0.5 relative my-1" style={{ background: G.beige200 }}>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: G.forestLight }} />
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: G.forestLight }} />
                            </div>
                            <span className="text-[10px] font-medium" style={{ color: '#16a34a' }}>Direct</span>
                          </div>
                          <div>
                            <div className="text-xl font-extrabold" style={{ color: G.forest }}>{arrival}</div>
                            <div className="text-xs font-medium" style={{ color: G.beigeDark }}>{route.destination || destination}</div>
                          </div>
                        </div>

                        {/* Seats & Details */}
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="font-semibold flex items-center" style={{ color: availableSeats < 5 ? '#dc2626' : '#16a34a' }}>
                            <Users className="w-3.5 h-3.5 mr-1" />{availableSeats} seats left
                          </span>
                          <span style={{ color: G.beige200 }}>•</span>
                          <Link to={`/trips/${tripId}`} className="font-medium hover:underline" style={{ color: G.forestMid, textDecoration: 'none' }}>View Trip Details</Link>
                        </div>
                      </div>

                      {/* Right: Fare & CTA */}
                      <div className="w-full md:w-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3" style={{ borderColor: G.beige200 }}>
                        <div className="text-left md:text-right">
                          <span className="text-xs block" style={{ color: G.beigeDark }}>Per Seat</span>
                          <div className="text-2xl font-black" style={{ color: G.forestMid }}>₹{fare}</div>
                        </div>
                        <Link
                          to={`/trips/${tripId}/seats`}
                          className="px-6 py-2.5 font-semibold rounded-xl text-sm text-center whitespace-nowrap transition-all transform active:scale-95"
                          style={{ background: G.forestMid, color: '#fff', textDecoration: 'none', boxShadow: '0 3px 10px rgba(30,82,25,0.25)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = G.forest; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = G.forestMid; }}
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
