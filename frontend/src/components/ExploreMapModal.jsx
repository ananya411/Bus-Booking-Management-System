import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Compass,
  ArrowRight,
  X,
  Search,
  Bus,
  Layers,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';

const NETWORK_HUBS = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi NCR', x: 42, y: 26, buses: '140+ daily', popular: true },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', x: 34, y: 34, buses: '85+ daily', popular: true },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', x: 55, y: 32, buses: '90+ daily', popular: true },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', x: 26, y: 48, buses: '75+ daily', popular: true },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', x: 28, y: 64, buses: '180+ daily', popular: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', x: 33, y: 68, buses: '120+ daily', popular: true },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', x: 48, y: 66, buses: '110+ daily', popular: true },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', x: 45, y: 82, buses: '160+ daily', popular: true },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', x: 56, y: 84, buses: '130+ daily', popular: true },
  { id: 'goa', name: 'Goa', state: 'Goa', x: 31, y: 76, buses: '45+ daily', popular: true },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', x: 78, y: 46, buses: '70+ daily', popular: false },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab', x: 39, y: 19, buses: '65+ daily', popular: false },
];

const POPULAR_CORRIDORS = [
  { source: 'Mumbai', destination: 'Pune', distance: '150 km', duration: '3h 30m', fare: '₹350', freq: 'Every 20 mins' },
  { source: 'Delhi', destination: 'Lucknow', distance: '550 km', duration: '8h 15m', fare: '₹799', freq: 'Hourly' },
  { source: 'Bangalore', destination: 'Hyderabad', distance: '570 km', duration: '8h 45m', fare: '₹750', freq: '32+ daily' },
  { source: 'Delhi', destination: 'Jaipur', distance: '280 km', duration: '5h 00m', fare: '₹450', freq: '50+ daily' },
  { source: 'Ahmedabad', destination: 'Mumbai', distance: '525 km', duration: '8h 30m', fare: '₹800', freq: 'Every 45 mins' },
  { source: 'Chennai', destination: 'Bangalore', distance: '345 km', duration: '6h 15m', fare: '₹550', freq: '38+ daily' },
  { source: 'Pune', destination: 'Goa', distance: '450 km', duration: '9h 30m', fare: '₹950', freq: '20+ daily' },
  { source: 'Delhi', destination: 'Chandigarh', distance: '250 km', duration: '4h 30m', fare: '₹400', freq: '40+ daily' },
];

export default function ExploreMapModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [selectedHub, setSelectedHub] = useState(NETWORK_HUBS[0]);
  const [activeFilter, setActiveFilter] = useState('all');

  if (!isOpen) return null;

  const handleBookRoute = (source, destination) => {
    onClose();
    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${today}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-brand-darker border border-gray-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-800 flex items-center justify-between bg-brand-dark">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Route Network Map</h3>
              <p className="text-[11px] text-gray-400">Discover 8,000+ daily connection points across India</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Layout Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual SVG Map (7 cols) */}
            <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col relative overflow-hidden min-h-[340px]">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2 z-10">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Intercity Corridors
                </span>
                <span className="text-[11px] text-brand-accent">Click any node to inspect</span>
              </div>

              {/* Graphic schematic map canvas */}
              <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
                {/* SVG connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5A524" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Interconnecting routes */}
                  <line x1="42" y1="26" x2="55" y2="32" stroke="url(#routeGrad)" strokeWidth="1.2" strokeDasharray="2,2" />
                  <line x1="42" y1="26" x2="34" y2="34" stroke="url(#routeGrad)" strokeWidth="1.2" />
                  <line x1="42" y1="26" x2="39" y2="19" stroke="url(#routeGrad)" strokeWidth="1.2" />
                  <line x1="34" y1="34" x2="26" y2="48" stroke="url(#routeGrad)" strokeWidth="1.2" />
                  <line x1="26" y1="48" x2="28" y2="64" stroke="url(#routeGrad)" strokeWidth="1.4" />
                  <line x1="28" y1="64" x2="33" y2="68" stroke="#F5A524" strokeWidth="1.8" />
                  <line x1="33" y1="68" x2="31" y2="76" stroke="url(#routeGrad)" strokeWidth="1.2" />
                  <line x1="33" y1="68" x2="48" y2="66" stroke="url(#routeGrad)" strokeWidth="1.2" />
                  <line x1="48" y1="66" x2="45" y2="82" stroke="url(#routeGrad)" strokeWidth="1.4" />
                  <line x1="45" y1="82" x2="56" y2="84" stroke="url(#routeGrad)" strokeWidth="1.4" />
                  <line x1="55" y1="32" x2="78" y2="46" stroke="url(#routeGrad)" strokeWidth="1.2" strokeDasharray="2,2" />
                </svg>

                {/* City node pins */}
                {NETWORK_HUBS.map((hub) => {
                  const isSelected = selectedHub.id === hub.id;
                  return (
                    <button
                      key={hub.id}
                      onClick={() => setSelectedHub(hub)}
                      style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-brand-accent border-white shadow-lg ring-4 ring-brand-accent/30'
                            : 'bg-brand-dark border-brand-accent group-hover:bg-brand-accent'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 top-4 text-[10px] whitespace-nowrap font-bold px-1.5 py-0.5 rounded transition-all ${
                          isSelected
                            ? 'bg-brand-accent text-brand-dark shadow'
                            : 'text-gray-300 bg-black/60 group-hover:text-white'
                        }`}
                      >
                        {hub.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Hub Card Overlay */}
              <div className="mt-3 p-3 bg-black/60 border border-gray-800 rounded-xl flex items-center justify-between z-10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    <span className="text-white font-bold text-xs">{selectedHub.name}</span>
                    <span className="text-gray-400 text-[11px]">({selectedHub.state})</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{selectedHub.buses} connected</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/search?source=${encodeURIComponent(selectedHub.name)}`);
                  }}
                  className="px-3 py-1.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Explore Buses</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Popular Corridors Quick-Select (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Popular Corridors</span>
                </h4>
                <span className="text-[11px] text-gray-400">Direct booking</span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {POPULAR_CORRIDORS.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleBookRoute(c.source, c.destination)}
                    className="p-3 bg-gray-900 border border-gray-800 hover:border-brand-accent/50 rounded-xl cursor-pointer transition-all hover:bg-gray-850 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-white group-hover:text-brand-accent transition-colors">
                        {c.source} ➔ {c.destination}
                      </div>
                      <span className="font-extrabold text-white text-xs">{c.fare}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                      <span>{c.duration} · {c.distance}</span>
                      <span className="text-emerald-400 font-medium">{c.freq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-brand-dark border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span>Operating across 20+ states with GPS tracking on 100% of departures</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs transition-colors"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
}

