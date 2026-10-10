-- ============================================================================
-- UKADA RIDE - COMPLETE SUPABASE POSTGRESQL SCHEMA & INITIAL SEED DATA
-- Hyperlocal Okada & Keke Transit Mobility Architecture
-- Compatible with @supabase/supabase-js, Realtime postgres_changes & RLS
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABLE: drivers
-- Stores registered Okada motorcycle & Keke tricycle operators
-- ============================================================================
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.complaints CASCADE;
DROP TABLE IF EXISTS public.fare_rules CASCADE;
DROP TABLE IF EXISTS public.service_zones CASCADE;
DROP TABLE IF EXISTS public.landmarks CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;

CREATE TABLE public.drivers (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  phone TEXT NOT NULL,
  "photoUrl" TEXT,
  "driverCode" TEXT NOT NULL UNIQUE,
  "driverMode" TEXT NOT NULL CHECK ("driverMode" IN ('app', 'phone_only')),
  "vehicleType" TEXT NOT NULL CHECK ("vehicleType" IN ('okada', 'keke')),
  "vehicleReg" TEXT NOT NULL,
  "vehicleColor" TEXT,
  "vehicleModel" TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  availability TEXT NOT NULL DEFAULT 'online' CHECK (availability IN ('offline', 'online', 'busy')),
  rating NUMERIC(3,2) DEFAULT 5.0,
  "totalTrips" INTEGER DEFAULT 0,
  "serviceZones" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "currentLat" DOUBLE PRECISION DEFAULT 5.2875,
  "currentLng" DOUBLE PRECISION DEFAULT 7.6810,
  "lastLocationUpdate" TIMESTAMPTZ DEFAULT NOW(),
  "approvalDate" TIMESTAMPTZ DEFAULT NOW(),
  "approvedBy" TEXT DEFAULT 'UKADA Control Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. TABLE: trips
-- Stores passenger ride requests, active dispatches & completed bookings
-- ============================================================================
CREATE TABLE public.trips (
  id TEXT PRIMARY KEY,
  "passengerId" TEXT NOT NULL,
  "passengerName" TEXT NOT NULL,
  "passengerPhone" TEXT NOT NULL,
  "vehicleType" TEXT NOT NULL CHECK ("vehicleType" IN ('okada', 'keke')),
  "pickupName" TEXT NOT NULL,
  "pickupLat" DOUBLE PRECISION NOT NULL,
  "pickupLng" DOUBLE PRECISION NOT NULL,
  "destinationName" TEXT NOT NULL,
  "destinationLat" DOUBLE PRECISION NOT NULL,
  "destinationLng" DOUBLE PRECISION NOT NULL,
  "distanceKm" NUMERIC(6,2) NOT NULL DEFAULT 1.0,
  "durationMins" INTEGER NOT NULL DEFAULT 5,
  "estimatedFare" INTEGER NOT NULL,
  "finalFare" INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN (
      'requested',
      'searching',
      'accepted',
      'arrived',
      'in_progress',
      'completed',
      'cancelled',
      'manual_dispatch',
      'no_driver_found'
    )
  ),
  "driverId" TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
  "assignedDriver" JSONB,
  "dispatchMethod" TEXT NOT NULL DEFAULT 'auto' CHECK ("dispatchMethod" IN ('auto', 'manual')),
  "manualAssignedByAdminId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "acceptedAt" TIMESTAMPTZ,
  "startedAt" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  "cancelledAt" TIMESTAMPTZ,
  "cancelReason" TEXT,
  "passengerRating" INTEGER CHECK ("passengerRating" BETWEEN 1 AND 5),
  "passengerFeedback" TEXT,
  "paymentStatus" TEXT NOT NULL DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'paid_cash')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. TABLE: fare_rules
