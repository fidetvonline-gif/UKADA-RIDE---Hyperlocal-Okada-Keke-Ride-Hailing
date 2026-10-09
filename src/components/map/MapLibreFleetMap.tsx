import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { Driver, TripBooking, LocationLandmark } from '../../types';
import { InteractiveMap } from '../InteractiveMap';
import { Layers, Compass, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

// Configure the worker URL explicitly so Vite resolves the bundled worker asset
if (typeof window !== 'undefined' && maplibregl.setWorkerUrl && maplibreWorkerUrl) {
  try {
    maplibregl.setWorkerUrl(maplibreWorkerUrl);
  } catch (e) {
    console.warn('MapLibre worker setup note:', e);
  }
}

interface MapLibreFleetMapProps {
  drivers?: Driver[];
  activeTrip?: TripBooking;
  landmarks?: LocationLandmark[];
  onSelectLandmark?: (landmark: LocationLandmark) => void;
  className?: string;
  zoom?: number;
}

export const MapLibreFleetMap: React.FC<MapLibreFleetMapProps> = ({
  drivers = [],
  activeTrip,
  landmarks = [],
  onSelectLandmark,
  className = 'h-[460px] w-full',
  zoom = 12.5,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [tileError, setTileError] = useState<boolean>(false);

  // Ukana & Ikot Ekpene corridor coordinates (Lng, Lat)
  // Center near Federal Polytechnic Ukana: 7.6834, 5.2891
  const CENTER_LNG = 7.6810;
  const CENTER_LAT = 5.2840;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Carto Dark Matter style (fast, free, dark theme for premium transportation aesthetics)
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-raster': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              ],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            },
          },
          layers: [
            {
              id: 'osm-raster-layer',
              type: 'raster',
              source: 'osm-raster',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [CENTER_LNG, CENTER_LAT],
        zoom: zoom,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      const handleGlobalError = (event: ErrorEvent) => {
        if (event.message && (event.message.includes('Worker failed to load') || event.message.includes('worker'))) {
          event.preventDefault();
          setTileError(true);
        }
      };
      window.addEventListener('error', handleGlobalError);

      map.on('load', () => {
        setMapLoaded(true);
      });

      map.on('error', (e) => {
        // Fallback safely if external tile server or worker is blocked
        console.warn('MapLibre operational fallback:', e?.error?.message || 'Tile/worker unavailable');
        setTileError(true);
      });

      mapRef.current = map;

      return () => {
        window.removeEventListener('error', handleGlobalError);
        markersRef.current.forEach((m) => m.remove());
        map.remove();
      };
    } catch (e) {
      console.warn('MapLibre GL failed to initialize:', e);
      setTileError(true);
    }
  }, [zoom]);

  // Update Driver Markers on MapLibre map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add Driver Markers
    drivers.forEach((driver) => {
      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer';

      const isPhoneOnly = driver.driverMode === 'phone_only';
      const isOnline = driver.availability === 'online';
      const isOkada = driver.vehicleType === 'okada';

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${isOnline && !isPhoneOnly ? '<span class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></span>' : ''}
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-slate-900 ${
            isPhoneOnly ? 'bg-blue-600' : isOkada ? 'bg-amber-500' : 'bg-emerald-500'
          } ${isOnline ? 'opacity-100' : 'opacity-40'}">
            ${isPhoneOnly ? '☎' : isOkada ? '🏍' : '🛺'}
          </div>
          <div class="absolute -bottom-4 bg-slate-950/90 text-[9px] font-mono font-bold text-slate-200 px-1 py-0.2 rounded border border-slate-800 whitespace-nowrap shadow-sm">
            ${driver.driverCode}
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([driver.currentLng, driver.currentLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 text-xs bg-slate-900 text-white rounded-lg">
              <p class="font-bold text-amber-400">${driver.fullName} (${driver.driverCode})</p>
              <p class="text-slate-300 text-[11px]">${driver.vehicleModel} &middot; ${driver.vehicleReg}</p>
              <p class="text-[10px] text-slate-400 mt-1 capitalize">Mode: ${isPhoneOnly ? 'Phone-Only (Basic Phone)' : 'App Live GPS'} &middot; Status: ${driver.availability}</p>
            </div>
          `)
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add Landmark Pins
    landmarks.forEach((landmark) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer hover:scale-125 transition-transform';
      el.innerHTML = `
        <div class="w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-400 shadow-md flex items-center justify-center">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        </div>
      `;

      el.addEventListener('click', () => {
        if (onSelectLandmark) onSelectLandmark(landmark);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([landmark.lng, landmark.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div class="p-2 text-xs bg-slate-900 text-white rounded-lg">
              <p class="font-bold text-white">${landmark.name}</p>
              <p class="text-[10px] text-slate-400">${landmark.area}</p>
            </div>
          `)
        )
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add Active Trip Pickup & Destination if active
    if (activeTrip) {
      // Pickup Pin
      const pickupEl = document.createElement('div');
      pickupEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-950 shadow-xl">
          P
        </div>
      `;
      const pMarker = new maplibregl.Marker({ element: pickupEl })
        .setLngLat([activeTrip.pickupLng, activeTrip.pickupLat])
        .addTo(map);
      markersRef.current.push(pMarker);

      // Destination Pin
      const destEl = document.createElement('div');
      destEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xl">
          D
        </div>
      `;
      const dMarker = new maplibregl.Marker({ element: destEl })
        .setLngLat([activeTrip.destinationLng, activeTrip.destinationLat])
        .addTo(map);
      markersRef.current.push(dMarker);
    }
  }, [drivers, landmarks, activeTrip, mapLoaded, onSelectLandmark]);

  // Center map on Ukana Polytechnic
  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [CENTER_LNG, CENTER_LAT],
        zoom: 13,
        essential: true,
      });
    }
  };

  // If tile error or offline, seamlessly fallback to high-fidelity vector map
  if (tileError) {
    return (
      <div className={`relative ${className}`}>
        <InteractiveMap
          drivers={drivers}
          activeTrip={activeTrip}
          landmarks={landmarks}
          className="h-full w-full"
        />
        <div className="absolute top-3 left-3 z-30 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
          Operational Vector Layer (Ukana Corridor)
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 ${className}`}>
      {/* Map Header Status Tag */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-white tracking-wide">
          MapLibre Live Telemetry
        </span>
        <span className="text-[10px] font-mono text-slate-400 border-l border-slate-700 pl-2">
          Akwa Ibom &middot; Ukana Corridor
        </span>
      </div>

      {/* Recenter Button */}
      <div className="absolute top-3 right-14 z-20">
        <button
          onClick={handleRecenter}
          className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-amber-400 flex items-center justify-center shadow-lg transition-colors"
          title="Recenter on Ukana Central"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* MapLibre DOM Target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 text-[11px] text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Okada (Live GPS)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Keke (Live GPS)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Phone-Only Stand (Basic Phone)</span>
        </div>
      </div>
    </div>
  );
};
