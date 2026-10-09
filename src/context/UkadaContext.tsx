import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import {
  Driver,
  TripBooking,
  FareRule,
  ServiceZone,
  ComplaintTicket,
  AuditLog,
  VehicleType,
  DriverStatus,
  DriverAvailability,
  InAppVoiceCall,
} from '../types';
import { callAudioEngine } from '../utils/callAudioEngine';
import {
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_FARE_RULES,
  INITIAL_SERVICE_ZONES,
  INITIAL_COMPLAINTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_LANDMARKS,
  ASSET_AVATAR_1,
} from '../data/mockData';
import { resolveImageUrl } from '../utils/assetResolver';
import { supabaseService, isSupabaseConfigured } from '../lib/supabase';

interface UkadaContextType {
  // Supabase cloud persistence status
  isSupabaseConfigured: boolean;

  // Views
  activeView: 'home' | 'passenger' | 'driver' | 'admin' | 'simulator';
  setActiveView: (view: 'home' | 'passenger' | 'driver' | 'admin' | 'simulator') => void;

  // Active user / driver profiles
  passengerProfile: {
    id: string;
    name: string;
    phone: string;
  };
  setPassengerProfile: (p: { id: string; name: string; phone: string }) => void;
  activeDriverId: string;
  setActiveDriverId: (id: string) => void;
  currentDriver: Driver | undefined;

  // Entities
  trips: TripBooking[];
  activeTrip: TripBooking | undefined; // current trip for passenger
  incomingTripForDriver: TripBooking | undefined; // pending request for active driver
  drivers: Driver[];
  fareRules: FareRule[];
  serviceZones: ServiceZone[];
  complaints: ComplaintTicket[];
  auditLogs: AuditLog[];
  landmarks: typeof INITIAL_LANDMARKS;

  // Passenger actions
  requestRide: (
    pickupId: string,
    destinationId: string,
    vehicleType: VehicleType,
    customPickupName?: string,
    customDestName?: string
  ) => TripBooking;
  cancelTrip: (tripId: string, reason: string) => void;
  rateTrip: (tripId: string, rating: number, feedback: string) => void;
  submitComplaint: (
    category: ComplaintTicket['category'],
    message: string,
    tripId?: string,
    reporterRole?: 'passenger' | 'driver'
  ) => void;

  // Driver actions
  acceptRide: (tripId: string) => void;
  rejectRide: (tripId: string) => void;
  markArrivedAtPickup: (tripId: string) => void;
  startTrip: (tripId: string) => void;
  completeTrip: (tripId: string, finalFare?: number) => void;
  toggleDriverOnline: (driverId: string) => void;
  updateDriverGps: (driverId: string, lat: number, lng: number) => void;

  // Admin actions
  assignManualDispatch: (tripId: string, driverId: string, agreedFare: number, adminName: string) => void;
  registerDriver: (driverData: Omit<Driver, 'id' | 'rating' | 'totalTrips' | 'approvalDate'>) => Driver;
  updateDriverStatus: (driverId: string, status: DriverStatus, reason: string, adminName: string) => void;
  updateFareRule: (rule: FareRule) => void;
  updateComplaintStatus: (ticketId: string, status: ComplaintTicket['status'], resolutionNotes?: string) => void;
  toggleServiceZone: (zoneId: string) => void;

  // Simulation helpers
  simulateIncomingRequest: (vehicleType?: VehicleType) => void;
  fastForwardTrip: (tripId: string) => void;
  resetAllData: () => void;

  // Direct In-App VoIP Voice Calling (Zero 3rd-party software needed)
  activeCall: InAppVoiceCall | null;
  startInAppCall: (params?: {
    targetDriver?: Driver;
    targetPassenger?: { name: string; phone: string };
    tripId?: string;
    callerRole?: 'passenger' | 'driver';
  }) => void;
  answerCall: () => void;
  declineCall: () => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallSpeaker: () => void;
  toggleCallMinimized: () => void;
  sendCallQuickVoiceMessage: (text: string) => void;
}

