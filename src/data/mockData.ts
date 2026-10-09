import { Driver, LocationLandmark, FareRule, ServiceZone, ComplaintTicket, AuditLog, TripBooking } from '../types';

// Direct ES module asset imports to ensure correct domain & bundled asset resolution across all deployment domains
import okadaMain from '../assets/images/nigerian_okada_motorcycle_1791573121916.jpg';
import kekeMain from '../assets/images/nigerian_keke_tricycle_1791573137305.jpg';
import avatar1 from '../assets/images/ukada_driver_avatar_1_1791569475088.jpg';
import avatar2 from '../assets/images/ukada_driver_avatar_2_1791569485339.jpg';
import okadaPickup from '../assets/images/natural_nigerian_okada_pickup_1791577371490.jpg';
import kekeBoarding from '../assets/images/keke_passengers_boarding_1791574423699.jpg';
import rideBookedApp from '../assets/images/passenger_booking_phone_1791574453780.jpg';
import ridersJobTeam from '../assets/images/nigerian_riders_job_team_1791577399778.jpg';

// Real vehicle turntable assets (Okada)
import okadaAngle0 from '../assets/images/okada_front_angle_1791573155731.jpg';
import okadaAngle45 from '../assets/images/okada_front_right_45_1791576421096.jpg';
import okadaAngle90 from '../assets/images/nigerian_okada_motorcycle_1791573121916.jpg';
import okadaAngle135 from '../assets/images/okada_rear_right_135_1791576437806.jpg';
import okadaAngle180 from '../assets/images/okada_rear_angle_1791573171575.jpg';
import okadaAngle225 from '../assets/images/okada_rear_left_225_1791576453743.jpg';
import okadaAngle270 from '../assets/images/okada_left_profile_1791573233980.jpg';
import okadaAngle315 from '../assets/images/okada_front_left_315_1791576470779.jpg';

// Real vehicle turntable assets (Keke)
import kekeAngle0 from '../assets/images/keke_front_angle_1791573189605.jpg';
import kekeAngle45 from '../assets/images/keke_front_right_45_1791576490050.jpg';
import kekeAngle90 from '../assets/images/nigerian_keke_tricycle_1791573137305.jpg';
import kekeAngle135 from '../assets/images/keke_rear_right_135_1791576509768.jpg';
import kekeAngle180 from '../assets/images/keke_rear_angle_1791573211928.jpg';
import kekeAngle225 from '../assets/images/keke_rear_left_225_1791576531571.jpg';
import kekeAngle270 from '../assets/images/keke_left_profile_1791573255820.jpg';
import kekeAngle315 from '../assets/images/keke_front_left_315_1791576551101.jpg';

export const ASSET_OKADA = okadaMain;
export const ASSET_KEKE = kekeMain;
export const ASSET_AVATAR_1 = avatar1;
export const ASSET_AVATAR_2 = avatar2;
export const ASSET_OKADA_PICKUP = okadaPickup;
export const ASSET_KEKE_BOARDING = kekeBoarding;
export const ASSET_RIDE_BOOKED_APP = rideBookedApp;
export const ASSET_RIDERS_JOBS_TEAM = ridersJobTeam;

export interface VehicleTurntableAngle {
  angle: number;
  label: string;
  badge: string;
  src: string;
  details: string;
}

