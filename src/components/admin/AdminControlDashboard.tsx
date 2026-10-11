import React, { useState } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { Driver, TripBooking, VehicleType, DriverMode, DriverStatus, FareRule } from '../../types';
import { InteractiveMap } from '../InteractiveMap';
import { UkadaLogo } from '../common/UkadaLogo';
import { ASSET_AVATAR_1, ASSET_AVATAR_2 } from '../../data/mockData';
import { resolveImageUrl } from '../../utils/assetResolver';
import {
  Activity,
  Users,
  Car,
  DollarSign,
  PhoneCall,
  ShieldAlert,
  Settings,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  Compass,
  MapPin,
  Clock,
  Check,
  TrendingUp,
  UserCheck,
  RotateCcw,
} from 'lucide-react';

export const AdminControlDashboard: React.FC = () => {
  const {
    isSupabaseConfigured,
    trips,
    drivers,
    fareRules,
    serviceZones,
    complaints,
    auditLogs,
    landmarks,
    driverApplications,
    assignManualDispatch,
    registerDriver,
    approveDriverApplication,
    rejectDriverApplication,
    updateDriverStatus,
    updateFareRule,
    updateComplaintStatus,
    toggleServiceZone,
  } = useUkada();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'manual_queue' | 'fleet' | 'live_map' | 'fares' | 'complaints' | 'audit' | 'verification'
  >('overview');

  // Filter states
  const [fleetFilterMode, setFleetFilterMode] = useState<string>('all');
  const [fleetFilterVehicle, setFleetFilterVehicle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modals
  const [showAddDriverModal, setShowAddDriverModal] = useState<boolean>(false);
  const [selectedDriverForAction, setSelectedDriverForAction] = useState<Driver | null>(null);
  const [actionReason, setActionReason] = useState<string>('');

  // Manual Dispatch State
  const [selectedTripForDispatch, setSelectedTripForDispatch] = useState<TripBooking | null>(null);
  const [dispatchSelectedDriverId, setDispatchSelectedDriverId] = useState<string>('');
  const [agreedFareInput, setAgreedFareInput] = useState<number>(500);

  // New Driver Form State
  const [newDriverName, setNewDriverName] = useState<string>('');
  const [newDriverPhone, setNewDriverPhone] = useState<string>('+234 ');
  const [newDriverCode, setNewDriverCode] = useState<string>(`UKD-OK-${Math.floor(100 + Math.random() * 900)}`);
  const [newDriverMode, setNewDriverMode] = useState<DriverMode>('app');
  const [newDriverVehicle, setNewDriverVehicle] = useState<VehicleType>('okada');
  const [newDriverReg, setNewDriverReg] = useState<string>('AKW-');
  const [newDriverColor, setNewDriverColor] = useState<string>('Red');
  const [newDriverModel, setNewDriverModel] = useState<string>('Bajaj Boxer 150');
  const [newDriverZone, setNewDriverZone] = useState<string>('Ukana Central Zone');

  // Fare editing states
  const [editingFareRule, setEditingFareRule] = useState<FareRule | null>(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const activeTripsCount = trips.filter((t) => ['requested', 'searching', 'accepted', 'arrived', 'in_progress'].includes(t.status)).length;
  const manualQueueTrips = trips.filter((t) => t.status === 'manual_dispatch' || t.status === 'searching');
  const onlineDrivers = drivers.filter((d) => d.availability === 'online');
  const phoneOnlyDrivers = drivers.filter((d) => d.driverMode === 'phone_only');
  const totalCompletedVolume = trips
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + (t.finalFare || t.estimatedFare), 0);
  const totalPlatformFees = Math.round(totalCompletedVolume * 0.1);

  // Handle new driver registration
  const handleRegisterDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim()) return;

    registerDriver({
      fullName: newDriverName.trim(),
      phone: newDriverPhone.trim(),
      photoUrl: newDriverMode === 'app' ? ASSET_AVATAR_1 : ASSET_AVATAR_2,
      driverCode: newDriverCode.trim(),
      driverMode: newDriverMode,
      vehicleType: newDriverVehicle,
      vehicleReg: newDriverReg.trim(),
      vehicleColor: newDriverColor.trim(),
      vehicleModel: newDriverModel.trim(),
      status: 'approved',
      availability: 'online',
      serviceZones: [newDriverZone],
      currentLat: 5.2860,
      currentLng: 7.6790,
      lastLocationUpdate: new Date().toISOString(),
      approvedBy: 'Admin Michael Essien',
    });

    setShowAddDriverModal(false);
    setNewDriverName('');
    showToast(`Driver ${newDriverCode} onboarded & approved successfully!`);
  };

  const handleManualDispatchConfirm = () => {
    if (!selectedTripForDispatch || !dispatchSelectedDriverId) return;
    assignManualDispatch(selectedTripForDispatch.id, dispatchSelectedDriverId, agreedFareInput, 'Admin Michael Essien');
    setSelectedTripForDispatch(null);
    setDispatchSelectedDriverId('');
    showToast('Ride manually dispatched! Driver and passenger records updated.');
  };

  const handleDriverStatusUpdate = (status: DriverStatus) => {
    if (!selectedDriverForAction) return;
    updateDriverStatus(
      selectedDriverForAction.id,
      status,
      actionReason.trim() || `Administrative ${status} action`,
      'Admin Michael Essien'
    );
    setSelectedDriverForAction(null);
    setActionReason('');
  };

  // Filtered drivers list
  const filteredDrivers = drivers.filter((d) => {
    if (fleetFilterMode !== 'all' && d.driverMode !== fleetFilterMode) return false;
    if (fleetFilterVehicle !== 'all' && d.vehicleType !== fleetFilterVehicle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.fullName.toLowerCase().includes(q) ||
        d.driverCode.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.vehicleReg.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <UkadaLogo size="sm" subtitle="OPERATIONS CONTROL" />
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold uppercase">
            Ukana Dispatch Center
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-[10px] font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-slate-300">
                {isSupabaseConfigured ? 'Supabase Live' : 'Supabase Client Active'}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fleet Online: <strong className="text-white font-mono tabular-nums">{onlineDrivers.length}/{drivers.length}</strong></span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Manual Queue: <strong className="text-amber-400 font-mono tabular-nums">{manualQueueTrips.length}</strong></span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
              ME
            </div>
            <span className="text-xs font-semibold text-slate-200">Admin Michael</span>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl w-full mx-auto gap-5">
        {/* Navigation Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview &amp; Stats</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('manual_queue')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'manual_queue' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Manual Dispatch Queue ({manualQueueTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('fleet')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'fleet' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Fleet &amp; Drivers ({drivers.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('live_map')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'live_map' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Live Fleet Map</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('fares')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'fares' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pricing &amp; Zones</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('complaints')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'complaints' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Complaints ({complaints.filter((c) => c.status === 'open').length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'audit' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('verification')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'verification' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Driver Verification ({driverApplications.filter(a => a.status === 'pending').length})</span>
          </button>
        </div>

        {/* 1. OVERVIEW & STATS TAB */}
        {activeAdminTab === 'overview' && (
          <div className="flex flex-col gap-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Bookings Today</span>
                <p className="text-2xl font-bold font-mono text-white tabular-nums mt-2">{trips.length}</p>
                <div className="text-[11px] text-slate-400 mt-2">
                  <span>{activeTripsCount} Active</span> &middot; <span>{trips.filter((t) => t.status === 'completed').length} Completed</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-amber-400">Manual Dispatch Queue</span>
                <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-2">{manualQueueTrips.length}</p>
                <div className="text-[11px] text-slate-400 mt-2">
                  Awaiting phone call assignment
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-emerald-400">Online Fleet in Ukana</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-2">
                  {onlineDrivers.length} <span className="text-sm text-slate-400 font-normal">/ {drivers.length} Total</span>
                </p>
                <div className="text-[11px] text-slate-400 mt-2">
                  <span>{phoneOnlyDrivers.length} Phone-only registered</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-400">Gross Volume (GMV)</span>
                <p className="text-2xl font-bold font-mono text-white tabular-nums mt-2">
                  ₦{totalCompletedVolume.toLocaleString()}
                </p>
                <div className="text-[11px] text-emerald-400 mt-2 font-mono">
                  ₦{totalPlatformFees.toLocaleString()} Platform Fees (10%)
                </div>
              </div>
            </div>

            {/* Live Operational Fleet Map */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Live Operations Map: Ukana, Ikot Ekpene, Essien Udim</h3>
                  <p className="text-xs text-slate-400">Real-time GPS positions &amp; stationary phone-only driver stands</p>
                </div>
                <button
                  onClick={() => setActiveAdminTab('live_map')}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  Expand Map &rarr;
                </button>
              </div>

              <InteractiveMap
                drivers={drivers}
                landmarks={landmarks}
                className="h-80 w-full"
              />
            </div>

            {/* Recent Trips Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Recent Trips Stream</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase">
                      <th className="py-2.5 px-3">Trip ID</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Passenger</th>
                      <th className="py-2.5 px-3">Route</th>
                      <th className="py-2.5 px-3">Driver</th>
                      <th className="py-2.5 px-3">Dispatch</th>
                      <th className="py-2.5 px-3">Fare</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {trips.slice(0, 6).map((trip, idx) => (
                      <tr key={`${trip.id}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-300">{trip.id}</td>
                        <td className="py-2.5 px-3 uppercase font-semibold text-slate-300">
                          {trip.vehicleType === 'okada' ? '🏍 Okada' : '🛺 Keke'}
                        </td>
                        <td className="py-2.5 px-3 text-white font-medium">{trip.passengerName}</td>
                        <td className="py-2.5 px-3 text-slate-300 truncate max-w-xs">
                          {trip.pickupName.split('(')[0]} &rarr; {trip.destinationName.split('(')[0]}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {trip.assignedDriver ? `${trip.assignedDriver.fullName} (${trip.assignedDriver.driverCode})` : 'Unassigned'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                            {trip.dispatchMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-400 tabular-nums">
                          ₦{trip.finalFare || trip.estimatedFare}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            trip.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            trip.status === 'searching' || trip.status === 'manual_dispatch' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANUAL DISPATCH QUEUE (FR-05) */}
        {activeAdminTab === 'manual_queue' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Manual Dispatch Queue</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assisting passengers whose automatic match timed out, and dispatching basic phone-only drivers.
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold tabular-nums">
                  {manualQueueTrips.length} Waiting
                </span>
              </div>
            </div>

            {manualQueueTrips.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No bookings currently pending in manual dispatch queue. All automated requests are handled.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {manualQueueTrips.map((trip, idx) => (
                  <div
                    key={`${trip.id}-${idx}`}
                    className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 flex flex-col gap-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-xs font-bold text-white uppercase font-mono">{trip.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 uppercase">
                          {trip.vehicleType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Passenger: <strong className="text-white">{trip.passengerName}</strong> ({trip.passengerPhone})
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Pickup Location</span>
                        <p className="font-semibold text-slate-200 mt-0.5">{trip.pickupName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination</span>
                        <p className="font-semibold text-slate-200 mt-0.5">{trip.destinationName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Proposed Fare</span>
                        <p className="font-mono font-bold text-amber-400 text-sm mt-0.5 tabular-nums">
                          ₦{trip.estimatedFare} ({trip.distanceKm} km)
                        </p>
                      </div>
                    </div>

                    {/* Eligible Drivers for this Booking (FR-05) */}
                    <div className="mt-2 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                        Available Eligible Drivers in Ukana (App &amp; Phone-Only):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {drivers
                          .filter((d) => d.vehicleType === trip.vehicleType && d.status === 'approved')
                          .map((d) => (
                            <div
                              key={d.id}
                              className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={resolveImageUrl(d.photoUrl)}
                                  alt={d.fullName}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-white text-[11px] leading-tight">{d.fullName}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{d.driverCode} &middot; {d.phone}</p>
                                  <span className={`text-[9px] font-semibold uppercase ${
                                    d.driverMode === 'phone_only' ? 'text-blue-400' : 'text-emerald-400'
                                  }`}>
                                    {d.driverMode === 'phone_only' ? 'Basic Phone' : 'App GPS'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 items-end">
                                <a
                                  href={`tel:${d.phone.replace(/[^0-9+]/g, '')}`}
                                  className="px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
                                  title="Call Driver on Phone"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Call</span>
                                </a>

                                <button
                                  onClick={() => {
                                    setSelectedTripForDispatch(trip);
                                    setDispatchSelectedDriverId(d.id);
                                    setAgreedFareInput(trip.estimatedFare);
                                  }}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition-colors"
                                >
                                  Assign Ride
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. FLEET & DRIVERS MANAGEMENT (FR-02) */}
        {activeAdminTab === 'fleet' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Registered Fleet &amp; Driver Onboarding</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  App-enabled riders with live GPS and phone-only commercial drivers.
                </p>
              </div>

              <button
                onClick={() => setShowAddDriverModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard New Driver</span>
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by driver code, name, plate or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Mode:</span>
                <select
                  value={fleetFilterMode}
                  onChange={(e) => setFleetFilterMode(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
                >
                  <option value="all">All Modes</option>
                  <option value="app">App-Enabled (GPS)</option>
                  <option value="phone_only">Phone-Only (Basic Phone)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Vehicle:</span>
                <select
                  value={fleetFilterVehicle}
                  onChange={(e) => setFleetFilterVehicle(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
                >
                  <option value="all">All Vehicles</option>
                  <option value="okada">Okada (Motorcycle)</option>
                  <option value="keke">Keke (Tricycle)</option>
                </select>
              </div>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={resolveImageUrl(driver.photoUrl)}
                      alt={driver.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-500 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{driver.fullName}</h4>
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {driver.driverCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{driver.phone}</p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {driver.vehicleModel} &middot; <strong className="font-mono text-slate-200">{driver.vehicleReg}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        driver.availability === 'online' ? 'bg-emerald-400' : 'bg-slate-600'
                      }`} />
                      <span className="text-slate-300 capitalize">{driver.availability}</span>
                      <span className="text-slate-500">&middot;</span>
                      <span className="text-amber-400 font-semibold font-mono">★ {driver.rating}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      driver.status === 'approved' ? 'bg-emerald-950 text-emerald-300' :
                      driver.status === 'suspended' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {driver.status}
                    </span>
                  </div>

                  {/* Admin controls */}
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    {driver.status === 'approved' ? (
                      <button
                        onClick={() => setSelectedDriverForAction(driver)}
                        className="px-2.5 py-1 text-[10px] font-medium text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded hover:bg-rose-900 transition-colors"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => updateDriverStatus(driver.id, 'approved', 'Reactivated by Admin', 'Admin Michael')}
                        className="px-2.5 py-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded hover:bg-emerald-900 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. LIVE FLEET MAP TAB */}
        {activeAdminTab === 'live_map' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Live Fleet GPS Radar &amp; Stationary Stands</h3>
                <p className="text-xs text-slate-400">
                  Green pulses indicate app-enabled drivers with fresh coordinates (&lt;30s). Blue pins indicate phone-only drivers at physical transport stands.
                </p>
              </div>
            </div>

            <InteractiveMap
              drivers={drivers}
              landmarks={landmarks}
              className="h-[520px] w-full"
            />
          </div>
        )}

        {/* 5. FARE RULES & ZONES CONFIGURATION */}
        {activeAdminTab === 'fares' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Fare Rules */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-base font-bold text-white">Fare Rules Configuration</h3>
              <p className="text-xs text-slate-400">
                Configured rates apply to passenger estimates and driver fare calculations.
              </p>

              <div className="flex flex-col gap-3">
                {fareRules.map((rule) => (
                  <div key={rule.vehicleType} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold uppercase text-amber-400">
                        {rule.vehicleType === 'okada' ? '🏍 UKADA OKADA (Motorcycle)' : '🛺 UKADA KEKE (Tricycle)'}
                      </span>
                      <button
                        onClick={() => setEditingFareRule(rule)}
                        className="text-xs text-amber-400 hover:text-white font-semibold"
                      >
                        Edit Rule
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400">Base Fare</span>
                        <p className="font-mono font-bold text-white tabular-nums mt-0.5">₦{rule.baseFare}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Rate / km</span>
                        <p className="font-mono font-bold text-white tabular-nums mt-0.5">₦{rule.perKmRate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Minimum Fare</span>
                        <p className="font-mono font-bold text-white tabular-nums mt-0.5">₦{rule.minFare}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Cancel Fee</span>
                        <p className="font-mono font-bold text-white tabular-nums mt-0.5">₦{rule.cancelFee}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Zones */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-base font-bold text-white">Operating Service Zones</h3>
              <p className="text-xs text-slate-400">
                Active geofenced operational zones in Akwa Ibom State.
              </p>

              <div className="flex flex-col gap-2.5">
                {serviceZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{zone.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({zone.radiusKm} km radius)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{zone.description}</p>
                    </div>

                    <button
                      onClick={() => toggleServiceZone(zone.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        zone.active
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {zone.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. COMPLAINTS & TICKETS TAB */}
        {activeAdminTab === 'complaints' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Passenger &amp; Driver Support Desk</h3>
            <div className="flex flex-col gap-3">
              {complaints.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No support tickets reported.</div>
              ) : (
                complaints.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">{ticket.id}</span>
                        <span className="text-white font-semibold">{ticket.reporterName} ({ticket.reporterRole})</span>
                        <span className="text-slate-400 font-mono">{ticket.reporterPhone}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    <p className="text-slate-300">{ticket.message}</p>

                    {ticket.status !== 'resolved' && (
                      <button
                        onClick={() => updateComplaintStatus(ticket.id, 'resolved', 'Resolved by Admin Michael via phone call')}
                        className="self-start px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px]"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 7. AUDIT LOG TAB */}
        {activeAdminTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Administrator Audit Trail</h3>
            <div className="flex flex-col gap-2">
              {auditLogs.map((log, idx) => (
                <div key={`${log.id}-${idx}`} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{log.action}</span> &middot;{' '}
                    <span className="text-slate-400">{log.adminName}</span>
                    <p className="text-slate-300 mt-0.5">{log.details}</p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 tabular-nums shrink-0 ml-3">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. DRIVER VERIFICATION TAB */}
        {activeAdminTab === 'verification' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  Driver Applicant Verification &amp; Compliance Review
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review applicant details, National Identification Number (NIN), contact credentials, and biometric liveness before granting operational status.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold">
                  {driverApplications.filter((a) => a.status === 'pending').length} Pending Review
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                  {driverApplications.filter((a) => a.status === 'approved').length} Approved
                </span>
              </div>
            </div>

            {/* Filter Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setVerificationStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      verificationStatusFilter === status
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {status === 'all' ? 'All Applications' : `${status} (${driverApplications.filter((a) => a.status === status).length})`}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                Showing {driverApplications.filter((a) => verificationStatusFilter === 'all' || a.status === verificationStatusFilter).length} records
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {driverApplications.filter((a) => verificationStatusFilter === 'all' || a.status === verificationStatusFilter).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <UserCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  No driver applications match the selected status filter.
                </div>
              ) : (
                driverApplications
                  .filter((a) => verificationStatusFilter === 'all' || a.status === verificationStatusFilter)
                  .map((app, idx) => (
                  <div
                    key={`${app.id}-${idx}`}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-sm font-bold text-white">{app.fullName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            app.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {app.status === 'pending' ? 'Pending Verification' : app.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Ref: {app.id} &middot; Applied {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Contact Email</span>
                          <span className="font-mono text-slate-200 truncate">{app.email}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Phone Number</span>
                          <span className="font-mono text-slate-200">{app.phone}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">National Identity Number (NIN)</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {app.nin}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                              NIMC Verified
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Vehicle &amp; Mode</span>
                          <span className="text-slate-200">
                            {(app.vehicleType || 'okada') === 'okada' ? '🏍 Okada' : '🛺 Keke'} &middot; {app.driverMode === 'phone_only' ? 'Basic Phone' : 'App'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {app.vehicleModel || 'Bajaj Boxer 150cc'} ({app.vehicleReg || 'AKW-PENDING'})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" /> Biometric Face Video &amp; Liveness Verified
                        </span>
                        <span>&middot;</span>
                        <span className="text-slate-400">Corridor: {app.serviceZone || 'Ukana Central Zone'}</span>
                        <span>&middot;</span>
                        <span className="text-slate-400">SMS &amp; Email receipts dispatched</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              approveDriverApplication(app.id);
                              showToast(`Driver ${app.fullName} approved and enrolled into active fleet!`);
                            }}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve Driver
                          </button>
                          <button
                            onClick={() => {
                              rejectDriverApplication(app.id, 'Identity verification criteria unfulfilled');
                              showToast(`Application for ${app.fullName} rejected.`);
                            }}
                            className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-semibold rounded-xl text-xs transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Active Driver Profile
                          </span>
                        </div>
                      )}
                      {app.status === 'rejected' && (
                        <button
                          onClick={() => {
                            approveDriverApplication(app.id);
                            showToast(`Application for ${app.fullName} reconsidered & approved!`);
                          }}
                          className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                        >
                          Reconsider
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ONBOARD DRIVER */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Register &amp; Verify New Driver</h3>
              <p className="text-xs text-slate-400">Onboard motorcycle (Okada) or tricycle (Keke) transport operator</p>
            </div>

            <form onSubmit={handleRegisterDriverSubmit} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    placeholder="e.g. Samuel Umoh"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Driver Code</label>
                  <input
                    type="text"
                    required
                    value={newDriverCode}
                    onChange={(e) => setNewDriverCode(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Driver Mode</label>
                  <select
                    value={newDriverMode}
                    onChange={(e: any) => setNewDriverMode(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="app">App-Enabled (GPS)</option>
                    <option value="phone_only">Phone-Only (Basic Phone)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Vehicle Type</label>
                  <select
                    value={newDriverVehicle}
                    onChange={(e: any) => setNewDriverVehicle(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="okada">Okada (Motorcycle)</option>
                    <option value="keke">Keke (Tricycle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Plate Number</label>
                  <input
                    type="text"
                    value={newDriverReg}
                    onChange={(e) => setNewDriverReg(e.target.value)}
                    placeholder="AKW-123-UK"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Vehicle Color</label>
                  <input
                    type="text"
                    value={newDriverColor}
                    onChange={(e) => setNewDriverColor(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Vehicle Make/Model</label>
                  <input
                    type="text"
                    value={newDriverModel}
                    onChange={(e) => setNewDriverModel(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL DISPATCH ASSIGNMENT CONFIRMATION */}
      {selectedTripForDispatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-white">Confirm Manual Dispatch Assignment</h3>
            <p className="text-slate-300">
              Trip <span className="font-mono text-amber-400">{selectedTripForDispatch.id}</span> will be formally assigned to driver ID <span className="font-mono text-amber-400">{dispatchSelectedDriverId}</span>.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Agreed Fare (₦ Cash)</label>
              <input
                type="number"
                value={agreedFareInput}
                onChange={(e) => setAgreedFareInput(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTripForDispatch(null)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleManualDispatchConfirm}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Confirm &amp; Notify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUSPEND DRIVER */}
      {selectedDriverForAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-white">Suspend Driver: {selectedDriverForAction.fullName}</h3>
            <p className="text-slate-300">
              Suspended drivers immediately lose eligibility for new automated matching and manual queue dispatches.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Mandatory Suspension Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Overcharging passenger on Ukana - Ikot Ekpene route or expired roadworthiness."
                className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDriverForAction(null)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDriverStatusUpdate('suspended')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FARE RULE */}
      {editingFareRule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase">
              Configure {editingFareRule.vehicleType} Fares (₦)
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-slate-300">Base Fare (₦)</label>
              <input
                type="number"
                value={editingFareRule.baseFare}
                onChange={(e) => setEditingFareRule({ ...editingFareRule, baseFare: Number(e.target.value) })}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />

              <label className="text-slate-300 mt-2">Per-km Rate (₦)</label>
              <input
                type="number"
                value={editingFareRule.perKmRate}
                onChange={(e) => setEditingFareRule({ ...editingFareRule, perKmRate: Number(e.target.value) })}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />

              <label className="text-slate-300 mt-2">Minimum Fare (₦)</label>
              <input
                type="number"
                value={editingFareRule.minFare}
                onChange={(e) => setEditingFareRule({ ...editingFareRule, minFare: Number(e.target.value) })}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingFareRule(null)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateFareRule(editingFareRule);
                  setEditingFareRule(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
