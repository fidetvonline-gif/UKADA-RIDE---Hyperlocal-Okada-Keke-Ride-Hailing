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
  Coins,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  PhoneCall,
  Clock,
  Navigation,
  UserCheck,
  Fuel,
  Sparkles,
  Award,
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

  // Interactive Earnings Calculator state
  const [calcVehicle, setCalcVehicle] = useState<'okada' | 'keke'>('okada');
  const [tripsPerDay, setTripsPerDay] = useState<number>(14);

  // Realistic Nigerian fares calculation
  // Okada avg trip: ₦350. Keke avg trip: ₦600 (3 pax @ ₦200 each). Driver retains 90%
  const avgTripGross = calcVehicle === 'okada' ? 350 : 600;
  const driverRate = 0.90;
  const dailyEarnings = Math.round(tripsPerDay * avgTripGross * driverRate);
  const weeklyEarnings = dailyEarnings * 6; // 6 working days
  const monthlyEarnings = weeklyEarnings * 4;

  const jobRoles = [
    {
      title: 'Okada Express Rider',
      vehicle: 'Bajaj Boxer 150cc',
      weeklyPay: '₦75,000 – ₦120,000',
      badge: 'High Demand',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      perks: [
        'Keep 90% of every ride fare',
        'Free DOT-certified passenger helmet & safety vest',
        'Flexible hours across city & market junctions',
        'Fuel partner discounts on major transit routes',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer',
    },
    {
      title: 'Keke Route Pilot',
      vehicle: 'Commercial Yellow Tricycle 200cc',
      weeklyPay: '₦95,000 – ₦160,000',
      badge: 'Top Volume',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      perks: [
        'High passenger volume on morning & market routes',
        'Carry 3 passengers per trip for triple ticket revenue',
        'Akwa Ibom transit union compliance badge included',
        'Zero predatory vehicle lease contracts',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer',
    },
    {
      title: 'City Express Courier',
      vehicle: 'Motorbike Parcel Dispatch',
      weeklyPay: '₦60,000 – ₦100,000',
      badge: 'Package Delivery',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      perks: [
        'Deliver market goods, pharmacy parcels & documents',
        'Guaranteed daytime inter-junction courier bookings',
        'Lower wear-and-tear with scheduled parcel pickups',
        'Dedicated dispatch center routing support',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer',
    },
    {
      title: 'Fleet Vehicle Partner',
      vehicle: 'Motorbike / Keke Fleet Asset',
      weeklyPay: '₦35,000 – ₦55,000 / unit',
      badge: 'Passive Income',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      perks: [
        'Place your vehicle under verified UKADA management',
        'Live GPS fleet tracking in your owner portal',
        'Vetted, background-checked professional drivers',
        'Guaranteed weekly automated bank remittance',
      ],
      payoutFrequency: 'Weekly Direct Remittance',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-14">
      {/* ================================================================= */}
      {/* 1. NATURAL NIGERIAN STREET MOBILITY SHOWCASE (NO BLOAT / NO SCHOOL)*/}
      {/* ================================================================= */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Nigerian Street Transit</span>
            </div>
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
      
      {/* Simple CTA to Driver Job Page instead of full section */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Drive for UKADA</h3>
            <p className="text-sm text-slate-400">Earn a stable income as a driver. Apply today.</p>
          </div>
          <button onClick={onApplyDriver} className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl">Apply for Driver Job</button>
      </div>
    </div>
  );
};