export const REAL_OKADA_TURNTABLE: VehicleTurntableAngle[] = [
  {
    angle: 0,
    label: 'Front Headlight & Crash Guard',
    badge: 'Front Profile (0°)',
    src: okadaAngle0,
    details: 'Round glass headlight, chrome handlebars, front safety crash bar with reflective tape, and verified Nigerian plate (FST-345-AB).'
  },
  {
    angle: 45,
    label: 'Front-Right Quarter Angle',
    badge: 'Front-Right (45°)',
    src: okadaAngle45,
    details: 'Bajaj Boxer BM 150cc teardrop tank, front spoked tire, chrome leg protector, and telescopic front fork suspension.'
  },
  {
    angle: 90,
    label: 'Right Side Showroom Profile',
    badge: 'Right Side (90°)',
    src: okadaAngle90,
    details: 'Long dual-passenger seat, chrome exhaust pipe with heat shield, rear suspension shock, and steel luggage rack.'
  },
  {
    angle: 135,
    label: 'Rear-Right Quarter Angle',
    badge: 'Rear-Right (135°)',
    src: okadaAngle135,
    details: 'Rear exhaust muffler, Nigerian registration plate (BDG 781 AZ Lagos), and heavy welded steel luggage carrier rack.'
  },
  {
    angle: 180,
    label: 'Rear Tail Rack & Plate',
    badge: 'Rear Angle (180°)',
    src: okadaAngle180,
    details: 'Rear tail brake lamp, turn indicators, rear tyre with mudguard, and dual passenger grab rack.'
  },
  {
    angle: 225,
    label: 'Rear-Left Quarter Angle',
    badge: 'Rear-Left (225°)',
    src: okadaAngle225,
    details: 'Enclosed chain cover, left rear shock absorber, side battery compartment, helmet carrier, and Nigerian plate.'
  },
  {
    angle: 270,
    label: 'Left Side Profile & Engine Block',
    badge: 'Left Side (270°)',
    src: okadaAngle270,
    details: '150cc 4-stroke air-cooled engine block, carburettor, kick-starter, gear shift lever, and side stand.'
  },
  {
    angle: 315,
    label: 'Front-Left Quarter Angle',
    badge: 'Front-Left (315°)',
    src: okadaAngle315,
    details: 'Left front crash guard, chrome headlight housing, spoked wheel, red fuel tank with Bajaj emblem, and handlebar grip.'
  }
];

export const REAL_KEKE_TURNTABLE: VehicleTurntableAngle[] = [
  {
    angle: 0,
    label: 'Front Windshield & Wiper',
    badge: 'Front Cabin (0°)',
    src: kekeAngle0,
    details: 'Curved yellow steel apron, safety glass windshield with articulated wiper blade, single central headlight pod, and KJA-789-LG plate.'
  },
  {
    angle: 45,
    label: 'Front-Right Quarter Angle',
    badge: 'Front-Right (45°)',
    src: kekeAngle45,
    details: 'Official Akwa Ibom State green regulatory stripe on yellow cab, curved windshield with wiper, and black canvas canopy roof.'
  },
  {
    angle: 90,
    label: 'Right Side Cabin & Livery',
    badge: 'Right Side (90°)',
    src: kekeAngle90,
    details: 'Commercial yellow body, passenger entry, roll-cage tubular pillars, heavy-duty weather canopy, and rear spare wheel.'
  },
  {
    angle: 135,
    label: 'Rear-Right Quarter Angle',
    badge: 'Rear-Right (135°)',
    src: kekeAngle135,
    details: 'Rear spare tyre with "BAJAJ RE" cover, "GOD\'S GRACE" motto, Akwa Ibom Land of Promise livery, and registration UY-1234-AG.'
  },
  {
    angle: 180,
    label: 'Rear Cabin & Slogan Spare Tire',
    badge: 'Rear View (180°)',
    src: kekeAngle180,
    details: 'Authentic rear spare tyre with cover, chrome impact bumper, tail lights, and Akwa Ibom registration (MSA-987-KM).'
  },
  {
    angle: 225,
    label: 'Rear-Left Quarter Angle',
    badge: 'Rear-Left (225°)',
    src: kekeAngle225,
    details: 'Rear left side with "AKWA IBOM STATE COMMERCIAL TRICYCLE" stripe, rear window, spare wheel, and heavy-duty chassis.'
  },
  {
    angle: 270,
    label: 'Left Side Profile & Passenger Cabin',
    badge: 'Left Profile (270°)',
    src: kekeAngle270,
    details: 'Driver steering handlebar, 3-passenger rear cushioned bench, rolled-up all-weather side rain curtains, and wheels.'
  },
  {
    angle: 315,
    label: 'Front-Left Quarter Angle',
    badge: 'Front-Left (315°)',
    src: kekeAngle315,
    details: 'Front windshield with wiper, "AKWA IBOM STATE" green livery, front steer tire with yellow fender, and black canvas canopy.'
  }
];

