import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { VehicleType } from '../../types';
import {
  ASSET_OKADA,
  ASSET_KEKE,
  REAL_OKADA_TURNTABLE,
  REAL_KEKE_TURNTABLE,
  VehicleTurntableAngle,
} from '../../data/mockData';
import { vehicleSoundEngine } from '../../utils/vehicleSoundEngine';
import {
  RotateCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BellRing,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Gauge,
} from 'lucide-react';

interface Vehicle3DCanvasProps {
  vehicleType: VehicleType;
  onVehicleChange?: (type: VehicleType) => void;
  className?: string;
}

interface HotspotFeature {
  id: string;
  title: string;
  description: string;
  badge: string;
  relevantAngles: number[];
  xPercent: number;
  yPercent: number;
}

const OKADA_HOTSPOTS: HotspotFeature[] = [
  {
    id: 'headlight',
    title: 'Round Glass Halogen Headlight',
    description: 'Chrome housing with high-beam penetration for night navigation.',
    badge: 'Lighting',
    relevantAngles: [0, 45, 315],
    xPercent: 64,
    yPercent: 24,
  },
  {
    id: 'crash-guard',
    title: 'Tubular Steel Crash Guard with Reflective Tape',
    description: 'Heavy-duty tubular leg protector with mandatory red/white hazard safety stripes.',
    badge: 'Safety',
    relevantAngles: [0, 45, 90, 315],
    xPercent: 54,
    yPercent: 54,
  },
  {
    id: 'fuel-tank',
    title: 'Bajaj Boxer BM 150cc Teardrop Tank',
    description: 'Durable red lacquer tank with embossed chrome Bajaj emblem.',
    badge: 'Powertrain',
    relevantAngles: [45, 90, 270, 315],
    xPercent: 50,
    yPercent: 32,
  },
  {
    id: 'luggage-rack',
    title: 'Welded Steel Cargo Carrier Rack',
    description: 'Heavy-duty rear luggage carrier with tie-down hook points.',
    badge: 'Utility',
    relevantAngles: [90, 135, 180, 225],
    xPercent: 28,
    yPercent: 28,
  },
  {
    id: 'engine-block',
    title: '150cc 4-Stroke Air-Cooled Engine',
    description: 'Cast cooling fins, carburettor, kick-starter & sealed chain guard.',
    badge: 'Engine',
    relevantAngles: [45, 90, 225, 270],
    xPercent: 49,
    yPercent: 60,
  },
  {
    id: 'plate',
    title: 'Verified Nigerian Commercial Registration',
    description: 'Official road-worthy number plate certified by state transport authorities.',
    badge: 'Verified',
    relevantAngles: [0, 135, 180, 225],
    xPercent: 28,
    yPercent: 44,
  },
];

const KEKE_HOTSPOTS: HotspotFeature[] = [
  {
    id: 'windshield',
    title: 'Laminated Windshield with Wiper Blade',
    description: 'Full-width safety glass with high-torque electric rain wiper.',
    badge: 'Safety',
    relevantAngles: [0, 45, 315],
    xPercent: 42,
    yPercent: 26,
  },
  {
    id: 'transit-stripe',
    title: 'Akwa Ibom State Green Transit Livery',
    description: 'Mandatory commercial regulatory green stripe for authorized transit.',
    badge: 'Livery',
    relevantAngles: [45, 90, 225, 270, 315],
    xPercent: 56,
    yPercent: 52,
  },
  {
    id: 'canopy',
    title: 'Heavy Waterproof Vinyl Roof Canopy',
    description: 'All-weather passenger roof with rolled side curtains for rain protection.',
    badge: 'Cabin',
    relevantAngles: [0, 45, 90, 135, 180, 225, 270, 315],
    xPercent: 58,
    yPercent: 18,
  },
  {
    id: 'spare-tire',
    title: 'Mounted Rear Spare Tyre & Custom Slogan',
    description: 'Commercial spare wheel emblazoned with "BAJAJ RE" & transport faith motto.',
    badge: 'Spare Tire',
    relevantAngles: [135, 180, 225],
    xPercent: 70,
    yPercent: 50,
  },
  {
    id: 'passenger-bench',
    title: '3-Passenger Cushioned Rear Cabin Bench',
    description: 'Tubular steel roll-cage protecting a spacious 3-seat passenger bench.',
    badge: 'Cabin',
    relevantAngles: [45, 90, 270],
    xPercent: 62,
    yPercent: 46,
  },
];

