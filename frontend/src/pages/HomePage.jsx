import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bus,
  MapPin,
  Calendar,
  Compass,
  Smartphone,
  QrCode,
  ShieldCheck,
  Wifi,
  Zap,
  Leaf,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Radio,
  Ticket,
  Sparkles,
  Award
} from 'lucide-react';
import SearchForm from '../components/SearchForm';
import Logo from '../components/Logo';
import ExploreMapModal from '../components/ExploreMapModal';
import AppDownloadModal from '../components/AppDownloadModal';
import ManageBookingModal from '../components/ManageBookingModal';
import TripTrackerModal from '../components/TripTrackerModal';
import ServiceModal from '../components/ServiceModal';
import heroBgImage from '../Assets/Sunset Highway Journey with BusMitra.webp';
import { useLanguage } from '../context/LanguageContext';

// Top Intercity Destinations
const CITIES_LIST = [
  { name: 'Delhi', state: 'Delhi NCR', buses: '140+ daily departures', image: '🏛️' },
  { name: 'Mumbai', state: 'Maharashtra', buses: '180+ daily departures', image: '🌆' },
  { name: 'Bangalore', state: 'Karnataka', buses: '160+ daily departures', image: '🏙️' },
  { name: 'Pune', state: 'Maharashtra', buses: '120+ daily departures', image: '🌄' },
  { name: 'Hyderabad', state: 'Telangana', buses: '110+ daily departures', image: '🏰' },
  { name: 'Lucknow', state: 'Uttar Pradesh', buses: '95+ daily departures', image: '🕌' },
  { name: 'Jaipur', state: 'Rajasthan', buses: '85+ daily departures', image: '🛕' },
  { name: 'Ahmedabad', state: 'Gujarat', buses: '75+ daily departures', image: '🏢' },
  { name: 'Chennai', state: 'Tamil Nadu', buses: '130+ daily departures', image: '🌊' },
  { name: 'Kolkata', state: 'West Bengal', buses: '70+ daily departures', image: '🌉' },
  { name: 'Goa (Panaji)', state: 'Goa', buses: '45+ daily departures', image: '🏖️' },
  { name: 'Chandigarh', state: 'Punjab', buses: '65+ daily departures', image: '🌲' },
  { name: 'Varanasi', state: 'Uttar Pradesh', buses: '80+ daily departures', image: '🛕' },
  { name: 'Kochi', state: 'Kerala', buses: '95+ daily departures', image: '🌴' },
  { name: 'Agra', state: 'Uttar Pradesh', buses: '110+ daily departures', image: '🕌' },
  { name: 'Surat', state: 'Gujarat', buses: '90+ daily departures', image: '💎' },
];