-- Pricing matrix for Okada and Keke transport
-- ============================================================================
CREATE TABLE public.fare_rules (
  "vehicleType" TEXT PRIMARY KEY CHECK ("vehicleType" IN ('okada', 'keke')),
  "baseFare" INTEGER NOT NULL DEFAULT 250,
  "perKmRate" INTEGER NOT NULL DEFAULT 120,
  "minFare" INTEGER NOT NULL DEFAULT 300,
  "cancelFee" INTEGER NOT NULL DEFAULT 150,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. TABLE: complaints
-- Passenger safety & driver dispute tickets submitted to UKADA Control
-- ============================================================================
CREATE TABLE public.complaints (
  id TEXT PRIMARY KEY,
  "tripId" TEXT REFERENCES public.trips(id) ON DELETE SET NULL,
  "reporterRole" TEXT NOT NULL CHECK ("reporterRole" IN ('passenger', 'driver')),
  "reporterName" TEXT NOT NULL,
  "reporterPhone" TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('overcharging', 'safety', 'driver_behavior', 'route_issue', 'other')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
  "resolutionNotes" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. TABLE: service_zones
-- Geofenced corridors across Ukana, Ikot Ekpene, and Essien Udim
-- ============================================================================
CREATE TABLE public.service_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "centerLat" DOUBLE PRECISION NOT NULL,
  "centerLng" DOUBLE PRECISION NOT NULL,
  "radiusKm" NUMERIC(5,2) NOT NULL DEFAULT 3.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. TABLE: landmarks
-- Curated high-traffic transit hubs in Akwa Ibom State
-- ============================================================================
CREATE TABLE public.landmarks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('campus', 'market', 'junction', 'hospital', 'civic', 'motor_park')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. TABLE: audit_logs
-- Immutable dispatch center operational audit trail
-- ============================================================================
CREATE TABLE public.audit_logs (
  id TEXT PRIMARY KEY,
  "adminName" TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. PERFORMANCE INDEXES
-- Optimizes geospatial queries, status filtering & real-time dispatch matching
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status, availability);
CREATE INDEX IF NOT EXISTS idx_drivers_mode ON public.drivers("driverMode");
CREATE INDEX IF NOT EXISTS idx_drivers_vehicle ON public.drivers("vehicleType");
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_passenger ON public.trips("passengerId");
CREATE INDEX IF NOT EXISTS idx_trips_driver ON public.trips("driverId");
CREATE INDEX IF NOT EXISTS idx_trips_created ON public.trips("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);

-- ============================================================================
-- 10. REALTIME REPLICATION CONFIGURATION
-- Enables live Supabase WebSockets broadcast for Instant Passenger & Driver sync
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fare_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;

-- ============================================================================
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES
-- Configures access rules for public, authenticated passengers, and control staff
-- ============================================================================
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fare_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies (allows the client app anon role full read & write access)
CREATE POLICY "Public read drivers" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Public insert/update drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Public insert/update trips" ON public.trips FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read fare rules" ON public.fare_rules FOR SELECT USING (true);
CREATE POLICY "Public insert/update fare rules" ON public.fare_rules FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Public insert complaints" ON public.complaints FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read service zones" ON public.service_zones FOR SELECT USING (true);
CREATE POLICY "Public read landmarks" ON public.landmarks FOR SELECT USING (true);
CREATE POLICY "Public read audit logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Public insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 12. INITIAL SEED DATA
-- Populates authentic Nigerian operational fleet, fare rates, and landmarks
-- ============================================================================

-- Seed Fare Rules
INSERT INTO public.fare_rules ("vehicleType", "baseFare", "perKmRate", "minFare", "cancelFee")
VALUES
  ('okada', 250, 120, 300, 150),
  ('keke', 400, 160, 450, 200)
ON CONFLICT ("vehicleType") DO UPDATE SET
  "baseFare" = EXCLUDED."baseFare",
  "perKmRate" = EXCLUDED."perKmRate",
  "minFare" = EXCLUDED."minFare",
  "cancelFee" = EXCLUDED."cancelFee";

-- Seed Initial Drivers
INSERT INTO public.drivers (
  id, "fullName", phone, "photoUrl", "driverCode", "driverMode", "vehicleType",
  "vehicleReg", "vehicleColor", "vehicleModel", status, availability, rating,
  "totalTrips", "serviceZones", "currentLat", "currentLng", "approvalDate", "approvedBy"
)
VALUES
  (
    'drv-001', 'Sunday Udoh', '+234 803 412 8891',
    '/src/assets/images/ukada_driver_avatar_1_1791569475088.jpg',
    'UKD-OK-001', 'app', 'okada', 'AKW-782-UK', 'Red & Black', 'Bajaj Boxer 150cc',
    'approved', 'online', 4.9, 184,
    ARRAY['Ukana Central Zone', 'Poly Campus Shuttle Zone'],
    5.2875, 7.6810, '2026-02-10T08:30:00Z', 'Admin Michael Essien'
  ),
  (
    'drv-002', 'Emmanuel Akpan', '+234 814 559 2210',
    '/src/assets/images/ukada_driver_avatar_2_1791569485339.jpg',
    'UKD-KK-003', 'app', 'keke', 'IKP-415-AK', 'Yellow / Green', 'TVS King Deluxe 200',
    'approved', 'online', 4.8, 247,
    ARRAY['Ukana Central Zone', 'Ikot Ekpene Urban Zone'],
    5.2830, 7.6770, '2026-01-18T10:00:00Z', 'Admin Michael Essien'
  ),
  (
    'drv-003', 'Bassey Edet', '+234 802 883 1145',
    '/src/assets/images/ukada_driver_avatar_2_1791569485339.jpg',
    'UKD-OK-007', 'phone_only', 'okada', 'ESU-109-UD', 'Dark Blue', 'Haojue 125T',
    'approved', 'online', 4.7, 92,
    ARRAY['Ukana Central Zone', 'Essien Udim Corridor'],
    5.2810, 7.6740, '2026-03-01T14:20:00Z', 'Admin Michael Essien'
  ),
  (
    'drv-004', 'Kufre Inyang', '+234 703 661 9928',
    '/src/assets/images/ukada_driver_avatar_1_1791569475088.jpg',
    'UKD-KK-009', 'phone_only', 'keke', 'AKW-883-KK', 'Yellow', 'Piaggio Ape City',
    'approved', 'online', 4.6, 115,
    ARRAY['Essien Udim Corridor', 'Ukana Central Zone'],
    5.2678, 7.6482, '2026-02-24T11:45:00Z', 'Admin Michael Essien'
  ),
  (
    'drv-005', 'Idongesit Okon', '+234 901 334 7712',
    '/src/assets/images/ukada_driver_avatar_1_1791569475088.jpg',
    'UKD-OK-012', 'app', 'okada', 'IKP-202-AB', 'Silver & Blue', 'Yamaha Crux 110',
    'approved', 'offline', 4.9, 76,
    ARRAY['Ikot Ekpene Urban Zone'],
    5.1850, 7.7160, '2026-03-05T09:15:00Z', 'Admin Michael Essien'
  ),
  (
    'drv-006', 'Nsikak Peter', '+234 808 991 3320',
    '/src/assets/images/ukada_driver_avatar_2_1791569485339.jpg',
    'UKD-KK-015', 'phone_only', 'keke', 'AKW-550-EK', 'Green / White', 'Bajaj RE 4S',
    'approved', 'online', 4.5, 63,
    ARRAY['Poly Campus Shuttle Zone'],
    5.2890, 7.6835, '2026-03-10T12:00:00Z', 'Admin Michael Essien'
  )
ON CONFLICT (id) DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  phone = EXCLUDED.phone,
  status = EXCLUDED.status,
  availability = EXCLUDED.availability;

-- Seed Service Zones
INSERT INTO public.service_zones (id, name, description, active, "centerLat", "centerLng", "radiusKm")
VALUES
  ('zone-ukana-central', 'Ukana Central Zone', 'Main administrative hub, markets and hospital corridors', true, 5.2855, 7.6780, 3.5),
  ('zone-poly-campus', 'Poly Campus Shuttle Zone', 'Designated local residential corridors & transport transit gates', true, 5.2895, 7.6840, 2.5),
  ('zone-ikot-ekpene', 'Ikot Ekpene Urban Zone', 'Commercial market road, raffia craft center & motor park', true, 5.1820, 7.7145, 4.0),
  ('zone-essien-udim', 'Essien Udim Corridor', 'Connecting arterial routes linking Afaha Ikot Ebak and Ukana', true, 5.2650, 7.6450, 5.0)
ON CONFLICT (id) DO NOTHING;

-- Seed Landmarks
INSERT INTO public.landmarks (id, name, area, lat, lng, type)
VALUES
  ('lmk-01', 'Federal Polytechnic Main Gate', 'Ukana East', 5.2895, 7.6840, 'campus'),
  ('lmk-02', 'Ukana Ideh Junction', 'Ukana Central', 5.2855, 7.6780, 'junction'),
  ('lmk-03', 'General Hospital Ukana', 'Ukana South', 5.2810, 7.6750, 'hospital'),
  ('lmk-04', 'Essien Udim Local Govt Council Secretariat', 'Afaha Ikot Ebak', 5.2650, 7.6450, 'civic'),
  ('lmk-05', 'Ikot Ekpene Central Motor Park', 'Ikot Ekpene', 5.1820, 7.7145, 'motor_park'),
  ('lmk-06', 'Main Market Roundabout (Plaza)', 'Ikot Ekpene Central', 5.1805, 7.7130, 'market'),
  ('lmk-07', 'St. Anne Catholic Cathedral Junction', 'Ifuho, Ikot Ekpene', 5.1870, 7.7100, 'junction'),
  ('lmk-08', 'Polytechnic Staff Quarters Gate', 'Ukana West', 5.2920, 7.6880, 'campus'),
  ('lmk-09', 'Abak Road Roundabout Junction', 'Ikot Ekpene East', 5.1780, 7.7200, 'junction')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Demonstration Trips
INSERT INTO public.trips (
  id, "passengerId", "passengerName", "passengerPhone", "vehicleType",
  "pickupName", "pickupLat", "pickupLng", "destinationName", "destinationLat", "destinationLng",
  "distanceKm", "durationMins", "estimatedFare", "finalFare", status,
  "driverId", "dispatchMethod", "createdAt", "paymentStatus"
)
VALUES
  (
    'trip-init-001', 'pax-past-1', 'Blessing Bassey', '+234 802 334 1122', 'okada',
    'Federal Polytechnic Main Gate', 5.2895, 7.6840, 'Ukana Ideh Junction', 5.2855, 7.6780,
    1.4, 6, 420, 420, 'completed',
    'drv-001', 'auto', NOW() - INTERVAL '35 minutes', 'paid_cash'
  ),
  (
    'trip-init-002', 'pax-past-2', 'Nseobong Etim', '+234 818 776 5544', 'keke',
    'General Hospital Ukana', 5.2810, 7.6750, 'Federal Polytechnic Main Gate', 5.2895, 7.6840,
    2.1, 9, 740, 740, 'completed',
    'drv-002', 'auto', NOW() - INTERVAL '80 minutes', 'paid_cash'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. HELPER FUNCTION: Trigger for auto-updating updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_drivers_updated_at ON public.drivers;
CREATE TRIGGER trg_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_trips_updated_at ON public.trips;
CREATE TRIGGER trg_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add driver_applications table
CREATE TABLE public.driver_applications (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nin TEXT NOT NULL,
  "videoUrl" TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read applications" ON public.driver_applications FOR SELECT USING (true);
CREATE POLICY "Public insert applications" ON public.driver_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update applications" ON public.driver_applications FOR UPDATE USING (true);
