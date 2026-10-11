import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VehicleType } from '../../types';
import { createOkada3DModel, createKeke3DModel } from './Vehicle3DModels';
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
  Layers,
  Box,
} from 'lucide-react';

interface Vehicle3DCanvasProps {
  vehicleType: VehicleType;
  onVehicleChange?: (type: VehicleType) => void;
  className?: string;
}

interface Hotspot3D {
  id: string;
  title: string;
  description: string;
  badge: string;
  position: [number, number, number]; // [x, y, z] in 3D world space
}

const OKADA_HOTSPOTS_3D: Hotspot3D[] = [
  {
    id: 'headlight',
    title: 'Round Glass Halogen Headlight',
    description: 'Chrome housing with high-beam penetration for night navigation.',
    badge: 'Lighting',
    position: [1.4, 1.15, 0],
  },
  {
    id: 'crash-guard',
    title: 'Tubular Steel Crash Guard with Reflective Tape',
    description: 'Heavy-duty tubular leg protector with mandatory red/white hazard safety stripes.',
    badge: 'Safety',
    position: [0.35, 0.8, 0.45],
  },
  {
    id: 'fuel-tank',
    title: 'Bajaj Boxer BM 150cc Teardrop Tank',
    description: 'Durable red lacquer tank with embossed chrome Bajaj emblem.',
    badge: 'Powertrain',
    position: [0.28, 1.4, 0],
  },
  {
    id: 'engine-block',
    title: '150cc 4-Stroke Air-Cooled Engine',
    description: 'Cast cooling fins, carburettor, kick-starter & sealed chain guard.',
    badge: 'Engine',
    position: [-0.05, 0.72, 0.25],
  },
  {
    id: 'luggage-rack',
    title: 'Welded Steel Cargo Carrier Rack',
    description: 'Heavy-duty rear luggage carrier with tie-down hook points.',
    badge: 'Utility',
    position: [-1.22, 1.34, 0],
  },
  {
    id: 'plate',
    title: 'Verified Nigerian Commercial Registration',
    description: 'Official road-worthy number plate certified by state transport authorities.',
    badge: 'Verified',
    position: [-1.62, 0.98, 0],
  },
];

const KEKE_HOTSPOTS_3D: Hotspot3D[] = [
  {
    id: 'windshield',
    title: 'Laminated Windshield with Wiper Blade',
    description: 'Full-width safety glass with high-torque electric rain wiper.',
    badge: 'Safety',
    position: [0.72, 1.6, 0],
  },
  {
    id: 'transit-stripe',
    title: 'Akwa Ibom State Green Transit Livery',
    description: 'Mandatory commercial regulatory green stripe for authorized transit.',
    badge: 'Livery',
    position: [0.85, 0.92, 0.65],
  },
  {
    id: 'canopy',
    title: 'Heavy Waterproof Vinyl Roof Canopy',
    description: 'All-weather passenger roof with rolled side curtains for rain protection.',
    badge: 'Cabin',
    position: [-0.35, 2.25, 0],
  },
  {
    id: 'spare-tire',
    title: 'Mounted Rear Spare Tyre & Custom Slogan',
    description: 'Commercial spare wheel emblazoned with "BAJAJ RE" & transport faith motto.',
    badge: 'Spare Tire',
    position: [-1.55, 1.0, 0],
  },
  {
    id: 'passenger-bench',
    title: '3-Passenger Cushioned Rear Cabin Bench',
    description: 'Tubular steel roll-cage protecting a spacious 3-seat passenger bench.',
    badge: 'Cabin',
    position: [-0.95, 0.9, 0],
  },
];