// Hyperlocal landmarks in Ukana & Ikot Ekpene, Akwa Ibom State, Nigeria
export const INITIAL_LANDMARKS: LocationLandmark[] = [
  {
    id: 'poly-gate',
    name: 'Federal Polytechnic Ukana (Main Gate)',
    area: 'Ukana Central',
    lat: 5.2891,
    lng: 7.6834,
    type: 'campus',
  },
  {
    id: 'poly-admin',
    name: 'Federal Poly Ukana Admin Complex',
    area: 'Ukana Central',
    lat: 5.2899,
    lng: 7.6848,
    type: 'campus',
  },
  {
    id: 'ukana-market',
    name: 'Ukana Ikot Ideh Market & Junction',
    area: 'Ukana Central',
    lat: 5.2815,
    lng: 7.6750,
    type: 'market',
  },
  {
    id: 'ukana-hospital',
    name: 'Ukana Cottage Hospital',
    area: 'Ukana Central',
    lat: 5.2840,
    lng: 7.6792,
    type: 'hospital',
  },
  {
    id: 'essien-udim-lga',
    name: 'Essien Udim LGA Secretariat (Afaha Ikot Ebak)',
    area: 'Essien Udim Corridor',
    lat: 5.2678,
    lng: 7.6482,
    type: 'civic',
  },
  {
    id: 'obo-annang',
    name: 'Obo Annang Central Market',
    area: 'Essien Udim Corridor',
    lat: 5.2340,
    lng: 7.6680,
    type: 'market',
  },
  {
    id: 'ikot-ekpene-plaza',
    name: 'Ikot Ekpene Plaza & Raffia City Market',
    area: 'Ikot Ekpene Urban',
    lat: 5.1832,
    lng: 7.7142,
    type: 'market',
  },
  {
    id: 'akwa-poly-junc',
    name: 'Akwa Ibom State Polytechnic Main Junction',
    area: 'Ikot Ekpene Urban',
    lat: 5.1950,
    lng: 7.7080,
    type: 'campus',
  },
  {
    id: 'ik-motor-park',
    name: 'Ikot Ekpene Central Motor Park',
    area: 'Ikot Ekpene Urban',
    lat: 5.1810,
    lng: 7.7115,
    type: 'motor_park',
  },
  {
    id: 'ik-general-hospital',
    name: 'General Hospital Ikot Ekpene',
    area: 'Ikot Ekpene Urban',
    lat: 5.1795,
    lng: 7.7210,
    type: 'hospital',
  },
  {
    id: 'four-corners',
    name: 'Four Corners Junction, Ikot Ekpene',
    area: 'Ikot Ekpene Urban',
    lat: 5.1860,
    lng: 7.7170,
    type: 'junction',
  },
  {
    id: 'obot-akara-junc',
    name: 'Obot Akara Highway Junction',
    area: 'Obot Akara Axis',
    lat: 5.2980,
    lng: 7.6150,
    type: 'junction',
  },
];

export const INITIAL_SERVICE_ZONES: ServiceZone[] = [
  {
    id: 'zone-ukana',
    name: 'Ukana Central Zone',
    description: 'Federal Poly Ukana, Ikot Ideh Market, Cottage Hospital axis',
    active: true,
    centerLat: 5.2860,
    centerLng: 7.6790,
    radiusKm: 5.0,
  },
  {
    id: 'zone-ikot-ekpene',
    name: 'Ikot Ekpene Urban Zone',
    description: 'Raffia Plaza, Motor Park, State Poly & Four Corners',
    active: true,
    centerLat: 5.1840,
    centerLng: 7.7150,
    radiusKm: 7.5,
  },
  {
    id: 'zone-essien-udim',
    name: 'Essien Udim Corridor',
    description: 'Afaha Ikot Ebak LGA Secretariat, Obo Annang Market',
    active: true,
    centerLat: 5.2500,
    centerLng: 7.6580,
    radiusKm: 6.0,
  },
  {
    id: 'zone-poly-campus',
    name: 'Poly Campus Shuttle Zone',
    description: 'Designated local residential corridors & transport transit gates',
    active: true,
    centerLat: 5.2895,
    centerLng: 7.6840,
    radiusKm: 2.5,
  },
];

