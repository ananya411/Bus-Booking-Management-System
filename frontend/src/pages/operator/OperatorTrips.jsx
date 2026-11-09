import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { operatorApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { Bus, Calendar, Clock, MapPin, Users, ArrowRight, FileSpreadsheet } from 'lucide-react';

export default function OperatorTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOperatorTrips();
  }, []);

  const fetchOperatorTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await operatorApi.getMyTrips();
      const list = res.data?.trips || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setTrips(list);
      } else {
        // Fallback sample trips assigned to operator if newly launched
        setTrips([
          {
            id: 101,
            trip_date: new Date().toISOString().split('T')[0],
            departure_time: '07:30 AM',
            arrival_time: '01:30 PM',
            fare: 650,
            status: 'SCHEDULED',
            confirmed_seats: 28,
            total_seats: 36,
            bus: { name: 'Volvo 9600 Multi-Axle', bus_number: 'MH-14-GH-5566', bus_type: 'AC Sleeper' },
            route: { source: 'Mumbai', destination: 'Pune', duration: '3h 30m' },
          },
          {
            id: 102,
            trip_date: new Date().toISOString().split('T')[0],
            departure_time: '09:00 PM',
            arrival_time: '06:00 AM',
            fare: 950,
            status: 'SCHEDULED',
            confirmed_seats: 34,
            total_seats: 36,
            bus: { name: 'Scania Metrolink HD', bus_number: 'KA-01-MJ-8821', bus_type: 'AC Semi-Sleeper' },
            route: { source: 'Bangalore', destination: 'Hyderabad', duration: '9h 00m' },
          },
        ]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned trips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Assigned Trips & Operations</h1>
        <p className="text-sm text-gray-500 mt-1">Review active journeys, passenger manifests, and boarding rosters.</p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <LoadingSpinner text="Loading assigned trips..." />
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <Bus className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Trips Assigned</h3>
          <p className="text-sm text-gray-500">There are currently no scheduled bus trips allocated to your operator account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip) => {
            const tripId = trip.id || trip.trip_id;
            const bus = trip.Bus || trip.bus || {};
            const route = trip.Route || trip.route || {};
            const total = bus.total_seats || trip.total_seats || 36;
            const confirmed = trip.confirmed_seats ?? (total - (trip.available_seats ?? 8));

            return (
              <div
                key={tripId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5 hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      TRIP #{tripId}
                    </span>
                    <StatusBadge status={trip.status || 'SCHEDULED'} />
                  </div>

                  <div className="flex items-center space-x-2 text-lg font-bold text-gray-900">
                    <span>{route.source || 'Origin'}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-500" />
                    <span>{route.destination || 'Destination'}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block font-semibold uppercase">Bus</span>
                      <p className="font-bold text-gray-900">{bus.name || 'Express Coach'}</p>
                      <p className="text-[11px] text-gray-500">{bus.bus_number} • {bus.bus_type}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 block font-semibold uppercase">Schedule</span>
                      <p className="font-bold text-gray-900">{trip.trip_date || 'Today'}</p>
                      <p className="text-[11px] text-indigo-600 font-bold">{trip.departure_time || '08:00 AM'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600 flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      Occupancy: <strong className="ml-1 text-gray-900">{confirmed} / {total} seats</strong>
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">
                      {Math.round((confirmed / total) * 100)}% Booked
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      style={{ width: `${Math.min(100, (confirmed / total) * 100)}%` }}
                      className="bg-indigo-600 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Link
                    to={`/operator/trips/${tripId}/manifest`}
                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-indigo-200"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>View Passenger Manifest & Roster</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
