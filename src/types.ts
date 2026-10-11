export type UserRole = 'passenger' | 'driver' | 'admin';

export type VehicleType = 'okada' | 'keke';

export type DriverMode = 'app' | 'phone_only';

export type DriverStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type DriverAvailability = 'offline' | 'online' | 'busy';

export type TripStatus =
  | 'requested'
  | 'searching'
  | 'accepted'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'manual_dispatch'
  | 'no_driver_found';

export interface LocationLandmark {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  type: 'campus' | 'market' | 'junction' | 'hospital' | 'civic' | 'motor_park';
}

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  photoUrl: string;
  driverCode: string; // e.g. UKD-OK-001
  driverMode: DriverMode; // 'app' or 'phone_only'
  vehicleType: VehicleType; // 'okada' or 'keke'
  vehicleReg: string; // Plate number e.g. "AKW-782-UK"
  vehicleColor: string;
  vehicleModel: string;
  status: DriverStatus;
  availability: DriverAvailability;
  rating: number;
  totalTrips: number;
  serviceZones: string[];
  currentLat: number;
  currentLng: number;
  lastLocationUpdate: string; // ISO string
  approvalDate: string;
  approvedBy: string;
}

export interface TripBooking {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  vehicleType: VehicleType;
  pickupName: string;
  pickupLat: number;
  pickupLng: number;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  distanceKm: number;
  durationMins: number;
  estimatedFare: number;
  finalFare: number;
  status: TripStatus;
  driverId?: string;
  assignedDriver?: Driver;
  dispatchMethod: 'auto' | 'manual';
  manualAssignedByAdminId?: string;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  passengerRating?: number;
  passengerFeedback?: string;
  paymentStatus: 'pending' | 'paid_cash';
}

export interface FareRule {
  vehicleType: VehicleType;
  baseFare: number; // in Naira (₦)
  perKmRate: number;
  minFare: number;
  cancelFee: number;
}

export interface ServiceZone {
  id: string;
  name: string;
  description: string;
  active: boolean;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

export interface ComplaintTicket {
  id: string;
  tripId?: string;
  reporterRole: 'passenger' | 'driver';
  reporterName: string;
  reporterPhone: string;
  category: 'overcharging' | 'safety' | 'driver_behavior' | 'route_issue' | 'other';
  message: string;
  status: 'open' | 'investigating' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DriverApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nin: string;
  vehicleType?: VehicleType;
  driverMode?: DriverMode;
  vehicleReg?: string;
  vehicleModel?: string;
  serviceZone?: string;
  livenessVerified?: boolean;
  videoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export type CallStatus = 'idle' | 'outgoing_ringing' | 'incoming_ringing' | 'connected' | 'ended';

export interface InAppVoiceCall {
  id: string;
  tripId?: string;
  callerRole: 'passenger' | 'driver' | 'admin';
  callerName: string;
  callerPhone?: string;
  receiverRole: 'passenger' | 'driver';
  receiverName: string;
  receiverPhone?: string;
  receiverPhoto: string;
  receiverCode?: string;
  vehicleInfo?: string;
  vehiclePlate?: string;
  status: CallStatus;
  startedAt?: string;
  durationSeconds: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isMinimized?: boolean;
  lastSpeechText?: string;
  isDriverSpeaking?: boolean;
}