export const INITIAL_FARE_RULES: FareRule[] = [
  {
    vehicleType: 'okada',
    baseFare: 250, // ₦250
    perKmRate: 120, // ₦120/km
    minFare: 300,
    cancelFee: 150,
  },
  {
    vehicleType: 'keke',
    baseFare: 400, // ₦400
    perKmRate: 160, // ₦160/km
    minFare: 450,
    cancelFee: 200,
  },
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-001',
    fullName: 'Sunday Udoh',
    phone: '+234 803 412 8891',
    photoUrl: ASSET_AVATAR_1,
    driverCode: 'UKD-OK-001',
    driverMode: 'app',
    vehicleType: 'okada',
    vehicleReg: 'AKW-782-UK',
    vehicleColor: 'Red & Black',
    vehicleModel: 'Bajaj Boxer 150cc',
    status: 'approved',
    availability: 'online',
    rating: 4.9,
    totalTrips: 184,
    serviceZones: ['Ukana Central Zone', 'Poly Campus Shuttle Zone'],
    currentLat: 5.2875,
    currentLng: 7.6810,
    lastLocationUpdate: new Date().toISOString(),
    approvalDate: '2026-02-10T08:30:00Z',
    approvedBy: 'Admin Michael Essien',
  },
  {
    id: 'drv-002',
    fullName: 'Emmanuel Akpan',
    phone: '+234 814 559 2210',
    photoUrl: ASSET_AVATAR_2,
    driverCode: 'UKD-KK-003',
    driverMode: 'app',
    vehicleType: 'keke',
    vehicleReg: 'IKP-415-AK',
    vehicleColor: 'Yellow / Green',
    vehicleModel: 'TVS King Deluxe 200',
    status: 'approved',
    availability: 'online',
    rating: 4.8,
    totalTrips: 247,
    serviceZones: ['Ukana Central Zone', 'Ikot Ekpene Urban Zone'],
    currentLat: 5.2830,
    currentLng: 7.6770,
    lastLocationUpdate: new Date().toISOString(),
    approvalDate: '2026-01-18T10:00:00Z',
    approvedBy: 'Admin Michael Essien',
  },
  {
    id: 'drv-003',
    fullName: 'Bassey Edet',
    phone: '+234 802 883 1145',
    photoUrl: ASSET_AVATAR_2,
    driverCode: 'UKD-OK-007',
    driverMode: 'phone_only', // Basic phone - no smartphone GPS!
    vehicleType: 'okada',
    vehicleReg: 'ESU-109-UD',
    vehicleColor: 'Dark Blue',
    vehicleModel: 'Haojue 125T',
    status: 'approved',
    availability: 'online',
    rating: 4.7,
    totalTrips: 92,
    serviceZones: ['Ukana Central Zone', 'Essien Udim Corridor'],
    currentLat: 5.2810, // Stationed at Ukana Ideh Junction
    currentLng: 7.6740,
    lastLocationUpdate: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // Stationary station
    approvalDate: '2026-03-01T14:20:00Z',
    approvedBy: 'Admin Michael Essien',
  },
  {
    id: 'drv-004',
    fullName: 'Kufre Inyang',
    phone: '+234 703 661 9928',
    photoUrl: ASSET_AVATAR_1,
    driverCode: 'UKD-KK-009',
    driverMode: 'phone_only', // Phone-only keke driver
    vehicleType: 'keke',
    vehicleReg: 'AKW-883-KK',
    vehicleColor: 'Yellow',
    vehicleModel: 'Piaggio Ape City',
    status: 'approved',
    availability: 'online',
    rating: 4.6,
    totalTrips: 115,
    serviceZones: ['Essien Udim Corridor', 'Ukana Central Zone'],
    currentLat: 5.2678,
    currentLng: 7.6482,
    lastLocationUpdate: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    approvalDate: '2026-02-24T11:45:00Z',
    approvedBy: 'Admin Michael Essien',
  },
  {
    id: 'drv-005',
    fullName: 'Idongesit Okon',
    phone: '+234 901 334 7712',
    photoUrl: ASSET_AVATAR_1,
    driverCode: 'UKD-OK-012',
    driverMode: 'app',
    vehicleType: 'okada',
    vehicleReg: 'IKP-202-AB',
    vehicleColor: 'Silver & Blue',
    vehicleModel: 'Yamaha Crux 110',
    status: 'approved',
    availability: 'offline',
    rating: 4.9,
    totalTrips: 76,
    serviceZones: ['Ikot Ekpene Urban Zone'],
    currentLat: 5.1850,
    currentLng: 7.7160,
    lastLocationUpdate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    approvalDate: '2026-03-15T09:10:00Z',
    approvedBy: 'Admin Michael Essien',
  },
];

