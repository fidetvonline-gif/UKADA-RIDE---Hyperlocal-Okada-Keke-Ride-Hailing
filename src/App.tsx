import React, { useState } from 'react';
import { UkadaProvider, useUkada } from './context/UkadaContext';
import { PremiumHomePage } from './components/home/PremiumHomePage';
import { PassengerExperience } from './components/passenger/PassengerExperience';
import { DriverExperience } from './components/driver/DriverExperience';
import { AdminControlDashboard } from './components/admin/AdminControlDashboard';
import { LiveSimulationSplitView } from './components/simulator/LiveSimulationSplitView';
import { DriverJobDetails } from './components/driver/DriverJobDetails';
import { InAppCallModal } from './components/calling/InAppCallModal';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { UkadaLogo } from './components/common/UkadaLogo';
import {
  Navigation,
  Smartphone,
  Shield,
  Layers,
  Radio,
  Home,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'passenger', label: 'Passenger', icon: Navigation },
  { id: 'driver', label: 'Driver', icon: Smartphone },
  { id: 'admin', label: 'Control', icon: Shield },
  { id: 'simulator', label: 'Sim', icon: Layers },
] as const;

const MainShell: React.FC = () => {
  const { activeView, setActiveView } = useUkada();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNavClick = (view: typeof NAV_LINKS[number]['id']) => {
    if (activeView === view) return;
    setIsLoading(true);
    setActiveView(view);
    setTimeout(() => setIsLoading(false), 500); // Simulate smooth transition
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {isLoading && <LoadingOverlay />}
      {/* Top Bar */}
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <UkadaLogo
            size="md"
            subtitle="MOBILITY TECH"
            onClick={() => handleNavClick('home')}
            className="shrink-0"
          />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeView === link.id ? 'text-amber-400 font-bold' : ''
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                <span>{link.label === 'Home' ? 'Platform 3D' : link.label === 'Sim' ? 'Live Simulator' : `${link.label} App`}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {activeView === 'home' ? (
              <button
                onClick={() => handleNavClick('passenger')}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Book a Ride</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('home')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                &larr; Back
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Dynamic Viewport Content */}
      <div className="flex-1">
        {activeView === 'home' && <PremiumHomePage />}
        {activeView === 'passenger' && <PassengerExperience />}
        {activeView === 'driver' && <DriverExperience />}
        {activeView === 'admin' && <AdminControlDashboard />}
        {activeView === 'simulator' && <LiveSimulationSplitView />}
        {activeView === 'driver-job' && <DriverJobDetails />}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 flex justify-around p-2">
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavClick(link.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeView === link.id ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </button>
        ))}
      </div>

      {/* Global In-App Voice Calling Overlay & Floating PiP Bar */}
      <InAppCallModal />

      {/* Quiet Footer (Hidden on mobile to make space for bottom nav) */}
      <footer className="hidden md:block bg-slate-950 border-t border-slate-800/80 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <UkadaLogo
            size="sm"
            subtitle="COMMERCIAL OKADA & KEKE TRANSIT"
            onClick={() => setActiveView('home')}
          />
          <span className="text-slate-400 font-medium">UKADA Ride &copy; 2026</span>
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
