import React, { useState, useEffect } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { InteractiveMap } from '../InteractiveMap';
import {
  Power,
  Navigation,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  User,
  Shield,
  MapPin,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Bike,
} from 'lucide-react';

export const DriverExperience: React.FC = () => {
  const {
    drivers,
    activeDriverId,
    setActiveDriverId,
    currentDriver,
    toggleDriverOnline,
    trips,
    incomingTripForDriver,
    acceptRide,
    rejectRide,
    markArrivedAtPickup,
    startTrip,
    completeTrip,
    landmarks,
    simulateIncomingRequest,
    startInAppCall,
    activeCall,
    answerCall,
    declineCall,
  } = useUkada();

  const [activeDriverTab, setActiveDriverTab] = useState<'duty' | 'earnings' | 'profile'>('duty');
  const [requestCountdown, setRequestCountdown] = useState<number>(15);
  const [cashCollectedInput, setCashCollectedInput] = useState<number | null>(null);

  // Find any active trip assigned to this driver
  const assignedTrip = trips.find(
    (t) =>
      t.driverId === currentDriver?.id &&
      ['accepted', 'arrived', 'in_progress'].includes(t.status)
  );

  // Incoming request countdown timer (FR-04)
  useEffect(() => {
    if (!incomingTripForDriver) {
      setRequestCountdown(15);
      return;
    }

    setRequestCountdown(15);
    const interval = setInterval(() => {
      setRequestCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          rejectRide(incomingTripForDriver.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingTripForDriver?.id, rejectRide]);

  // Driver trips for earnings calculation
  const driverTrips = trips.filter(
    (t) => t.driverId === currentDriver?.id && t.status === 'completed'
  );

  const totalGrossCash = driverTrips.reduce((acc, t) => acc + (t.finalFare || t.estimatedFare), 0);
  const platformCommission = Math.round(totalGrossCash * 0.1); // 10% platform fee
  const netEarnings = totalGrossCash - platformCommission;

  if (!currentDriver) {
    return <div className="p-8 text-center text-slate-400">Loading driver details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Driver App Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={currentDriver.photoUrl}
            alt={currentDriver.fullName}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">{currentDriver.fullName}</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {currentDriver.driverCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentDriver.vehicleModel} &middot; {currentDriver.vehicleReg}
            </p>
          </div>
        </div>

        {/* Online / Offline Duty Switch */}
        <div className="flex items-center gap-2">
          {/* Quick Driver Switcher for testing multiple accounts */}
          <select
            value={activeDriverId}
            onChange={(e) => setActiveDriverId(e.target.value)}
            className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 font-medium"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.driverCode} - {d.fullName} ({d.driverMode === 'phone_only' ? 'Phone-only' : 'App'})
              </option>
            ))}
          </select>

          <button
            onClick={() => toggleDriverOnline(currentDriver.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              currentDriver.availability === 'online'
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{currentDriver.availability === 'online' ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>
      </header>

      {/* Driver Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Incoming In-App Voice Call Banner (Tested directly in browser) */}
        {activeCall && activeCall.status === 'outgoing_ringing' && activeCall.receiverRole === 'driver' && (
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl border border-emerald-400 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                <Phone className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 block">
                  Incoming In-App Call (Direct VoIP)
                </span>
                <h4 className="text-sm font-bold text-slate-950">
                  Passenger: {activeCall.callerName} ({activeCall.callerPhone})
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={answerCall}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Answer Call</span>
              </button>
              <button
                onClick={declineCall}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}
        {/* Driver Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveDriverTab('duty')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeDriverTab === 'duty'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Duty Console</span>
          </button>

          <button
            onClick={() => setActiveDriverTab('earnings')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeDriverTab === 'earnings'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Earnings Ledger</span>
          </button>

          <button
            onClick={() => setActiveDriverTab('profile')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeDriverTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Driver Dossier</span>
          </button>
        </div>

        {/* TAB 1: ON-DUTY CONSOLE */}
        {activeDriverTab === 'duty' && (
          <div className="flex flex-col gap-4">
            {/* Phone-Only Driver Notice (If driver is basic feature-phone only) */}
            {currentDriver.driverMode === 'phone_only' && (
              <div className="bg-blue-950/40 border border-blue-800 p-4 rounded-xl flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-white">Registered Phone-Only Driver Mode</h4>
                  <p className="text-slate-300 mt-0.5">
                    This driver account operates with a basic mobile phone. Ride dispatches are assigned manually by the UKADA control room via standard GSM phone calls. Trip statuses and fares are recorded on the control dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* INCOMING RIDE REQUEST MODAL / BANNER (FR-04) */}
            {incomingTripForDriver && currentDriver.availability === 'online' && !assignedTrip && (
              <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-500 rounded-2xl p-5 shadow-2xl animate-pulse">
                <div className="flex items-center justify-between mb-3 border-b border-amber-500/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Incoming Ride Request!
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{requestCountdown}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Pickup Point</span>
                    <p className="text-xs font-bold text-white mt-0.5">{incomingTripForDriver.pickupName}</p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination</span>
                    <p className="text-xs font-bold text-white mt-0.5">{incomingTripForDriver.destinationName}</p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Fare (Cash)</span>
                    <p className="text-base font-mono font-bold text-amber-400 tabular-nums">
                      ₦{incomingTripForDriver.estimatedFare}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => acceptRide(incomingTripForDriver.id)}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ACCEPT RIDE (₦{incomingTripForDriver.estimatedFare})</span>
                  </button>

                  <button
                    onClick={() => rejectRide(incomingTripForDriver.id)}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE ASSIGNED TRIP WORKFLOW (FR-06) */}
            {assignedTrip && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Active Ride: {assignedTrip.status.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-0.5">
                      Passenger: {assignedTrip.passengerName}
                    </h3>
                  </div>

                  <button
                    onClick={() =>
                      startInAppCall({
                        targetPassenger: { name: assignedTrip.passengerName, phone: assignedTrip.passengerPhone },
                        tripId: assignedTrip.id,
                        callerRole: 'driver',
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                    title="Direct in-app voice call to passenger"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Call Passenger (In-App)</span>
                  </button>
                </div>

                {/* Route overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Pickup</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{assignedTrip.pickupName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-400 font-semibold uppercase">Destination</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{assignedTrip.destinationName}</p>
                  </div>
                </div>

                {/* Lifecycle Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {assignedTrip.status === 'accepted' && (
                    <button
                      onClick={() => markArrivedAtPickup(assignedTrip.id)}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Arrived at Pickup Location</span>
                    </button>
                  )}

                  {assignedTrip.status === 'arrived' && (
                    <button
                      onClick={() => startTrip(assignedTrip.id)}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start Trip with Passenger</span>
                    </button>
                  )}

                  {assignedTrip.status === 'in_progress' && (
                    <div className="w-full flex flex-col gap-2">
                      <button
                        onClick={() => completeTrip(assignedTrip.id, cashCollectedInput || assignedTrip.finalFare)}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Complete Trip &amp; Collect ₦{assignedTrip.finalFare || assignedTrip.estimatedFare} Cash</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Offline or Waiting State */}
            {!assignedTrip && !incomingTripForDriver && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {currentDriver.availability === 'online'
                      ? 'You are Online & Ready for Requests'
                      : 'You are Currently Offline'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentDriver.availability === 'online'
                      ? 'GPS active in Ukana Central. Stay parked or patrol near Poly Gate or Ideh Market for immediate dispatches.'
                      : 'Switch online above when ready to receive Okada/Keke ride orders.'}
                  </p>
                </div>

                {currentDriver.availability === 'online' && (
                  <button
                    onClick={() => simulateIncomingRequest(currentDriver.vehicleType)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors shrink-0"
                  >
                    Simulate Incoming Request
                  </button>
                )}
              </div>
            )}

            {/* Live Navigation & Fleet Map */}
            <InteractiveMap
              drivers={drivers}
              activeTrip={assignedTrip}
              landmarks={landmarks}
              className="h-80 w-full"
            />
          </div>
        )}

        {/* TAB 2: DRIVER EARNINGS LEDGER */}
        {activeDriverTab === 'earnings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Driver Daily Earnings Ledger</h3>
              <p className="text-xs text-slate-400">
                Transparent breakdown of cash fares collected and 10% platform commission.
              </p>
            </div>

            {/* Summary KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Gross Cash Collected</span>
                <p className="text-xl font-bold font-mono text-white tabular-nums mt-1">
                  ₦{totalGrossCash.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400">{driverTrips.length} completed trips</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-amber-400 font-semibold uppercase">Platform Fee (10%)</span>
                <p className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-1">
                  ₦{platformCommission.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400">Weekly settlement</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-emerald-400 font-semibold uppercase">Net Driver Take-Home</span>
                <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                  ₦{netEarnings.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-400">90% retained</span>
              </div>
            </div>

            {/* Completed trips list */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Trips Completed Today</h4>
              {driverTrips.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No completed trips yet today. Go online to accept rides!
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {driverTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">
                          {trip.pickupName.split('(')[0]} &rarr; {trip.destinationName.split('(')[0]}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(trip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {trip.distanceKm} km &middot; Cash paid
                        </p>
                      </div>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">
                        ₦{trip.finalFare || trip.estimatedFare}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DRIVER DOSSIER */}
        {activeDriverTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Driver Identification &amp; Credentials</h3>
              <p className="text-xs text-slate-400">Verified by UKADA Control Administration</p>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={currentDriver.photoUrl}
                alt={currentDriver.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <h4 className="text-base font-bold text-white">{currentDriver.fullName}</h4>
                <p className="text-xs font-mono text-amber-400 mt-0.5">{currentDriver.driverCode}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                    {currentDriver.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                    {currentDriver.driverMode === 'app' ? 'App GPS Enabled' : 'Phone-Only Basic'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Registered Vehicle</span>
                <p className="font-semibold text-white mt-0.5">{currentDriver.vehicleModel} ({currentDriver.vehicleColor})</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">License Plate</span>
                <p className="font-semibold font-mono text-amber-400 mt-0.5">{currentDriver.vehicleReg}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Authorized Service Zones</span>
                <p className="font-semibold text-white mt-0.5">{currentDriver.serviceZones.join(', ')}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Approval Admin</span>
                <p className="font-semibold text-white mt-0.5">{currentDriver.approvedBy}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
