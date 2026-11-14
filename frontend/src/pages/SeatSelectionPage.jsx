import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Bus, ChevronLeft, ArrowRight, Check, Disc, Shield } from 'lucide-react';

export default function SeatSelectionPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [seatsData, setSeatsData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTripAndSeats();
  }, [tripId]);

  const fetchTripAndSeats = async () => {
    setLoading(true);
    setError('');
    try {
      const [tripRes, seatsRes] = await Promise.allSettled([
        tripApi.getTripById(tripId),
        tripApi.getTripSeats(tripId),
      ]);

      let tripObj = null;
      if (tripRes.status === 'fulfilled') {
        tripObj = tripRes.value.data?.trip || tripRes.value.data || tripRes.value;
        setTrip(tripObj);
      }

      let fetchedSeats = [];
      if (seatsRes.status === 'fulfilled') {
        fetchedSeats = seatsRes.value.data?.seats || seatsRes.value.data || [];
      }

      // If backend didn't return pre-formatted seats, synthesize realistic seat map from bus total_seats
      if (!Array.isArray(fetchedSeats) || fetchedSeats.length === 0) {
        const total = tripObj?.Bus?.total_seats || tripObj?.bus?.total_seats || 36;
        const bookedSeatNumbers = tripObj?.booked_seats || tripObj?.bookedSeats || [3, 4, 11, 12, 19, 27];

        const generated = [];
        const rows = Math.ceil(total / 4);
        let seatCounter = 1;

        for (let r = 1; r <= rows; r++) {
          const colLetters = ['A', 'B', 'C', 'D'];
          for (let c = 0; c < 4; c++) {
            if (seatCounter <= total) {
              const seatNum = `${r}${colLetters[c]}`;
              const isBooked = bookedSeatNumbers.includes(seatCounter) || bookedSeatNumbers.includes(seatNum);
              generated.push({
                seat_number: seatNum,
                seat_id: seatCounter,
                is_booked: isBooked,
                status: isBooked ? 'booked' : 'available',
                row: r,
                column: colLetters[c],
              });
              seatCounter++;
            }
          }
        }
        setSeatsData(generated);
      } else {
        setSeatsData(fetchedSeats);
      }
    } catch (err) {
      setError(err.message || 'Error fetching seat availability');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    const isBooked = seat.is_booked || seat.status === 'booked' || seat.status === 'reserved';
    if (isBooked) return;

    const seatNumber = seat.seat_number || seat.seatNumber || String(seat.seat_id);
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const farePerSeat = Number(trip?.fare || trip?.base_fare || 500);
  const totalFare = selectedSeats.length * farePerSeat;

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to continue.');
      return;
    }

    // Save booking session
    const bookingSession = {
      tripId,
      selectedSeats,
      farePerSeat,
      totalFare,
      tripDetails: trip,
    };
    sessionStorage.setItem('bbms_booking', JSON.stringify(bookingSession));

    navigate('/booking/passenger-details');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Loading bus seat layout..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-gray-600 hover:text-brand-dark transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Trip Details
        </button>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Header Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-dark font-bold text-xs uppercase tracking-wider mb-1">
              <Bus className="w-4 h-4 text-brand-accent" />
              <span>{trip?.Bus?.bus_type || trip?.bus_type || 'Luxury Bus'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {trip?.Bus?.name || trip?.bus_name || 'Express Line'} • Seat Selection
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {trip?.Route?.source || 'Source'} → {trip?.Route?.destination || 'Destination'} • Departure: {trip?.departure_time || '08:00'}
            </p>
          </div>

          {/* Seat Status Legend */}
          <div className="flex items-center space-x-5 text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md border border-gray-300 bg-white" />
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-brand-accent border border-brand-accent-hover" />
              <span className="text-gray-900 font-bold">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-red-100 border border-red-300" />
              <span className="text-gray-600">Booked</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Bus Layout + Cart Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Seat Layout Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col items-center">
            {/* Bus Cabin Visual Wrapper */}
            <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-3xl p-6 bg-gray-50/60 relative">
              {/* Driver Area */}
              <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  Front / Cabin
                </span>
                <div className="flex items-center space-x-2 bg-gray-200/80 px-3 py-1.5 rounded-xl text-gray-600 text-xs font-semibold">
                  <Disc className="w-4 h-4 animate-spin-slow text-gray-700" />
                  <span>Driver</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-3.5">
                {/* Group seats by rows */}
                {(() => {
                  // Organize seats into rows
                  const rowsMap = {};
                  seatsData.forEach((seat, index) => {
                    const rowKey = seat.row || Math.floor(index / 4) + 1;
                    if (!rowsMap[rowKey]) rowsMap[rowKey] = [];
                    rowsMap[rowKey].push(seat);
                  });

                  return Object.entries(rowsMap).map(([rowNum, rowSeats]) => {
                    // Left 2 seats and Right 2 seats with aisle
                    const leftSeats = rowSeats.slice(0, 2);
                    const rightSeats = rowSeats.slice(2, 4);

                    return (
                      <div key={rowNum} className="flex justify-between items-center">
                        {/* Left seats pair */}
                        <div className="flex space-x-2.5">
                          {leftSeats.map((seat) => renderSeatButton(seat))}
                        </div>

                        {/* Aisle indicator */}
                        <div className="text-[10px] font-mono text-gray-300 uppercase px-3 select-none">
                          aisle
                        </div>

                        {/* Right seats pair */}
                        <div className="flex space-x-2.5">
                          {rightSeats.map((seat) => renderSeatButton(seat))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Rear area */}
              <div className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-6 pt-3 border-t border-gray-200">
                Rear End
              </div>
            </div>
          </div>

          {/* Right Fare & Selection Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Booking Summary
            </h3>

            {/* Selected Seats chips */}
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-2">
                Selected Seats ({selectedSeats.length})
              </span>
              {selectedSeats.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No seats selected yet. Click on available seats to add them.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seatNum) => (
                    <span
                      key={seatNum}
                      className="inline-flex items-center px-3 py-1 bg-brand-accent/20 border border-brand-accent/50 text-brand-dark text-xs font-bold rounded-lg"
                    >
                      Seat {seatNum}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Base Fare (per seat)</span>
                <span className="font-semibold text-gray-800">₹{farePerSeat}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Seats Selected</span>
                <span className="font-semibold text-gray-800">× {selectedSeats.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Service Fees</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-black text-brand-dark">₹{totalFare}</span>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="w-full py-3.5 bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-extrabold rounded-xl shadow-lg shadow-brand-accent/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function renderSeatButton(seat) {
    const seatNumber = seat.seat_number || seat.seatNumber || String(seat.seat_id);
    const isBooked = seat.is_booked || seat.status === 'booked' || seat.status === 'reserved';
    const isSelected = selectedSeats.includes(seatNumber);

    let baseClasses =
      'w-11 h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all duration-200 relative select-none';

    if (isBooked) {
      return (
        <div
          key={seatNumber}
          title={`Seat ${seatNumber} is already booked`}
          className={`${baseClasses} bg-red-50 text-red-400 border border-red-200 cursor-not-allowed opacity-75`}
        >
          <span>{seatNumber}</span>
          <span className="text-[8px] uppercase tracking-tighter">Booked</span>
        </div>
      );
    }

    if (isSelected) {
      return (
        <button
          key={seatNumber}
          type="button"
          onClick={() => toggleSeat(seat)}
          title={`Seat ${seatNumber} selected. Click to remove.`}
          className={`${baseClasses} bg-brand-accent text-brand-dark border-2 border-brand-accent-hover shadow-md shadow-brand-accent/30 font-black transform scale-105`}
        >
          <span>{seatNumber}</span>
          <Check className="w-3.5 h-3.5 text-brand-dark stroke-[3]" />
        </button>
      );
    }

    return (
      <button
        key={seatNumber}
        type="button"
        onClick={() => toggleSeat(seat)}
        title={`Seat ${seatNumber} available. Click to select.`}
        className={`${baseClasses} bg-white text-gray-700 border-2 border-gray-300 hover:border-brand-accent hover:bg-brand-accent/10 hover:text-brand-dark shadow-sm`}
      >
        <span>{seatNumber}</span>
      </button>
    );
  }
}
