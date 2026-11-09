import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Tag, RefreshCw, MapPin, Clock, ArrowRight, Star, Award, CheckCircle2, Bus } from 'lucide-react';
import SearchForm from '../components/SearchForm';

export default function HomePage() {
  const popularRoutes = [
    { source: 'Mumbai', destination: 'Pune', duration: '3h 30m', fare: '₹350', busCount: '45+ buses daily' },
    { source: 'Bangalore', destination: 'Hyderabad', duration: '8h 45m', fare: '₹750', busCount: '32+ buses daily' },
    { source: 'Delhi', destination: 'Jaipur', duration: '5h 15m', fare: '₹450', busCount: '50+ buses daily' },
    { source: 'Ahmedabad', destination: 'Mumbai', duration: '9h 00m', fare: '₹800', busCount: '28+ buses daily' },
    { source: 'Chennai', destination: 'Bangalore', duration: '6h 30m', fare: '₹550', busCount: '38+ buses daily' },
    { source: 'Pune', destination: 'Goa', duration: '10h 15m', fare: '₹950', busCount: '20+ buses daily' },
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      title: 'Safe & Sanitized Travel',
      description: 'Partnered with top-rated operators ensuring verified sanitization, GPS tracking, and vetted staff.',
    },
    {
      icon: <Tag className="w-8 h-8 text-indigo-600" />,
      title: 'Guaranteed Best Prices',
      description: 'Zero booking fees, live discounts, and transparent fares with no hidden surcharges ever.',
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-indigo-600" />,
      title: 'Instant & Easy Refund',
      description: 'Plans changed? Cancel in 1-click and receive swift automated refunds directly to your account.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Search & Compare',
      description: 'Enter your departure city, destination, and journey date to browse dozens of verified bus operators.',
    },
    {
      number: '02',
      title: 'Select Seats',
      description: 'Pick your preferred seat with our interactive visual seating map and select boarding & drop points.',
    },
    {
      number: '03',
      title: 'Instant E-Ticket',
      description: 'Complete booking seamlessly and receive your confirmed digital ticket with live PNR tracking.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-800/80 border border-indigo-700/60 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-200 mb-6 backdrop-blur-sm">
            <Award className="w-4 h-4 text-indigo-300" />
            <span>India's Trusted Smart Bus Booking Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Book Your Bus Tickets <span className="text-indigo-300 underline decoration-indigo-400/50">Online</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-indigo-100/90 max-w-2xl mx-auto leading-relaxed">
            Experience effortless intercity travel with BusMitra. Discover luxury AC sleepers, express volvos, and reliable transit with live seat selection.
          </p>
        </div>
      </section>

      {/* Floating Search Form Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 w-full">
        <SearchForm />
      </div>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Commute with BusMitra?</h2>
          <p className="mt-2 text-gray-600">Built for speed, safety, and utmost passenger comfort.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 bg-white border-y border-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Book In 3 Easy Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-4xl font-extrabold text-indigo-600/30 mb-2 font-mono">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Trending Now</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Popular Bus Routes</h2>
          </div>
          <Link
            to="/search"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View all routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.map((route, idx) => (
            <Link
              key={idx}
              to={`/search?source=${encodeURIComponent(route.source)}&destination=${encodeURIComponent(route.destination)}`}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-900 font-bold text-lg">
                    <span>{route.source}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                    <span>{route.destination}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {route.duration}
                  </span>
                  <span className="flex items-center">
                    <Bus className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {route.busCount}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs text-gray-500">Starting from</span>
                <span className="text-lg font-bold text-indigo-600">{route.fare}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety Banner */}
      <section className="bg-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Ready to travel with peace of mind?</h3>
            <p className="text-indigo-100 text-sm">Join over 100,000+ happy passengers who travel smarter with BusMitra every month.</p>
          </div>
          <Link
            to="/search"
            className="px-8 py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Find Your Bus Now
          </Link>
        </div>
      </section>
    </div>
  );
}
