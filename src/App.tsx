import React from 'react';
import { UkadaProvider, useUkada } from './context/UkadaContext';
import { PremiumHomePage } from './components/home/PremiumHomePage';
import { PassengerExperience } from './components/passenger/PassengerExperience';
import { DriverExperience } from './components/driver/DriverExperience';
import { AdminControlDashboard } from './components/admin/AdminControlDashboard';
import { LiveSimulationSplitView } from './components/simulator/LiveSimulationSplitView';
import { InAppCallModal } from './components/calling/InAppCallModal';
import { UkadaLogo } from './components/common/UkadaLogo';
import {
  Navigation,
  Smartphone,
  Shield,
  Layers,
  Radio,
  Home,
  ArrowRight,
} from 'lucide-react';

const MainShell: React.FC = () => {
  const { activeView, setActiveView } = useUkada();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract: 3 zones separated by gap-8 (Brand - Nav Links - 1 Primary Action) */}
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Professional Ukada Logo & Wordmark */}
          <UkadaLogo
            size="md"
            subtitle="MOBILITY TECH"
            onClick={() => setActiveView('home')}
            className="shrink-0"
          />

          {/* Zone 2: Concise single-line navigation links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'home' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Platform 3D</span>
            </button>

            <button
              onClick={() => setActiveView('passenger')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'passenger' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Passenger App</span>
            </button>

            <button
              onClick={() => setActiveView('driver')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'driver' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Driver App</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'admin' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>UKADA Control</span>
            </button>

            <button
              onClick={() => setActiveView('simulator')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'simulator' ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Live Simulator</span>
            </button>
          </div>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            {activeView === 'home' ? (
              <button
                onClick={() => setActiveView('passenger')}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span>Book a Ride</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveView('home')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                &larr; Back to 3D Platform
              </button>
            )}
          </div>
        </div>

        {/* Mobile Viewport Sub-bar Switcher */}
        <div className="flex md:hidden items-center justify-between gap-1 pt-2 border-t border-slate-800/80 mt-2 text-[10px] font-semibold text-slate-400 overflow-x-auto">
          <button
            onClick={() => setActiveView('home')}
            className={`px-2.5 py-1 text-center rounded whitespace-nowrap shrink-0 ${activeView === 'home' ? 'text-amber-400 font-bold bg-slate-800' : ''}`}
          >
            3D Home
          </button>
          <button
            onClick={() => setActiveView('passenger')}
            className={`px-2.5 py-1 text-center rounded whitespace-nowrap shrink-0 ${activeView === 'passenger' ? 'text-amber-400 font-bold bg-slate-800' : ''}`}
          >
            Passenger
          </button>
          <button
            onClick={() => setActiveView('driver')}
            className={`px-2.5 py-1 text-center rounded whitespace-nowrap shrink-0 ${activeView === 'driver' ? 'text-amber-400 font-bold bg-slate-800' : ''}`}
          >
            Driver
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`px-2.5 py-1 text-center rounded whitespace-nowrap shrink-0 ${activeView === 'admin' ? 'text-amber-400 font-bold bg-slate-800' : ''}`}
          >
            Control
          </button>
          <button
            onClick={() => setActiveView('simulator')}
            className={`px-2.5 py-1 text-center rounded whitespace-nowrap shrink-0 ${activeView === 'simulator' ? 'text-amber-400 font-bold bg-slate-800' : ''}`}
          >
            Simulator
          </button>
        </div>
      </nav>

      {/* Dynamic Viewport Content */}
      <div className="flex-1">
        {activeView === 'home' && <PremiumHomePage />}
        {activeView === 'passenger' && <PassengerExperience />}
        {activeView === 'driver' && <DriverExperience />}
        {activeView === 'admin' && <AdminControlDashboard />}
        {activeView === 'simulator' && <LiveSimulationSplitView />}
      </div>

      {/* Global In-App Voice Calling Overlay & Floating PiP Bar */}
      <InAppCallModal />

      {/* Quiet Footer with UKADA Brand Mark */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <UkadaLogo
            size="sm"
            subtitle="COMMERCIAL OKADA & KEKE TRANSIT"
            onClick={() => setActiveView('home')}
          />
          <div className="flex flex-col sm:items-end text-center sm:text-right">
            <span className="text-slate-400 font-medium">UKADA Ride &copy; 2026 &middot; Hyperlocal Mobility</span>
            <span className="text-[11px] text-slate-500">
              Ukana, Essien Udim, Ikot Ekpene, Akwa Ibom State, Nigeria
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <UkadaProvider>
      <MainShell />
    </UkadaProvider>
  );
}
