import React, { useState, useEffect } from 'react';
import { tripApi, busApi, routeApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { CalendarDays, Plus, Edit2, Trash2, Search, Filter, Clock, Bus, MapPin } from 'lucide-react';

export default function TripManagement() {
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bus_id: '',
    route_id: '',
    trip_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00',
    arrival_time: '14:00',
    fare: 500,
    status: 'scheduled',
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tripsRes, busesRes, routesRes] = await Promise.allSettled([
        tripApi.getAllTrips(),
        busApi.getBuses(),
        routeApi.getRoutes(),
      ]);

      if (tripsRes.status === 'fulfilled') {
        const list = tripsRes.value.data?.trips || tripsRes.value.data || [];
        setTrips(Array.isArray(list) ? list : []);
      }
      if (busesRes.status === 'fulfilled') {
        const list = busesRes.value.data?.buses || busesRes.value.data || [];
        setBuses(Array.isArray(list) ? list : []);
      }
      if (routesRes.status === 'fulfilled') {
        const list = routesRes.value.data?.routes || routesRes.value.data || [];
        setRoutes(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch trips and related entities');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentTripId(null);
    setFormData({
      bus_id: buses[0]?.id || buses[0]?.bus_id || '',
      route_id: routes[0]?.id || routes[0]?.route_id || '',
      trip_date: new Date().toISOString().split('T')[0],
      departure_time: '08:00',
      arrival_time: '14:00',
      fare: 550,
      status: 'scheduled',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (trip) => {
    setIsEditing(true);
    setCurrentTripId(trip.id || trip.trip_id);
    setFormData({
      bus_id: trip.bus_id || trip.Bus?.id || trip.bus?.id || '',
      route_id: trip.route_id || trip.Route?.id || trip.route?.id || '',
      trip_date: trip.trip_date || trip.date || '',
      departure_time: trip.departure_time || '08:00',
      arrival_time: trip.arrival_time || '14:00',
      fare: trip.fare || trip.base_fare || 500,
      status: trip.status || 'scheduled',
    });
    setModalOpen(true);
  };

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        fare: Number(formData.fare),
      };

      if (isEditing) {
        await tripApi.updateTrip(currentTripId, payload);
        setSuccess('Trip updated successfully!');
      } else {
        await tripApi.createTrip(payload);
        setSuccess('Trip scheduled successfully!');
      }
      setModalOpen(false);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to save trip schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (trip) => {
    setTripToDelete(trip);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    setDeleting(true);
    try {
      const id = tripToDelete.id || tripToDelete.trip_id;
      await tripApi.deleteTrip(id);
      setSuccess('Trip cancelled/deleted successfully!');
      setDeleteModalOpen(false);
      setTripToDelete(null);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTrips = trips.filter((t) => {
    if (dateFilter && (t.trip_date || t.date) !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const busName = (t.Bus?.name || t.bus?.name || '').toLowerCase();
      const src = (t.Route?.source || t.route?.source || '').toLowerCase();
      const dst = (t.Route?.destination || t.route?.destination || '').toLowerCase();
      if (!busName.includes(q) && !src.includes(q) && !dst.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Trip Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scheduled trips, assign buses to routes, and adjust seat pricing.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Trip</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex items-center w-full">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by route or bus name..."
            className="w-full text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading trip schedules..." />
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-2">
            <CalendarDays className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No trips found matching the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Bus Details</th>
                  <th className="py-3 px-4">Route Corridor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Departure → Arrival</th>
                  <th className="py-3 px-4">Base Fare</th>
                  <th className="py-3 px-4">Available Seats</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTrips.map((trip) => {
                  const bus = trip.Bus || trip.bus || {};
                  const route = trip.Route || trip.route || {};
                  const available = trip.available_seats ?? trip.availableSeats ?? bus.total_seats ?? 36;

                  return (
                    <tr key={trip.id || trip.trip_id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{bus.name || 'Express Line'}</p>
                        <p className="text-[11px] text-gray-500">{bus.bus_number} • {bus.bus_type}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-700">
                        {route.source || 'Origin'} → {route.destination || 'Destination'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {trip.trip_date || trip.date || 'Today'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-800">
                        {trip.departure_time || '08:00'} → {trip.arrival_time || '14:00'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-gray-900">
                        ₹{trip.fare || trip.base_fare || 500}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {available} seats
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={trip.status || 'SCHEDULED'} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(trip)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit Trip"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(trip)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Cancel/Delete Trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Trip Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Trip Schedule' : 'Schedule New Trip'}
      >
        <form onSubmit={handleSaveTrip} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Select Bus *
            </label>
            <select
              required
              value={formData.bus_id}
              onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose a Bus --</option>
              {buses.map((b) => (
                <option key={b.id || b.bus_id} value={b.id || b.bus_id}>
                  {b.bus_number} — {b.name || 'Express'} ({b.bus_type || 'AC'}, {b.total_seats || 36} seats)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Select Route *
            </label>
            <select
              required
              value={formData.route_id}
              onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose a Route --</option>
              {routes.map((r) => (
                <option key={r.id || r.route_id} value={r.id || r.route_id}>
                  {r.source} → {r.destination} {r.distance ? `(${r.distance} km)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Trip Date *
              </label>
              <input
                type="date"
                required
                value={formData.trip_date}
                onChange={(e) => setFormData({ ...formData, trip_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Fare (₹ per seat) *
              </label>
              <input
                type="number"
                min="50"
                required
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Departure Time *
              </label>
              <input
                type="time"
                required
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Arrival Time *
              </label>
              <input
                type="time"
                required
                value={formData.arrival_time}
                onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Trip Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_transit">In Transit / Running</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60 shadow-sm"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Schedule Trip'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Cancel Trip"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel / remove this trip? This will notify any booked passengers and halt future ticket bookings.
          </p>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
            >
              Keep Trip
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-60"
            >
              {deleting ? 'Cancelling...' : 'Cancel Trip'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