const UkadaContext = createContext<UkadaContextType | undefined>(undefined);

export const UkadaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'home' | 'passenger' | 'driver' | 'admin' | 'simulator'>('home');
  
  const [passengerProfile, setPassengerProfile] = useState({
    id: 'pax-current',
    name: 'Anietie Udo',
    phone: '+234 812 770 4141',
  });

  const [activeDriverId, setActiveDriverId] = useState<string>('drv-001');

  // Supabase-backed state collections
  const [trips, setTrips] = useState<TripBooking[]>(INITIAL_TRIPS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [fareRules, setFareRules] = useState<FareRule[]>(INITIAL_FARE_RULES);
  const [serviceZones, setServiceZones] = useState<ServiceZone[]>(INITIAL_SERVICE_ZONES);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Initialize data from Supabase Service Provider on mount
  useEffect(() => {
    let isMounted = true;

    const initializeSupabaseData = async () => {
      try {
        const [loadedTrips, loadedDrivers, loadedFares, loadedComplaints] = await Promise.all([
          supabaseService.fetchTrips(INITIAL_TRIPS),
          supabaseService.fetchDrivers(INITIAL_DRIVERS),
          supabaseService.fetchFareRules(INITIAL_FARE_RULES),
          supabaseService.fetchComplaints(INITIAL_COMPLAINTS),
        ]);

        if (isMounted) {
          setTrips(loadedTrips);
          setDrivers(loadedDrivers);
          setFareRules(loadedFares);
          setComplaints(loadedComplaints);
        }
      } catch (err) {
        console.warn('Supabase initialization encountered fallback:', err);
      }
    };

    initializeSupabaseData();

    // Setup Supabase Realtime Channels for live multi-client synchronization
    const tripSub = supabaseService.subscribeToTrips(({ event, trip }) => {
      if (!isMounted) return;
      setTrips((prev) => {
        const idx = prev.findIndex((t) => t.id === trip.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = trip;
          return updated;
        }
        return [trip, ...prev];
      });
    });

    const driverSub = supabaseService.subscribeToDrivers(({ event, driver }) => {
      if (!isMounted) return;
      setDrivers((prev) => {
        const idx = prev.findIndex((d) => d.id === driver.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = driver;
          return updated;
        }
        return [...prev, driver];
      });
    });

    return () => {
      isMounted = false;
      tripSub?.unsubscribe();
      driverSub?.unsubscribe();
    };
  }, []);

  // Sync state mutations to Supabase Provider
  useEffect(() => {
    supabaseService.syncAllTrips(trips);
  }, [trips]);

  useEffect(() => {
    supabaseService.syncAllDrivers(drivers);
  }, [drivers]);

  useEffect(() => {
    supabaseService.syncFareRules(fareRules);
  }, [fareRules]);

  useEffect(() => {
    // Complaints sync
    complaints.forEach((c) => supabaseService.saveComplaint(c));
  }, [complaints]);

  // Derived current driver
  const currentDriver = drivers.find((d) => d.id === activeDriverId) || drivers[0];

  // Active trip for passenger (the most recent non-completed, non-cancelled trip)
  const activeTrip = trips.find(
    (t) =>
      t.passengerId === passengerProfile.id &&
      ['requested', 'searching', 'accepted', 'arrived', 'in_progress', 'manual_dispatch'].includes(t.status)
  );

  // Incoming trip for the currently active driver
  const incomingTripForDriver = trips.find(
    (t) => t.status === 'searching' && t.vehicleType === currentDriver?.vehicleType && currentDriver?.availability === 'online'
  );

  // Calculate distance between two lat/lng coordinates (Haversine Formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 1 decimal place
  };

  // Add audit log
  const logAudit = useCallback((adminName: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      adminName,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  // Request a ride (FR-03 & FR-04)
  const requestRide = useCallback(
    (
      pickupId: string,
      destinationId: string,
      vehicleType: VehicleType,
      customPickupName?: string,
      customDestName?: string
    ): TripBooking => {
      const pickupLandmark = INITIAL_LANDMARKS.find((l) => l.id === pickupId) || INITIAL_LANDMARKS[0];
      const destLandmark = INITIAL_LANDMARKS.find((l) => l.id === destinationId) || INITIAL_LANDMARKS[1];

      const pickupName = customPickupName || pickupLandmark.name;
      const destinationName = customDestName || destLandmark.name;

      const dist = Math.max(
        0.8,
        calculateDistance(pickupLandmark.lat, pickupLandmark.lng, destLandmark.lat, destLandmark.lng)
      );

      // Fares calculation
      const rule = fareRules.find((r) => r.vehicleType === vehicleType) || fareRules[0];
      const calculated = Math.round(rule.baseFare + dist * rule.perKmRate);
      const estFare = Math.max(rule.minFare, Math.ceil(calculated / 50) * 50); // rounded to 50 Naira
      const estDuration = Math.max(3, Math.round(dist * (vehicleType === 'okada' ? 2.2 : 2.8)));

      const newTripId = `UKD-TRIP-${Math.floor(1000 + Math.random() * 9000)}`;

      const newTrip: TripBooking = {
        id: newTripId,
        passengerId: passengerProfile.id,
        passengerName: passengerProfile.name,
        passengerPhone: passengerProfile.phone,
        vehicleType,
        pickupName,
        pickupLat: pickupLandmark.lat,
        pickupLng: pickupLandmark.lng,
        destinationName,
        destinationLat: destLandmark.lat,
        destinationLng: destLandmark.lng,
        distanceKm: dist,
        durationMins: estDuration,
        estimatedFare: estFare,
        finalFare: estFare,
        status: 'searching', // Enter matching search
        dispatchMethod: 'auto',
        createdAt: new Date().toISOString(),
        paymentStatus: 'pending',
      };

      setTrips((prev) => [newTrip, ...prev]);

      // Automatic matching search logic (FR-04):
      // Check if any eligible online driver exists in radius
      const eligibleDrivers = drivers.filter(
        (d) =>
          d.status === 'approved' &&
          d.availability === 'online' &&
          d.vehicleType === vehicleType &&
          d.driverMode === 'app'
      );

      // If no smartphone driver online or search times out after 15 seconds, move to manual_dispatch queue (FR-05)
      setTimeout(() => {
        setTrips((prev) =>
          prev.map((t) => {
            if (t.id === newTripId && t.status === 'searching') {
              // If still searching and no driver took it, fallback to manual dispatch queue!
              return { ...t, status: 'manual_dispatch' };
            }
            return t;
          })
        );
      }, 15000);

      return newTrip;
    },
    [drivers, fareRules, passengerProfile]
  );

  // Accept a ride as driver
  const acceptRide = useCallback(
    (tripId: string) => {
      if (!currentDriver) return;

      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return {
              ...t,
              status: 'accepted',
              driverId: currentDriver.id,
              assignedDriver: currentDriver,
              acceptedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      // Mark driver as busy
      setDrivers((prev) =>
        prev.map((d) => (d.id === currentDriver.id ? { ...d, availability: 'busy' } : d))
      );
    },
    [currentDriver]
  );

  // Reject a ride as driver
  const rejectRide = useCallback((tripId: string) => {
    // Keep in search or send to next round / manual dispatch
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return { ...t, status: 'manual_dispatch' };
        }
        return t;
      })
    );
  }, []);

  // Driver arrives at pickup
  const markArrivedAtPickup = useCallback((tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'arrived' } : t))
    );
  }, []);

  // Start trip
  const startTrip = useCallback((tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, status: 'in_progress', startedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  // Complete trip
  const completeTrip = useCallback(
    (tripId: string, finalFare?: number) => {
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return {
              ...t,
              status: 'completed',
              finalFare: finalFare || t.finalFare || t.estimatedFare,
              completedAt: new Date().toISOString(),
              paymentStatus: 'paid_cash',
            };
          }
          return t;
        })
      );

      // Free up driver
      const trip = trips.find((t) => t.id === tripId);
      if (trip?.driverId) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === trip.driverId
              ? {
                  ...d,
                  availability: 'online',
                  totalTrips: d.totalTrips + 1,
                }
              : d
          )
        );
      }
    },
    [trips]
  );

  // Cancel trip
  const cancelTrip = useCallback(
    (tripId: string, reason: string) => {
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return {
              ...t,
              status: 'cancelled',
              cancelledAt: new Date().toISOString(),
              cancelReason: reason,
            };
          }
          return t;
        })
      );

      const trip = trips.find((t) => t.id === tripId);
      if (trip?.driverId) {
        setDrivers((prev) =>
          prev.map((d) => (d.id === trip.driverId ? { ...d, availability: 'online' } : d))
        );
      }
    },
    [trips]
  );

  // Rate trip
  const rateTrip = useCallback((tripId: string, rating: number, feedback: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, passengerRating: rating, passengerFeedback: feedback } : t
      )
    );
  }, []);

  // Submit complaint
  const submitComplaint = useCallback(
    (
      category: ComplaintTicket['category'],
      message: string,
      tripId?: string,
      reporterRole: 'passenger' | 'driver' = 'passenger'
    ) => {
      const newTicket: ComplaintTicket = {
        id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
        tripId,
        reporterRole,
        reporterName: reporterRole === 'passenger' ? passengerProfile.name : currentDriver?.fullName || 'Driver',
        reporterPhone: reporterRole === 'passenger' ? passengerProfile.phone : currentDriver?.phone || '',
        category,
        message,
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      setComplaints((prev) => [newTicket, ...prev]);
    },
    [currentDriver, passengerProfile]
  );

  // Manual dispatch by admin (FR-05)
  const assignManualDispatch = useCallback(
    (tripId: string, driverId: string, agreedFare: number, adminName: string) => {
      const selectedDriver = drivers.find((d) => d.id === driverId);
      if (!selectedDriver) return;

      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return {
              ...t,
              status: 'accepted',
              driverId,
              assignedDriver: selectedDriver,
              finalFare: agreedFare,
              dispatchMethod: 'manual',
              manualAssignedByAdminId: adminName,
              acceptedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, availability: 'busy' } : d))
      );

      logAudit(
        adminName,
        'Manual Dispatch',
        `Assigned ${selectedDriver.fullName} (${selectedDriver.driverCode}) to Trip ${tripId} at ₦${agreedFare}.`
      );
    },
    [drivers, logAudit]
  );

  // Toggle driver online / offline
  const toggleDriverOnline = useCallback((driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const nextAvail: DriverAvailability = d.availability === 'online' ? 'offline' : 'online';
          return {
            ...d,
            availability: nextAvail,
            lastLocationUpdate: new Date().toISOString(),
          };
        }
        return d;
      })
    );
  }, []);

  // Update driver GPS
  const updateDriverGps = useCallback((driverId: string, lat: number, lng: number) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              currentLat: lat,
              currentLng: lng,
              lastLocationUpdate: new Date().toISOString(),
            }
          : d
      )
    );
  }, []);

  // Register new driver (FR-02)
  const registerDriver = useCallback(
    (driverData: Omit<Driver, 'id' | 'rating' | 'totalTrips' | 'approvalDate'>): Driver => {
      const newDriver: Driver = {
        ...driverData,
        id: `drv-${Date.now().toString().slice(-4)}`,
        rating: 5.0,
        totalTrips: 0,
        approvalDate: new Date().toISOString(),
      };

      setDrivers((prev) => [newDriver, ...prev]);
      logAudit(
        driverData.approvedBy || 'Admin',
        'Driver Registration',
        `Registered driver ${newDriver.fullName} (${newDriver.driverCode}, ${newDriver.driverMode}).`
      );
      return newDriver;
    },
    [logAudit]
  );

  // Update driver approval status
  const updateDriverStatus = useCallback(
    (driverId: string, status: DriverStatus, reason: string, adminName: string) => {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.id === driverId) {
            return {
              ...d,
              status,
              availability: status === 'approved' ? d.availability : 'offline',
            };
          }
          return d;
        })
      );
      logAudit(adminName, `Status Change: ${status}`, `Driver ID ${driverId}: ${reason}`);
    },
    [logAudit]
  );

  // Update fare rule
  const updateFareRule = useCallback(
    (rule: FareRule) => {
      setFareRules((prev) => prev.map((r) => (r.vehicleType === rule.vehicleType ? rule : r)));
      logAudit('Admin', 'Fare Rule Update', `Updated ${rule.vehicleType.toUpperCase()} fare parameters.`);
    },
    [logAudit]
  );

  // Update complaint ticket
  const updateComplaintStatus = useCallback(
    (ticketId: string, status: ComplaintTicket['status'], resolutionNotes?: string) => {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === ticketId
            ? { ...c, status, resolutionNotes: resolutionNotes || c.resolutionNotes }
            : c
        )
      );
      logAudit('Admin', 'Complaint Ticket Update', `Ticket ${ticketId} status changed to ${status}.`);
    },
    [logAudit]
  );

  // Toggle service zone
  const toggleServiceZone = useCallback((zoneId: string) => {
    setServiceZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, active: !z.active } : z))
    );
  }, []);

  // Quick simulation triggers for testing
  const simulateIncomingRequest = useCallback(
    (vehicleType: VehicleType = 'okada') => {
      requestRide('poly-gate', 'ukana-market', vehicleType);
    },
    [requestRide]
  );

  const fastForwardTrip = useCallback(
    (tripId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      if (trip.status === 'searching' || trip.status === 'manual_dispatch') {
        acceptRide(tripId);
      } else if (trip.status === 'accepted') {
        markArrivedAtPickup(tripId);
      } else if (trip.status === 'arrived') {
        startTrip(tripId);
      } else if (trip.status === 'in_progress') {
        completeTrip(tripId);
      }
    },
    [trips, acceptRide, markArrivedAtPickup, startTrip, completeTrip]
  );

  // Active in-app VoIP call state (Zero 3rd-party app needed)
  const [activeCall, setActiveCall] = useState<InAppVoiceCall | null>(null);
  const callDurationRef = useRef<number | null>(null);
  const ringTimeoutRef = useRef<number | null>(null);

  // Clear timers & sound on unmount
  useEffect(() => {
    return () => {
      if (callDurationRef.current) clearInterval(callDurationRef.current);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      callAudioEngine.stopRinging();
      callAudioEngine.stopMicrophone();
      callAudioEngine.stopSpeech();
    };
  }, []);

  // Update call duration every second while connected
  useEffect(() => {
    if (activeCall?.status === 'connected') {
      if (!callDurationRef.current) {
        callDurationRef.current = window.setInterval(() => {
          setActiveCall((prev) => {
            if (!prev || prev.status !== 'connected') return prev;
            return {
              ...prev,
              durationSeconds: prev.durationSeconds + 1,
            };
          });
        }, 1000);
      }
    } else {
      if (callDurationRef.current) {
        clearInterval(callDurationRef.current);
        callDurationRef.current = null;
      }
    }
  }, [activeCall?.status]);

  const endCall = useCallback(() => {
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }
    if (callDurationRef.current) {
      clearInterval(callDurationRef.current);
      callDurationRef.current = null;
    }
    callAudioEngine.stopRinging();
    callAudioEngine.playCallEnded();
    callAudioEngine.stopMicrophone();
    callAudioEngine.stopSpeech();

    setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));

    setTimeout(() => {
      setActiveCall(null);
    }, 900);
  }, []);

  const answerCall = useCallback(() => {
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }
    callAudioEngine.stopRinging();
    callAudioEngine.playCallConnected();
    callAudioEngine.setupMicrophone().catch(() => {});

    setActiveCall((prev) => {
      if (!prev) return null;
      const initialGreeting =
        prev.callerRole === 'passenger'
          ? `Hello ${prev.callerName}! Samuel here, your UKADA rider. I have received your booking and I am heading to your pickup location now!`
          : `Hello! I received your UKADA ride request, I am on my way.`;

      // Realistic driver voice response
      callAudioEngine.speakDriverResponse(
        initialGreeting,
        () => {
          setActiveCall((c) => (c ? { ...c, isDriverSpeaking: true, lastSpeechText: initialGreeting } : null));
        },
        () => {
          setActiveCall((c) => (c ? { ...c, isDriverSpeaking: false } : null));
        }
      );

      return {
        ...prev,
        status: 'connected',
        lastSpeechText: initialGreeting,
        isDriverSpeaking: true,
      };
    });
  }, []);

  const declineCall = useCallback(() => {
    endCall();
  }, [endCall]);

  const toggleCallMute = useCallback(() => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  }, []);

  const toggleCallSpeaker = useCallback(() => {
    setActiveCall((prev) => (prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null));
  }, []);

  const toggleCallMinimized = useCallback(() => {
    setActiveCall((prev) => (prev ? { ...prev, isMinimized: !prev.isMinimized } : null));
  }, []);

  const sendCallQuickVoiceMessage = useCallback(
    (text: string) => {
      if (!activeCall || activeCall.status !== 'connected') return;

      let driverReply = `I received your message: "${text}". I am heading to you right now!`;
      const lower = text.toLowerCase();
      if (lower.includes('where') || lower.includes('location')) {
        driverReply = 'I am currently 2 minutes away, just past the Federal Poly roundabout!';
      } else if (lower.includes('gate') || lower.includes('here') || lower.includes('waiting')) {
        driverReply = 'Understood! I will pull up right by the gate. Look out for my yellow helmet and reflective vest.';
      } else if (lower.includes('helmet') || lower.includes('safety')) {
        driverReply = 'Yes, I have an approved, sanitized passenger helmet ready on the bike for you.';
      } else if (lower.includes('hurry') || lower.includes('rush') || lower.includes('late')) {
        driverReply = 'Speeding up safely on the open road, see you in under a minute!';
      } else if (lower.includes('cash') || lower.includes('change') || lower.includes('fare')) {
        driverReply = 'Yes, I have cash change available. Exact fare or note is fine!';
      }

      callAudioEngine.speakDriverResponse(
        driverReply,
        () => {
          setActiveCall((c) => (c ? { ...c, isDriverSpeaking: true, lastSpeechText: driverReply } : null));
        },
        () => {
          setActiveCall((c) => (c ? { ...c, isDriverSpeaking: false } : null));
        }
      );
    },
    [activeCall]
  );

  const startInAppCall = useCallback(
    (params?: {
      targetDriver?: Driver;
      targetPassenger?: { name: string; phone: string };
      tripId?: string;
      callerRole?: 'passenger' | 'driver';
    }) => {
      const callerRole = params?.callerRole || 'passenger';
      const callerName =
        callerRole === 'passenger' ? passengerProfile.name : currentDriver?.fullName || 'Ukada Rider';
      const callerPhone =
        callerRole === 'passenger' ? passengerProfile.phone : currentDriver?.phone || '+234 803 200 1199';

      let targetDriver = params?.targetDriver || activeTrip?.assignedDriver;
      if (!targetDriver && callerRole === 'passenger') {
        targetDriver = drivers.find((d) => d.availability === 'online' && d.status === 'approved') || drivers[0];
      }

      const receiverRole: 'passenger' | 'driver' = callerRole === 'passenger' ? 'driver' : 'passenger';
      const receiverName =
        callerRole === 'passenger'
          ? targetDriver?.fullName || 'Samuel Udoh'
          : params?.targetPassenger?.name || activeTrip?.passengerName || passengerProfile.name;
      const receiverPhone =
        callerRole === 'passenger'
          ? targetDriver?.phone || '+234 803 123 4567'
          : params?.targetPassenger?.phone || activeTrip?.passengerPhone || passengerProfile.phone;
      const receiverPhoto = resolveImageUrl(
        callerRole === 'passenger'
          ? targetDriver?.photoUrl || drivers[0]?.photoUrl || ASSET_AVATAR_1
          : ASSET_AVATAR_1
      );

      const callObj: InAppVoiceCall = {
        id: `call-${Date.now()}`,
        tripId: params?.tripId || activeTrip?.id,
        callerRole,
        callerName,
        callerPhone,
        receiverRole,
        receiverName,
        receiverPhone,
        receiverPhoto,
        receiverCode: targetDriver?.driverCode || 'UKD-OK-001',
        vehicleInfo: targetDriver
          ? `${targetDriver.vehicleModel} (${targetDriver.vehicleColor})`
          : 'Bajaj Boxer 100cc (Red)',
        vehiclePlate: targetDriver?.vehicleReg || 'AKW-782-UK',
        status: 'outgoing_ringing',
        startedAt: new Date().toISOString(),
        durationSeconds: 0,
        isMuted: false,
        isSpeakerOn: true,
        isMinimized: false,
        isDriverSpeaking: false,
      };

      setActiveCall(callObj);

      // Play authentic telephone ring
      callAudioEngine.startOutgoingRinging();

      // In-app auto-answer simulation (driver answers after 2.6 seconds)
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = window.setTimeout(() => {
        answerCall();
      }, 2600);
    },
    [passengerProfile, currentDriver, activeTrip, drivers, answerCall]
  );

  const resetAllData = useCallback(() => {
    supabaseService.resetAllData();
    setTrips(INITIAL_TRIPS);
    setDrivers(INITIAL_DRIVERS);
    setFareRules(INITIAL_FARE_RULES);
    setComplaints(INITIAL_COMPLAINTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setServiceZones(INITIAL_SERVICE_ZONES);
  }, []);

  return (
    <UkadaContext.Provider
      value={{
        isSupabaseConfigured: isSupabaseConfigured(),
        activeView,
        setActiveView,
        passengerProfile,
        setPassengerProfile,
        activeDriverId,
        setActiveDriverId,
        currentDriver,
        trips,
        activeTrip,
        incomingTripForDriver,
        drivers,
        fareRules,
        serviceZones,
        complaints,
        auditLogs,
        landmarks: INITIAL_LANDMARKS,
        requestRide,
        cancelTrip,
        rateTrip,
        submitComplaint,
        acceptRide,
        rejectRide,
        markArrivedAtPickup,
        startTrip,
        completeTrip,
        toggleDriverOnline,
        updateDriverGps,
        assignManualDispatch,
        registerDriver,
        updateDriverStatus,
        updateFareRule,
        updateComplaintStatus,
        toggleServiceZone,
        simulateIncomingRequest,
        fastForwardTrip,
        resetAllData,
        activeCall,
        startInAppCall,
        answerCall,
        declineCall,
        endCall,
        toggleCallMute,
        toggleCallSpeaker,
        toggleCallMinimized,
        sendCallQuickVoiceMessage,
      }}
    >
      {children}
    </UkadaContext.Provider>
  );
};

export const useUkada = () => {
  const context = useContext(UkadaContext);
  if (!context) {
    throw new Error('useUkada must be used within a UkadaProvider');
  }
  return context;
};
