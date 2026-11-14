import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bus,
  LogOut,
  Ticket,
  Shield,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Globe,
  Radio,
  Briefcase,
  HelpCircle,
  MapPin,
  Compass,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';
import ManageBookingModal from './ManageBookingModal';
import TripTrackerModal from './TripTrackerModal';
import ServiceModal from './ServiceModal';
import ExploreMapModal from './ExploreMapModal';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isOperator } = useAuth();
  const { t, language, setLanguage, currentLangMeta, supportedLanguages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [planMenuOpen, setPlanMenuOpen] = useState(false);

  // Modal states
  const [showManageBooking, setShowManageBooking] = useState(false);
  const [showTripTracker, setShowTripTracker] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showExploreMap, setShowExploreMap] = useState(false);
  const [trackerBusNumber, setTrackerBusNumber] = useState('');

  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const planRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Close menus on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (planRef.current && !planRef.current.contains(e.target)) {
        setPlanMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close drawers on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setLangMenuOpen(false);
    setPlanMenuOpen(false);
  }, [location.pathname]);

  const handleOpenTrackerFromBooking = (busNo) => {
    setTrackerBusNumber(busNo);
    setShowTripTracker(true);
  };

  return (
    <>
      <header className="bg-brand-dark border-b border-gray-800 sticky top-0 z-40 shadow-nav select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ───────────── LEFT: Logo ───────────── */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center group py-0.5">
                <Logo className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105" />
              </Link>
            </div>

            {/* ───────────── CENTER: Main Navigation (Desktop) ───────────── */}
            <nav className="hidden lg:flex items-center gap-7">
              {/* Plan Your Journey Dropdown */}
              <div className="relative" ref={planRef}>
                <button
                  type="button"
                  onClick={() => setPlanMenuOpen(!planMenuOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors py-2"
                >
                  <span>{t('nav.planJourney', 'Plan Your Journey')}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      planMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {planMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-brand-darker border border-gray-700 shadow-dropdown py-1.5 z-50 animate-slide-down">
                    <button
                      type="button"
                      onClick={() => {
                        setPlanMenuOpen(false);
                        setShowExploreMap(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-brand-accent flex items-center gap-2.5 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-brand-accent" />
                      <span>{t('nav.routeMap', 'Explore Route Map')}</span>
                    </button>
                    <Link
                      to="/search"
                      onClick={() => setPlanMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-brand-accent flex items-center gap-2.5 transition-colors"
                    >
                      <Bus className="w-4 h-4 text-emerald-400" />
                      <span>{t('search.submit', 'Search All Buses')}</span>
                    </Link>
                    <a
                      href="#popular-corridors"
                      onClick={() => setPlanMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-gray-800/80 hover:text-brand-accent flex items-center gap-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{t('dest.title', 'Top Destinations')}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Service button */}
              <button
                type="button"
                onClick={() => setShowServiceModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('nav.services', 'Services')}</span>
              </button>

              {/* Manage My Booking button */}
              <button
                type="button"
                onClick={() => setShowManageBooking(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-brand-accent transition-colors"
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('nav.manageBooking', 'Manage My Booking')}</span>
              </button>

              {/* Trip Tracker button */}
              <button
                type="button"
                onClick={() => setShowTripTracker(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{t('nav.liveTracker', 'Trip Tracker')}</span>
              </button>

              {/* Help button */}
              <Link
                to="/support"
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                <span>{t('nav.support', 'Help')}</span>
              </Link>
            </nav>

            {/* ───────────── RIGHT: Language & Auth (Desktop) ───────────── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher Dropdown (Fixed to INR) */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700/80 hover:border-brand-accent/50 bg-gray-900/70 hover:bg-gray-800 transition-all shadow-sm"
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="font-medium">{currentLangMeta.native}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-brand-darker border border-gray-700 shadow-dropdown p-2 z-50 animate-slide-down text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 px-2 block mb-1">
                      {t('nav.language', 'Language')}
                    </span>
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          language === l.code
                            ? 'bg-brand-accent text-brand-dark font-bold'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{l.native}</span>
                          <span className={`text-[10px] ${language === l.code ? 'text-brand-dark/80' : 'text-gray-500'}`}>{l.label}</span>
                        </div>
                        {language === l.code && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth Button or User Profile */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-700 bg-gray-900 text-white hover:border-gray-500 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center text-[11px] font-bold uppercase text-brand-dark">
                      {user?.name ? user.name[0] : 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name || user?.email}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-brand-darker border border-gray-700 shadow-dropdown py-1 z-50 animate-slide-down text-xs">
                      <div className="px-4 py-2.5 border-b border-gray-800">
                        <p className="font-bold text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-brand-accent/20 text-brand-accent">
                          {user?.role || 'customer'}
                        </span>
                      </div>

                      <Link
                        to="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <Ticket className="w-3.5 h-3.5 mr-2 text-brand-accent" />
                        {t('nav.myBookings', 'My Bookings')}
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-brand-accent hover:bg-gray-800 transition-colors font-semibold"
                        >
                          <Shield className="w-3.5 h-3.5 mr-2" />
                          {t('nav.adminPortal', 'Admin Portal')}
                        </Link>
                      )}

                      {isOperator && (
                        <Link
                          to="/operator/trips"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-brand-accent hover:bg-gray-800 transition-colors font-semibold"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                          {t('nav.operatorPortal', 'Operator Dashboard')}
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10 border-t border-gray-800 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        {t('nav.signOut', 'Sign Out')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark transition-all duration-200"
                >
                  {t('nav.signIn', 'Sign in')}
                </Link>
              )}
            </div>

            {/* ───────────── MOBILE: Hamburger Toggle ───────────── */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTripTracker(true)}
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-gray-800 transition-colors"
                title="Live Trip Tracker"
              >
                <Radio className="w-5 h-5 animate-pulse" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ───────────── MOBILE: Drawer ───────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-darker border-t border-gray-800 px-4 pt-3 pb-6 space-y-2 animate-slide-down text-sm">
            {/* Language Selection Bar in Mobile */}
            <div className="py-2 border-b border-gray-800">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('nav.language', 'Language')}</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between border transition-all ${
                      language === l.code
                        ? 'bg-brand-accent text-brand-dark font-bold border-brand-accent shadow-sm'
                        : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <span>{l.native}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowExploreMap(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 flex items-center gap-2.5"
            >
              <Compass className="w-4 h-4 text-brand-accent" />
              <span>{t('nav.routeMap', 'Explore Route Map')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowManageBooking(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 flex items-center gap-2.5"
            >
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>{t('nav.manageBooking', 'Manage My Booking')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowTripTracker(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 flex items-center gap-2.5"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>{t('nav.liveTracker', 'Live Trip Tracker')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowServiceModal(true);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 flex items-center gap-2.5"
            >
              <Briefcase className="w-4 h-4 text-brand-accent" />
              <span>{t('nav.services', 'Services (Luggage, Wi-Fi, Mobility)')}</span>
            </button>

            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800"
            >
              {t('nav.support', 'Help & Support')}
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-gray-800 space-y-2">
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-white font-medium bg-gray-900"
                >
                  {t('nav.myBookings', 'My Bookings')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-brand-accent font-semibold"
                  >
                    {t('nav.adminPortal', 'Admin Portal')}
                  </Link>
                )}
                {isOperator && (
                  <Link
                    to="/operator/trips"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-brand-accent font-semibold"
                  >
                    {t('nav.operatorPortal', 'Operator Trips')}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.signOut', 'Sign Out')} ({user?.name || user?.email})</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-800">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-xs font-bold rounded-xl border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark transition-all"
                >
                  {t('nav.signIn', 'Sign in / Register')}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Modals invoked from Navbar */}
      <ManageBookingModal
        isOpen={showManageBooking}
        onClose={() => setShowManageBooking(false)}
        onTrackBus={handleOpenTrackerFromBooking}
      />

      <TripTrackerModal
        isOpen={showTripTracker}
        onClose={() => {
          setShowTripTracker(false);
          setTrackerBusNumber('');
        }}
        initialBusNumber={trackerBusNumber}
      />

      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
      />

      <ExploreMapModal
        isOpen={showExploreMap}
        onClose={() => setShowExploreMap(false)}
      />
    </>
  );
}
