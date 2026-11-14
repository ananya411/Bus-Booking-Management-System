import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Compass,
  Bus,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import Logo from './Logo';

const ACTIVE_BUSES = [
  {
    id: 'bus-1',
    busNumber: 'DL-01-AB-1234',
    operator: 'Royal Volvo Express Multi-Axle',
    route: 'Delhi ➔ Lucknow',
    source: 'Delhi (Kashmere Gate ISBT)',
    destination: 'Lucknow (Alambagh Bus Stand)',
    departureTime: '06:00 AM',
    estimatedArrival: '02:15 PM',
    status: 'On Time',
    statusColor: 'emerald',
    progressPercent: 68,
    currentSpeed: '78 km/h',
    currentLocation: 'Kannauj Bypass, NH 34',
    nextStop: 'Kanpur Bypass (ETA 42 mins)',
    distanceRemaining: '142 km',
    lastPing: 'Just now',
    driverName: 'Rajesh Kumar (ID: DRV-482)',
    amenities: ['GPS Active', 'CCTV Live', 'Restroom on board', 'Speed Governor (80 km/h)'],
    stops: [
      { name: 'Delhi ISBT Kashmere Gate', time: '06:00 AM', passed: true, isCurrent: false },
      { name: 'Noida Sector 62', time: '06:45 AM', passed: true, isCurrent: false },
      { name: 'Agra Express Milestone 140', time: '09:30 AM', passed: true, isCurrent: false },
      { name: 'Kannauj Fuel & Food Plaza', time: '11:45 AM', passed: true, isCurrent: true },
      { name: 'Kanpur Bypass Drop', time: '01:00 PM', passed: false, isCurrent: false },
      { name: 'Lucknow Alambagh Terminal', time: '02:15 PM', passed: false, isCurrent: false },
    ]
  },
  {
    id: 'bus-2',
    busNumber: 'MH-02-CD-5678',
    operator: 'Scania AC Sleeper Gold Class',
    route: 'Mumbai ➔ Pune',
    source: 'Mumbai (Dadar East TT)',
    destination: 'Pune (Swargate Terminal)',
    departureTime: '07:30 AM',
    estimatedArrival: '11:00 AM',
    status: '10m Early',
    statusColor: 'emerald',
    progressPercent: 82,
    currentSpeed: '82 km/h',
    currentLocation: 'Mumbai-Pune Expressway, Lonavala Exit',
    nextStop: 'Wakad Bridge, Pune (ETA 22 mins)',
    distanceRemaining: '38 km',
    lastPing: '15s ago',
    driverName: 'Sanjay Patil (ID: DRV-198)',
    amenities: ['GPS Active', 'Wi-Fi 5G', 'Emergency SOS', 'Direct Telemetry'],
    stops: [
      { name: 'Dadar East, Mumbai', time: '07:30 AM', passed: true, isCurrent: false },
      { name: 'Vashi Plaza, Navi Mumbai', time: '08:15 AM', passed: true, isCurrent: false },
      { name: 'Khalapur Toll Plaza', time: '09:00 AM', passed: true, isCurrent: false },
      { name: 'Lonavala Food Hub', time: '09:40 AM', passed: true, isCurrent: true },
      { name: 'Wakad Bridge, Pune', time: '10:35 AM', passed: false, isCurrent: false },
      { name: 'Swargate Terminal, Pune', time: '11:00 AM', passed: false, isCurrent: false },
    ]
  },
  {
    id: 'bus-3',
    busNumber: 'KA-03-EF-9012',
    operator: 'BharatBenz Club Class AC',
    route: 'Bangalore ➔ Hyderabad',
    source: 'Bangalore (Majestic Bus Stand)',
    destination: 'Hyderabad (MGBS Terminal)',
    departureTime: '09:00 PM',
    estimatedArrival: '06:30 AM',
    status: 'On Schedule',
    statusColor: 'emerald',
    progressPercent: 45,
    currentSpeed: '74 km/h',
    currentLocation: 'Anantapur Bypass, NH 44',
    nextStop: 'Kurnool Toll (ETA 1h 15m)',
    distanceRemaining: '290 km',
    lastPing: '30s ago',
    driverName: 'Venkatesh Rao (ID: DRV-721)',
    amenities: ['GPS Active', 'Live CCTV', 'Dual Drivers', 'Comfort Air-Suspension'],
    stops: [
      { name: 'Majestic Bus Stand, Bangalore', time: '09:00 PM', passed: true, isCurrent: false },
      { name: 'Hebbal Flyover', time: '09:45 PM', passed: true, isCurrent: false },
      { name: 'Chikkaballapur Bypass', time: '10:50 PM', passed: true, isCurrent: false },
      { name: 'Anantapur Food Plaza', time: '01:30 AM', passed: true, isCurrent: true },
      { name: 'Kurnool Outer Ring', time: '03:15 AM', passed: false, isCurrent: false },
      { name: 'MGBS Terminal, Hyderabad', time: '06:30 AM', passed: false, isCurrent: false },
    ]
  }
];

