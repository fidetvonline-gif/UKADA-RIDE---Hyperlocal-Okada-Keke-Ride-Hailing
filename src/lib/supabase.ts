import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { TripBooking, Driver, FareRule, ComplaintTicket } from '../types';

// Environment variable retrieval
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project.supabase.co')
  );
};

// Singleton Supabase Client
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      clientInstance = null;
    }
  }
  return clientInstance;
};

// Local storage fallback cache keys (used as offline cache layer)
const CACHE_KEY_TRIPS = 'ukada_supabase_cache_trips';
const CACHE_KEY_DRIVERS = 'ukada_supabase_cache_drivers';
const CACHE_KEY_FARES = 'ukada_supabase_cache_fares';
const CACHE_KEY_COMPLAINTS = 'ukada_supabase_cache_complaints';

/**
 * Supabase Service Provider
 * Encapsulates all data access and real-time sync for UKADA Ride.
 */
export const supabaseService = {
  isConfigured: isSupabaseConfigured,

  // -------------------------------------------------------------
  // TRIPS OPERATIONS
  // -------------------------------------------------------------
  async fetchTrips(fallback: TripBooking[]): Promise<TripBooking[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Use cached data or fallback
      try {
        const cached = localStorage.getItem(CACHE_KEY_TRIPS);
        return cached ? JSON.parse(cached) : fallback;
      } catch {
        return fallback;
      }
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase trips query error, falling back:', error.message);
        // Save fallback to Supabase if table is empty
        if (data && data.length === 0 && fallback.length > 0) {
          await this.syncAllTrips(fallback);
        }
        return fallback;
      }

      // Update cache
      localStorage.setItem(CACHE_KEY_TRIPS, JSON.stringify(data));
      return data as TripBooking[];
    } catch (err) {
      console.warn('Network error fetching trips from Supabase:', err);
      const cached = localStorage.getItem(CACHE_KEY_TRIPS);
      return cached ? JSON.parse(cached) : fallback;
    }
  },

  async saveTrip(trip: TripBooking): Promise<void> {
    // Optimistic cache update
    try {
      const cached = localStorage.getItem(CACHE_KEY_TRIPS);
      const list: TripBooking[] = cached ? JSON.parse(cached) : [];
      const index = list.findIndex((t) => t.id === trip.id);
      if (index >= 0) {
        list[index] = trip;
      } else {
        list.unshift(trip);
      }
      localStorage.setItem(CACHE_KEY_TRIPS, JSON.stringify(list));
    } catch {
      // ignore cache failure
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('trips')
        .upsert(trip, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase trip upsert error:', error.message);
      }
    } catch (err) {
      console.warn('Network error syncing trip to Supabase:', err);
    }
  },

  async syncAllTrips(trips: TripBooking[]): Promise<void> {
    try {
      localStorage.setItem(CACHE_KEY_TRIPS, JSON.stringify(trips));
    } catch {
      // ignore cache failure
    }

    const supabase = getSupabaseClient();
    if (!supabase || trips.length === 0) return;

    try {
      await supabase.from('trips').upsert(trips, { onConflict: 'id' });
    } catch (err) {
      console.warn('Failed batch sync of trips to Supabase:', err);
    }
  },

  // -------------------------------------------------------------
  // DRIVERS OPERATIONS
  // -------------------------------------------------------------
  async fetchDrivers(fallback: Driver[]): Promise<Driver[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      try {
        const cached = localStorage.getItem(CACHE_KEY_DRIVERS);
        return cached ? JSON.parse(cached) : fallback;
      } catch {
        return fallback;
      }
    }

    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*');

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase drivers query error, falling back:', error.message);
        if (data && data.length === 0 && fallback.length > 0) {
          await this.syncAllDrivers(fallback);
        }
        return fallback;
      }

      localStorage.setItem(CACHE_KEY_DRIVERS, JSON.stringify(data));
      return data as Driver[];
    } catch (err) {
      console.warn('Network error fetching drivers from Supabase:', err);
      const cached = localStorage.getItem(CACHE_KEY_DRIVERS);
      return cached ? JSON.parse(cached) : fallback;
    }
  },

  async saveDriver(driver: Driver): Promise<void> {
    try {
      const cached = localStorage.getItem(CACHE_KEY_DRIVERS);
      const list: Driver[] = cached ? JSON.parse(cached) : [];
      const index = list.findIndex((d) => d.id === driver.id);
      if (index >= 0) {
        list[index] = driver;
      } else {
        list.push(driver);
      }
      localStorage.setItem(CACHE_KEY_DRIVERS, JSON.stringify(list));
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase.from('drivers').upsert(driver, { onConflict: 'id' });
    } catch (err) {
      console.warn('Error syncing driver to Supabase:', err);
    }
  },

  async syncAllDrivers(drivers: Driver[]): Promise<void> {
    try {
      localStorage.setItem(CACHE_KEY_DRIVERS, JSON.stringify(drivers));
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (!supabase || drivers.length === 0) return;

    try {
      await supabase.from('drivers').upsert(drivers, { onConflict: 'id' });
    } catch (err) {
      console.warn('Failed batch sync of drivers to Supabase:', err);
    }
  },

  // -------------------------------------------------------------
  // FARE RULES OPERATIONS
  // -------------------------------------------------------------
  async fetchFareRules(fallback: FareRule[]): Promise<FareRule[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      try {
        const cached = localStorage.getItem(CACHE_KEY_FARES);
        return cached ? JSON.parse(cached) : fallback;
      } catch {
        return fallback;
      }
    }

    try {
      const { data, error } = await supabase.from('fare_rules').select('*');
      if (error || !data || data.length === 0) {
        if (data && data.length === 0 && fallback.length > 0) {
          await this.syncFareRules(fallback);
        }
        return fallback;
      }
      localStorage.setItem(CACHE_KEY_FARES, JSON.stringify(data));
      return data as FareRule[];
    } catch {
      const cached = localStorage.getItem(CACHE_KEY_FARES);
      return cached ? JSON.parse(cached) : fallback;
    }
  },

  async syncFareRules(rules: FareRule[]): Promise<void> {
    try {
      localStorage.setItem(CACHE_KEY_FARES, JSON.stringify(rules));
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase.from('fare_rules').upsert(rules, { onConflict: 'vehicleType' });
    } catch (err) {
      console.warn('Failed sync of fare rules to Supabase:', err);
    }
  },

  // -------------------------------------------------------------
  // COMPLAINTS OPERATIONS
  // -------------------------------------------------------------
  async fetchComplaints(fallback: ComplaintTicket[]): Promise<ComplaintTicket[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      try {
        const cached = localStorage.getItem(CACHE_KEY_COMPLAINTS);
        return cached ? JSON.parse(cached) : fallback;
      } catch {
        return fallback;
      }
    }

    try {
      const { data, error } = await supabase.from('complaints').select('*').order('createdAt', { ascending: false });
      if (error || !data || data.length === 0) {
        return fallback;
      }
      localStorage.setItem(CACHE_KEY_COMPLAINTS, JSON.stringify(data));
      return data as ComplaintTicket[];
    } catch {
      const cached = localStorage.getItem(CACHE_KEY_COMPLAINTS);
      return cached ? JSON.parse(cached) : fallback;
    }
  },

  async saveComplaint(complaint: ComplaintTicket): Promise<void> {
    try {
      const cached = localStorage.getItem(CACHE_KEY_COMPLAINTS);
      const list: ComplaintTicket[] = cached ? JSON.parse(cached) : [];
      list.unshift(complaint);
      localStorage.setItem(CACHE_KEY_COMPLAINTS, JSON.stringify(list));
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase.from('complaints').upsert(complaint, { onConflict: 'id' });
    } catch (err) {
      console.warn('Failed saving complaint to Supabase:', err);
    }
  },

  // -------------------------------------------------------------
  // REAL-TIME BROADCAST & SUBSCRIPTIONS
  // -------------------------------------------------------------
  subscribeToTrips(onUpdate: (payload: { event: string; trip: TripBooking }) => void): RealtimeChannel | null {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const channel = supabase
        .channel('public:trips')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'trips' },
          (payload) => {
            const trip = (payload.new || payload.old) as TripBooking;
            if (trip) {
              onUpdate({ event: payload.eventType, trip });
            }
          }
        )
        .subscribe();
      return channel;
    } catch (err) {
      console.warn('Supabase realtime trips subscription error:', err);
      return null;
    }
  },

  subscribeToDrivers(onUpdate: (payload: { event: string; driver: Driver }) => void): RealtimeChannel | null {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const channel = supabase
        .channel('public:drivers')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'drivers' },
          (payload) => {
            const driver = (payload.new || payload.old) as Driver;
            if (driver) {
              onUpdate({ event: payload.eventType, driver });
            }
          }
        )
        .subscribe();
      return channel;
    } catch (err) {
      console.warn('Supabase realtime drivers subscription error:', err);
      return null;
    }
  },

  // Clear all data
  async resetAllData(): Promise<void> {
    try {
      localStorage.removeItem(CACHE_KEY_TRIPS);
      localStorage.removeItem(CACHE_KEY_DRIVERS);
      localStorage.removeItem(CACHE_KEY_FARES);
      localStorage.removeItem(CACHE_KEY_COMPLAINTS);
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await Promise.all([
        supabase.from('trips').delete().neq('id', ''),
        supabase.from('drivers').delete().neq('id', ''),
        supabase.from('complaints').delete().neq('id', ''),
      ]);
    } catch (err) {
      console.warn('Supabase reset data error:', err);
    }
  },
};
