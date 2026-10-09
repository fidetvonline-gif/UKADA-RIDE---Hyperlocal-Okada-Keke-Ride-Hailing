import React, { useState, useEffect, useRef } from 'react';
import { Driver, TripBooking, LocationLandmark } from '../types';
import { Navigation, Bike, Compass, PhoneCall } from 'lucide-react';

interface InteractiveMapProps {
  drivers?: Driver[];
  activeTrip?: TripBooking;
  selectedLandmark?: LocationLandmark | null;
  onSelectLandmark?: (landmark: LocationLandmark) => void;
  landmarks?: LocationLandmark[];
  showFleet?: boolean;
  className?: string;
  interactive?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  drivers = [],
  activeTrip,
  selectedLandmark,
  onSelectLandmark,
  landmarks = [],
  showFleet = true,
  className = 'h-80 w-full',
  interactive = true,
}) => {
  // Center coordinates (Ukana / Ikot Ekpene corridor around 5.24N, 7.69E)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // SVG coordinate projection logic:
  // Lat range: 5.16 to 5.31 (Delta ~ 0.15)
  // Lng range: 7.60 to 7.74 (Delta ~ 0.14)
  const minLat = 5.16;
  const maxLat = 5.31;
  const minLng = 7.60;
  const maxLng = 7.74;

  const projectToMap = (lat: number, lng: number) => {
    // Map bounds: 800 x 600 viewbox
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 540 + 30;
    return { x, y };
  };

  // Animate trip vehicle along route when trip is in_progress or accepted
  useEffect(() => {
    if (!activeTrip || !['accepted', 'arrived', 'in_progress'].includes(activeTrip.status)) {
      setAnimatedProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setAnimatedProgress((prev) => (prev >= 1 ? 0.05 : prev + 0.015));
    }, 400);

    return () => clearInterval(interval);
  }, [activeTrip?.status, activeTrip?.id]);

  // Determine current position of driver during trip
  const getSimulatedDriverPos = () => {
    if (!activeTrip) return null;

    const pickupPos = projectToMap(activeTrip.pickupLat, activeTrip.pickupLng);
    const destPos = projectToMap(activeTrip.destinationLat, activeTrip.destinationLng);

    // Initial driver spawn position
    let startPos = pickupPos;
    if (activeTrip.assignedDriver) {
      startPos = projectToMap(activeTrip.assignedDriver.currentLat, activeTrip.assignedDriver.currentLng);
    } else {
      startPos = { x: pickupPos.x - 40, y: pickupPos.y + 40 };
    }

    if (activeTrip.status === 'accepted') {
      // Driver moving towards pickup
      const curX = startPos.x + (pickupPos.x - startPos.x) * animatedProgress;
      const curY = startPos.y + (pickupPos.y - startPos.y) * animatedProgress;
      return { x: curX, y: curY, stage: 'approaching' };
    }

    if (activeTrip.status === 'arrived') {
      return { x: pickupPos.x, y: pickupPos.y, stage: 'arrived' };
    }

    if (activeTrip.status === 'in_progress') {
      // Driver moving towards destination
      const curX = pickupPos.x + (destPos.x - pickupPos.x) * animatedProgress;
      const curY = pickupPos.y + (destPos.y - pickupPos.y) * animatedProgress;
      return { x: curX, y: curY, stage: 'riding' };
    }

    return null;
  };

  const currentVehiclePos = getSimulatedDriverPos();

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset viewport
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-inner select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Map Header / Location badge */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-md">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-white tracking-wide">
          Ukana - Ikot Ekpene Corridor
        </span>
        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          Free Live Telemetry &middot; Always Open
        </span>
      </div>

      {/* Map Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
          className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center justify-center font-bold text-sm shadow-md transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
          className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center justify-center font-bold text-sm shadow-md transition-colors"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs shadow-md transition-colors"
          title="Center Corridor"
        >
          <Compass className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* SVG Canvas Map */}
      <div
        className="w-full h-full transition-transform duration-75 cursor-grab active:cursor-grabbing"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Background Grid & Land Terrain */}
          <rect width="800" height="600" fill="#090d16" />

          {/* Tropical vegetation patches (Green belts of Akwa Ibom) */}
          <path
            d="M50 80 Q120 40 240 70 T400 90 T600 40 L650 120 L450 160 L180 180 Z"
            fill="#0f291e"
            opacity="0.35"
          />
          <path
            d="M30 450 Q180 430 350 470 T650 490 L750 580 L200 580 Z"
            fill="#0f291e"
            opacity="0.3"
          />

          {/* Service Area Boundary Rings (Ukana & Ikot Ekpene) */}
          {/* Ukana Central Zone */}
          <circle
            cx="440"
            cy="110"
            r="95"
            fill="#3b82f6"
            fillOpacity="0.05"
            stroke="#3b82f6"
            strokeOpacity="0.25"
            strokeDasharray="4 4"
          />
          <text x="440" y="30" fill="#60a5fa" fontSize="10" opacity="0.6" textAnchor="middle" fontWeight="500">
            Ukana Central Zone (Poly Campus)
          </text>

          {/* Ikot Ekpene Urban Zone */}
          <circle
            cx="630"
            cy="460"
            r="120"
            fill="#f59e0b"
            fillOpacity="0.04"
            stroke="#f59e0b"
            strokeOpacity="0.25"
            strokeDasharray="4 4"
          />
          <text x="630" y="590" fill="#fbbf24" fontSize="10" opacity="0.6" textAnchor="middle" fontWeight="500">
            Ikot Ekpene Urban Zone (Raffia City)
          </text>

          {/* Essien Udim Corridor */}
          <circle
            cx="280"
            cy="240"
            r="105"
            fill="#10b981"
            fillOpacity="0.04"
            stroke="#10b981"
            strokeOpacity="0.25"
            strokeDasharray="4 4"
          />
          <text x="280" y="145" fill="#34d399" fontSize="10" opacity="0.6" textAnchor="middle" fontWeight="500">
            Essien Udim LGA Corridor
          </text>

          {/* Main Highway Network */}
          {/* Primary Arterial: Ikot Ekpene - Aba / Umuahia Expressway */}
          <path
            d="M 680 580 L 630 460 L 520 330 L 410 200 L 320 120 L 100 60"
            stroke="#1e293b"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 680 580 L 630 460 L 520 330 L 410 200 L 320 120 L 100 60"
            stroke="#334155"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Road center dash */}
          <path
            d="M 680 580 L 630 460 L 520 330 L 410 200 L 320 120 L 100 60"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Ukana Poly Access Road (Branch to Federal Poly) */}
          <path
            d="M 520 330 L 460 210 L 440 100 L 465 70"
            stroke="#334155"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 520 330 L 460 210 L 440 100 L 465 70"
            stroke="#475569"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Essien Udim Secretariat Link */}
          <path
            d="M 410 200 L 280 240 L 210 290 L 140 370"
            stroke="#334155"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Ikot Ekpene Ring & Plaza bypass */}
          <path
            d="M 630 460 L 670 470 L 690 520 L 640 550"
            stroke="#334155"
            strokeWidth="5"
            fill="none"
          />

          {/* Road Labels */}
          <text x="360" y="160" fill="#94a3b8" fontSize="9" opacity="0.75" transform="rotate(-36 360,160)">
            Ikot Ekpene - Ukana Expressway
          </text>
          <text x="475" y="180" fill="#94a3b8" fontSize="8" opacity="0.7" transform="rotate(-65 475,180)">
            Polytechnic Campus Way
          </text>

          {/* Active Trip Route Polyline */}
          {activeTrip && (
            <>
              {/* Pickup to Destination Polyline */}
              {(() => {
                const p = projectToMap(activeTrip.pickupLat, activeTrip.pickupLng);
                const d = projectToMap(activeTrip.destinationLat, activeTrip.destinationLng);
                return (
                  <g>
                    {/* Glowing underlay */}
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={d.x}
                      y2={d.y}
                      stroke={activeTrip.vehicleType === 'okada' ? '#f59e0b' : '#10b981'}
                      strokeWidth="8"
                      strokeOpacity="0.3"
                      strokeLinecap="round"
                    />
                    {/* Active Route Line */}
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={d.x}
                      y2={d.y}
                      stroke={activeTrip.vehicleType === 'okada' ? '#fbbf24' : '#34d399'}
                      strokeWidth="4"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })()}
            </>
          )}

          {/* Landmarks / POI Markers */}
          {landmarks.map((landmark) => {
            const pos = projectToMap(landmark.lat, landmark.lng);
            const isSelected = selectedLandmark?.id === landmark.id;
            return (
              <g
                key={landmark.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectLandmark && onSelectLandmark(landmark)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#38bdf8' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y - 7}
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize={isSelected ? '10' : '8'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow"
                >
                  {landmark.name.length > 22 ? landmark.name.slice(0, 20) + '...' : landmark.name}
                </text>
              </g>
            );
          })}

          {/* Active Trip Pickup & Destination Markers */}
          {activeTrip && (
            <>
              {/* Pickup Pin */}
              {(() => {
                const pos = projectToMap(activeTrip.pickupLat, activeTrip.pickupLng);
                return (
                  <g transform={`translate(${pos.x}, ${pos.y})`}>
                    <circle r="14" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                    <circle r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      P
                    </text>
                  </g>
                );
              })()}

              {/* Destination Pin */}
              {(() => {
                const pos = projectToMap(activeTrip.destinationLat, activeTrip.destinationLng);
                return (
                  <g transform={`translate(${pos.x}, ${pos.y})`}>
                    <circle r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      D
                    </text>
                  </g>
                );
              })()}
            </>
          )}

          {/* Fleet Drivers (Okada & Keke) */}
          {showFleet &&
            drivers.map((drv) => {
              // Hide driver if they are currently rendered as active moving vehicle to avoid duplicate
              if (activeTrip && activeTrip.driverId === drv.id && currentVehiclePos) return null;

              const pos = projectToMap(drv.currentLat, drv.currentLng);
              const isPhoneOnly = drv.driverMode === 'phone_only';
              const isOnline = drv.availability === 'online';

              return (
                <g key={drv.id} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Status aura */}
                  {isOnline && !isPhoneOnly && (
                    <circle r="10" fill="#22c55e" fillOpacity="0.2" className="animate-pulse" />
                  )}

                  {/* Marker Body */}
                  <circle
                    r="8"
                    fill={
                      isPhoneOnly
                        ? '#3b82f6'
                        : drv.vehicleType === 'okada'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity={isOnline ? 1 : 0.45}
                  />

                  {/* Icon Representation */}
                  <text
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    className="select-none"
                  >
                    {isPhoneOnly ? '☎' : drv.vehicleType === 'okada' ? 'OK' : 'KK'}
                  </text>

                  {/* Driver Code Tooltip */}
                  <text
                    y="16"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="7"
                    fontWeight="500"
                    className="select-none font-mono"
                  >
                    {drv.driverCode}
                  </text>
                </g>
              );
            })}

          {/* Active Moving Vehicle Marker */}
          {currentVehiclePos && (
            <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y})`}>
              <circle r="18" fill="#f59e0b" fillOpacity="0.25" className="animate-ping" />
              <circle r="12" fill="#fbbf24" stroke="#ffffff" strokeWidth="2.5" className="shadow-lg" />
              <text y="4" textAnchor="middle" fill="#090d16" fontSize="8" fontWeight="bold">
                {activeTrip?.vehicleType === 'okada' ? '🏍' : '🛺'}
              </text>
              {/* Floating label */}
              <rect x="-35" y="-24" width="70" height="15" rx="3" fill="#0f172a" opacity="0.9" />
              <text x="0" y="-14" fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">
                {activeTrip?.assignedDriver?.driverCode || 'DRIVER'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Okada (Bike)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Keke (Tricycle)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Phone-only Driver</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span>Live GPS</span>
        </div>
      </div>
    </div>
  );
};