export const Vehicle3DCanvas: React.FC<Vehicle3DCanvasProps> = ({
  vehicleType,
  onVehicleChange,
  className = 'w-full h-[540px] lg:h-[620px]',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction & Playback state
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);
  const [currentYawDeg, setCurrentYawDeg] = useState<number>(45);
  const [isAudioRunning, setIsAudioRunning] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot3D | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [screenHotspots, setScreenHotspots] = useState<
    Array<{ hotspot: Hotspot3D; x: number; y: number; visible: boolean }>
  >([]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const turntableFloorRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Wheel animation references
  const wheelsRef = useRef<THREE.Group[]>([]);

  // Camera Orbit / Drag variables
  const isDraggingRef = useRef<boolean>(false);
  const previousPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4, // 45 degrees
    phi: Math.PI / 3, // ~60 degrees elevation
    radius: 4.8,
  });

  const hotspotsData = vehicleType === 'okada' ? OKADA_HOTSPOTS_3D : KEKE_HOTSPOTS_3D;

  // Initialize Three.js Scene, Camera, Lights, Turntable, and 3D Vehicle Models
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and shadow map
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // 4. Studio Lighting System (Key light, Fill, Rim, Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool Blue/Cyan Fill Light for Automotive Definition
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Amber Rim Accent Light
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    rimLight.position.set(-4, 3, 6);
    scene.add(rimLight);

    // Ground Studio Floor & Turntable Platter
    const floorGroup = new THREE.Group();
    turntableFloorRef.current = floorGroup;
    scene.add(floorGroup);

    // Circular Turntable Platter
    const platterRadius = 2.6;
    const platterGeo = new THREE.CylinderGeometry(platterRadius, platterRadius, 0.08, 48);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.35,
    });
    const platterMesh = new THREE.Mesh(platterGeo, platterMat);
    platterMesh.position.y = -0.04;
    platterMesh.receiveShadow = true;
    floorGroup.add(platterMesh);

    // Platter Bezel Ring (Glowing Amber / Emerald rim)
    const ringGeo = new THREE.TorusGeometry(platterRadius, 0.04, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: vehicleType === 'okada' ? 0xf59e0b : 0x10b981,
      metalness: 0.9,
      roughness: 0.1,
      emissive: vehicleType === 'okada' ? 0xd97706 : 0x059669,
      emissiveIntensity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.005;
    floorGroup.add(ringMesh);

    // Platter Grooves / Tech Spoke Markers
    for (let s = 0; s < 12; s++) {
      const spokeGeo = new THREE.BoxGeometry(0.02, 0.005, platterRadius * 1.8);
      const spokeMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.4,
      });
      const spokeMesh = new THREE.Mesh(spokeGeo, spokeMat);
      spokeMesh.rotation.y = (s / 12) * Math.PI;
      spokeMesh.position.y = 0.002;
      floorGroup.add(spokeMesh);
    }

    // Shadow Receiver Ground Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.7 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.042;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Build the Actual 3D Vehicle Model Group
    const vehicleGroup = new THREE.Group();
    vehicleGroupRef.current = vehicleGroup;
    scene.add(vehicleGroup);

    // Populate model based on vehicleType
    wheelsRef.current = [];
    if (vehicleType === 'okada') {
      const okadaData = createOkada3DModel();
      vehicleGroup.add(okadaData.rootGroup);
      if (okadaData.frontWheel && okadaData.rearWheel) {
        wheelsRef.current.push(okadaData.frontWheel, okadaData.rearWheel);
      }
    } else {
      const kekeData = createKeke3DModel();
      vehicleGroup.add(kekeData.rootGroup);
      if (kekeData.frontWheel && kekeData.rearLeftWheel && kekeData.rearRightWheel) {
        wheelsRef.current.push(kekeData.frontWheel, kekeData.rearLeftWheel, kekeData.rearRightWheel);
      }
    }

    // Render loop with continuous actual 3D turntable spin
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update Auto-Spin on the 3D Vehicle Model
      if (isAutoSpinning && !isDraggingRef.current && vehicleGroupRef.current) {
        const rotationDelta = (Math.PI / 4) * spinSpeed * deltaTime; // ~8 RPM
        orbitAngleRef.current.theta += rotationDelta;

        // Keep theta normalized
        if (orbitAngleRef.current.theta > Math.PI * 2) {
          orbitAngleRef.current.theta -= Math.PI * 2;
        }

        // Spin wheels as the vehicle rotates!
        wheelsRef.current.forEach((wheel) => {
          wheel.rotation.z += rotationDelta * 2.5;
        });
      }

      // Update Camera Position based on Spherical Coordinates
      const currentRadius = orbitAngleRef.current.radius / zoomLevel;
      const x =
        currentRadius *
        Math.sin(orbitAngleRef.current.phi) *
        Math.sin(orbitAngleRef.current.theta);
      const y = currentRadius * Math.cos(orbitAngleRef.current.phi);
      const z =
        currentRadius *
        Math.sin(orbitAngleRef.current.phi) *
        Math.cos(orbitAngleRef.current.theta);

      camera.position.set(x, Math.max(0.3, y), z);
      camera.lookAt(0, 0.75, 0); // Focus on vehicle center

      // Calculate Normalized Heading in Degrees (0 - 360)
      let headingDeg = (orbitAngleRef.current.theta * 180) / Math.PI;
      headingDeg = ((headingDeg % 360) + 360) % 360;
      setCurrentYawDeg(headingDeg);

      // Render 3D Scene
      renderer.render(scene, camera);

      // Project 3D Hotspot world coordinates to 2D Screen space
      if (showHotspots && mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        const projected = hotspotsData.map((spot) => {
          const worldPos = new THREE.Vector3(...spot.position);
          worldPos.project(camera);

          // Check if behind camera
          const isVisible = worldPos.z < 1;
          const sx = ((worldPos.x + 1) * rect.width) / 2;
          const sy = ((-worldPos.y + 1) * rect.height) / 2;

          return {
            hotspot: spot,
            x: sx,
            y: sy,
            visible: isVisible,
          };
        });
        setScreenHotspots(projected);
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Handle Window / Container Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      vehicleSoundEngine.stopEngine();
    };
  }, [vehicleType, isAutoSpinning, spinSpeed, zoomLevel, showHotspots]);

  // Pointer Drag-to-Rotate 3D Controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;

    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    // Update Azimuth Theta
    orbitAngleRef.current.theta -= deltaX * 0.009;

    // Update Polar Elevation Phi (Clamped to avoid flipping over)
    orbitAngleRef.current.phi = Math.max(
      0.15,
      Math.min(Math.PI / 2 - 0.04, orbitAngleRef.current.phi - deltaY * 0.007)
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
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
    orbitAngleRef.current.theta = (targetDeg * Math.PI) / 180;
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl bg-slate-950 border border-slate-800/90 overflow-hidden select-none shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 h-auto' : className
      }`}
    >
      {/* ================================================================= */}
      {/* 3D WEBGL VIEWPORT: ACTUAL PROCEDURAL 3D MESH WITH REAL-TIME SPIN */}
      {/* ================================================================= */}
      <div
        ref={mountRef}
        className="relative flex-1 w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-[#050811]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Real 3D Badge Indicator */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-200 flex items-center gap-2.5 shadow-xl">
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="font-bold text-white uppercase tracking-wider">
              Actual 3D WebGL {vehicleType === 'okada' ? 'Motorcycle' : 'Tricycle'}
            </span>
          </div>
          <span className="text-amber-400 font-mono text-[11px] font-bold border-l border-slate-700 pl-2">
            {Math.round(currentYawDeg)}° HEADING
          </span>
          <span className="text-[10px] text-emerald-400 font-mono border-l border-slate-700 pl-2 hidden sm:inline">
            REAL 3D ROTATION: {isAutoSpinning ? `${(spinSpeed * 4.8).toFixed(1)} RPM` : 'PAUSED'}
          </span>
        </div>

        {/* Top-Right Drag Hint */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] text-slate-400">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Click &amp; drag 360° anywhere to orbit camera</span>
        </div>

        {/* 3D World Hotspot Pins overlay projected on real 3D coords */}
        {showHotspots &&
          screenHotspots.map(({ hotspot, x, y, visible }) => {
            if (!visible) return null;
            const isSelected = activeHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className="absolute z-20 group pointer-events-auto"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isSelected ? null : hotspot);
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/40'
                      : 'bg-slate-950/90 text-amber-400 border border-amber-400/80 hover:scale-110 hover:bg-amber-500 hover:text-slate-950'
                  }`}
                  title={hotspot.title}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </button>

                {/* Tooltip Card */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-slate-950/95 backdrop-blur-md border border-slate-700/80 shadow-2xl transition-all duration-200 z-30 ${
                    isSelected
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {hotspot.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {Math.round(currentYawDeg)}° 3D Angle
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mb-0.5">{hotspot.title}</p>
                  <p className="text-[11px] text-slate-300 leading-normal">{hotspot.description}</p>
                </div>
              </div>
            );
          })}

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
            title={isAutoSpinning ? 'Pause 3D Turntable Spin' : 'Start 3D Turntable Spin'}
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
            {isAudioRunning ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
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
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* QUICK ANGLE PRESET SELECTOR STRIP                                 */}
      {/* ================================================================= */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-slate-900/95 border-t border-slate-800/80 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 hidden sm:inline">
          3D Perspective Angles:
        </span>
        <div className="flex items-center gap-1.5 w-full justify-between sm:justify-start">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <button
              key={angle}
              type="button"
              onClick={() => handleJumpToAngle(angle)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 ${
                Math.abs(currentYawDeg - angle) < 22.5 ||
                (angle === 0 && currentYawDeg > 337.5)
                  ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                  : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {angle}°
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* BOTTOM SPECIFICATION BAR: Real Nigerian Commercial Specs          */}
      {/* ================================================================= */}
      <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/70 border border-slate-800/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-white">
              {vehicleType === 'okada' ? '3D Bajaj BM 150cc' : '3D Bajaj RE 200cc'}
            </p>
            <p className="text-[10px] text-slate-400">
              {vehicleType === 'okada' ? 'Actual 3D Mesh Bike Model' : 'Actual 3D Mesh Keke Model'}
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
