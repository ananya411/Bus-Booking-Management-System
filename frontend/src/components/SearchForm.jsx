import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRightLeft, Search } from 'lucide-react';

const POPULAR_CITIES = [
  'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 
  'Delhi', 'Jaipur', 'Ahmedabad', 'Chennai', 'Goa'
];

export default function SearchForm({ 
  initialSource = '', 
  initialDestination = '', 
  initialDate = '',
  className = '',
  isCompact = false
}) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate || today);
  const [error, setError] = useState('');

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) {
      setError('Please enter both source and destination');
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError('Source and Destination cannot be the same');
      return;
    }
    setError('');

    const searchParams = new URLSearchParams({
      source: source.trim(),
      destination: destination.trim(),
      date: date || today,
    });

    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 ${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-4">
        <div className={`grid grid-cols-1 ${isCompact ? 'md:grid-cols-3' : 'md:grid-cols-12'} gap-3 items-center`}>
          {/* Source Input */}
          <div className={`${isCompact ? 'col-span-1' : 'md:col-span-4'} relative`}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              From
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-5 h-5 text-indigo-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                list="source-cities"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter departure city"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 font-medium placeholder-gray-400 outline-none transition-all"
                required
              />
              <datalist id="source-cities">
                {POPULAR_CITIES.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Swap Button */}
          {!isCompact ? (
            <div className="hidden md:flex md:col-span-1 justify-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors border border-indigo-200 shadow-sm"
                title="Swap locations"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Destination Input */}
          <div className={`${isCompact ? 'col-span-1' : 'md:col-span-4'} relative`}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              To
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-5 h-5 text-indigo-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                list="destination-cities"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination city"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 font-medium placeholder-gray-400 outline-none transition-all"
                required
              />
              <datalist id="destination-cities">
                {POPULAR_CITIES.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Date Picker */}
          <div className={`${isCompact ? 'col-span-1' : 'md:col-span-3'} relative`}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Date of Journey
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-5 h-5 text-indigo-600 absolute left-3 pointer-events-none" />
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 font-medium outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Button & Quick Dates */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Quick:</span>
            <button
              type="button"
              onClick={() => setDate(today)}
              className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDate(tomorrow.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Tomorrow
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <Search className="w-5 h-5" />
            <span>Search Buses</span>
          </button>
        </div>
      </form>
    </div>
  );
}