export const Vehicle3DCanvas: React.FC<Vehicle3DCanvasProps> = ({
  vehicleType,
  onVehicleChange,
  className = 'w-full h-[540px] lg:h-[620px]',
}) => {
  // Continuous 360-degree rotation angle (0 to 360)
  const [rotationAngle, setRotationAngle] = useState<number>(45);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotFeature | null>(null);
  const [isAudioRunning, setIsAudioRunning] = useState<boolean>(false);

  // Drag interaction
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const currentDataset = vehicleType === 'okada' ? REAL_OKADA_TURNTABLE : REAL_KEKE_TURNTABLE;
  const currentHotspots = vehicleType === 'okada' ? OKADA_HOTSPOTS : KEKE_HOTSPOTS;

  // Refs for direct DOM elements to ensure 60fps GSAP-driven rotation without lag
  const platterRef = useRef<HTMLDivElement>(null);
  const primaryShadowRef = useRef<HTMLDivElement>(null);
  const secondaryShadowRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const rotationProxyRef = useRef<{ angle: number }>({ angle: 45 });

  // Preload all 8 high-resolution real photographic turntable angles
  useEffect(() => {
    REAL_OKADA_TURNTABLE.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
    REAL_KEKE_TURNTABLE.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Cleanup audio synthesizer on unmount
  useEffect(() => {
    return () => {
      vehicleSoundEngine.stopEngine();
    };
  }, []);

  // Helper to apply direct inline transforms to platter and shadows in sync
  const applyTransforms = useCallback((deg: number) => {
    const norm = ((deg % 360) + 360) % 360;
    if (platterRef.current) {
      platterRef.current.style.transform = `perspective(900px) rotateX(68deg) rotateZ(${norm}deg)`;
    }
    if (primaryShadowRef.current) {
      primaryShadowRef.current.style.transform = `perspective(900px) rotateX(68deg) rotateZ(${norm}deg)`;
    }
    if (secondaryShadowRef.current) {
      const sinOffset = 1 + Math.sin((norm * Math.PI) / 180) * 0.2;
      secondaryShadowRef.current.style.transform = `perspective(900px) rotateX(68deg) rotateZ(${norm + 15}deg) scaleX(${sinOffset})`;
    }
  }, []);

  // GSAP-driven continuous 360-degree rotation tween
  useEffect(() => {
    // Kill any existing tween
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    if (!isAutoSpinning) {
      applyTransforms(rotationAngle);
      return;
    }

    // Set starting angle from current state
    rotationProxyRef.current.angle = rotationAngle;

    // 360 degrees rotation duration scaled by spinSpeed (default 13.8 seconds per full 360° turn)
    const baseDuration = 13.8 / spinSpeed;

    tweenRef.current = gsap.to(rotationProxyRef.current, {
      angle: '+=360',
      duration: baseDuration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        angle: (val) => {
          const numVal = parseFloat(val);
          return (((numVal % 360) + 360) % 360);
        },
      },
      onUpdate: () => {
        if (isDraggingRef.current) return;
        const currentAngle = ((rotationProxyRef.current.angle % 360) + 360) % 360;
        setRotationAngle(currentAngle);
        applyTransforms(currentAngle);
      },
    });

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [isAutoSpinning, spinSpeed, applyTransforms]);

  const normalizedAngle = ((rotationAngle % 360) + 360) % 360;

  // Calculate the active photo index (0 to 7) corresponding to 8 angles spaced 45° apart
  const sectorProgress = normalizedAngle / 45;
  const primaryIndex = Math.floor(sectorProgress) % 8;
  const secondaryIndex = (primaryIndex + 1) % 8;
  const crossfadeWeight = sectorProgress - Math.floor(sectorProgress);

  const activeAngleData = currentDataset[primaryIndex] || currentDataset[0];
  const nextAngleData = currentDataset[secondaryIndex] || currentDataset[0];

  // Drag-to-spin controls (seamlessly pauses GSAP and updates angle + base in real-time)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = rotationAngle;
    if (tweenRef.current) {
      tweenRef.current.pause();
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const newAngle = ((dragStartAngleRef.current + deltaX * 0.75) % 360 + 360) % 360;
    setRotationAngle(newAngle);
    rotationProxyRef.current.angle = newAngle;
    applyTransforms(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    if (isAutoSpinning && tweenRef.current) {
      rotationProxyRef.current.angle = rotationAngle;
      tweenRef.current.restart(true);
    }
  };

  const handleToggleSound = () => {
    const running = vehicleSoundEngine.toggleEngine(vehicleType);
    setIsAudioRunning(running);
  };

  const handleHorn = () => {
    vehicleSoundEngine.playHorn(vehicleType);
  };

  const handleJumpToAngle = (targetDeg: number) => {
    setRotationAngle(targetDeg);
    rotationProxyRef.current.angle = targetDeg;
    applyTransforms(targetDeg);
    if (isAutoSpinning && tweenRef.current) {
      tweenRef.current.restart(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl bg-slate-950 border border-slate-800/90 overflow-hidden select-none shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 h-auto' : className
      }`}
    >
      {/* ================================================================= */}
      {/* 1. TOP HEADER: Status, Turntable Telemetry & Vehicle Switcher     */}
      {/* ================================================================= */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                {vehicleType === 'okada'
                  ? 'Real Nigerian Okada (Bajaj Boxer BM 150cc)'
                  : 'Real Nigerian Keke (Bajaj RE 200cc)'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isAutoSpinning ? 'Base Spinning 360°' : 'Manual Rotate'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {vehicleType === 'okada'
                ? 'Actual red & chrome commercial motorcycle rotating on motorized showroom platter'
                : 'Actual yellow commercial tricycle rotating on motorized showroom platter'}
            </p>
          </div>
        </div>

        {/* Vehicle Switcher: Real Bike vs Real Keke */}
        {onVehicleChange && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onVehicleChange('okada')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                vehicleType === 'okada'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🏍 Real Okada Bike</span>
            </button>
            <button
              type="button"
              onClick={() => onVehicleChange('keke')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                vehicleType === 'keke'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🛺 Real Keke Tricycle</span>
            </button>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 2. MAIN VIEWPORT: REAL VEHICLE + ACTIVELY SPINNING BASE & SHADOWS  */}
      {/* ================================================================= */}
      <div
        className="relative flex-1 w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-[#050811]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Studio Lighting Radial Gradient Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background:
              vehicleType === 'okada'
                ? 'radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.14) 0%, rgba(15,23,42,0.65) 45%, rgba(5,8,17,1) 85%)'
                : 'radial-gradient(ellipse at 50% 40%, rgba(16,185,129,0.14) 0%, rgba(15,23,42,0.65) 45%, rgba(5,8,17,1) 85%)',
          }}
        />

        {/* =============================================================== */}
        {/* THE MOTORIZED TURNTABLE BASE THAT VISIBLY SPINS 360°           */}
        {/* =============================================================== */}
        <div className="absolute bottom-4 sm:bottom-8 w-full flex items-center justify-center pointer-events-none">
          {/* Outer Stationary Platform Ring (Chamfer Bezel) */}
          <div className="relative w-[380px] sm:w-[560px] lg:w-[680px] h-[120px] sm:h-[160px] flex items-center justify-center">
            {/* Stationary Metallic Floor Recess */}
            <div
              className="absolute inset-0 rounded-full border-2 border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              style={{
                transform: 'perspective(900px) rotateX(68deg)',
                background: 'linear-gradient(to bottom, #0f172a, #020617)',
              }}
            />

            {/* ACTIVELY SPINNING TURNTABLE PLATTER (Turns with normalizedAngle) */}
            <div
              ref={platterRef}
              className="absolute inset-2 sm:inset-3 rounded-full transition-transform duration-75 flex items-center justify-center overflow-hidden"
              style={{
                transform: `perspective(900px) rotateX(68deg) rotateZ(${normalizedAngle}deg)`,
                background:
                  vehicleType === 'okada'
                    ? 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 55%, #090d16 100%)'
                    : 'radial-gradient(ellipse at center, #132e22 0%, #0f172a 55%, #090d16 100%)',
                boxShadow:
                  vehicleType === 'okada'
                    ? 'inset 0 0 40px rgba(245,158,11,0.25), 0 0 30px rgba(245,158,11,0.2)'
                    : 'inset 0 0 40px rgba(16,185,129,0.25), 0 0 30px rgba(16,185,129,0.2)',
                border:
                  vehicleType === 'okada'
                    ? '2px solid rgba(245,158,11,0.6)'
                    : '2px solid rgba(16,185,129,0.6)',
              }}
            >
              {/* Radial Grooves / Spokes that visibly spin around */}
              <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="94" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,3" />
                <circle cx="100" cy="100" r="75" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,4" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="#64748b" strokeWidth="1" />
                <circle cx="100" cy="100" r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                {/* 16 Radial Spokes radiating out */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={100 + 94 * Math.cos((i * 22.5 * Math.PI) / 180)}
                    y2={100 + 94 * Math.sin((i * 22.5 * Math.PI) / 180)}
                    stroke={i % 2 === 0 ? '#f59e0b' : '#64748b'}
                    strokeWidth={i % 4 === 0 ? '2' : '1'}
                    strokeOpacity={i % 4 === 0 ? '0.7' : '0.3'}
                  />
                ))}
              </svg>

              {/* 4 Cardinal Angle Markers on the Platter */}
              <div className="absolute top-2 font-mono text-[9px] text-amber-400 font-extrabold tracking-widest">
                0° FRONT
              </div>
              <div className="absolute bottom-2 font-mono text-[9px] text-slate-400 font-extrabold tracking-widest">
                180° REAR
              </div>
              <div className="absolute right-3 font-mono text-[9px] text-slate-400 font-extrabold">
                90° R
              </div>
              <div className="absolute left-3 font-mono text-[9px] text-slate-400 font-extrabold">
                270° L
              </div>

              {/* Glowing Turntable Drive Cursor */}
              <div
                className="absolute top-0 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] border border-white"
                style={{ transform: 'translateY(-50%)' }}
              />
            </div>

            {/* =========================================================== */}
            {/* DYNAMIC ROTATING VEHICLE SHADOW (Actively spins with yaw)   */}
            {/* =========================================================== */}
            <div
              ref={primaryShadowRef}
              className="absolute pointer-events-none transition-transform duration-75"
              style={{
                transform: `perspective(900px) rotateX(68deg) rotateZ(${normalizedAngle}deg)`,
                width: vehicleType === 'okada' ? '340px' : '400px',
                height: vehicleType === 'okada' ? '90px' : '140px',
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 45%, transparent 75%)',
                filter: 'blur(10px)',
              }}
            />

            {/* Secondary directional cast shadow elongation */}
            <div
              ref={secondaryShadowRef}
              className="absolute pointer-events-none transition-transform duration-75"
              style={{
                transform: `perspective(900px) rotateX(68deg) rotateZ(${normalizedAngle + 15}deg) scaleX(${
                  1 + Math.sin((normalizedAngle * Math.PI) / 180) * 0.2
                })`,
                width: vehicleType === 'okada' ? '300px' : '360px',
                height: vehicleType === 'okada' ? '70px' : '110px',
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 80%)',
                filter: 'blur(14px)',
              }}
            />
          </div>
        </div>

        {/* =============================================================== */}
        {/* THE REAL VEHICLE PHOTOGRAPHIC LAYER                             */}
        {/* =============================================================== */}
        <div
          className="relative z-10 max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* Primary Active Angle Real Photograph */}
          <img
            src={activeAngleData.src}
            alt={`${vehicleType} ${activeAngleData.label}`}
            className="max-h-[350px] sm:max-h-[440px] lg:max-h-[510px] w-auto object-contain select-none drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] transition-opacity duration-150"
            style={{
              opacity: 1 - crossfadeWeight * 0.35,
            }}
            draggable={false}
          />

          {/* Smooth Crossfade Secondary Angle Image during transition */}
          {crossfadeWeight > 0.05 && (
            <img
              src={nextAngleData.src}
              alt={`${vehicleType} ${nextAngleData.label}`}
              className="max-h-[350px] sm:max-h-[440px] lg:max-h-[510px] w-auto object-contain select-none drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] absolute inset-0 m-auto transition-opacity duration-150"
              style={{
                opacity: crossfadeWeight * 0.95,
              }}
              draggable={false}
            />
          )}

          {/* Interactive Inspection Hotspots on the Real Vehicle */}
          {showHotspots &&
            currentHotspots.map((spot) => {
              const isRelevant = spot.relevantAngles.includes(activeAngleData.angle);
              if (!isRelevant) return null;

              const isSelected = activeHotspot?.id === spot.id;

              return (
                <div
                  key={spot.id}
                  className="absolute z-20 group"
                  style={{
                    left: `${spot.xPercent}%`,
                    top: `${spot.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(isSelected ? null : spot);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xl transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/40'
                        : 'bg-slate-950/90 text-amber-400 border border-amber-400/80 hover:scale-110 hover:bg-amber-500 hover:text-slate-950'
                    }`}
                    title={spot.title}
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Tooltip Card */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-950/95 backdrop-blur-md border border-slate-700/80 shadow-2xl pointer-events-none transition-all duration-200 z-30 ${
                      isSelected
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        {spot.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {Math.round(normalizedAngle)}° Platter View
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mb-0.5">{spot.title}</p>
                    <p className="text-[11px] text-slate-300 leading-normal">{spot.description}</p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Top-Left Heading & Base RPM Telemetry */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-200 flex items-center gap-2.5 shadow-xl">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="font-bold text-white">{activeAngleData.badge}</span>
          </div>
          <span className="text-amber-400 font-mono text-[11px] font-bold border-l border-slate-700 pl-2">
            {Math.round(normalizedAngle)}° HEADING
          </span>
          <span className="text-[10px] text-slate-400 font-mono border-l border-slate-700 pl-2 hidden sm:inline">
            BASE SPIN: {isAutoSpinning ? '4.8 RPM' : 'IDLE'}
          </span>
        </div>

        {/* Top-Right Drag Hint */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] text-slate-400">
          <span>Drag screen to spin platter</span>
        </div>

        {/* Bottom Floating Turntable Controls Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800/90 shadow-2xl max-w-[94%]">
          {/* Auto-Spin Play/Pause */}
          <button
            type="button"
            onClick={() => setIsAutoSpinning((s) => !s)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isAutoSpinning
                ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isAutoSpinning ? 'Pause Base Spin' : 'Start Base Spin'}
          >
            {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSpinning ? 'Spinning: ON' : 'Spinning: OFF'}</span>
          </button>

          {/* Speed Toggles */}
          <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2">
            <button
              type="button"
              onClick={() => setSpinSpeed(0.5)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                spinSpeed === 0.5
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              0.5x
            </button>
            <button
              type="button"
              onClick={() => setSpinSpeed(1)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                spinSpeed === 1
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => setSpinSpeed(1.8)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                spinSpeed === 1.8
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2.0x
            </button>
          </div>

          {/* Web Audio Engine Sound */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isAudioRunning
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Toggle Web Audio engine simulation"
          >
            {isAudioRunning ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioRunning ? 'Engine: ON' : 'Engine: Start'}</span>
          </button>

          {/* Honk Horn */}
          <button
            type="button"
            onClick={handleHorn}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold active:scale-95 transition-all"
            title="Honk vehicle horn"
          >
            <BellRing className="w-3 h-3 text-amber-400" />
            <span>Honk!</span>
          </button>

          {/* Hotspots Toggle */}
          <button
            type="button"
            onClick={() => setShowHotspots((h) => !h)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              showHotspots
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span>{showHotspots ? 'Pins: ON' : 'Pins: OFF'}</span>
          </button>

          {/* Zoom and Fullscreen */}
          <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-1 rounded text-slate-400 hover:text-white ml-1"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. QUICK ANGLE PRESET SELECTOR STRIP                              */}
      {/* ================================================================= */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-slate-900/95 border-t border-slate-800/80 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 hidden sm:inline">
          Turntable Angles:
        </span>
        <div className="flex items-center gap-1.5 w-full justify-between sm:justify-start">
          {currentDataset.map((item) => (
            <button
              key={item.angle}
              type="button"
              onClick={() => handleJumpToAngle(item.angle)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 ${
                Math.abs(normalizedAngle - item.angle) < 22.5 ||
                (item.angle === 0 && normalizedAngle > 337.5)
                  ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                  : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.angle}°
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. BOTTOM SPECIFICATION BAR: Real Nigerian Commercial Specs       */}
      {/* ================================================================= */}
      <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-white">
              {vehicleType === 'okada' ? 'Real Bajaj BM 150cc' : 'Real Bajaj RE 200cc'}
            </p>
            <p className="text-[10px] text-slate-400">
              {vehicleType === 'okada' ? 'Actual Commercial Motorbike' : 'Actual Commercial Tricycle'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">
              {vehicleType === 'okada' ? 'Safety Crash Guard' : 'All-Weather Canopy'}
            </p>
            <p className="text-[10px] text-slate-400">
              {vehicleType === 'okada' ? 'Reflective Warning Stripes' : 'Waterproof Rain Curtains'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <div>
            <p className="font-bold text-white">
              {vehicleType === 'okada' ? 'Extended Cargo Rack' : '3-Passenger Cabin'}
            </p>
            <p className="text-[10px] text-slate-400">
              {vehicleType === 'okada' ? 'Welded Steel Luggage Base' : 'Comfortable Padded Bench'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-white">
              {vehicleType === 'okada' ? 'State Verified Plate' : 'Akwa Ibom Livery'}
            </p>
            <p className="text-[10px] text-slate-400">
              {vehicleType === 'okada' ? 'Union Certified Carrier' : 'Official Green Transit Stripe'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
