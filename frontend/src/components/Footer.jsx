import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ShieldCheck, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">BusMitra</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              India's fastest growing smart bus ticketing platform. Book your journeys safely and conveniently with live seat selection and instant confirmations.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">Search Buses</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">User Login</Link>
              </li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Popular Routes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?source=Mumbai&destination=Pune" className="hover:text-white transition-colors">Mumbai → Pune</Link></li>
              <li><Link to="/search?source=Bangalore&destination=Hyderabad" className="hover:text-white transition-colors">Bangalore → Hyderabad</Link></li>
              <li><Link to="/search?source=Delhi&destination=Jaipur" className="hover:text-white transition-colors">Delhi → Jaipur</Link></li>
              <li><Link to="/search?source=Ahmedabad&destination=Mumbai" className="hover:text-white transition-colors">Ahmedabad → Mumbai</Link></li>
            </ul>
          </div>

          {/* Support & Trust */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Why BusMitra</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Secure Payments</span>
              </li>
              <li className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-indigo-400" />
                <span>24x7 Customer Support</span>
              </li>
              <li className="flex items-center space-x-2">
                <Bus className="w-4 h-4 text-amber-400" />
                <span>Verified Bus Operators</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BusMitra Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-current" /> for safe and seamless travel.
          </p>
        </div>
      </div>
    </footer>
  );
}
