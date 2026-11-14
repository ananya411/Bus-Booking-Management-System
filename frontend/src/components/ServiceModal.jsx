import React, { useState } from 'react';
import {
  Wifi,
  Briefcase,
  Accessibility,
  Armchair,
  ShieldCheck,
  Coffee,
  CheckCircle2,
  X,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';

export default function ServiceModal({ isOpen, onClose, initialTab = 'baggage' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'baggage', label: 'Baggage Allowance', icon: Briefcase },
    { id: 'wifi', label: 'Wi-Fi & Power', icon: Wifi },
    { id: 'seats', label: 'Seat Selection', icon: Armchair },
    { id: 'mobility', label: 'Reduced Mobility', icon: Accessibility },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-darker border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-800 flex items-center justify-between bg-brand-dark">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <h3 className="text-sm font-bold text-white">Onboard Services & Travel Rules</h3>
              <p className="text-[11px] text-gray-400">Everything you need to know for a seamless journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-brand-dark/50 px-6 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-brand-accent text-brand-accent'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-300">
          {activeTab === 'baggage' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-white font-bold text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-accent" />
                  Free Luggage Included With Every Ticket
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every passenger is entitled to bring 1 carry-on bag plus 1 large stowed luggage at no additional cost.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
                    <span className="text-brand-accent font-bold text-xs block mb-1">1x Hand Luggage</span>
                    <p className="text-xs text-white font-medium">Up to 7 kg (15 lbs)</p>
                    <p className="text-[11px] text-gray-400 mt-1">Must fit in overhead rack or beneath the seat in front of you.</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
                    <span className="text-brand-accent font-bold text-xs block mb-1">1x Hold / Stowed Luggage</span>
                    <p className="text-xs text-white font-medium">Up to 20 kg (44 lbs)</p>
                    <p className="text-[11px] text-gray-400 mt-1">Stowed in the bus luggage compartment before boarding.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Baggage Guidelines:</h5>
                <ul className="space-y-1.5 list-disc pl-4 text-gray-400">
                  <li>Please attach a tag with your name, phone number, and destination address.</li>
                  <li>Fragile items, laptops, passport and medications must remain in hand luggage.</li>
                  <li>Additional luggage or special items (musical instruments, folding bicycles) can be booked at check-in for ₹150.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'wifi' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-white font-bold text-base flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-brand-accent" />
                  Free High-Speed Onboard Wi-Fi & Power
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Stay entertained, work remotely, or stream throughout your trip with our complimentary media connection.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800 text-center">
                    <span className="text-brand-accent font-extrabold text-lg block">5G</span>
                    <p className="text-white font-semibold">Dual Carrier LTE</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Continuous connectivity across highways</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800 text-center">
                    <span className="text-brand-accent font-extrabold text-lg block">220V</span>
                    <p className="text-white font-semibold">AC Power Outlets</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Plug in your laptop or tablet</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800 text-center">
                    <span className="text-brand-accent font-extrabold text-lg block">USB</span>
                    <p className="text-white font-semibold">Fast Charging Ports</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Individual USB-A &amp; USB-C slots</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-400">
                <p className="text-white font-semibold">How to connect:</p>
                <p>1. Open Wi-Fi settings on your device and select <strong className="text-brand-accent font-mono">BusMitra_Free_WiFi</strong>.</p>
                <p>2. Accept terms on the welcome landing page and you're good to surf!</p>
              </div>
            </div>
          )}

          {activeTab === 'seats' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-white font-bold text-base flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-brand-accent" />
                  Guaranteed Seat Reservation
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Reserve your exact preferred seat during checkout with our real-time interactive seat layout.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
                    <span className="text-brand-accent font-bold block mb-1">Window &amp; Aisle Berths</span>
                    <p className="text-gray-300">Choose between extra viewing windows or easy aisle access.</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800">
                    <span className="text-brand-accent font-bold block mb-1">Ladies-Only Berths</span>
                    <p className="text-gray-300">Protected single and double sleeper berths reserved exclusively for female travelers.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobility' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-white font-bold text-base flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-brand-accent" />
                  Passengers with Reduced Mobility
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We are committed to accessible, inclusive transit. Trained crew members assist with boarding and luggage placement.
                </p>
                <div className="space-y-2 text-xs pt-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">
                      <strong>Wheelchair Transport:</strong> Collapsible wheelchairs are transported free of charge in the luggage hold.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">
                      <strong>Service Dogs:</strong> Recognized guide and assistance dogs travel free in the passenger cabin.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">
                      <strong>Pre-Boarding Assistance:</strong> Notify us 24 hours prior to travel at 1800 200 4455 for dedicated station escorts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-brand-dark border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span>Questions? Reach out to support@busmitra.in</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

