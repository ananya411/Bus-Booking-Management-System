import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  Smartphone,
  ShieldCheck,
  Headphones,
  Compass,
  Ticket,
  Briefcase,
  Heart,
  QrCode,
  Download,
  ExternalLink
} from 'lucide-react';
import Logo from './Logo';
import ManageBookingModal from './ManageBookingModal';
import TripTrackerModal from './TripTrackerModal';
import ServiceModal from './ServiceModal';
import ExploreMapModal from './ExploreMapModal';
import AppDownloadModal from './AppDownloadModal';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [showManageBooking, setShowManageBooking] = useState(false);
  const [showTripTracker, setShowTripTracker] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showExploreMap, setShowExploreMap] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);

  return (
    <>
      <footer className="bg-brand-darker border-t border-gray-800 text-gray-400 text-xs mt-auto">
        {/* Top Feature Bar (Trust & Assurance banner) */}
        <div className="border-b border-gray-800 bg-brand-dark/40 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-accent/15 flex items-center justify-center text-brand-accent flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">{t('footer.payments', '100% Secure Payments')}</p>
                <p className="text-[11px] text-gray-500">{t('footer.paymentsDesc', 'Encrypted instant checkout')}</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">{t('footer.paperless', 'Digital Paperless Tickets')}</p>
                <p className="text-[11px] text-gray-500">{t('footer.paperlessDesc', 'Board with phone QR')}</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">{t('footer.support', '24/7 Dedicated Support')}</p>
                <p className="text-[11px] text-gray-500">{t('footer.supportDesc', 'Call 1800 200 4455')}</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">{t('footer.coaches', 'Verified AC Coaches')}</p>
                <p className="text-[11px] text-gray-500">{t('footer.coachesDesc', 'Sanitized & GPS monitored')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Banner with Official Logo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800/80">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link to="/" className="inline-block group">
              <Logo className="h-12 sm:h-14 w-auto transition-transform group-hover:scale-105" />
            </Link>
            <div className="h-8 w-px bg-gray-800 hidden sm:block" />
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              {t('footer.desc', "India's premium intercity bus booking network. Live GPS tracking, verified luxury AC coaches, guaranteed seat selection, and instant paperless boarding.")}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#011810] border border-brand-accent/40 text-brand-accent shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
            <span>{t('footer.official', 'Official Booking Platform')}</span>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {/* Column 1: Bus Travel */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('footer.busTravel', 'Bus Travel')}</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Why Travel With Us?
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="hover:text-white transition-colors">
                    All Bus Destinations
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowExploreMap(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Interactive Route Map
                  </button>
                </li>
                <li>
                  <Link to="/search?type=sleeper" className="hover:text-white transition-colors">
                    Overnight Sleeper Buses
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowAppModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Get the BusMitra App
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowTripTracker(true)}
                    className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1"
                  >
                    <span>Live Trip Tracker</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Discover */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Discover</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/search?source=Delhi" className="hover:text-white transition-colors">
                    Northern Hub (Delhi, Jaipur, Agra)
                  </Link>
                </li>
                <li>
                  <Link to="/search?source=Mumbai" className="hover:text-white transition-colors">
                    Western Express (Mumbai, Pune, Goa)
                  </Link>
                </li>
                <li>
                  <Link to="/search?source=Bangalore" className="hover:text-white transition-colors">
                    Southern Lines (Bangalore, Hyderabad)
                  </Link>
                </li>
                <li>
                  <Link to="/search?source=Ahmedabad" className="hover:text-white transition-colors">
                    Gujarat Express (Ahmedabad, Surat)
                  </Link>
                </li>
                <li>
                  <Link to="/search?source=Chennai" className="hover:text-white transition-colors">
                    Tamil Nadu Express (Chennai, Madurai)
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=Goa" className="hover:text-white transition-colors">
                    Weekend Coastal Holiday Routes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: BusMitra */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>BusMitra</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#company" className="hover:text-white transition-colors">
                    About BusMitra
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white transition-colors">
                    Careers &amp; Jobs
                  </a>
                </li>
                <li>
                  <a href="#press" className="hover:text-white transition-colors">
                    Press Room
                  </a>
                </li>
                <li>
                  <Link to="/support#cancellation" className="hover:text-white transition-colors">
                    Terms &amp; Conditions of Travel
                  </Link>
                </li>
                <li>
                  <a href="#sustainability" className="hover:text-white transition-colors">
                    Sustainability &amp; Net Zero 2040
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Operator &amp; Reseller Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Customer Service */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer Service</span>
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/support" className="hover:text-white transition-colors">
                    Help Center &amp; FAQs
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowManageBooking(true)}
                    className="hover:text-brand-accent transition-colors text-left font-semibold text-white"
                  >
                    Manage My Booking
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Baggage Allowance Guide
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Reduced Mobility Assistance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Seat Reservations
                  </button>
                </li>
                <li>
                  <Link to="/support#contact" className="hover:text-white transition-colors">
                    Lost &amp; Found Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: App Download & Socials */}
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-brand-accent" />
                <span>BusMitra App</span>
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Scan or download the app for exclusive deals and instant boarding alerts.
              </p>

              {/* Store Badges */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowAppModal(true)}
                  className="w-full p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center gap-2.5 transition-colors text-left group"
                >
                  <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Get it on</span>
                    <span className="text-xs font-bold text-white">Google Play</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAppModal(true)}
                  className="w-full p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl flex items-center gap-2.5 transition-colors text-left group"
                >
                  <Download className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Download on</span>
                    <span className="text-xs font-bold text-white">App Store</span>
                  </div>
                </button>
              </div>

              {/* Social Channels */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">
                  Follow BusMitra
                </span>
                <div className="flex items-center gap-2 text-gray-400">
                  {['Facebook', 'Instagram', 'YouTube', 'LinkedIn', 'X'].map((social) => (
                    <span
                      key={social}
                      className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-[10px] font-bold"
                    >
                      {social[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal bar */}
          <div className="pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <Link to="/login" className="hover:text-gray-300 transition-colors">
                Reseller Login
              </Link>
              <span>·</span>
              <Link to="/support#cancellation" className="hover:text-gray-300 transition-colors">
                Cancellation Policy
              </Link>
              <span>·</span>
              <a href="#privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <span>·</span>
              <a href="#accessibility" className="hover:text-gray-300 transition-colors">
                Accessibility Statement
              </a>
              <span>·</span>
              <a href="#terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
            </div>

            <p className="flex items-center text-[11px] text-gray-400">
              © {new Date().getFullYear()}{' '}
              <span className="text-white font-bold mx-1">BusMitra</span> - Engineered for{' '}
              <span className="text-brand-accent font-bold ml-1">Algions AI Labs.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Global Modals invoked from Footer */}
      <ManageBookingModal
        isOpen={showManageBooking}
        onClose={() => setShowManageBooking(false)}
        onTrackBus={() => {
          setShowManageBooking(false);
          setShowTripTracker(true);
        }}
      />

      <TripTrackerModal
        isOpen={showTripTracker}
        onClose={() => setShowTripTracker(false)}
      />

      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
      />

      <ExploreMapModal
        isOpen={showExploreMap}
        onClose={() => setShowExploreMap(false)}
      />

      <AppDownloadModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
      />
    </>
  );
}
