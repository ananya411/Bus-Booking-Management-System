import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, MapPin, ArrowRight, ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

export default function PassengerDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedBooking = sessionStorage.getItem('bbms_booking');
    if (!savedBooking) {
      navigate('/search');
      return;
    }

    try {
      const parsed = JSON.parse(savedBooking);
      setBookingData(parsed);

      // Initialize passenger objects for each selected seat
      const initialPassengers = (parsed.selectedSeats || []).map((seatNum) => ({
        seat_number: seatNum,
        name: '',
        age: '',
        gender: 'male',
      }));
      setPassengers(initialPassengers);

      if (user) {
        setContactEmail(user.email || '');
        setContactPhone(user.phone || '');
        if (initialPassengers.length > 0 && user.name) {
          initialPassengers[0].name = user.name;
        }
      }

      // Default boarding and dropping points from trip details
      const route = parsed.tripDetails?.Route || parsed.tripDetails?.route;
      const stops = route?.stops || [];
      if (stops.length > 0) {
        setBoardingPoint(stops[0].name || route.source || 'Main Terminal');
        setDroppingPoint(stops[stops.length - 1].name || route.destination || 'City Hub');
      } else {
        setBoardingPoint(route?.source ? `${route.source} Central Bus Stand` : 'Main Bus Terminal');
        setDroppingPoint(route?.destination ? `${route.destination} Bypass Junction` : 'City Center Station');
      }
    } catch (e) {
      navigate('/search');
    }
  }, [user, navigate]);

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear field-specific error
    if (errors[`passenger_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`passenger_${index}_${field}`]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    // Validate Contact
    if (!contactEmail.trim() || !/^\S+@\S+\.\S+$/.test(contactEmail)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!contactPhone.trim() || contactPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!boardingPoint) {
      errs.boardingPoint = 'Please select a boarding point';
    }
    if (!droppingPoint) {
      errs.droppingPoint = 'Please select a dropping point';
    }

    // Validate Each Passenger
    passengers.forEach((p, idx) => {
      if (!p.name.trim()) {
        errs[`passenger_${idx}_name`] = 'Passenger name is required';
      }
      const ageNum = parseInt(p.age, 10);
      if (!p.age || isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
        errs[`passenger_${idx}_age`] = 'Age must be between 1 and 100';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const passengerSubmission = {
      ...bookingData,
      passengers,
      contact: {
        email: contactEmail,
        phone: contactPhone,
      },
      boardingPoint,
      droppingPoint,
    };

    sessionStorage.setItem('bbms_booking', JSON.stringify(passengerSubmission));
    navigate('/booking/confirm');
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Seat Selection
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Passenger & Contact Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              Your ticket and journey updates will be sent to the contact info below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Passenger Forms */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-gray-900">Passenger Information</h2>

              {passengers.map((passenger, idx) => (
                <div
                  key={passenger.seat_number}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200/80 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                      Seat {passenger.seat_number}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Passenger #{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors[`passenger_${idx}_name`] ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                        }`}
                      />
                      {errors[`passenger_${idx}_name`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`passenger_${idx}_name`]}</p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Age *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                        placeholder="Age"
                        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors[`passenger_${idx}_age`] ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                        }`}
                      />
                      {errors[`passenger_${idx}_age`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`passenger_${idx}_age`]}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Gender *
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Boarding and Dropping Points */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Boarding & Dropping Locations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Boarding Point *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      placeholder="Enter Boarding Point"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Dropping Point *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={droppingPoint}
                      onChange={(e) => setDroppingPoint(e.target.value)}
                      placeholder="Enter Dropping Point"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="passenger@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white ${
                        errors.email ? 'border-red-400' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white ${
                        errors.phone ? 'border-red-400' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                <span>Your personal details are encrypted and securely stored.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <span>Proceed to Review & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
