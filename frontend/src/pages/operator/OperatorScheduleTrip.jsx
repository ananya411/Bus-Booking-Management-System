import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { busApi, routeApi, tripApi, stopApi } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import Modal from '../../components/Modal';
import { resolveCityName } from '../../utils/formatters';
import {
  Calendar,
  Bus,
  MapPin,
  ArrowRight,
  Clock,
  Plus,
  CheckCircle2,
  Sparkles,
  Route as RouteIcon,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function OperatorScheduleTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedBusId = searchParams.get('busId') || '';

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [createdTrip, setCreatedTrip] = useState(null);

  // Form State
  const [selectedBusId, setSelectedBusId] = useState(preselectedBusId);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [travelDate, setTravelDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [departureTime, setDepartureTime] = useState('07:30');
  const [arrivalTime, setArrivalTime] = useState('14:30');
  const [fare, setFare] = useState(650);

  // Quick Route Modal State (if operator wants to create a new route on the spot)
  const [newRouteModalOpen, setNewRouteModalOpen] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    name: '',
    source: '',
    destination: '',
    distance: 350,
    duration: '6h 00m',
  });
  const [creatingRoute, setCreatingRoute] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [busesRes, routesRes, stopsRes] = await Promise.allSettled([
        busApi.getMyBuses(),
        routeApi.getRoutes(),
        stopApi.getStops(),
      ]);

      let busList = [];
      if (busesRes.status === 'fulfilled') {
        const list = busesRes.value.data?.buses || busesRes.value.data || [];
        busList = Array.isArray(list) ? list : [];
        setBuses(busList);
        if (!selectedBusId && busList.length > 0) {
          setSelectedBusId(busList[0]._id || busList[0].id);
        }
      }

      if (routesRes.status === 'fulfilled') {
        const list = routesRes.value.data?.routes || routesRes.value.data || [];
        const validRoutes = Array.isArray(list) ? list : [];
        setRoutes(validRoutes);
        if (validRoutes.length > 0) {
          setSelectedRouteId(validRoutes[0]._id || validRoutes[0].id);
          // Suggest initial fare based on first route distance
          if (validRoutes[0].distance) {
            setFare(Math.round(validRoutes[0].distance * 1.8));
          }
        }
      }

      if (stopsRes.status === 'fulfilled') {
        const list = stopsRes.value.data?.stops || stopsRes.value.data || [];
        setStops(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize scheduling form');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteChange = (routeId) => {
    setSelectedRouteId(routeId);
    const r = routes.find((item) => (item._id || item.id) === routeId);
    if (r && r.distance) {
      // Suggest realistic fare
      setFare(Math.round(r.distance * 1.8));
    }
  };

  const handleCreateNewRoute = async (e) => {
    e.preventDefault();
    if (!newRouteData.source || !newRouteData.destination) {
      setError('Please select both source and destination stops.');
      return;
    }
    setCreatingRoute(true);
    try {
      const res = await routeApi.createRoute({
        name: newRouteData.name || 'Express Corridor',
        source: newRouteData.source,
        destination: newRouteData.destination,
        distance: Number(newRouteData.distance) || 300,
        duration: newRouteData.duration || '5h 00m',
      });
      const created = res.data || res;
      setSuccess('New route corridor created successfully!');
      setNewRouteModalOpen(false);

      // Refresh routes and select the new one
      const refreshedRoutes = await routeApi.getRoutes();
      const list = refreshedRoutes.data?.routes || refreshedRoutes.data || [];
      setRoutes(Array.isArray(list) ? list : []);
      const newId = created._id || created.id;
      if (newId) {
        setSelectedRouteId(newId);
        if (newRouteData.distance) {
          setFare(Math.round(Number(newRouteData.distance) * 1.8));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create route');
    } finally {
      setCreatingRoute(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreatedTrip(null);

    if (!selectedBusId) {
      setError('Please select an active bus from your fleet.');
      return;
    }
    if (!selectedRouteId) {
      setError('Please select a travel route for this bus.');
      return;
    }

    setPublishing(true);
    try {
      const payload = {
        bus: selectedBusId,
        route: selectedRouteId,
        travelDate: travelDate,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        fare: Number(fare),
      };

      const res = await tripApi.createTrip(payload);
      const trip = res.data?.trip || res.data || {};
      setCreatedTrip(trip);
      setSuccess('Bus successfully dispatched on route! Tickets are now available for customer booking.');
    } catch (err) {
      setError(err.message || 'Failed to publish trip schedule');
    } finally {
      setPublishing(false);
    }
  };

  const selectedBus = buses.find((b) => (b._id || b.id) === selectedBusId);
  const selectedRoute = routes.find((r) => (r._id || r.id) === selectedRouteId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-brand-accent/20 text-brand-dark">
            <RouteIcon className="w-6 h-6 text-brand-dark" />
          </span>
          <span>Add Bus to Route &amp; Customer Scheduling</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Deploy your coach onto an inter-city route, define passenger schedules, set fares, and immediately open ticket sales for customers.
        </p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Published Success Banner Card */}
      {createdTrip && (
        <div className="bg-gradient-to-r from-brand-darker via-brand-dark to-brand-dark p-6 rounded-3xl border border-brand-accent/40 text-white shadow-xl space-y-4">
          <div className="flex items-center space-x-3 text-brand-accent">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <div>
              <h3 className="text-lg font-black text-white">Route Schedule Active &amp; Live!</h3>
              <p className="text-xs text-gray-300">
                Customers can now discover and book seats on this departure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-gray-400 block font-semibold">Coach</span>
              <span className="font-bold text-white text-sm">
                {selectedBus?.busNumber || selectedBus?.bus_number || 'Bus'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold">Date</span>
              <span className="font-bold text-white text-sm">{travelDate}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold">Departure</span>
              <span className="font-bold text-brand-accent text-sm">{departureTime}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold">Ticket Fare</span>
              <span className="font-bold text-white text-sm">₹{fare}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to={`/search?source=${encodeURIComponent(
                resolveCityName(selectedRoute?.source)
              )}&destination=${encodeURIComponent(
                resolveCityName(selectedRoute?.destination)
              )}&date=${travelDate}`}
              className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark text-xs font-black rounded-xl inline-flex items-center space-x-1.5 shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View in Customer Search</span>
            </Link>

            <Link
              to="/operator/trips"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5"
            >
              <span>Go to Assigned Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-2xl border border-gray-100">
          <LoadingSpinner message="Loading fleet and route inventory..." />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Bus Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-brand-accent text-brand-dark flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h3 className="text-base font-bold text-gray-900">Select Coach from Your Fleet</h3>
              </div>
              <Link
                to="/operator/buses"
                className="text-xs font-bold text-brand-dark hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-brand-accent" />
                <span>Add Another Bus</span>
              </Link>
            </div>

            {buses.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                <span>You do not have any registered buses in your fleet yet.</span>
                <Link
                  to="/operator/buses"
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-xs"
                >
                  Create Bus
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {buses.map((bus) => {
                  const id = bus._id || bus.id || bus.bus_id;
                  const isSelected = selectedBusId === id;
                  return (
                    <div
                      key={id}
                      onClick={() => setSelectedBusId(id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-accent bg-brand-accent/10 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-black uppercase text-brand-dark">
                          {bus.busNumber || bus.bus_number}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-brand-accent bg-brand-accent' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-dark" />}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {bus.name || bus.bus_name || 'Coach'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {bus.type || bus.bus_type} • {bus.totalSeats || bus.total_seats || 36} Seats
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Route Corridor Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-brand-accent text-brand-dark flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h3 className="text-base font-bold text-gray-900">Select Travel Route</h3>
              </div>
              <button
                type="button"
                onClick={() => setNewRouteModalOpen(true)}
                className="text-xs font-bold text-brand-dark hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-brand-accent" />
                <span>New Route Corridor</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Available Routes
              </label>
              <select
                value={selectedRouteId}
                onChange={(e) => handleRouteChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
              >
                {routes.map((r) => {
                  const rId = r._id || r.id;
                  const src = resolveCityName(r.source, 'Origin');
                  const dst = resolveCityName(r.destination, 'Destination');
                  return (
                    <option key={rId} value={rId}>
                      {src} ➔ {dst} ({r.distance || 300} km • {r.duration || '5h'})
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedRoute && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">Route Summary</span>
                  <div className="text-sm font-black text-gray-900 flex items-center space-x-2">
                    <span>{resolveCityName(selectedRoute.source)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{resolveCityName(selectedRoute.destination)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block font-semibold uppercase text-[10px]">Distance &amp; Time</span>
                  <span className="font-bold text-gray-900">
                    {selectedRoute.distance || 350} km • {selectedRoute.duration || '6h'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Schedule Timings & Fare */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-xl bg-brand-accent text-brand-dark flex items-center justify-center font-black text-xs">
                3
              </span>
              <h3 className="text-base font-bold text-gray-900">Schedule &amp; Ticket Pricing</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Travel Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Departure Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expected Arrival <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Base Ticket Fare (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  required
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-gray-900 text-brand-dark"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-500 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Trip will be published immediately to public customer search results.</span>
            </p>

            <button
              type="submit"
              disabled={publishing || buses.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 text-brand-dark font-black text-sm rounded-xl shadow-lg shadow-brand-accent/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{publishing ? 'Publishing Schedule...' : 'Publish Trip for Customers'}</span>
            </button>
          </div>
        </form>
      )}

      {/* New Route Creation Modal */}
      <Modal
        isOpen={newRouteModalOpen}
        onClose={() => setNewRouteModalOpen(false)}
        title="Add New Inter-City Route Corridor"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateNewRoute} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Route Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Western Coastal Express"
              value={newRouteData.name}
              onChange={(e) => setNewRouteData({ ...newRouteData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Source Terminal <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={newRouteData.source}
                onChange={(e) => setNewRouteData({ ...newRouteData, source: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-gray-900"
              >
                <option value="">Select Origin</option>
                {stops.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.city} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Destination <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={newRouteData.destination}
                onChange={(e) => setNewRouteData({ ...newRouteData, destination: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-gray-900"
              >
                <option value="">Select Destination</option>
                {stops.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.city} ({s.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Distance (KM)
              </label>
              <input
                type="number"
                min="10"
                value={newRouteData.distance}
                onChange={(e) => setNewRouteData({ ...newRouteData, distance: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Estimated Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 5h 30m"
                value={newRouteData.duration}
                onChange={(e) => setNewRouteData({ ...newRouteData, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setNewRouteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingRoute}
              className="px-5 py-2 rounded-xl bg-brand-accent text-brand-dark font-extrabold text-xs shadow-md shadow-brand-accent/20 hover:brightness-105"
            >
              {creatingRoute ? 'Creating...' : 'Create Corridor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

