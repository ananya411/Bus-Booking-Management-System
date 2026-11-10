import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRightLeft, Search, ChevronDown } from 'lucide-react';

// India States and their major cities organized for bus travel
const INDIA_LOCATIONS = [
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Rajahmundry', 'Kurnool', 'Kakinada'],
  },
  {
    state: 'Delhi (NCR)',
    cities: ['New Delhi', 'Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Anand'],
  },
  {
    state: 'Himachal Pradesh',
    cities: ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Mandi', 'Solan'],
  },
  {
    state: 'Karnataka',
    cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Davanagere', 'Shimoga', 'Gulbarga'],
  },
  {
    state: 'Kerala',
    cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur'],
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Rewa', 'Satna', 'Ratlam'],
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Solapur', 'Thane', 'Navi Mumbai', 'Amravati'],
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Pushkar'],
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Vellore', 'Erode'],
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar'],
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Allahabad', 'Meerut', 'Mathura', 'Bareilly', 'Aligarh', 'Ayodhya'],
  },
  {
    state: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie', 'Roorkee'],
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Darjeeling'],
  },
];

export default function SearchForm({
  initialSource = '',
  initialDestination = '',
  initialDate = '',
  className = '',
  isCompact = false,
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
      setError('Please select both departure and destination cities');
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError('Departure and Destination cannot be the same city');
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

  const SelectField = ({ label, value, onChange, id, exclude }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#1e5219' }}>
        {label}
      </label>
      <div className="relative flex items-center">
        <MapPin className="w-4 h-4 absolute left-3 pointer-events-none z-10" style={{ color: '#2d6b27' }} />
        <ChevronDown className="w-4 h-4 absolute right-3 pointer-events-none z-10" style={{ color: '#2d6b27' }} />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full pl-9 pr-9 py-3 appearance-none rounded-xl border font-medium text-sm outline-none transition-all cursor-pointer"
          style={{
            background: '#faf7f0',
            borderColor: value ? '#2d6b27' : '#d0bf97',
            color: value ? '#1a2e1a' : '#a08c5b',
            boxShadow: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#1e5219'; e.target.style.boxShadow = '0 0 0 3px rgba(45,107,39,0.15)'; }}
          onBlur={(e) => { e.target.style.borderColor = value ? '#2d6b27' : '#d0bf97'; e.target.style.boxShadow = 'none'; }}
        >
          <option value="">— Select City —</option>
          {INDIA_LOCATIONS.map(({ state, cities }) => (
            <optgroup key={state} label={`📍 ${state}`}>
              {cities
                .filter((c) => c !== exclude)
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
  );

  return (
    <div
      className={`rounded-2xl shadow-2xl p-5 sm:p-7 ${className}`}
      style={{ background: '#ffffff', border: '1.5px solid #d0bf97' }}
    >
      {error && (
        <div
          className="mb-4 p-3 text-sm rounded-xl flex items-center space-x-2"
          style={{ background: '#fdf2f2', color: '#b91c1c', border: '1px solid #fca5a5' }}
        >
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-4">
        <div className={`grid grid-cols-1 ${isCompact ? 'md:grid-cols-3' : 'md:grid-cols-11'} gap-3 items-end`}>
          {/* Source */}
          <div className={isCompact ? 'col-span-1' : 'md:col-span-4'}>
            <SelectField
              label="From — Departure City"
              value={source}
              onChange={setSource}
              id="source-select"
              exclude={destination}
            />
          </div>

          {/* Swap Button */}
          {!isCompact && (
            <div className="hidden md:flex md:col-span-1 justify-center pb-0.5">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap cities"
                className="p-2.5 rounded-full border transition-all"
                style={{ background: '#f0f5ef', borderColor: '#7db575', color: '#1e5219' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#d6e8d3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f0f5ef'; }}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Destination */}
          <div className={isCompact ? 'col-span-1' : 'md:col-span-4'}>
            <SelectField
              label="To — Destination City"
              value={destination}
              onChange={setDestination}
              id="destination-select"
              exclude={source}
            />
          </div>

          {/* Date */}
          <div className={isCompact ? 'col-span-1' : 'md:col-span-2'}>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: '#1e5219' }}
            >
              Journey Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 absolute left-3 pointer-events-none" style={{ color: '#2d6b27' }} />
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-3 rounded-xl border font-medium text-sm outline-none transition-all"
                style={{
                  background: '#faf7f0',
                  borderColor: '#d0bf97',
                  color: '#1a2e1a',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#1e5219'; e.target.style.boxShadow = '0 0 0 3px rgba(45,107,39,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d0bf97'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-1 gap-3">
          <div className="flex items-center space-x-2 text-xs" style={{ color: '#7d6c42' }}>
            <span className="font-semibold">Quick:</span>
            {[
              { label: 'Today', days: 0 },
              { label: 'Tomorrow', days: 1 },
            ].map(({ label, days }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + days);
                  setDate(d.toISOString().split('T')[0]);
                }}
                className="px-3 py-1 rounded-lg font-semibold transition-all"
                style={{ background: '#f0f5ef', color: '#1e5219', border: '1px solid #afd1a9' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#d6e8d3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f0f5ef'; }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-3.5 font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 text-sm"
            style={{ background: '#1e5219', color: '#faf7f0', boxShadow: '0 4px 15px rgba(30,82,25,0.4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#163d12'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#1e5219'; }}
          >
            <Search className="w-5 h-5" />
            <span>Search Buses</span>
          </button>
        </div>
      </form>
    </div>
  );
}
