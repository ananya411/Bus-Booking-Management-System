import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ShieldCheck, Headphones, Heart } from 'lucide-react';

const G = {
  forestDark: '#0f2a0c',
  forest: '#1a3a16',
  accent: '#7db575',
  beige: '#faf7f0',
  beigeMuted: '#d6e8d3',
  border: 'rgba(125,181,117,0.2)',
  textMuted: '#7db575',
};

export default function Footer() {
  return (
    <footer className="text-sm mt-auto" style={{ background: G.forestDark, color: '#8fba89' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2" style={{ color: G.beige }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: G.accent, color: G.forestDark }}>
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">BusMitra</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#7db575' }}>
              India's fastest growing smart bus ticketing platform. Book your journeys safely and conveniently with live seat selection and instant confirmations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-xs tracking-wider uppercase" style={{ color: G.beige }}>Quick Links</h4>
            <ul className="space-y-2 text-xs">
              {[{ to: '/', label: 'Home' }, { to: '/search', label: 'Search Buses' }, { to: '/my-bookings', label: 'My Bookings' }, { to: '/login', label: 'User Login' }].map(({ to, label }) => (
                <li key={to}><Link to={to} style={{ color: '#8fba89', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.color = G.beige; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#8fba89'; }}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-semibold mb-3 text-xs tracking-wider uppercase" style={{ color: G.beige }}>Popular Routes</h4>
            <ul className="space-y-2 text-xs">
              {[
                { s: 'Mumbai', d: 'Pune' },
                { s: 'Bangalore', d: 'Hyderabad' },
                { s: 'Delhi', d: 'Jaipur' },
                { s: 'Ahmedabad', d: 'Mumbai' },
              ].map(({ s, d }) => (
                <li key={s + d}><Link to={`/search?source=${s}&destination=${d}`} style={{ color: '#8fba89', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.color = G.beige; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#8fba89'; }}>{s} → {d}</Link></li>
              ))}
            </ul>
          </div>

          {/* Why BusMitra */}
          <div>
            <h4 className="font-semibold mb-3 text-xs tracking-wider uppercase" style={{ color: G.beige }}>Why BusMitra</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4" style={{ color: '#4ade80' }} /><span>100% Secure Payments</span></li>
              <li className="flex items-center space-x-2"><Headphones className="w-4 h-4" style={{ color: G.accent }} /><span>24×7 Customer Support</span></li>
              <li className="flex items-center space-x-2"><Bus className="w-4 h-4" style={{ color: '#fbbf24' }} /><span>Verified Bus Operators</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-xs" style={{ borderColor: G.border, color: '#5a7a56' }}>
          <p>© {new Date().getFullYear()} BusMitra Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Crafted with <Heart className="w-3.5 h-3.5 mx-1 fill-current" style={{ color: '#f87171' }} /> for safe and seamless travel.
          </p>
        </div>
      </div>
    </footer>
  );
}
