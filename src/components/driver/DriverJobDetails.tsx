import React, { useState } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { DriverOnboardingModal } from '../home/DriverOnboardingModal';
import { ASSET_RIDERS_JOBS_TEAM, ASSET_OKADA, ASSET_KEKE } from '../../data/mockData';
import { resolveImageUrl } from '../../utils/assetResolver';
import { UkadaLogo } from '../common/UkadaLogo';
import {
  Briefcase,
  Coins,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Phone,
  Bike,
  Users,
  Clock,
  MapPin,
  HelpCircle,
  FileCheck,
  ChevronRight,
  Headphones,
  Award,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const DriverJobDetails: React.FC = () => {
  const { setActiveView } = useUkada();
  const [showDriverModal, setShowDriverModal] = useState<boolean>(false);
  const [calcVehicle, setCalcVehicle] = useState<'okada' | 'keke'>('okada');
  const [tripsPerDay, setTripsPerDay] = useState<number>(14);
  const [workingDays, setWorkingDays] = useState<number>(6);

  // Realistic Nigerian fares calculation
  // Okada avg trip: ₦350. Keke avg trip: ₦600 (3 pax @ ₦200 each). Driver retains 90%
  const avgTripGross = calcVehicle === 'okada' ? 350 : 600;
  const driverRate = 0.90;
  const platformRate = 0.10;

  const dailyGross = tripsPerDay * avgTripGross;
  const dailyEarnings = Math.round(dailyGross * driverRate);
  const dailyFee = Math.round(dailyGross * platformRate);

  const weeklyEarnings = dailyEarnings * workingDays;
  const monthlyEarnings = weeklyEarnings * 4;

  const jobRoles = [
    {
      id: 'okada',
      title: 'Okada Express Rider',
      vehicle: 'Bajaj Boxer 150cc / TVS Star HLX',
      weeklyPay: '₦75,000 – ₦120,000',
      badge: 'High Demand',
      icon: '🏍',
      description: 'Single-passenger rapid transit bypassing heavy traffic along university corridors and market routes.',
      perks: [
        'Keep 90% of every ride fare collected',
        'Free DOT-certified passenger helmet & safety vest',
        'Flexible working hours across Ukana and Ikot Ekpene',
        'Fuel partner subsidy on commercial transit corridors',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer / Cash In-Hand',
    },
    {
      id: 'keke',
      title: 'Keke Route Pilot',
      vehicle: 'Commercial Yellow Tricycle 200cc',
      weeklyPay: '₦95,000 – ₦160,000',
      badge: 'Highest Volume',
      icon: '🛺',
      description: 'Carry up to 3 passengers per trip on high-frequency market commutes, family runs, and shopping trips.',
      perks: [
        'Maximum passenger volume on morning & market days',
        'Triple ticket revenue per trip (3 passengers)',
        'Akwa Ibom transit union compliance badge included',
        'Zero predatory vehicle lease contracts',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer / Cash In-Hand',
    },
    {
      id: 'courier',
      title: 'City Express Parcel Courier',
      vehicle: 'Motorbike Parcel Dispatch Box',
      weeklyPay: '₦60,000 – ₦100,000',
      badge: 'Scheduled Delivery',
      icon: '📦',
      description: 'Deliver retail packages, urgent pharmacy goods, and university documents between commercial centers.',
      perks: [
        'Guaranteed daytime inter-junction courier bookings',
        'Lower wear-and-tear with scheduled parcel pickups',
        'Pre-paid corporate client trips',
        'Dedicated dispatch center routing support',
      ],
      payoutFrequency: 'Daily Instant Bank Transfer',
    },
    {
      id: 'partner',
      title: 'Fleet Vehicle Partner',
      vehicle: 'Motorbike / Keke Fleet Asset Owner',
      weeklyPay: '₦35,000 – ₦55,000 / unit',
      badge: 'Passive Income',
      icon: '💼',
      description: 'Place your motorcycle or tricycle under verified UKADA management and earn passive weekly remittance.',
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
    <div className="flex flex-col bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-amber-400 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">Careers</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-400 font-semibold">Apply for Driver's Job Today</span>
          </div>

          <button
            onClick={() => setActiveView('home')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
          >
            &larr; Back to Platform
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
        {/* ================================================================= */}
        {/* HERO BANNER: RESTORED IMAGE & VALUE PROPOSITION                   */}
        {/* ================================================================= */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Column: Restored Nigerian Riders Team Image */}
            <div className="lg:col-span-6 relative h-80 lg:h-full min-h-[360px]">
              <img
                src={resolveImageUrl(ASSET_RIDERS_JOBS_TEAM)}
                alt="UKADA Commercial Drivers Team in Ukana"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/90 lg:from-transparent via-slate-950/50 to-slate-950 lg:to-slate-900" />
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Akwa Ibom Official Fleet</span>
              </div>
            </div>

            {/* Right Column: Hero Details */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Official Recruitment
                </span>
                <span className="text-xs text-slate-400">
                  Ukana &middot; Ikot Ekpene &middot; Essien Udim
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Drive &amp; Earn with UKADA
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Join our verified team of Okada riders and Keke pilots. Earn high daily income, retain 90% of your fares, get paid instantly to your bank account, and work on your own schedule.
                </p>
              </div>

              {/* High Impact Numbers */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-semibold">Your Share</span>
                  <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">90%</p>
                  <p className="text-[10px] text-slate-500">Keep 90% of fares</p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-semibold">Platform Fee</span>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">10%</p>
                  <p className="text-[10px] text-slate-500">Fair fixed policy</p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-semibold">Payouts</span>
                  <p className="text-xl font-bold font-mono text-white mt-0.5">Daily</p>
                  <p className="text-[10px] text-slate-500">Instant bank transfer</p>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(true)}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Register to Become a Driver</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('passenger')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                >
                  Need a Ride Instead?
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* WHY DRIVE WITH UKADA: CORE ADVANTAGES                             */}
        {/* ================================================================= */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white">Why Riders Choose UKADA</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built specifically for everyday Nigerian transport workers. We protect your daily hustle with transparent rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Guaranteed 90% Take-Home</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike apps that take 25% or 30%, UKADA charges a low 10% commission. You keep ₦900 out of every ₦1,000 cash earned on your trips.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smartphone &amp; Basic Phone Friendly</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No expensive smartphone? No problem. We dispatch rides to basic push-button phone operators via our Assisted Voice Dispatch desk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Safety Gear &amp; Official Decals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every verified driver receives a DOT passenger safety helmet, branded reflective safety vest, and union recognition badge for smooth transit.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* LIVE INCOME CALCULATOR (MOVED TO THIS DEDICATED PAGE)             */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Live Driver Income Calculator</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Estimate how much you will take home daily, weekly, and monthly based on real local trip fares in Ukana.
              </p>
            </div>

            {/* Vehicle Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCalcVehicle('okada')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  calcVehicle === 'okada'
                    ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🏍</span>
                <span>Okada (₦350 avg)</span>
              </button>
              <button
                type="button"
                onClick={() => setCalcVehicle('keke')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  calcVehicle === 'keke'
                    ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🛺</span>
                <span>Keke (₦600 avg)</span>
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Estimated Trips Per Day</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{tripsPerDay} trips</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={tripsPerDay}
                onChange={(e) => setTripsPerDay(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 (Part-time)</span>
                <span>15 (Standard)</span>
                <span>30 (Full hustle)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Working Days Per Week</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{workingDays} days</span>
              </div>
              <input
                type="range"
                min="4"
                max="7"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4 Days</span>
                <span>5 Days</span>
                <span>6 Days</span>
                <span>7 Days</span>
              </div>
            </div>
          </div>

          {/* Income Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-semibold">Daily Take-Home (Net)</span>
              <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
                ₦{dailyEarnings.toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>Gross: ₦{dailyGross.toLocaleString()}</span>
                <span className="text-slate-400">Fee (10%): ₦{dailyFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-semibold">Weekly Take-Home ({workingDays} days)</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                ₦{weeklyEarnings.toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 mt-1">
                Direct to your bank account weekly
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-semibold">Monthly Projected</span>
              <p className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
                ₦{monthlyEarnings.toLocaleString()}
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                Top 15% earner bracket in Akwa Ibom
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* AVAILABLE TRANSPORTATION ROLES (MOVED HERE FROM HOMEPAGE)         */}
        {/* ================================================================= */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white">Available Transportation Roles</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select the category that matches your vehicle and preferred daily schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobRoles.map((role) => (
              <div
                key={role.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <h4 className="font-bold text-base text-white">{role.title}</h4>
                        <p className="text-xs text-slate-400">{role.vehicle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {role.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400">Expected Weekly Take-Home:</span>
                    <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                      {role.weeklyPay}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {role.perks.map((perk, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{role.payoutFrequency}</span>
                  <button
                    type="button"
                    onClick={() => setShowDriverModal(true)}
                    className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Apply for this Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* WHAT YOU NEED TO APPLY (REQUIREMENTS & NIN)                       */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white">What You Need to Apply</h3>
            <p className="text-xs text-slate-400">
              Simple documentation for community safety and driver legitimacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <FileCheck className="w-6 h-6 text-amber-400" />
              <h5 className="font-bold text-sm text-white">1. National ID (NIN)</h5>
              <p className="text-xs text-slate-400">
                Valid 11-digit National Identity Number verified through our secure portal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <Phone className="w-6 h-6 text-emerald-400" />
              <h5 className="font-bold text-sm text-white">2. Phone &amp; Email</h5>
              <p className="text-xs text-slate-400">
                Active Nigerian phone number for SMS trip alerts and an email address for receipt summaries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <Bike className="w-6 h-6 text-blue-400" />
              <h5 className="font-bold text-sm text-white">3. Vehicle Plate / Reg</h5>
              <p className="text-xs text-slate-400">
                Registered motorcycle or tricycle with plate number (or match with a vehicle owner).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <h5 className="font-bold text-sm text-white">4. Facial Liveness</h5>
              <p className="text-xs text-slate-400">
                Clear selfie photo or quick video check for rider verification and passenger security.
              </p>
            </div>
          </div>

          {/* Bottom Big CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Ready to start earning daily?</p>
              <p className="text-xs text-slate-400">Takes less than 3 minutes to submit your onboarding profile.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowDriverModal(true)}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Register to Become a Driver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CONTACT US & OPERATIONAL HUB INFO                                */}
        {/* ================================================================= */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Prefer to Onboard In Person?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Visit our physical operations desk at Federal Polytechnic Ukana Junction or call our fleet coordinator.
              </p>
              <p className="text-xs font-mono text-slate-300 mt-1">
                Hotline: +234 802 345 6789 &middot; Email: careers@ukada-ride.ng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDriverModal(true)}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 whitespace-nowrap transition-colors"
          >
            Start Online Registration
          </button>
        </div>
      </div>

      {/* Driver Registration & Onboarding Form Modal */}
      <DriverOnboardingModal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
      />
    </div>
  );
};
