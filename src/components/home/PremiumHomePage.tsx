import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUkada } from '../../context/UkadaContext';
import { VehicleType, LocationLandmark } from '../../types';
import { Vehicle3DCanvas } from '../3d/Vehicle3DCanvas';
import { InteractiveMap } from '../InteractiveMap';
import { MapLibreFleetMap } from '../map/MapLibreFleetMap';
import { DriverOnboardingModal } from './DriverOnboardingModal';
import { RealMobilityAndJobsSection } from './RealMobilityAndJobsSection';
import { UkadaLogo } from '../common/UkadaLogo';
import {
  Navigation,
  Smartphone,
  Shield,
  PhoneCall,
  Phone,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  Bike,
  Sparkles,
  Users,
  Compass,
  DollarSign,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const PremiumHomePage: React.FC = () => {
  const {
    setActiveView,
    drivers,
    trips,
    fareRules,
    landmarks,
    requestRide,
    activeTrip,
  } = useUkada();

  const [heroVehicle, setHeroVehicle] = useState<VehicleType>('okada');
  const [showDriverModal, setShowDriverModal] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mapEngine, setMapEngine] = useState<'vector' | 'satellite'>('vector');

  // Quick Booking Form State
  const [pickupId, setPickupId] = useState<string>('poly-gate');
  const [destId, setDestId] = useState<string>('ukana-market');
  const [bookingVehicle, setBookingVehicle] = useState<VehicleType>('okada');
  const [quickBookingSuccess, setQuickBookingSuccess] = useState<boolean>(false);

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const metricsSectionRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animations
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero-text', {
        opacity: 0,
        y: 28,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.gsap-vehicle-stage', {
        opacity: 0,
        scale: 0.96,
        y: 24,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.gsap-metric-card', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const okadaRule = fareRules.find((r) => r.vehicleType === 'okada') || fareRules[0];
  const kekeRule = fareRules.find((r) => r.vehicleType === 'keke') || fareRules[1];

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    requestRide(pickupId, destId, bookingVehicle);
    setQuickBookingSuccess(true);
    setTimeout(() => {
      setQuickBookingSuccess(false);
      setActiveView('passenger');
    }, 1200);
  };

  const faqs = [
    {
      q: 'Do I need any third-party app to call my driver?',
      a: 'No! UKADA features built-in in-app voice calling. Once you confirm your booking, you can directly call your driver with crystal-clear high-definition audio inside this app. No phone airtime, WhatsApp or third-party phone dialer is needed.',
    },
    {
      q: 'Is the live GPS map completely free to use?',
      a: 'Yes, 100% free with unlimited real-time telemetry. It runs natively in your browser for all passengers, workers, and drivers with zero subscriptions or setup required.',
    },
    {
      q: 'How does payment work?',
      a: 'Payment is 100% Cash to Driver or direct local bank transfer upon arrival at your drop-off. You see the transparent upfront fixed fare before booking, with zero surge pricing.',
    },
    {
      q: 'Can riders with basic feature phones (non-smartphones) use UKADA?',
      a: 'Yes! UKADA uses an inclusive Dual-Dispatch Architecture. Smartphone drivers match automatically via live GPS, while traditional riders with basic push-button phones are dispatched through the assisted UKADA Control center.',
    },
    {
      q: 'Are safety helmets provided for Okada motorbike trips?',
      a: 'Yes. All registered UKADA Okada operators carry sanitized passenger safety helmets and wear high-visibility reflective vests for verified passenger safety on all city and highway routes.',
    },
  ];

  return (
    <div className="flex flex-col bg-slate-950 text-slate-100 min-h-screen">
      {/* ================================================================= */}
      {/* 1. HERO SECTION WITH 360° TURNING REAL VEHICLE STUDIO             */}
      {/* ================================================================= */}
      <section
        ref={heroSectionRef}
        className="relative pt-6 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Value Proposition (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 z-10">
            <div className="flex flex-col gap-3">
              <h1 className="gsap-hero-text text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Hyperlocal Mobility,{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Engineered for Akwa Ibom.
                </span>
              </h1>

              <p className="gsap-hero-text text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                On-demand Okada and Keke transport with upfront local fares, 100% free live GPS tracking with real-time route updates, and direct in-app driver calling without third-party apps.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="gsap-hero-text flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveView('passenger')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Book a Ride Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('driver-job')}
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-slate-800 hover:border-slate-700 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Become a Driver</span>
              </button>
            </div>

            {/* Quick Feature Proof Pills */}
            <div className="gsap-hero-text flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-900">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash to Driver</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct In-App Calling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free Live GPS Fleet Map</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Vehicle Interactive Turntable Showcase (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 gsap-vehicle-stage">
            <Vehicle3DCanvas
              vehicleType={heroVehicle}
              onVehicleChange={(type) => setHeroVehicle(type)}
            />

            {/* Vehicle Mode Quick Comparison Bar */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
              <div
                onClick={() => setHeroVehicle('okada')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  heroVehicle === 'okada'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/40'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">🏍</span>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>Okada 150cc</span>
                    <span className="text-[10px] text-amber-400 font-mono">From ₦{okadaRule.baseFare}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Single passenger &middot; Fast traffic bypass</p>
                </div>
              </div>

              <div
                onClick={() => setHeroVehicle('keke')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  heroVehicle === 'keke'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">🛺</span>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>Keke Deluxe 200cc</span>
                    <span className="text-[10px] text-emerald-400 font-mono">From ₦{kekeRule.baseFare}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Up to 3 passengers &middot; Weather canopy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Metric Strip */}
        <div
          ref={metricsSectionRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 pt-8 border-t border-slate-900"
        >
          <div className="gsap-metric-card p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Minimum Fare</span>
            <p className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-1">
              ₦{okadaRule.minFare}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Transparent fixed pricing</p>
          </div>

          <div className="gsap-metric-card p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Average Pickup</span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-1">
              &lt; 4 mins
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Central Junction to Ideh Market</p>
          </div>

          <div className="gsap-metric-card p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Fleet</span>
            <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
              {drivers.length} Verified Riders
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">App GPS + Basic Phone drivers</p>
          </div>

          <div className="gsap-metric-card p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Driver Earnings</span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-1">
              90% Take-Home
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Fair platform policy for riders</p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. REAL MOBILITY & RECRUITMENT REPUTATION SHOWCASE               */}
      {/* ================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <RealMobilityAndJobsSection
          onApplyDriver={() => setActiveView('driver-job')}
          onBookRide={() => setActiveView('passenger')}
        />
      </section>

      {/* ================================================================= */}
      {/* 3. HOW IT WORKS: 4-STEP VISUAL PRODUCT GUIDE                       */}
      {/* ================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How to Book Your Okada or Keke
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Fast, transparent, and built for local Nigerian communities. No complicated digital sign-ups or payment cards required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-extrabold text-base">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Choose Your Pickup Landmark</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your pickup spot from verified local hotspots like Ideh Market, Central Junction, or Commercial Plaza, or type custom locations.
              </p>
              <div className="mt-auto pt-2 text-[11px] font-mono text-slate-500">
                &bull; Pre-mapped City Corridors
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-extrabold text-base">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Select Okada or Keke</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose between a fast 150cc Okada bike or a 3-passenger covered Keke. View instant upfront fixed fare calculations with zero surge pricing.
              </p>
              <div className="mt-auto pt-2 text-[11px] font-mono text-slate-500">
                &bull; Fixed Fare Guarantee
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-base">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Call Driver Directly (In-App)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once matched, click "Call Driver" right in the app. Coordinate your exact gate or corner with high-definition voice—no external app needed.
              </p>
              <div className="mt-auto pt-2 text-[11px] font-mono text-emerald-400">
                &bull; Zero 3rd-Party App
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold text-base">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Ride &amp; Pay Cash on Drop-off</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Meet your verified rider wearing a helmet. Reach your destination safely and pay Cash directly to the driver or via quick mobile bank transfer.
              </p>
              <div className="mt-auto pt-2 text-[11px] font-mono text-slate-500">
                &bull; 100% Cash to Driver
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. LIVE FLEET GPS MAP: 100% FREE TELEMETRY                        */}
      {/* ================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Banner Explaining Free Access */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">100% Free Live GPS Telemetry</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  Always Open &middot; Free for Commuters
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                This map is completely free and open for all commuters, workers, and residents. All telemetry and road coordinates run smoothly and natively inside the application with instant live updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setMapEngine('vector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapEngine === 'vector'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Native Vector Map (Free)
            </button>
            <button
              onClick={() => setMapEngine('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapEngine === 'satellite'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Dark Telemetry Tiles
            </button>
          </div>
        </div>

        {/* Map Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white">
                Live Fleet Telemetry &amp; Service Zones
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Track live moving Okada motorbikes and Keke tricycles around Federal Polytechnic Ukana and Ikot Ekpene. Completely open with zero third-party subscriptions.
            </p>
          </div>

          <button
            onClick={() => setActiveView('passenger')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <span>Open Booking Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Render Map Engine */}
        {mapEngine === 'vector' ? (
          <InteractiveMap
            drivers={drivers}
            landmarks={landmarks}
            activeTrip={activeTrip}
            className="h-[490px] w-full"
          />
        ) : (
          <MapLibreFleetMap
            drivers={drivers}
            landmarks={landmarks}
            activeTrip={activeTrip}
            className="h-[490px] w-full"
          />
        )}
      </section>

      {/* ================================================================= */}
      {/* 5. INCLUSIVE DUAL-DISPATCH ARCHITECTURE                            */}
      {/* ================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2 inline-block">
              Zero Workforce Exclusion
            </span>
            <h2 className="text-2xl font-bold text-white">
              Built for Both Smartphone &amp; Push-Button Phone Drivers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Unlike foreign ride-hailing apps that exclude local Nigerian riders without expensive smartphones, UKADA bridges the digital divide with our patent-ready dual-stream matching architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stream A: Automated Smartphone Matching */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. App-Enabled Automated Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smartphone-equipped Okada and Keke riders broadcast real-time GPS coordinates. Rides are matched automatically within 3 km using proximity ranking and a 15-second acceptance timer.
              </p>
              <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant route polyline &amp; live GPS telemetry</span>
              </div>
            </div>

            {/* Stream B: Administrator-Assisted Voice Dispatch */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Assisted Voice Dispatch for Basic Phones</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When automated matching times out or in rural pockets, requests enter the UKADA Control manual queue. Administrators call registered basic-phone drivers on cellular networks to confirm availability and dispatch the ride.
              </p>
              <div className="mt-2 text-[11px] font-mono text-blue-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero driver exclusion &middot; 100% coverage reliability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. DETAILED PRODUCT FAQ ACCORDION                                 */}
      {/* ================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-start gap-2 mb-8">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Everything You Need to Know About UKADA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear answers on in-app calling, payment options, safety standards, and maps.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors"
                >
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. DRIVER PARTNERSHIP CTA BANNER                                   */}
      {/* ================================================================= */}
      <section className="py-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl flex flex-col gap-3">
            <UkadaLogo size="md" subtitle="FLEET RECRUITMENT PROGRAM" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Own an Okada or Keke in Ukana or Ikot Ekpene?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Join hundreds of verified riders receiving guaranteed passenger trips every day. Enjoy low 10% platform fees and retain 90% of your earnings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDriverModal(true)}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              Register as Driver
            </button>

            <button
              onClick={() => setActiveView('driver')}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
            >
              Open Driver App
            </button>
          </div>
        </div>
      </section>

      {/* DRIVER ONBOARDING MODAL */}
      <DriverOnboardingModal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
      />
    </div>
  );
};