export const INITIAL_TRIPS: TripBooking[] = [
  {
    id: 'UKD-TRIP-901',
    passengerId: 'pax-01',
    passengerName: 'Anietie Udo',
    passengerPhone: '+234 812 770 4141',
    vehicleType: 'okada',
    pickupName: 'Federal Polytechnic Ukana (Main Gate)',
    pickupLat: 5.2891,
    pickupLng: 7.6834,
    destinationName: 'Ukana Ikot Ideh Market & Junction',
    destinationLat: 5.2815,
    destinationLng: 7.6750,
    distanceKm: 1.6,
    durationMins: 5,
    estimatedFare: 450,
    finalFare: 450,
    status: 'completed',
    driverId: 'drv-001',
    assignedDriver: INITIAL_DRIVERS[0],
    dispatchMethod: 'auto',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    passengerRating: 5,
    passengerFeedback: 'Very prompt arrival at the gate, safe helmet provided.',
    paymentStatus: 'paid_cash',
  },
  {
    id: 'UKD-TRIP-902',
    passengerId: 'pax-02',
    passengerName: 'Blessing Ekong',
    passengerPhone: '+234 808 331 9922',
    vehicleType: 'keke',
    pickupName: 'Ukana Cottage Hospital',
    pickupLat: 5.2840,
    pickupLng: 7.6792,
    destinationName: 'Ikot Ekpene Plaza & Raffia City Market',
    destinationLat: 5.1832,
    destinationLng: 7.7142,
    distanceKm: 12.4,
    durationMins: 22,
    estimatedFare: 2400,
    finalFare: 2400,
    status: 'completed',
    driverId: 'drv-002',
    assignedDriver: INITIAL_DRIVERS[1],
    dispatchMethod: 'manual',
    manualAssignedByAdminId: 'Admin Michael Essien',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 98 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 76 * 60 * 1000).toISOString(),
    passengerRating: 5,
    passengerFeedback: 'Smooth ride with space for my market goods.',
    paymentStatus: 'paid_cash',
  },
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'TKT-101',
    tripId: 'UKD-TRIP-901',
    reporterRole: 'passenger',
    reporterName: 'Anietie Udo',
    reporterPhone: '+234 812 770 4141',
    category: 'other',
    message: 'Left my plastic folder in the keke, driver kindly returned it at the junction.',
    status: 'resolved',
    resolutionNotes: 'Resolved amicably on site with driver UKD-OK-001.',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    adminName: 'SuperAdmin Michael Essien',
    action: 'Driver Approval',
    details: 'Approved Sunday Udoh (UKD-OK-001) for Okada operations.',
    timestamp: '2026-02-10T08:30:00Z',
  },
  {
    id: 'LOG-002',
    adminName: 'SuperAdmin Michael Essien',
    action: 'Driver Registration',
    details: 'Onboarded phone-only driver Bassey Edet (UKD-OK-007).',
    timestamp: '2026-03-01T14:20:00Z',
  },
  {
    id: 'LOG-003',
    adminName: 'SuperAdmin Michael Essien',
    action: 'Fare Rule Configuration',
    details: 'Updated Okada base fare to ₦250 and Keke base fare to ₦400.',
    timestamp: '2026-03-05T09:00:00Z',
  },
];
