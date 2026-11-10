import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Tag, RefreshCw, Clock, ArrowRight, Award, Bus } from 'lucide-react';
import SearchForm from '../components/SearchForm';

const G = {
  forestDark: '#0f2a0c',
  forest:     '#1a3a16',
  forestMid:  '#1e5219',
  forestLight:'#2d6b27',
  accent:     '#7db575',
  beige50:    '#faf7f0',
  beige100:   '#f5f0e8',
  beige200:   '#ede4d0',
  beige300:   '#e0d3b5',
  beigeDark:  '#a08c5b',
};

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
    { icon: <ShieldCheck className="w-7 h-7" style={{ color: G.forestMid }} />, title: 'Safe & Sanitized Travel', description: 'Partnered with top-rated operators ensuring verified sanitization, GPS tracking, and vetted staff.' },
    { icon: <Tag className="w-7 h-7" style={{ color: G.forestMid }} />, title: 'Guaranteed Best Prices', description: 'Zero booking fees, live discounts, and transparent fares with no hidden surcharges ever.' },
    { icon: <RefreshCw className="w-7 h-7" style={{ color: G.forestMid }} />, title: 'Instant & Easy Refund', description: 'Plans changed? Cancel in 1-click and receive swift automated refunds directly to your account.' },
  ];

  const steps = [
    { number: '01', title: 'Search & Compare', description: 'Select your departure city, destination, and journey date to browse dozens of verified bus operators.' },
    { number: '02', title: 'Select Seats', description: 'Pick your preferred seat with our interactive visual seating map and select boarding & drop points.' },
    { number: '03', title: 'Instant E-Ticket', description: 'Complete booking seamlessly and receive your confirmed digital ticket with live PNR tracking.' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: G.beige100 }}>
      {/* Hero Section */}
      <section
        className="relative pt-16 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${G.forestDark} 0%, ${G.forest} 50%, ${G.forestMid} 100%)` }}
      >
        {/* Decorative dots */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: G.accent, opacity: 0.12 }} />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: G.accent, opacity: 0.1 }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm"
            style={{ background: 'rgba(125,181,117,0.15)', border: '1px solid rgba(125,181,117,0.3)', color: G.accent }}
          >
            <Award className="w-4 h-4" />
            <span>India's Trusted Smart Bus Booking Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: G.beige50 }}>
            Book Your Bus Tickets{' '}
            <span style={{ color: G.accent, textDecoration: 'underline', textDecorationColor: 'rgba(125,181,117,0.5)' }}>Online</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#b8d4b4' }}>
            Experience effortless intercity travel with BusMitra. Discover luxury AC sleepers, express volvos, and reliable transit with live seat selection — across all Indian states.
          </p>
        </div>
      </section>

      {/* Floating Search Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 w-full">
        <SearchForm />
      </div>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: G.forest }}>Why Commute with BusMitra?</h2>
          <p className="mt-2 text-sm" style={{ color: G.beigeDark }}>Built for speed, safety, and utmost passenger comfort.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl p-8 shadow-md border hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ background: '#fff', borderColor: G.beige200 }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#f0f5ef' }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: G.forest }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5a4d2e' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-y w-full" style={{ background: '#fff', borderColor: G.beige200 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: G.forestLight }}>Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: G.forest }}>Book In 3 Easy Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative p-6 rounded-2xl border" style={{ background: G.beige50, borderColor: G.beige200 }}>
                <div className="text-4xl font-extrabold font-mono mb-2" style={{ color: 'rgba(45,107,39,0.2)' }}>{s.number}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: G.forest }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7d6c42' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: G.forestLight }}>Trending Now</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: G.forest }}>Popular Bus Routes</h2>
          </div>
          <Link to="/search" className="text-sm font-semibold flex items-center space-x-1 transition-colors" style={{ color: G.forestMid, textDecoration: 'none' }}>
            <span>View all routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.map((route, i) => (
            <Link
              key={i}
              to={`/search?source=${encodeURIComponent(route.source)}&destination=${encodeURIComponent(route.destination)}`}
              className="rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-all group"
              style={{ background: '#fff', borderColor: G.beige200, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = G.accent; e.currentTarget.style.boxShadow = '0 8px 25px rgba(45,107,39,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = G.beige200; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
            >
              <div>
                <div className="flex items-center space-x-2 font-bold text-lg mb-3" style={{ color: G.forest }}>
                  <span>{route.source}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: G.accent }} />
                  <span>{route.destination}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs mb-3" style={{ color: '#a08c5b' }}>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{route.duration}</span>
                  <span className="flex items-center"><Bus className="w-3.5 h-3.5 mr-1" />{route.busCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: G.beige200 }}>
                <span className="text-xs" style={{ color: '#a08c5b' }}>Starting from</span>
                <span className="text-lg font-black" style={{ color: G.forestMid }}>{route.fare}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 mt-auto" style={{ background: `linear-gradient(135deg, ${G.forestDark} 0%, ${G.forestMid} 100%)` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-bold" style={{ color: G.beige50 }}>Ready to travel with peace of mind?</h3>
            <p className="text-sm" style={{ color: '#b8d4b4' }}>Join over 100,000+ happy passengers who travel smarter with BusMitra every month.</p>
          </div>
          <Link
            to="/search"
            className="px-8 py-3.5 font-bold rounded-xl shadow-lg transition-all whitespace-nowrap"
            style={{ background: G.accent, color: G.forestDark, textDecoration: 'none', boxShadow: '0 4px 15px rgba(125,181,117,0.4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#52964a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = G.accent; e.currentTarget.style.color = G.forestDark; }}
          >
            Find Your Bus Now
          </Link>
        </div>
      </section>
    </div>
  );
}