export default function TripTrackerModal({ isOpen, onClose, initialBusNumber = '' }) {
  const [selectedBus, setSelectedBus] = useState(ACTIVE_BUSES[0]);
  const [searchInput, setSearchInput] = useState(initialBusNumber || '');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [speedVal, setSpeedVal] = useState(78);

  useEffect(() => {
    if (initialBusNumber) {
      setSearchInput(initialBusNumber);
      const found = ACTIVE_BUSES.find(
        (b) => b.busNumber.toLowerCase() === initialBusNumber.toLowerCase()
      );
      if (found) {
        setSelectedBus(found);
      } else {
        setSelectedBus({
          id: `bus-dyn-${initialBusNumber}`,
          busNumber: initialBusNumber,
          operator: 'BusMitra Verified Partner Coach',
          route: 'Active Corridor',
          source: 'Origin Terminal',
          destination: 'Destination Hub',
          departureTime: '06:00 AM',
          estimatedArrival: '02:15 PM',
          status: 'On Time',
          statusColor: 'emerald',
          progressPercent: 64,
          currentSpeed: '76 km/h',
          currentLocation: 'Express Highway Milestone 142',
          nextStop: 'Intercity Bypass (ETA 28 mins)',
          distanceRemaining: '168 km',
          lastPing: 'Just now',
          driverName: 'Verified Pilot (ID: DRV-512)',
          amenities: ['GPS Active', 'Live CCTV', 'Emergency SOS', 'Speed Governor (80 km/h)'],
          stops: [
            { name: 'Origin Terminal Hub', time: '06:00 AM', passed: true, isCurrent: false },
            { name: 'Outer Bypass Toll', time: '06:50 AM', passed: true, isCurrent: false },
            { name: 'Highway Rest Stop & Food Court', time: '09:30 AM', passed: true, isCurrent: true },
            { name: 'District Milestone Junction', time: '12:00 PM', passed: false, isCurrent: false },
            { name: 'Destination City Terminal', time: '02:15 PM', passed: false, isCurrent: false },
          ]
        });
      }
    }
  }, [initialBusNumber, isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSpeedVal(Math.floor(70 + Math.random() * 15));
      setIsRefreshing(false);
    }, 600);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;
    const match = ACTIVE_BUSES.find(
      (b) =>
        b.busNumber.toUpperCase().includes(query) ||
        b.route.toUpperCase().includes(query) ||
        b.id.toUpperCase().includes(query)
    );
    if (match) {
      setSelectedBus(match);
    } else {
      setSelectedBus({
        id: `bus-dyn-${Date.now()}`,
        busNumber: query,
        operator: 'BusMitra Verified Partner Coach',
        route: 'Active Corridor Telemetry',
        source: 'Departure Terminal',
        destination: 'Arrival Hub',
        departureTime: '06:30 AM',
        estimatedArrival: '02:45 PM',
        status: 'On Time',
        statusColor: 'emerald',
        progressPercent: 58,
        currentSpeed: `${Math.floor(72 + (query.charCodeAt(0) % 14))} km/h`,
        currentLocation: 'National Highway Corridor Milestone 185',
        nextStop: 'Intercity Junction Bypass (ETA 35 mins)',
        distanceRemaining: '134 km',
        lastPing: 'Just now',
        driverName: 'Verified Pilot (ID: DRV-894)',
        amenities: ['GPS Active', 'Live CCTV', 'Emergency SOS', 'Speed Governor (80 km/h)'],
        stops: [
          { name: 'Source Terminal Hub', time: '06:30 AM', passed: true, isCurrent: false },
          { name: 'City Toll Plaza', time: '07:15 AM', passed: true, isCurrent: false },
          { name: 'Highway Rest Stop & Food Court', time: '10:00 AM', passed: true, isCurrent: true },
          { name: 'Regional Bypass Junction', time: '12:30 PM', passed: false, isCurrent: false },
          { name: 'Destination Intercity Terminal', time: '02:45 PM', passed: false, isCurrent: false },
        ]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-darker border border-gray-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-800 flex items-center justify-between bg-brand-dark">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Live Trip Tracker</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-accent/20 text-brand-accent border border-brand-accent/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" />
                  Live GPS
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Real-time telemetry, stop progress & delay status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Refresh telemetry"
              className={`p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${
                isRefreshing ? 'animate-spin text-brand-accent' : ''
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Active Bus Tabs */}
        <div className="p-4 bg-brand-dark/60 border-b border-gray-800 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Navigation className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by Bus No (e.g. DL-01-AB-1234) or Route..."
                className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-accent transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-xs rounded-xl transition-colors"
            >
              Track
            </button>
          </form>

          {/* Quick bus selection pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] text-gray-400 flex-shrink-0">Live buses:</span>
            {ACTIVE_BUSES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBus(b);
                  setSearchInput(b.busNumber);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs flex items-center gap-1.5 ${
                  selectedBus.id === b.id
                    ? 'bg-brand-accent text-brand-dark font-bold shadow-sm'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>{b.route}</span>
                <span className="font-mono text-[10px] opacity-75">({b.busNumber})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Bus Info Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-extrabold text-white">{selectedBus.route}</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {selectedBus.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedBus.operator} ·{' '}
                  <span className="font-mono text-brand-accent font-semibold">
                    {selectedBus.busNumber}
                  </span>
                </p>
              </div>

              {/* Telemetry pill */}
              <div className="flex items-center gap-3 bg-black/40 px-3.5 py-2 rounded-xl border border-gray-800">
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase block">Current Speed</span>
                  <span className="text-sm font-extrabold text-brand-accent font-mono">
                    {speedVal} km/h
                  </span>
                </div>
                <div className="w-px h-7 bg-gray-800" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Distance Left</span>
                  <span className="text-sm font-extrabold text-white font-mono">
                    {selectedBus.distanceRemaining}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>{selectedBus.source}</span>
                </span>
                <span className="font-bold text-brand-accent">{selectedBus.progressPercent}% Completed</span>
                <span className="text-gray-400 flex items-center gap-1">
                  <span>{selectedBus.destination}</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              </div>

              <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-brand-accent to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${selectedBus.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-accent" /> Dep: {selectedBus.departureTime}
                </span>
                <span className="text-white font-medium bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                  📍 Current: {selectedBus.currentLocation}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> Est: {selectedBus.estimatedArrival}
                </span>
              </div>
            </div>

            {/* Next Stop highlight banner */}
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-accent animate-pulse" />
                <div>
                  <span className="text-gray-300 font-medium">Upcoming Stop: </span>
                  <span className="text-brand-accent font-bold">{selectedBus.nextStop}</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Telemetry synced 10s ago</span>
            </div>
          </div>

          {/* Detailed Stops Timeline */}
          <div>
            <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              Route Stop Milestones
            </h5>
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-800">
              {selectedBus.stops.map((stop, idx) => (
                <div key={idx} className="relative flex items-center justify-between pl-8 text-xs">
                  <div
                    className={`absolute left-2 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 ${
                      stop.passed
                        ? 'bg-emerald-500 border-emerald-400'
                        : stop.isCurrent
                        ? 'bg-brand-accent border-white animate-pulse'
                        : 'bg-gray-900 border-gray-600'
                    }`}
                  />
                  <div>
                    <span
                      className={`font-semibold ${
                        stop.passed
                          ? 'text-gray-200'
                          : stop.isCurrent
                          ? 'text-brand-accent font-bold'
                          : 'text-gray-400'
                      }`}
                    >
                      {stop.name}
                    </span>
                    {stop.isCurrent && (
                      <span className="ml-2 text-[10px] uppercase font-bold text-brand-accent bg-brand-accent/15 px-1.5 py-0.5 rounded">
                        Bus is here
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-gray-400 flex items-center gap-1.5">
                    {stop.passed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{stop.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Amenities */}
          <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Assigned Captain: <strong className="text-white">{selectedBus.driverName}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              {selectedBus.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-[10px] border border-gray-700"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-brand-dark border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span>Updates automatically every 15 seconds</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

