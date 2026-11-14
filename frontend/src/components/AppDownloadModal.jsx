import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  X,
  CheckCircle2,
  Download,
  Star,
  ShieldCheck,
  Zap,
  Bell
} from 'lucide-react';
import Logo from './Logo';

export default function AppDownloadModal({ isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-darker border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-800 flex items-center justify-between bg-brand-dark">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <h3 className="text-sm font-bold text-white">Get the BusMitra App</h3>
              <p className="text-[11px] text-gray-400">Digital tickets, live bus tracking &amp; instant alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* QR Code and Scan info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            {/* Realistic stylized QR SVG */}
            <div className="w-36 h-36 bg-white p-2.5 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full text-brand-dark fill-current">
                {/* 3 Large Corner Position Markers */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#111827" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
                <rect x="14" y="14" width="10" height="10" rx="1" fill="#111827" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#111827" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
                <rect x="76" y="14" width="10" height="10" rx="1" fill="#111827" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#111827" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
                <rect x="14" y="76" width="10" height="10" rx="1" fill="#111827" />

                {/* Timing patterns & decorative bit modules */}
                <rect x="38" y="12" width="6" height="6" fill="#111827" />
                <rect x="48" y="12" width="6" height="6" fill="#111827" />
                <rect x="56" y="12" width="6" height="6" fill="#111827" />
                <rect x="12" y="38" width="6" height="6" fill="#111827" />
                <rect x="12" y="48" width="6" height="6" fill="#111827" />
                <rect x="12" y="56" width="6" height="6" fill="#111827" />

                <rect x="38" y="38" width="8" height="8" rx="1" fill="#F5A524" />
                <rect x="52" y="38" width="6" height="6" fill="#111827" />
                <rect x="64" y="38" width="6" height="6" fill="#111827" />
                <rect x="38" y="52" width="6" height="6" fill="#111827" />
                <rect x="50" y="50" width="8" height="8" fill="#111827" />
                <rect x="64" y="52" width="8" height="8" fill="#111827" />
                <rect x="78" y="50" width="6" height="6" fill="#111827" />

                <rect x="38" y="68" width="6" height="6" fill="#111827" />
                <rect x="50" y="68" width="6" height="6" fill="#111827" />
                <rect x="62" y="68" width="8" height="8" fill="#111827" />
                <rect x="76" y="76" width="8" height="8" fill="#111827" />
                <rect x="44" y="80" width="6" height="6" fill="#111827" />
                <rect x="56" y="80" width="8" height="8" fill="#111827" />
                <rect x="88" y="70" width="6" height="6" fill="#111827" />
              </svg>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent/20 text-brand-accent uppercase">
                <QrCode className="w-3 h-3" /> Scan to install
              </span>
              <h4 className="text-white font-bold text-sm">Scan with your phone camera</h4>
              <p className="text-xs text-gray-400">
                Point your camera at this code to open the app on iOS App Store or Android Google Play.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-white font-bold ml-1">4.8 / 5.0</span>
                <span className="text-gray-400 text-[11px]">(120K+ reviews)</span>
              </div>
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-xl flex items-center gap-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Get it on</span>
                <span className="text-xs font-bold text-white">Google Play</span>
              </div>
            </a>

            <a
              href="https://apple.com/app-store"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-xl flex items-center gap-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Download on</span>
                <span className="text-xs font-bold text-white">App Store</span>
              </div>
            </a>
          </div>

          {/* App Features List */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Offline E-Tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Live GPS Bus Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Exclusive App Deals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Instant PNR Alerts</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-brand-dark border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <button
            onClick={handleCopyLink}
            className="text-brand-accent hover:underline flex items-center gap-1"
          >
            {copiedLink ? 'Link copied!' : 'Copy download link'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

