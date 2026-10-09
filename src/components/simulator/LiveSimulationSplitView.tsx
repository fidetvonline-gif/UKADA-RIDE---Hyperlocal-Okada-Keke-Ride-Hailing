import React from 'react';
import { useUkada } from '../../context/UkadaContext';
import { PassengerExperience } from '../passenger/PassengerExperience';
import { DriverExperience } from '../driver/DriverExperience';
import { UkadaLogo } from '../common/UkadaLogo';
import { Play, RotateCcw, Smartphone, ShieldCheck, ArrowRight, CheckCircle2, Phone } from 'lucide-react';

export const LiveSimulationSplitView: React.FC = () => {
  const {
    simulateIncomingRequest,
    fastForwardTrip,
    resetAllData,
    activeTrip,
    trips,
    drivers,
    setActiveView,
    startInAppCall,
  } = useUkada();

  const handleQuickOkadaDemo = () => {
    simulateIncomingRequest('okada');
  };

  const handleQuickKekeDemo = () => {
    simulateIncomingRequest('keke');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Simulation Command Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <UkadaLogo size="sm" subtitle="SIMULATION LAB" />
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Connected Real-Time State
            </span>
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleQuickOkadaDemo}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Request Okada Ride</span>
            </button>

            <button
              onClick={handleQuickKekeDemo}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Request Keke Ride</span>
            </button>

            <button
              onClick={() => startInAppCall({ callerRole: 'passenger' })}
              className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              title="Test in-app call directly between passenger and driver"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Test In-App Call</span>
            </button>

            {activeTrip && (
              <button
                onClick={() => fastForwardTrip(activeTrip.id)}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Next Lifecycle Step</span>
              </button>
            )}

            <button
              onClick={resetAllData}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1"
              title="Reset test data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Screens Canvas */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Screen: Passenger Experience */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Passenger Experience (Mobile View)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Client Device</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[820px]">
            <PassengerExperience />
          </div>
        </div>

        {/* Right Screen: Driver Experience */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Driver Experience (Android App View)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Driver Device</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[820px]">
            <DriverExperience />
          </div>
        </div>
      </div>
    </div>
  );
};
