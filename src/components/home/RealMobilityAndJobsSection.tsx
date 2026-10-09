import React, { useState } from 'react';
import {
  ASSET_OKADA_PICKUP,
  ASSET_KEKE_BOARDING,
  ASSET_RIDE_BOOKED_APP,
  ASSET_RIDERS_JOBS_TEAM,
} from '../../data/mockData';
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
                src={ASSET_OKADA_PICKUP}
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
                src={ASSET_KEKE_BOARDING}
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
                src={ASSET_RIDE_BOOKED_APP}
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
      {/* 2. REAL NIGERIAN JOBS & DRIVER EARNINGS RECRUITMENT HUB            */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl flex flex-col gap-10">
        {/* Top Header Banner with Real Team Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 w-fit">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Real Nigerian Jobs &middot; Dignity of Labour</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Drive &amp; Earn with UKADA.{' '}
              <span className="text-amber-400">Real Weekly Income</span> for Nigerian Youth &amp; Riders.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Turn your commercial motorbike or Keke into a reliable high-earning career. Work flexible hours, retain 90% of your fares, and withdraw your money instantly to your Nigerian bank account every single day.
            </p>

            {/* Quick Proof Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <p className="text-lg font-extrabold font-mono text-emerald-400">90%</p>
                <p className="text-[10px] text-slate-400">Rider Take-Home</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <p className="text-lg font-extrabold font-mono text-white">Daily</p>
                <p className="text-[10px] text-slate-400">Instant Cashout</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <p className="text-lg font-extrabold font-mono text-amber-400">Zero</p>
                <p className="text-[10px] text-slate-400">Union Harassment</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onApplyDriver}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Apply for a Driver Job Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">Takes less than 2 minutes &bull; Free onboarding</span>
            </div>
          </div>

          {/* Right Column: Authentic Photography of Nigerian Driver Team */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[300px] sm:h-[360px] bg-slate-950">
            <img
              src={ASSET_RIDERS_JOBS_TEAM}
              alt="Real Nigerian Okada riders and Keke driver wearing UKADA safety vests proudly holding earnings phones"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">UKADA Verified Driver Corps</p>
                <p className="text-[11px] text-emerald-400 font-mono">Over 450+ Active Weekly Earners</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* INTERACTIVE DRIVER EARNINGS CALCULATOR                           */}
        {/* =============================================================== */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Live Income Calculator
                </h3>
              </div>

              {/* Vehicle Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCalcVehicle('okada')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    calcVehicle === 'okada'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Okada Bike
                </button>
                <button
                  type="button"
                  onClick={() => setCalcVehicle('keke')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    calcVehicle === 'keke'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Keke Tricycle
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Completed Trips per Day:</span>
                <span className="font-mono font-bold text-white text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                  {tripsPerDay} trips / day
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={tripsPerDay}
                onChange={(e) => setTripsPerDay(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 trips (Part-time)</span>
                <span>15 trips (Standard)</span>
                <span>30 trips (Full-day Power)</span>
              </div>
            </div>
          </div>

          {/* Calculated Output Cards */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            <div className="flex-1 sm:w-36 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Daily Take-Home</p>
              <p className="text-xl font-extrabold font-mono text-white mt-1 tabular-nums">
                ₦{dailyEarnings.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Net cashout</p>
            </div>

            <div className="flex-1 sm:w-44 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center ring-1 ring-emerald-500/30">
              <p className="text-[10px] text-emerald-300 uppercase font-bold">Weekly Earnings</p>
              <p className="text-2xl font-extrabold font-mono text-emerald-400 mt-1 tabular-nums">
                ₦{weeklyEarnings.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-300/80 mt-0.5">Direct to your bank</p>
            </div>

            <div className="flex-1 sm:w-36 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Income</p>
              <p className="text-xl font-extrabold font-mono text-amber-400 mt-1 tabular-nums">
                ₦{monthlyEarnings.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">4-week total</p>
            </div>
          </div>
        </div>

        {/* 4 Available Real Job Roles Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Available Transportation Roles</h3>
            <span className="text-xs text-slate-400">Akwa Ibom &middot; Lagos Corridors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${role.badgeColor}`}
                    >
                      {role.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Immediate</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1">{role.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{role.vehicle}</p>

                  <div className="my-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Payout</p>
                    <p className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                      {role.weeklyPay}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-1.5 text-[11px] text-slate-300">
                    {role.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onApplyDriver}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-950 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Real Job Benefits Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Daily Bank Transfers</p>
              <p className="text-[10px] text-slate-400">GTBank, Access, OPay, PalmPay</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Medical &amp; Trip Cover</p>
              <p className="text-[10px] text-slate-400">Emergency hospital safety net</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Fuel Partner Rates</p>
              <p className="text-[10px] text-slate-400">Discounted pump stations</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Union Legal Protection</p>
              <p className="text-[10px] text-slate-400">Zero illegal taskforce stops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
