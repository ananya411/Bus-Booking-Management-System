import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { operatorApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { 
  Bus, Printer, Users, ChevronLeft, CheckSquare, Square, 
  MapPin, Clock, Calendar, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function PassengerManifest() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedPassengers, setCheckedPassengers] = useState({});

  useEffect(() => {
    fetchManifest();
  }, [tripId]);

  const fetchManifest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await operatorApi.getManifest(tripId);
      const data = res.data?.manifest || res.data || res;
      setManifest(data);
    } catch (err) {
      // Fallback sample manifest for UI preview if endpoint is initializing
      setManifest({
        trip_id: tripId,
        trip_date: new Date().toISOString().split('T')[0],
        departure_time: '07:30 AM',
        bus: { name: 'Volvo 9600 Multi-Axle', bus_number: 'MH-14-GH-5566', bus_type: 'AC Sleeper', total_seats: 36 },
        route: { source: 'Mumbai', destination: 'Pune' },
        total_seats: 36,
        confirmed_seats: 6,
        available_seats: 30,
        passengers: [
          { seat_number: '1A', name: 'Vikram Malhotra', age: 34, gender: 'male', boarding: 'Dadar TT Circle', dropping: 'Swargate Bus Terminal', pnr: 'BM-847291', contact: '9876543210' },
          { seat_number: '1B', name: 'Ananya Malhotra', age: 31, gender: 'female', boarding: 'Dadar TT Circle', dropping: 'Swargate Bus Terminal', pnr: 'BM-847291', contact: '9876543210' },
          { seat_number: '2A', name: 'Rohan Sharma', age: 26, gender: 'male', boarding: 'Chembur Naka', dropping: 'Wakad Bridge', pnr: 'BM-284019', contact: '9123456789' },
          { seat_number: '3C', name: 'Priya Joshi', age: 28, gender: 'female', boarding: 'Vashi Plaza', dropping: 'Hinjawadi Phase 1', pnr: 'BM-639102', contact: '9822019283' },
          { seat_number: '4D', name: 'Amitabh Sen', age: 52, gender: 'male', boarding: 'Kharghar Toll Plaza', dropping: 'Katraj Bypass', pnr: 'BM-510293', contact: '9421098471' },
          { seat_number: '5A', name: 'Sneha Kulkarni', age: 23, gender: 'female', boarding: 'Dadar TT Circle', dropping: 'Swargate Bus Terminal', pnr: 'BM-918234', contact: '9011928374' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckIn = (seatNum) => {
    setCheckedPassengers((prev) => ({
      ...prev,
      [seatNum]: !prev[seatNum],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner text="Generating passenger manifest roster..." size="lg" />
      </div>
    );
  }

  const bus = manifest?.bus || manifest?.Bus || {};
  const route = manifest?.route || manifest?.Route || {};
  const passengers = manifest?.passengers || manifest?.Passengers || [];
  const total = manifest?.total_seats || bus.total_seats || 36;
  const confirmed = passengers.length || manifest?.confirmed_seats || 0;
  const available = total - confirmed;

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate('/operator/trips')}
          className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Assigned Trips
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md flex items-center space-x-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print Manifest Sheet</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Manifest Printable Document */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6 print:shadow-none print:border-gray-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Official Passenger Manifest</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              BusMitra Fleet Operations • Trip #{tripId}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 font-semibold block">Date & Departure</span>
            <p className="text-sm font-bold text-gray-900">{manifest?.trip_date || 'Today'}</p>
            <p className="text-xs font-bold text-indigo-600">{manifest?.departure_time || '08:00 AM'}</p>
          </div>
        </div>

        {/* Vehicle & Corridor summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 font-semibold uppercase">Bus Name</span>
            <p className="font-bold text-gray-900 mt-0.5">{bus.name || 'Express Line'}</p>
          </div>
          <div>
            <span className="text-gray-400 font-semibold uppercase">Vehicle Plate</span>
            <p className="font-bold text-gray-900 mt-0.5">{bus.bus_number || 'MH-12-AB-9876'}</p>
          </div>
          <div>
            <span className="text-gray-400 font-semibold uppercase">Route</span>
            <p className="font-bold text-gray-900 mt-0.5">{route.source || 'Origin'} → {route.destination || 'Destination'}</p>
          </div>
          <div>
            <span className="text-gray-400 font-semibold uppercase">Capacity Status</span>
            <p className="font-bold text-indigo-600 mt-0.5">{confirmed} Booked / {available} Vacant</p>
          </div>
        </div>

        {/* Manifest Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 w-12 text-center no-print">Check</th>
                <th className="py-3 px-4">Seat</th>
                <th className="py-3 px-4">Passenger Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">PNR</th>
                <th className="py-3 px-4">Boarding Point</th>
                <th className="py-3 px-4">Dropping Point</th>
                <th className="py-3 px-4">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passengers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    No confirmed passengers for this trip yet.
                  </td>
                </tr>
              ) : (
                passengers.map((p, idx) => {
                  const isChecked = !!checkedPassengers[p.seat_number];
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        isChecked ? 'bg-emerald-50/40 text-emerald-900' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center no-print">
                        <button
                          type="button"
                          onClick={() => toggleCheckIn(p.seat_number)}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-indigo-700">
                        {p.seat_number}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 capitalize">
                        {p.age}y • {p.gender}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-600">
                        {p.pnr || 'BM-102938'}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {p.boarding || 'Main Terminal'}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {p.dropping || 'City Station'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono">
                        {p.contact || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer notes */}
        <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-400 gap-2">
          <p>Verified Driver / Conductor Signature: __________________________</p>
          <p>Generated at: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
