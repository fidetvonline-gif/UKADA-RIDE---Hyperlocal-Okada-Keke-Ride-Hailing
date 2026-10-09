import React, { useState } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { VehicleType, LocationLandmark } from '../../types';
import { InteractiveMap } from '../InteractiveMap';
import { UkadaLogo } from '../common/UkadaLogo';
import { ASSET_OKADA, ASSET_KEKE } from '../../data/mockData';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Shield,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  History,
  User,
  HelpCircle,
  X,
  CreditCard,
  Banknote,
  Search,
} from 'lucide-react';

export const PassengerExperience: React.FC = () => {
  const {
    passengerProfile,
    setPassengerProfile,
    landmarks,
    fareRules,
    requestRide,
    activeTrip,
    cancelTrip,
    rateTrip,
    submitComplaint,
    trips,
    drivers,
    fastForwardTrip,
    startInAppCall,
    activeCall,
  } = useUkada();

  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'support' | 'profile'>('book');

  // Booking Form State
  const [pickupId, setPickupId] = useState<string>('poly-gate');
  const [destinationId, setDestinationId] = useState<string>('ukana-market');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('okada');
  const [customPickupText, setCustomPickupText] = useState<string>('');
  const [customDestText, setCustomDestText] = useState<string>('');

  // Modals & UI States
  const [showCallModal, setShowCallModal] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [showComplaintModal, setShowComplaintModal] = useState<boolean>(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [hasRatedCurrent, setHasRatedCurrent] = useState<boolean>(false);

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState<'overcharging' | 'safety' | 'driver_behavior' | 'route_issue' | 'other'>('driver_behavior');
  const [complaintText, setComplaintText] = useState<string>('');
  const [complaintSubmitted, setComplaintSubmitted] = useState<boolean>(false);

  // Phone Verification Simulation State
  const [isVerifyingPhone, setIsVerifyingPhone] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>(passengerProfile.phone);
  const [nameInput, setNameInput] = useState<string>(passengerProfile.name);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const pickupLandmark = landmarks.find((l) => l.id === pickupId) || landmarks[0];
  const destLandmark = landmarks.find((l) => l.id === destinationId) || landmarks[1];

  // Calculate distance for preview
  const previewDistance = 2.4; // approx km between default points
  const okadaRule = fareRules.find((r) => r.vehicleType === 'okada') || fareRules[0];
  const kekeRule = fareRules.find((r) => r.vehicleType === 'keke') || fareRules[1];

  const okadaEstimate = Math.max(okadaRule.minFare, Math.ceil((okadaRule.baseFare + previewDistance * okadaRule.perKmRate) / 50) * 50);
  const kekeEstimate = Math.max(kekeRule.minFare, Math.ceil((kekeRule.baseFare + previewDistance * kekeRule.perKmRate) / 50) * 50);

  // Handle ride request submission
  const handleConfirmBooking = () => {
    return requestRide(
      pickupId,
      destinationId,
      selectedVehicle,
      customPickupText.trim() || undefined,
      customDestText.trim() || undefined
    );
  };

  const handleRateSubmit = () => {
    if (activeTrip) {
      rateTrip(activeTrip.id, ratingInput, feedbackInput);
      setHasRatedCurrent(true);
    }
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    submitComplaint(complaintCategory, complaintText, activeTrip?.id, 'passenger');
    setComplaintSubmitted(true);
    setTimeout(() => {
      setShowComplaintModal(false);
      setComplaintSubmitted(false);
      setComplaintText('');
    }, 1500);
  };

  const passengerTrips = trips.filter((t) => t.passengerId === passengerProfile.id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Mobile/Web Navigation Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <UkadaLogo size="sm" subtitle="PASSENGER TRANSIT" />

        {/* SOS Emergency Hotline Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSosModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg hover:bg-rose-900/70 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>SOS</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300 hover:text-white"
          >
            {passengerProfile.name.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('book')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'book'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Book Ride</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My Trips ({passengerTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'support'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Complaints</span>
          </button>
        </div>

        {/* TAB 1: BOOK RIDE */}
        {activeTab === 'book' && (
          <div className="flex flex-col gap-4">
            {/* Active Ride Card (If in progress or searching) */}
            {activeTrip && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
                {/* Status Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    {activeTrip.status === 'searching' && (
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    )}
                    {activeTrip.status === 'accepted' && (
                      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                    )}
                    {activeTrip.status === 'arrived' && (
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    )}
                    {activeTrip.status === 'in_progress' && (
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {activeTrip.status === 'searching' && 'Matching Nearby Driver...'}
                      {activeTrip.status === 'manual_dispatch' && 'Control Room Dispatching...'}
                      {activeTrip.status === 'accepted' && 'Driver Assigned & Approaching'}
                      {activeTrip.status === 'arrived' && 'Driver Arrived at Pickup!'}
                      {activeTrip.status === 'in_progress' && 'Trip In Progress'}
                      {activeTrip.status === 'completed' && 'Trip Completed'}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {activeTrip.id}
                  </span>
                </div>

                {/* Status-Specific Details */}
                {activeTrip.status === 'searching' && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin flex items-center justify-center shrink-0">
                      <Search className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-sm font-semibold text-white">
                        Searching for nearest available {activeTrip.vehicleType === 'okada' ? 'Okada' : 'Keke'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Broadcasting to verified drivers within 3 km in Ukana corridor. If smartphone match times out, control room will auto-assign via call.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          startInAppCall({
                            tripId: activeTrip.id,
                            callerRole: 'passenger',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        title="Call rider directly inside app with no 3rd-party software"
                      >
                        <Phone className="w-3.5 h-3.5 fill-current" />
                        <span>Direct Call Rider</span>
                      </button>

                      <button
                        onClick={() => fastForwardTrip(activeTrip.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
                      >
                        Simulate Driver Accept
                      </button>
                      <button
                        onClick={() => cancelTrip(activeTrip.id, 'Passenger cancelled during search')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/50 border border-rose-800/70 rounded-lg hover:bg-rose-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {activeTrip.status === 'manual_dispatch' && (
                  <div className="bg-amber-950/40 border border-amber-800/80 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-amber-300">
                        Assisted Dispatch in Queue
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Our local UKADA control administrator in Ukana is calling eligible drivers (including phone-only registered riders) to assign your ride immediately.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fastForwardTrip(activeTrip.id)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
                      >
                        Fast-Assign Driver
                      </button>
                      <button
                        onClick={() => cancelTrip(activeTrip.id, 'Cancelled in queue')}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Assigned Driver Card (FR-03 & FR-04) */}
                {activeTrip.assignedDriver && ['accepted', 'arrived', 'in_progress'].includes(activeTrip.status) && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeTrip.assignedDriver.photoUrl}
                        alt={activeTrip.assignedDriver.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 shadow-md shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {activeTrip.assignedDriver.fullName}
                          </h4>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                            {activeTrip.assignedDriver.driverCode}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {activeTrip.assignedDriver.vehicleModel} &middot; {activeTrip.assignedDriver.vehicleColor}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                          <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-200">
                            {activeTrip.assignedDriver.vehicleReg}
                          </span>
                          <span className="flex items-center text-amber-400 font-semibold">
                            ★ {activeTrip.assignedDriver.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Direct Contact & Simulation Controls */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() =>
                          startInAppCall({
                            targetDriver: activeTrip.assignedDriver,
                            tripId: activeTrip.id,
                            callerRole: 'passenger',
                          })
                        }
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-sm"
                        title="Direct in-app VoIP call (No 3rd-party application needed)"
                      >
                        <Phone className="w-3.5 h-3.5 fill-current" />
                        <span>Call Driver (In-App)</span>
                      </button>

                      <button
                        onClick={() => setShowCallModal(true)}
                        className="px-2.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                        title="Driver Details & Call Options"
                      >
                        Details
                      </button>

                      {/* Fast forward stage for testing */}
                      <button
                        onClick={() => fastForwardTrip(activeTrip.id)}
                        className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                        title="Simulate Next Status"
                      >
                        {activeTrip.status === 'accepted' ? 'Simulate Arrived' : 'Simulate Complete'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Trip Route Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Pickup Location</span>
                      <p className="font-semibold text-slate-200">{activeTrip.pickupName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination</span>
                      <p className="font-semibold text-slate-200">{activeTrip.destinationName}</p>
                    </div>
                  </div>
                </div>

                {/* Fare & Cash Payment Notice */}
                <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg text-amber-300">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-amber-400" />
                    <span>Pay Cash to Driver upon arrival</span>
                  </div>
                  <span className="font-bold text-sm text-white font-mono tabular-nums">
                    ₦{activeTrip.finalFare || activeTrip.estimatedFare}
                  </span>
                </div>
              </div>
            )}

            {/* Live Interactive Map with Vehicle tracking */}
            <div className="relative">
              <InteractiveMap
                drivers={drivers}
                activeTrip={activeTrip}
                landmarks={landmarks}
                selectedLandmark={pickupLandmark}
                className="h-72 sm:h-96 w-full"
              />
            </div>

            {/* Booking Form (Shown when no active trip or trip completed) */}
            {!activeTrip && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
                <div>
                  <h2 className="text-base font-bold text-white">Request an Okada or Keke</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Transparent local pricing, vetted local riders, direct phone communication.
                  </p>
                </div>

                {/* Location Inputs (Pickup & Destination) */}
                <div className="flex flex-col gap-3">
                  {/* Pickup Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Pickup Landmark in Ukana</span>
                    </label>
                    <div className="relative">
                      <select
                        value={pickupId}
                        onChange={(e) => setPickupId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        {landmarks.map((landmark) => (
                          <option key={landmark.id} value={landmark.id}>
                            {landmark.name} ({landmark.area})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Destination Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>Destination</span>
                    </label>
                    <div className="relative">
                      <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        {landmarks.map((landmark) => (
                          <option key={landmark.id} value={landmark.id}>
                            {landmark.name} ({landmark.area})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Vehicle Selector: Okada vs Keke */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">Choose Vehicle Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Okada Card */}
                    <div
                      onClick={() => setSelectedVehicle('okada')}
                      className={`relative flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedVehicle === 'okada'
                          ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={ASSET_OKADA}
                        alt="UKADA Okada Rider"
                        className="w-16 h-12 rounded-lg object-cover shrink-0 border border-slate-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">UKADA OKADA</h4>
                          <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                            ₦{okadaEstimate}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Motorcycle &middot; Fast &amp; single rider</p>
                        <div className="text-[10px] text-emerald-400 font-medium mt-1">
                          Safety helmet provided &middot; ~4 mins ETA
                        </div>
                      </div>
                    </div>

                    {/* Keke Card */}
                    <div
                      onClick={() => setSelectedVehicle('keke')}
                      className={`relative flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedVehicle === 'keke'
                          ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={ASSET_KEKE}
                        alt="UKADA Keke Tricycle"
                        className="w-16 h-12 rounded-lg object-cover shrink-0 border border-slate-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">UKADA KEKE</h4>
                          <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                            ₦{kekeEstimate}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Tricycle &middot; Up to 3 passengers / cargo</p>
                        <div className="text-[10px] text-emerald-400 font-medium mt-1">
                          Weather sheltered &middot; ~6 mins ETA
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature highlight: Direct In-App Calling banner */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                    <Phone className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>Direct In-App Driver Calling</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                        Zero 3rd-Party App
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Once you book a ride, you can actually call the driver directly from this app with high-definition audio. No phone airtime, WhatsApp or third-party dialer needed.
                    </p>
                  </div>
                </div>

                {/* Fare Summary & Booking Action */}
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Estimated distance: <span className="text-slate-200 font-semibold font-mono">{previewDistance} km</span> &middot; Payment: <span className="text-amber-400 font-medium">Cash to Driver</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const trip = handleConfirmBooking();
                        startInAppCall({ tripId: trip.id, callerRole: 'passenger' });
                      }}
                      className="w-full sm:w-auto px-4 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      title="Book ride and immediately open direct in-app voice call to driver"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                      <span>Book &amp; Call Driver Directly</span>
                    </button>

                    <button
                      onClick={handleConfirmBooking}
                      className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Confirm {selectedVehicle === 'okada' ? 'Okada' : 'Keke'} (₦{selectedVehicle === 'okada' ? okadaEstimate : kekeEstimate})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RIDE HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Trip History &amp; Receipts</h3>
                <p className="text-xs text-slate-400">Past Okada and Keke journeys in Akwa Ibom</p>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {passengerTrips.length} Trips
              </span>
            </div>

            {passengerTrips.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No past rides recorded yet. Request your first ride above!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {passengerTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg shrink-0">
                        {trip.vehicleType === 'okada' ? '🏍' : '🛺'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase">
                            {trip.vehicleType} &middot; {trip.pickupName.split('(')[0]} &rarr; {trip.destinationName.split('(')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(trip.createdAt).toLocaleDateString()} at {new Date(trip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {trip.distanceKm} km
                        </p>
                        {trip.assignedDriver && (
                          <p className="text-[11px] text-amber-400 mt-1">
                            Driver: {trip.assignedDriver.fullName} ({trip.assignedDriver.driverCode})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                      <span className="font-mono font-bold text-sm text-white tabular-nums">
                        ₦{trip.finalFare || trip.estimatedFare}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                        {trip.paymentStatus === 'paid_cash' ? 'Paid in Cash' : trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUPPORT & COMPLAINTS */}
        {activeTab === 'support' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-white">Passenger Support &amp; Incident Resolution</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Submit complaints regarding overcharging, lost items, driver behavior or route safety.
              </p>
            </div>

            <form onSubmit={handleComplaintSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Complaint Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e: any) => setComplaintCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="overcharging">Fare Discrepancy / Overcharging</option>
                  <option value="driver_behavior">Driver Conduct or Speeding</option>
                  <option value="safety">Vehicle Safety / No Helmet</option>
                  <option value="route_issue">Refusal to reach designated landmark</option>
                  <option value="other">Item Left Behind / General Feedback</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Description of Issue</label>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Provide specific details such as trip time, driver code, or landmark..."
                  rows={4}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {complaintSubmitted ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ticket submitted successfully! UKADA Control Room has received your report.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors w-full sm:w-auto self-start"
                >
                  Submit Ticket to Control Room
                </button>
              )}
            </form>

            {/* Direct Contact info for Ukana Dispatch Center */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col gap-2 text-xs text-slate-300">
              <span className="font-semibold text-white">UKADA Control Center Hotline</span>
              <p className="text-[11px] text-slate-400">
                Ukana Cottage Hospital Junction Station, Essien Udim, Akwa Ibom State.
              </p>
              <div className="flex items-center gap-4 mt-1 font-mono text-amber-400">
                <span>Direct Hotline: +234 803 000 8523</span>
                <span>WhatsApp: +234 814 000 8524</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & PHONE VERIFICATION */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Passenger Account</h3>
              <p className="text-xs text-slate-400">Verified Nigerian mobile profile for dispatch notifications</p>
            </div>

            <div className="flex flex-col gap-3 max-w-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number (Nigeria)</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              {/* Profile Saved feedback */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => {
                    setPassengerProfile({ id: passengerProfile.id, name: nameInput, phone: phoneInput });
                    setIsVerifyingPhone(true);
                    setTimeout(() => setIsVerifyingPhone(false), 2500);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Save Profile
                </button>
                {isVerifyingPhone && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CALL DRIVER MODAL (FR-03 & direct calling simulation) */}
      {showCallModal && activeTrip?.assignedDriver && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="relative">
              <img
                src={activeTrip.assignedDriver.photoUrl}
                alt={activeTrip.assignedDriver.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Phone className="w-3 h-3 text-slate-950" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{activeTrip.assignedDriver.fullName}</h3>
              <p className="text-xs text-amber-400 font-mono mt-0.5">
                {activeTrip.assignedDriver.driverCode} &middot; {activeTrip.assignedDriver.phone}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Vehicle: {activeTrip.assignedDriver.vehicleModel} ({activeTrip.assignedDriver.vehicleReg})
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => {
                  setShowCallModal(false);
                  startInAppCall({
                    targetDriver: activeTrip.assignedDriver,
                    tripId: activeTrip.id,
                    callerRole: 'passenger',
                  });
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call Directly From App (No 3rd-Party App)</span>
              </button>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 text-center">
                Direct in-app voice with crystal clear audio. Runs directly inside this application with zero airtime, phone credit or external dialer apps needed.
              </div>

              <button
                onClick={() => setShowCallModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white mt-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS EMERGENCY MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-950/80 border-2 border-rose-500 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Emergency Hotline (Ukana &amp; Essien Udim)</h3>
              <p className="text-xs text-slate-300 mt-1">
                Direct emergency dispatch contacts for Akwa Ibom police command and community security.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 text-left text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-white">Essien Udim Police Division</span>
                <p className="text-rose-400 font-mono mt-0.5">+234 803 123 0099</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-white">UKADA 24/7 Control Room Emergency Desk</span>
                <p className="text-amber-400 font-mono mt-0.5">+234 814 999 4400</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-white">Ukana Cottage Hospital Ambulance</span>
                <p className="text-emerald-400 font-mono mt-0.5">+234 802 888 1122</p>
              </div>
            </div>

            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