// Popular Intercity Corridors
const CONNECTIONS_LIST = [
  { s: 'Mumbai', d: 'Pune', duration: '3h 30m', fare: '₹350', freq: 'Every 20 mins', tag: 'Most Popular' },
  { s: 'Delhi', d: 'Lucknow', duration: '8h 15m', fare: '₹799', freq: 'Hourly departures', tag: 'Fast Express' },
  { s: 'Bangalore', d: 'Hyderabad', duration: '8h 45m', fare: '₹750', freq: '32+ buses daily', tag: 'Overnight AC' },
  { s: 'Delhi', d: 'Jaipur', duration: '5h 00m', fare: '₹450', freq: '50+ buses daily', tag: 'Best Value' },
  { s: 'Ahmedabad', d: 'Mumbai', duration: '8h 30m', fare: '₹800', freq: 'Every 45 mins', tag: 'Volvo Multi-Axle' },
  { s: 'Chennai', d: 'Bangalore', duration: '6h 15m', fare: '₹550', freq: '38+ buses daily', tag: 'Executive AC' },
  { s: 'Pune', d: 'Goa', duration: '9h 30m', fare: '₹950', freq: '20+ buses daily', tag: 'Holiday Sleeper' },
  { s: 'Delhi', d: 'Chandigarh', duration: '4h 30m', fare: '₹400', freq: '40+ buses daily', tag: 'Frequent Express' },
  { s: 'Delhi', d: 'Agra', duration: '3h 30m', fare: '₹380', freq: 'Every 30 mins', tag: 'Yamuna Expressway' },
  { s: 'Bangalore', d: 'Mysore', duration: '3h 00m', fare: '₹280', freq: 'Every 15 mins', tag: 'Direct Highway' },
  { s: 'Hyderabad', d: 'Vijayawada', duration: '5h 15m', fare: '₹550', freq: '28+ buses daily', tag: 'Deccan Express' },
  { s: 'Jaipur', d: 'Jodhpur', duration: '5h 45m', fare: '₹480', freq: '22+ buses daily', tag: 'Heritage Link' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Modals
  const [showMapModal, setShowMapModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showManageBooking, setShowManageBooking] = useState(false);
  const [showTripTracker, setShowTripTracker] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [trackerBusNo, setTrackerBusNo] = useState('');

  // Top destinations tab: 'cities' | 'connections'
  const [destTab, setDestTab] = useState('connections');
  const [expandedContent, setExpandedContent] = useState(false);

  const handleBookConnection = (s, d) => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?source=${encodeURIComponent(s)}&destination=${encodeURIComponent(d)}&date=${today}`);
  };

  const handleCitySearch = (city) => {
    navigate(`/search?source=${encodeURIComponent(city)}`);
  };

  return (
    <div className="w-full bg-brand-gray text-gray-800">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO & SEARCH MASK SECTION (Real-world Product Experience)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-darker text-white pt-10 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-800/80">
        {/* Background Photography Layer: Real-World Highway Journey */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={heroBgImage}
            alt="BusMitra Sunset Highway Express Journey"
            className="w-full h-full object-cover object-[center_42%] select-none filter brightness-[1.75] contrast-[1.08] saturate-[1.12]"
            loading="eager"
            decoding="async"
          />

          {/* Cinematic Color Grading & Contrast Masks */}
          {/* 1. Deep brand noir multiplier to unify lighting */}
          <div className="absolute inset-0 bg-[#011810]/65 mix-blend-multiply" />

          {/* 2. Directional left-to-right gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#011810]/98 via-[#011810]/80 to-[#011810]/35" />

          {/* 3. Vertical top-to-bottom vignette for seamless header & section blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#011810]/85 via-transparent to-[#011810]" />

          {/* 4. Atmospheric ambient glow matching coach lighting */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[320px] bg-brand-accent/10 rounded-full blur-[110px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[90px]" />

          {/* 5. Precision technical dot-matrix grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(#6DCE05 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Pill / Breadcrumb & Action bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#011810]/80 border border-white/15 text-brand-accent backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge', 'Pan-India Intercity Coach Network · 10,000+ Daily Routes')}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/40 border border-white/10 text-gray-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span>{t('hero.expressCorridors', 'Express Golden Corridors')}</span>
              </div>

              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/50 hover:bg-[#061D15] border border-white/15 text-gray-200 hover:text-white backdrop-blur-md transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('hero.exploreMap', 'Explore Map')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTripTracker(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/50 hover:bg-[#061D15] border border-white/15 text-emerald-400 hover:text-white backdrop-blur-md transition-colors shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{t('hero.liveTracker', 'Live Tracker')}</span>
              </button>
            </div>
          </div>

          {/* Main Headline */}
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              {t('hero.title', 'Bus Travel across India,')}{' '}
              <span className="text-brand-accent underline decoration-brand-accent/40 decoration-wavy">
                {t('hero.titleAccent', 'seat by seat.')}
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
              {t('hero.subtitle', 'Pick the exact berth you want, track your coach in real time, and carry your digital ticket right on your phone. Daily express volvos and luxury sleepers.')}
            </p>

            {/* Micro Feature Trust Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('hero.zeroFee', 'Zero Booking Fees')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('hero.gpsTracking', 'Live GPS Tracking')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('hero.instantTicket', 'Instant M-Ticket')}</span>
              </span>
            </div>
          </div>

          {/* Floating Enhanced Search Mask Form */}
          <div className="w-full relative z-10 drop-shadow-2xl">
            <SearchForm className="backdrop-blur-xl bg-[#011810]/92 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)]" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. BUSMITRA SMART APP EXPERIENCE ("TRAVEL WITH EASE OF MIND")
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
        <div className="bg-brand-dark rounded-2xl border border-gray-700/80 p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-brand-accent/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <Logo className="h-10 sm:h-12 w-auto" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{t('app.badge', 'Next-Gen Mobile Booking')}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t('app.title', 'Get the app and travel with ease of mind')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t('app.subtitle', 'Everything for your trip in one place: live GPS bus tracking, offline boarding tickets, easy seat upgrades, and instant delay notifications.')}
              </p>

              {/* 4 Feature Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                  <Ticket className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t('app.digitalTicket', 'Digital ticket')}</h4>
                    <p className="text-[11px] text-gray-400">{t('app.digitalTicketDesc', 'Board with phone QR scan')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                  <Radio className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t('app.liveTracking', 'Live tracking')}</h4>
                    <p className="text-[11px] text-gray-400">{t('app.liveTrackingDesc', 'Real-time bus ETA & stops')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t('app.easyCancel', 'Easy cancellations')}</h4>
                    <p className="text-[11px] text-gray-400">{t('app.easyCancelDesc', 'Automated instant refund credit')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t('app.support247', '24/7 dedicated support')}</h4>
                    <p className="text-[11px] text-gray-400">{t('app.support247Desc', 'In-app chat & toll-free helpline')}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppModal(true)}
                  className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Get it on Google Play</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAppModal(true)}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Download on App Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAppModal(true)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-brand-accent" />
                  <span>Scan to download App</span>
                </button>
              </div>
            </div>

            {/* Right: Interactive Phone Preview & QR box (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div
                onClick={() => setShowAppModal(true)}
                className="cursor-pointer bg-gray-900 border border-gray-700/80 hover:border-brand-accent/60 p-5 rounded-2xl shadow-xl flex items-center gap-5 transition-all group"
              >
                {/* SVG QR Code */}
                <div className="w-24 h-24 bg-white p-2 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-brand-dark">
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#111827" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="14" y="14" width="10" height="10" rx="1" fill="#111827" />
                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#111827" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="76" y="14" width="10" height="10" rx="1" fill="#111827" />
                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#111827" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
                    <rect x="14" y="76" width="10" height="10" rx="1" fill="#111827" />
                    <rect x="38" y="38" width="8" height="8" rx="1" fill="#6DCE05" />
                    <rect x="52" y="38" width="6" height="6" fill="#111827" />
                    <rect x="64" y="38" width="6" height="6" fill="#111827" />
                    <rect x="38" y="52" width="6" height="6" fill="#111827" />
                    <rect x="50" y="50" width="8" height="8" fill="#111827" />
                    <rect x="78" y="50" width="6" height="6" fill="#111827" />
                    <rect x="62" y="68" width="8" height="8" fill="#111827" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-accent tracking-wider block">
                    Instant App Access
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                    Scan with Phone Camera
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Trusted by 500+ million passengers globally
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 text-xs pt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-white font-bold text-xs">4.8★</span>
                    <span className="text-gray-400 text-[10px]">(App Store &amp; Play)</span>
                  </div>
                </div>
              </div>

              {/* Social Proof Metric Badge */}
              <p className="text-[11px] text-gray-400 mt-3 text-center">
                ✨ Trusted by <strong>500+ million travelers</strong> · 99.4% on-time record
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. BUSMITRA CORE ADVANTAGES
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
            {t('pillars.badge', 'The BusMitra Standard')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {t('pillars.title', 'Why travel with BusMitra?')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            {t('pillars.subtitle', 'Engineered for comfort, guaranteed best fares, and eco-friendly collective transit.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Connecting you to India */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-brand-accent mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {t('pillars.p1Title', 'Connecting you to India')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('pillars.p1Desc', 'Endless possibilities. Discover over 10,000 destinations across all Indian states with frequent departures and verified route corridors.')}
            </p>
          </div>

          {/* Card 2: Comfort on the go */}
          <div
            onClick={() => setShowServiceModal(true)}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {t('pillars.p2Title', 'Comfort on the go')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('pillars.p2Desc', 'Kick back with free high-speed Wi-Fi, individual power outlets, ergonomic extra legroom, and sanitized air-conditioned cabins.')}
            </p>
          </div>

          {/* Card 3: Choose, book, travel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {t('pillars.p3Title', 'Choose, book, travel')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('pillars.p3Desc', 'From your screen to your seat in seconds. Pick your preferred berth, confirm your booking, and we will take care of the rest.')}
            </p>
          </div>

          {/* Card 4: Go together */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {t('pillars.p4Title', 'Go together')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('pillars.p4Desc', 'Why add another car on the road when you can choose collective travel instead? Up to 80% lower CO2 emissions per passenger-km.')}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "WHERE TO NEXT? DISCOVER OUR TRAVEL MAP" (Interactive Explorer)
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-brand-darker rounded-2xl border border-gray-800 p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                {t('mapBanner.badge', 'Where to next?')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('mapBanner.title', 'Discover our travel map with 10,000+ destinations')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t('mapBanner.subtitle', 'Explore our full route network connecting major metropolitan hubs, tourist destinations, and regional expressways with real-time seat availability.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>{t('mapBanner.exploreBtn', 'Explore the map')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTripTracker(true)}
                className="px-5 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-colors"
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>{t('mapBanner.trackBtn', 'Track Active Trips')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. "TOP DESTINATIONS AND BUS CONNECTIONS"
         ───────────────────────────────────────────────────────────── */}
      <section id="popular-corridors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
              {t('dest.badge', 'Network Highlights')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {t('dest.title', 'Top Destinations & Bus Connections')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t('dest.subtitle', 'Select a popular city or high-demand route to book your ticket instantly.')}
            </p>
          </div>

          {/* Dual Tabs (Cities vs Connections) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-300 shadow-sm text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDestTab('connections')}
              className={`px-4 py-2 rounded-lg transition-all ${destTab === 'connections'
                  ? 'bg-brand-accent text-brand-dark font-extrabold shadow'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {t('dest.tabConnections', 'Popular Connections')}
            </button>
            <button
              type="button"
              onClick={() => setDestTab('cities')}
              className={`px-4 py-2 rounded-lg transition-all ${destTab === 'cities'
                  ? 'bg-brand-accent text-brand-dark font-extrabold shadow'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {t('dest.tabCities', 'Major Cities')}
            </button>
          </div>
        </div>

        {/* Tab 1: Connections Grid */}
        {destTab === 'connections' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {CONNECTIONS_LIST.map((c, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 hover:border-brand-accent rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 group-hover:bg-brand-accent/20 group-hover:text-brand-accent transition-colors">
                      {c.tag}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {c.duration}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-gray-900 group-hover:text-brand-accent transition-colors">
                    {c.s} ➔ {c.d}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{c.freq}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">From</span>
                    <span className="text-base font-black text-gray-900">{c.fare}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookConnection(c.s, c.d)}
                    className="px-3.5 py-1.5 bg-brand-dark hover:bg-brand-accent text-white hover:text-brand-dark text-xs font-bold rounded-lg transition-all flex items-center gap-1 group-hover:shadow"
                  >
                    <span>{t('dest.viewBuses', 'View Buses')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Cities Grid */}
        {destTab === 'cities' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 animate-fade-in">
            {CITIES_LIST.map((city, i) => (
              <div
                key={i}
                onClick={() => handleCitySearch(city.name)}
                className="bg-white border border-gray-200 hover:border-brand-accent rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 group"
              >
                <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {city.image}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-accent transition-colors">
                    {city.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">{city.buses}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. TRAVEL GUIDES & ROUTE INFORMATION
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {t('guides.title', 'Essential Travel Guides & Route Information')}
            </h3>
            <button
              type="button"
              onClick={() => setExpandedContent(!expandedContent)}
              className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
            >
              <span>{expandedContent ? t('guides.showLess', 'Show less') : t('guides.continueReading', 'Continue reading')}</span>
              {expandedContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* First two highlights always visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 leading-relaxed">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('guides.card1Title', 'Get Cheap Bus Tickets with BusMitra!')}
              </h4>
              <p>
                {t('guides.card1Desc', 'If you are looking to travel intercity across India or on major express corridors, BusMitra has you covered with over 400,000 available departures. Zero hidden surcharges, clear seat tariffs, and easy 1-click booking make planning simple.')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-accent" />
                {t('guides.card2Title', 'Bus Routes and Timetables to Suit Your Schedule')}
              </h4>
              <p>
                {t('guides.card2Desc', 'Traveling with BusMitra is hassle-free with modern AC sleeper and semi-sleeper buses, frequent daytime and overnight departures, and reliable timetables. Enjoy onboard Wi-Fi and track your journey in real time using our live telemetry system.')}
              </p>
            </div>
          </div>

          {/* Expandable Extra Informational Sections */}
          {expandedContent && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed animate-fade-in">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-sm font-bold text-gray-900">
                  Buying Your Tickets is Easy &amp; Paperless
                </h4>
                <p>
                  Our responsive web portal and mobile app make finding cheapest fares seamless.
                  Board directly with your digital ticket barcode without needing paper printouts.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-sm font-bold text-gray-900">
                  Collective Travel Reduces Carbon Footprint
                </h4>
                <p>
                  Choosing coach transit over individual cars reduces per-passenger emissions by up
                  to 80%. We are dedicated to our Net Zero 2040 sustainable operations vision.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-sm font-bold text-gray-900">
                  Travel in Comfort with Generous Baggage
                </h4>
                <p>
                  Every passenger enjoys 1 free hand carry-on (up to 7kg) and 1 free stowed luggage
                  (up to 20kg), plus individual reading lamps and USB fast-charging ports.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. BUSMITRA MOBILE APP BANNER ("Download the App")
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-brand-dark text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent">
              {t('banner.badge', 'Digital ticket & Live tracking')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {t('banner.title', 'Discover the BusMitra mobile app')}
            </h3>
            <p className="text-xs text-gray-400">
              {t('banner.subtitle', "Carry your tickets offline and track your driver's real-time ETA.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAppModal(true)}
              className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{t('banner.downloadBtn', 'Download the App')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowManageBooking(true)}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>{t('banner.manageBtn', 'Manage My Booking')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Global Modals */}
      <ExploreMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
      />

      <AppDownloadModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
      />

      <ManageBookingModal
        isOpen={showManageBooking}
        onClose={() => setShowManageBooking(false)}
        onTrackBus={(busNo) => {
          setShowManageBooking(false);
          setTrackerBusNo(busNo);
          setShowTripTracker(true);
        }}
      />

      <TripTrackerModal
        isOpen={showTripTracker}
        onClose={() => {
          setShowTripTracker(false);
          setTrackerBusNo('');
        }}
        initialBusNumber={trackerBusNo}
      />

      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
      />
    </div>
  );
}
