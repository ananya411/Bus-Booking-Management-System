import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ArrowRightLeft,
  Search,
  ChevronDown,
  Users,
  Plus,
  Minus,
  Sparkles,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const INDIA_LOCATIONS = [
  {
    state: 'Delhi (NCR)',
    cities: ['Delhi', 'New Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Thane'],
  },
  {
    state: 'Karnataka',
    cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Allahabad', 'Ayodhya', 'Mathura'],
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Mapusa', 'Vasco da Gama'],
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Siliguri', 'Darjeeling'],
  },
  {
    state: 'Punjab',
    cities: ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar'],
  },
  {
    state: 'Kerala',
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  },
];

const POPULAR_QUICK_ROUTES = [
  { s: 'Delhi', d: 'Lucknow' },
  { s: 'Mumbai', d: 'Pune' },
  { s: 'Bangalore', d: 'Hyderabad' },
  { s: 'Delhi', d: 'Jaipur' },
  { s: 'Ahmedabad', d: 'Mumbai' },
];

export default function SearchForm({
  initialSource = '',
  initialDestination = '',
  initialDate = '',
  className = '',
  isCompact = false,
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  const [tripType, setTripType] = useState('oneway'); // 'oneway' | 'roundtrip'
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate || today);
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);
  const [error, setError] = useState('');

  const totalPassengers = adults + children;

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSelectQuickRoute = (s, d) => {
    setSource(s);
    setDestination(d);
    setError('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) {
      setError(t('search.selectBoth', 'Please select both departure and destination cities'));
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError(t('search.differentCities', 'Departure and destination cannot be the same city'));
      return;
    }

    setError('');
    const params = new URLSearchParams({
      source: source.trim(),
      destination: destination.trim(),
      date: date || today,
      passengers: totalPassengers.toString(),
    });
    if (tripType === 'roundtrip' && returnDate) {
      params.append('returnDate', returnDate);
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div
      className={`rounded-2xl shadow-2xl p-4 sm:p-6 transition-all ${
        isCompact
          ? 'bg-white border border-gray-200'
          : 'bg-brand-darker border border-gray-700/80 text-white shadow-card-hover'
      } ${className}`}
    >
      {/* Trip Type Selector (One-way vs Round-trip) */}
      {!isCompact && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
          <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTripType('oneway')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tripType === 'oneway'
                  ? 'bg-brand-accent text-brand-dark font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('search.oneway', 'One-way')}
            </button>
            <button
              type="button"
              onClick={() => {
                setTripType('roundtrip');
                if (!returnDate) setReturnDate(date || today);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tripType === 'roundtrip'
                  ? 'bg-brand-accent text-brand-dark font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('search.roundtrip', 'Round-trip')}
            </button>
          </div>

          {/* Quick Route helper indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>{t('search.instantConfirmation', 'Zero Booking Fee · Instant PNR Confirmation')}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 text-xs sm:text-sm rounded-xl flex items-center gap-2 bg-red-900/30 border border-red-700/60 text-red-200">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div
          className={`grid grid-cols-1 ${
            isCompact
              ? 'md:grid-cols-3'
              : tripType === 'roundtrip'
              ? 'lg:grid-cols-12'
              : 'lg:grid-cols-11'
          } gap-3 items-end`}
        >
          {/* Departure City (From) */}
          <div className={isCompact ? 'col-span-1' : tripType === 'roundtrip' ? 'lg:col-span-3' : 'lg:col-span-3'}>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isCompact ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              {t('search.from', 'From')}
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-brand-accent absolute left-3.5 pointer-events-none z-10" />
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none z-10" />
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                className={`w-full pl-10 pr-8 py-3 appearance-none rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer ${
                  isCompact
                    ? 'bg-gray-50 border-gray-300 text-gray-800 focus:border-brand-accent focus:bg-white'
                    : 'bg-gray-900 border-gray-700 text-white focus:border-brand-accent focus:bg-black/60'
                }`}
              >
                <option value="">{t('search.fromPlaceholder', 'Select departure city')}</option>
                {INDIA_LOCATIONS.map(({ state, cities }) => (
                  <optgroup key={state} label={`📍 ${state}`}>
                    {cities
                      .filter((c) => c !== destination)
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          {!isCompact && (
            <div className="hidden lg:flex lg:col-span-1 justify-center pb-1">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap origin and destination"
                className="p-2.5 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 text-brand-accent hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Destination City (To) */}
          <div className={isCompact ? 'col-span-1' : tripType === 'roundtrip' ? 'lg:col-span-3' : 'lg:col-span-3'}>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isCompact ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              {t('search.to', 'To')}
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 pointer-events-none z-10" />
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none z-10" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className={`w-full pl-10 pr-8 py-3 appearance-none rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer ${
                  isCompact
                    ? 'bg-gray-50 border-gray-300 text-gray-800 focus:border-brand-accent focus:bg-white'
                    : 'bg-gray-900 border-gray-700 text-white focus:border-brand-accent focus:bg-black/60'
                }`}
              >
                <option value="">{t('search.toPlaceholder', 'Select destination city')}</option>
                {INDIA_LOCATIONS.map(({ state, cities }) => (
                  <optgroup key={state} label={`📍 ${state}`}>
                    {cities
                      .filter((c) => c !== source)
                      .map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Date of Journey */}
          <div className={isCompact ? 'col-span-1' : tripType === 'roundtrip' ? 'lg:col-span-2' : 'lg:col-span-2'}>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isCompact ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              {t('search.date', 'Date')}
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-brand-accent absolute left-3.5 pointer-events-none z-10" />
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={`w-full pl-10 pr-3 py-3 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer ${
                  isCompact
                    ? 'bg-gray-50 border-gray-300 text-gray-800 focus:border-brand-accent focus:bg-white'
                    : 'bg-gray-900 border-gray-700 text-white focus:border-brand-accent'
                }`}
              />
            </div>
          </div>

          {/* Return Date (if Round-trip) */}
          {!isCompact && tripType === 'roundtrip' && (
            <div className="lg:col-span-2 animate-fade-in">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-300">
                {t('search.returnDate', 'Return Date')}
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-emerald-400 absolute left-3.5 pointer-events-none z-10" />
                <input
                  type="date"
                  min={date || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all cursor-pointer bg-gray-900 border-gray-700 text-white focus:border-brand-accent"
                />
              </div>
            </div>
          )}

          {/* Passengers / Seats Picker */}
          {!isCompact && (
            <div className="lg:col-span-2 relative">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-300">
                {t('search.passengers', 'Passengers')}
              </label>
              <button
                type="button"
                onClick={() => setShowPassengerPicker(!showPassengerPicker)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-700 bg-gray-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-between text-left hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-accent absolute left-3.5" />
                  <span>
                    {totalPassengers} {totalPassengers === 1 ? t('search.passenger', 'Passenger') : t('search.passengers', 'Passengers')}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Popover */}
              {showPassengerPicker && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-brand-darker border border-gray-700 rounded-xl p-4 shadow-dropdown z-40 space-y-3 animate-slide-down">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                    <div>
                      <p className="text-xs font-bold text-white">{t('search.adults', 'Adults')}</p>
                      <p className="text-[10px] text-gray-400">{t('search.adultsAge', 'Age 12 and above')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        className="w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white font-mono">
                        {adults}
                      </span>
                      <button
                        type="button"
                        disabled={adults >= 6}
                        onClick={() => setAdults((a) => Math.min(6, a + 1))}
                        className="w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{t('search.children', 'Children')}</p>
                      <p className="text-[10px] text-gray-400">{t('search.childrenAge', 'Age 0–11 years')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={children <= 0}
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        className="w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white font-mono">
                        {children}
                      </span>
                      <button
                        type="button"
                        disabled={children >= 4}
                        onClick={() => setChildren((c) => Math.min(4, c + 1))}
                        className="w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassengerPicker(false)}
                    className="w-full py-1.5 bg-brand-accent text-brand-dark text-xs font-bold rounded-lg hover:bg-brand-accent-hover transition-colors mt-2"
                  >
                    {t('search.done', 'Done')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className={isCompact ? 'col-span-1 md:col-span-3' : 'lg:col-span-12 xl:col-span-12'}>
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-brand-accent/20 active:scale-[0.99]"
            >
              <Search className="w-5 h-5" />
              <span>{t('search.submit', 'Search buses')}</span>
            </button>
          </div>
        </div>

        {/* Quick Route Suggestion Chips */}
        {!isCompact && (
          <div className="pt-3 border-t border-gray-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 font-semibold text-[11px]">{t('search.popularCorridors', 'Popular Corridors:')}</span>
            {POPULAR_QUICK_ROUTES.map((route, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectQuickRoute(route.s, route.d)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  source === route.s && destination === route.d
                    ? 'bg-brand-accent/20 border-brand-accent text-brand-accent font-bold'
                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white'
                }`}
              >
                {route.s} ⇄ {route.d}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
