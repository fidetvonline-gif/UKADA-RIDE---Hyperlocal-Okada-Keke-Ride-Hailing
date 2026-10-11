import React, { useState } from 'react';
import {
  ASSET_OKADA_PICKUP,
  ASSET_KEKE_BOARDING,
  ASSET_RIDE_BOOKED_APP,
  ASSET_RIDERS_JOBS_TEAM,
} from '../../data/mockData';
import { resolveImageUrl } from '../../utils/assetResolver';
import {
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Award,
  Users,
  Coins,
} from 'lucide-react';

interface RealMobilityAndJobsSectionProps {
  onApplyDriver: () => void;
  onBookRide: () => void;
}

export const RealMobilityAndJobsSection: React.FC<RealMobilityAndJobsSectionProps> = ({
  onApplyDriver,
  onBookRide,
}) => {
  // Mobility showcase active tab
  const [activeMobilityTab, setActiveMobilityTab] = useState<'okada' | 'keke' | 'calling'>('okada');

  return (
    <div className="w-full flex flex-col gap-14">
      {/* ================================================================= */}
      {/* 1. NATURAL NIGERIAN STREET MOBILITY SHOWCASE                      */}
      {/* ================================================================= */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Everyday Urban &amp; Commercial Road Mobility
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Authentic commercial transport connecting busy avenues, market stalls, and residential streets.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveMobilityTab('okada')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMobilityTab === 'okada'
                  ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏍 Street Okada
            </button>
            <button
              type="button"
              onClick={() => setActiveMobilityTab('keke')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMobilityTab === 'keke'
                  ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛺 Commercial Keke
            </button>
            <button
              type="button"
              onClick={() => setActiveMobilityTab('calling')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMobilityTab === 'calling'
                  ? 'bg-blue-500 text-slate-950 shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📱 Direct In-App Call
            </button>
          </div>
        </div>

        {/* 3 Visual Mobility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Natural Street Pickup */}
          <div
            className={`group rounded-3xl bg-slate-900 border overflow-hidden shadow-xl transition-all flex flex-col ${
              activeMobilityTab === 'okada'
                ? 'border-amber-500 ring-1 ring-amber-500/40 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <img
                src={resolveImageUrl(ASSET_OKADA_PICKUP)}
                alt="Everyday natural Nigerian commercial street pickup with Okada rider in safety helmet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] font-bold text-amber-400">
                🏍 Street &amp; Junction Express
              </div>
              <div className="absolute bottom-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                Standard Helmet
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Fast Street &amp; Office Pickups
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verified riders stationed at key urban commercial streets and bus-stops. Zip past rush-hour bottlenecks safely with certified passenger helmets.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 font-bold">From ₦150 Base Fare</span>
                <button
                  type="button"
                  onClick={onBookRide}
                  className="text-xs font-bold text-white hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <span>Book Ride</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Commercial Keke Cabin */}
          <div
            className={`group rounded-3xl bg-slate-900 border overflow-hidden shadow-xl transition-all flex flex-col ${
              activeMobilityTab === 'keke'
                ? 'border-emerald-500 ring-1 ring-emerald-500/40 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <img
                src={resolveImageUrl(ASSET_KEKE_BOARDING)}
                alt="Nigerian commercial yellow tricycle Keke picking up passengers with market goods"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] font-bold text-emerald-400">
                🛺 All-Weather Cabin
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-950/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                3 Seats &middot; Rainproof
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Covered Market &amp; Group Travel
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Spacious commercial yellow tricycles with heavy-duty rain canopies and baggage space for shopping, market commutes, and family travel.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">From ₦250 Base Fare</span>
                <button
                  type="button"
                  onClick={onBookRide}
                  className="text-xs font-bold text-white hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>Book Keke</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Direct In-App Calling */}
          <div
            className={`group rounded-3xl bg-slate-900 border overflow-hidden shadow-xl transition-all flex flex-col ${
              activeMobilityTab === 'calling'
                ? 'border-blue-500 ring-1 ring-blue-500/40 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <img
                src={resolveImageUrl(ASSET_RIDE_BOOKED_APP)}
                alt="Smartphone booking interface showing direct Call Driver button connecting passenger"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] font-bold text-blue-400">
                📱 Direct In-App VoIP Call
              </div>
              <div className="absolute bottom-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                Zero Airtime Needed
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Direct In-App Driver Audio
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Call your driver directly inside this app as soon as your ride is matched. Talk with HD voice to coordinate your exact gate or shop corner without airtime or WhatsApp.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-blue-400 font-bold">Free In-App VoIP</span>
                <span className="text-slate-400">100% Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. APPLY FOR DRIVER'S JOB TODAY SECTION (WITH RESTORED PICTURE)   */}
      {/* ================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Image Restored */}
          <div className="lg:col-span-5 relative h-72 lg:h-full min-h-[300px]">
            <img
              src={resolveImageUrl(ASSET_RIDERS_JOBS_TEAM)}
              alt="UKADA verified commercial drivers team in Ukana Akwa Ibom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/90 lg:from-transparent via-slate-950/40 to-slate-950 lg:to-slate-900" />
            <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Official Fleet Team</span>
            </div>
          </div>

          {/* Right Column: Information & Clear CTA to Dedicated Job Page */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Driver Recruitment Portal
              </span>
              <span className="text-xs text-slate-400">Akwa Ibom &middot; Commercial Corridors</span>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Apply for Driver's Job Today
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Take control of your daily earnings with Nigeria's fairest mobility platform. Learn all about driver rates, transparent commissions, daily instant payouts, and vehicle onboarding requirements.
              </p>
            </div>

            {/* Quick Benefits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">Driver Take-Home</span>
                <p className="text-base font-bold text-amber-400 font-mono mt-0.5">90% of Fare</p>
                <p className="text-[10px] text-slate-500">Only 10% platform fee</p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">Payout Speed</span>
                <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">Daily Instant</p>
                <p className="text-[10px] text-slate-500">Direct to your bank</p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">Device Accepted</span>
                <p className="text-base font-bold text-blue-400 font-mono mt-0.5">App or Basic</p>
                <p className="text-[10px] text-slate-500">Feature phone supported</p>
              </div>
            </div>

            {/* Prominent Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onApplyDriver}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>View Job Details &amp; Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">
                Takes ~3 minutes &middot; NIN document required
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
