import * as THREE from 'three';

/**
 * Creates an authentic 3D Okada (Bajaj Boxer BM 150 style Nigerian commercial motorcycle).
 * Built with procedural Three.js geometries, realistic PBR materials, turning wheels,
 * handlebars, crash guards, luggage rack, engine, and headlights.
 */
export function createOkada3DModel(): {
  rootGroup: THREE.Group;
  frontWheel: THREE.Group;
  rearWheel: THREE.Group;
  forkGroup: THREE.Group;
} {
  const root = new THREE.Group();

  // Common Materials
  const paintMaterial = new THREE.MeshStandardMaterial({
    color: 0xd92626, // Nigerian iconic candy red lacquer
    metalness: 0.65,
    roughness: 0.25,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.95,
    roughness: 0.12,
  });

  const blackMetal = new THREE.MeshStandardMaterial({
    color: 0x1e2229,
    metalness: 0.8,
    roughness: 0.4,
  });

  const darkEngine = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.35,
  });

  const tireRubber = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.1,
    roughness: 0.85,
  });

  const leatherBlack = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.9,
    metalness: 0.05,
  });

  const glassLens = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.5,
  });

  const reflectorOrange = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.2,
    roughness: 0.3,
    emissive: 0xd97706,
    emissiveIntensity: 0.25,
  });

  const reflectorRed = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.2,
    roughness: 0.3,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.3,
  });

  // Helper for spoked wheel
  function createSpokedWheel(radius: number, tireRadius: number): THREE.Group {
    const wheel = new THREE.Group();

    // Tire
    const tireGeo = new THREE.TorusGeometry(radius, tireRadius, 16, 48);
    const tireMesh = new THREE.Mesh(tireGeo, tireRubber);
    tireMesh.castShadow = true;
    tireMesh.receiveShadow = true;
    wheel.add(tireMesh);

    // Rim
    const rimGeo = new THREE.TorusGeometry(radius - tireRadius * 0.4, 0.04, 12, 48);
    const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
    rimMesh.castShadow = true;
    wheel.add(rimMesh);

    // Hub
    const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.24, 24);
    const hubMesh = new THREE.Mesh(hubGeo, chromeMaterial);
    hubMesh.rotation.x = Math.PI / 2;
    wheel.add(hubMesh);

    // Spokes (wire pattern)
    const spokeGeo = new THREE.CylinderGeometry(0.008, 0.008, radius * 1.85, 6);
    const spokeMat = chromeMaterial;
    const numSpokes = 20;
    for (let i = 0; i < numSpokes; i++) {
      const angle = (i / numSpokes) * Math.PI;
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = angle;
      spoke.position.z = (i % 2 === 0 ? 0.05 : -0.05);
      wheel.add(spoke);
    }

    // Brake Disc
    const brakeGeo = new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, 0.02, 24);
    const brakeMesh = new THREE.Mesh(brakeGeo, chromeMaterial);
    brakeMesh.rotation.x = Math.PI / 2;
    brakeMesh.position.z = 0.07;
    wheel.add(brakeMesh);

    return wheel;
  }

  // --- REAR WHEEL ---
  const rearWheel = createSpokedWheel(0.65, 0.18);
  rearWheel.position.set(-1.45, 0.65, 0);
  root.add(rearWheel);

  // --- FRONT FORK & STEER GROUP ---
  const forkGroup = new THREE.Group();
  forkGroup.position.set(1.3, 0.65, 0);

  const frontWheel = createSpokedWheel(0.65, 0.18);
  forkGroup.add(frontWheel);

  // Fork Stanchions / Telescopic suspension
  const forkLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.4, 16), chromeMaterial);
  forkLeft.position.set(-0.15, 0.6, 0.22);
  forkLeft.rotation.z = -0.32;
  forkLeft.castShadow = true;
  forkGroup.add(forkLeft);

  const forkRight = forkLeft.clone();
  forkRight.position.z = -0.22;
  forkGroup.add(forkRight);

  // Fork Lower Sliders (Black cast)
  const sliderLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 16), blackMetal);
  sliderLeft.position.set(-0.06, 0.3, 0.22);
  sliderLeft.rotation.z = -0.32;
  forkGroup.add(sliderLeft);

  const sliderRight = sliderLeft.clone();
  sliderRight.position.z = -0.22;
  forkGroup.add(sliderRight);

  // Front Mudguard (Fender)
  const fenderGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.24, 24, 1, true, -Math.PI * 0.2, Math.PI * 0.7);
  const fenderMesh = new THREE.Mesh(fenderGeo, paintMaterial);
  fenderMesh.rotation.x = Math.PI / 2;
  fenderMesh.position.set(0, 0, 0);
  fenderMesh.castShadow = true;
  forkGroup.add(fenderMesh);

  // Handlebars Crossbar & Risers
  const handlebarGroup = new THREE.Group();
  handlebarGroup.position.set(-0.35, 1.35, 0);

  const barCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 16), chromeMaterial);
  barCenter.rotation.x = Math.PI / 2;
  handlebarGroup.add(barCenter);

  // Rubber Hand Grips
  const gripL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.25, 16), leatherBlack);
  gripL.rotation.x = Math.PI / 2;
  gripL.position.z = 0.45;
  handlebarGroup.add(gripL);

  const gripR = gripL.clone();
  gripR.position.z = -0.45;
  handlebarGroup.add(gripR);

  // Chrome Mirrors
  const mirrorStemL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 8), chromeMaterial);
  mirrorStemL.position.set(-0.05, 0.16, 0.38);
  mirrorStemL.rotation.z = -0.3;
  handlebarGroup.add(mirrorStemL);

  const mirrorHeadL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 20), blackMetal);
  mirrorHeadL.position.set(-0.1, 0.28, 0.38);
  mirrorHeadL.rotation.z = Math.PI / 2;
  handlebarGroup.add(mirrorHeadL);

  const mirrorStemR = mirrorStemL.clone();
  mirrorStemR.position.z = -0.38;
  handlebarGroup.add(mirrorStemR);

  const mirrorHeadR = mirrorHeadL.clone();
  mirrorHeadR.position.z = -0.38;
  handlebarGroup.add(mirrorHeadR);

  // Front Halogen Headlight (Round vintage glass chrome bucket)
  const headlightBucket = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65), chromeMaterial);
  headlightBucket.position.set(0.12, 1.15, 0);
  headlightBucket.rotation.z = -Math.PI / 2;
  headlightBucket.castShadow = true;
  forkGroup.add(headlightBucket);

  const headlightLens = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), glassLens);
  headlightLens.position.set(0.24, 1.15, 0);
  headlightLens.rotation.y = Math.PI / 2;
  forkGroup.add(headlightLens);

  // Headlight Light Glow
  const headlightBulb = new THREE.PointLight(0xfff5c0, 2, 8);
  headlightBulb.position.set(0.35, 1.15, 0);
  forkGroup.add(headlightBulb);

  // Front Orange Indicators
  const indicatorL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 16), reflectorOrange);
  indicatorL.rotation.x = Math.PI / 2;
  indicatorL.position.set(0.08, 1.12, 0.26);
  forkGroup.add(indicatorL);

  const indicatorR = indicatorL.clone();
  indicatorR.position.z = -0.26;
  forkGroup.add(indicatorR);

  // Front Number Plate (Verified Nigerian Commercial plate)
  const plateGeo = new THREE.BoxGeometry(0.02, 0.12, 0.32);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const frontPlate = new THREE.Mesh(plateGeo, plateMat);
  frontPlate.position.set(0.22, 0.88, 0);
  forkGroup.add(frontPlate);

  // Add forkGroup to root
  root.add(forkGroup);

  // --- MOTORCYCLE FRAME & CHASSIS ---
  const frameGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 12);
  const spineFrame = new THREE.Mesh(frameGeo, blackMetal);
  spineFrame.position.set(0.1, 1.1, 0);
  spineFrame.rotation.z = Math.PI / 2.35;
  spineFrame.castShadow = true;
  root.add(spineFrame);

  // Lower cradle tubes
  const cradleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.5, 10);
  const cradleLeft = new THREE.Mesh(cradleGeo, blackMetal);
  cradleLeft.position.set(-0.2, 0.5, 0.16);
  cradleLeft.rotation.z = Math.PI / 2;
  root.add(cradleLeft);

  const cradleRight = cradleLeft.clone();
  cradleRight.position.z = -0.16;
  root.add(cradleRight);

  // Swingarm to rear wheel
  const swingarmGeo = new THREE.BoxGeometry(1.2, 0.08, 0.05);
  const swingarmL = new THREE.Mesh(swingarmGeo, blackMetal);
  swingarmL.position.set(-0.85, 0.65, 0.14);
  root.add(swingarmL);

  const swingarmR = swingarmL.clone();
  swingarmR.position.z = -0.14;
  root.add(swingarmR);

  // Rear Dual Shock Absorbers with Red/Chrome Springs
  const shockGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12);
  const shockL = new THREE.Mesh(shockGeo, chromeMaterial);
  shockL.position.set(-1.15, 0.95, 0.2);
  shockL.rotation.z = -0.4;
  root.add(shockL);

  const shockR = shockL.clone();
  shockR.position.z = -0.2;
  root.add(shockR);

  // --- ENGINE BLOCK (Bajaj BM 150cc 4-Stroke Air-Cooled) ---
  const engineGroup = new THREE.Group();
  engineGroup.position.set(-0.05, 0.72, 0);

  // Crankcase
  const crankcase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.38), darkEngine);
  crankcase.castShadow = true;
  engineGroup.add(crankcase);

  // Cylinder with cooling fins
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16), darkEngine);
  cylinder.position.set(0.1, 0.28, 0);
  cylinder.rotation.z = -0.3;
  cylinder.castShadow = true;
  engineGroup.add(cylinder);

  // Cooling fins rings
  for (let f = 0; f < 6; f++) {
    const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 16), chromeMaterial);
    fin.position.set(0.06 + f * 0.04, 0.22 + f * 0.04, 0);
    fin.rotation.z = -0.3;
    engineGroup.add(fin);
  }

  // Carburettor & Air filter box
  const carb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.22), chromeMaterial);
  carb.position.set(-0.22, 0.3, 0);
  engineGroup.add(carb);

  // Kick Starter
  const kickStarter = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), chromeMaterial);
  kickStarter.position.set(-0.15, 0.05, 0.24);
  kickStarter.rotation.x = 0.5;
  kickStarter.rotation.z = -0.6;
  engineGroup.add(kickStarter);

  // Full Enclosed Chain Guard (Iconic Bajaj feature)
  const chainGuard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.07), blackMetal);
  chainGuard.position.set(-0.75, 0.65, -0.16);
  chainGuard.castShadow = true;
  root.add(chainGuard);

  root.add(engineGroup);

  // --- EXHAUST SYSTEM (Chrome Header & Long Silencer) ---
  const exhaustHeader = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 12), chromeMaterial);
  exhaustHeader.position.set(0.2, 0.5, 0.18);
  exhaustHeader.rotation.z = 0.8;
  root.add(exhaustHeader);

  const exhaustSilencer = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 1.45, 16), chromeMaterial);
  exhaustSilencer.position.set(-0.65, 0.5, 0.24);
  exhaustSilencer.rotation.z = Math.PI / 2 - 0.15;
  exhaustSilencer.castShadow = true;
  root.add(exhaustSilencer);

  // Exhaust Heat Shield (Perforated guard)
  const heatShield = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.6, 16, 1, true, 0, Math.PI), chromeMaterial);
  heatShield.position.set(-0.45, 0.52, 0.24);
  heatShield.rotation.z = Math.PI / 2 - 0.15;
  heatShield.rotation.y = Math.PI / 2;
  root.add(heatShield);

  // --- FUEL TANK (Iconic Teardrop Shape) ---
  const tankGeo = new THREE.SphereGeometry(0.42, 24, 16);
  tankGeo.scale(1.5, 0.85, 0.75);
  const tankMesh = new THREE.Mesh(tankGeo, paintMaterial);
  tankMesh.position.set(0.28, 1.35, 0);
  tankMesh.castShadow = true;
  root.add(tankMesh);

  // Chrome Fuel Filler Cap
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), chromeMaterial);
  capMesh.position.set(0.35, 1.62, 0);
  root.add(capMesh);

  // Tank Emblem / Stripe
  const stripeGeo = new THREE.BoxGeometry(0.4, 0.08, 0.66);
  const tankStripe = new THREE.Mesh(stripeGeo, chromeMaterial);
  tankStripe.position.set(0.26, 1.32, 0);
  root.add(tankStripe);

  // --- SEAT (Long Dual Passenger Contoured Leather) ---
  const seatGeo = new THREE.BoxGeometry(1.15, 0.16, 0.44);
  const seatMesh = new THREE.Mesh(seatGeo, leatherBlack);
  seatMesh.position.set(-0.52, 1.32, 0);
  seatMesh.rotation.z = -0.06;
  seatMesh.castShadow = true;
  root.add(seatMesh);

  // Passenger Grab Strap
  const strapGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 16, 1, true);
  const strapMesh = new THREE.Mesh(strapGeo, blackMetal);
  strapMesh.rotation.z = Math.PI / 2;
  strapMesh.position.set(-0.35, 1.35, 0);
  root.add(strapMesh);

  // --- TUBULAR CRASH GUARD (Front Leg Protector with safety reflector) ---
  const crashBarGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.95, 12);
  const crashBar = new THREE.Mesh(crashBarGeo, chromeMaterial);
  crashBar.rotation.x = Math.PI / 2;
  crashBar.position.set(0.35, 0.8, 0);
  crashBar.castShadow = true;
  root.add(crashBar);

  // Red/White hazard stripe indicators on crash bar
  const tapeL = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.25, 12), reflectorRed);
  tapeL.rotation.x = Math.PI / 2;
  tapeL.position.set(0.35, 0.8, 0.35);
  root.add(tapeL);

  const tapeR = tapeL.clone();
  tapeR.position.z = -0.35;
  root.add(tapeR);

  // --- REAR CARGO RACK (Heavy Welded Steel Carrier) ---
  const rackFrameGeo = new THREE.BoxGeometry(0.65, 0.04, 0.48);
  const rackFrame = new THREE.Mesh(rackFrameGeo, chromeMaterial);
  rackFrame.position.set(-1.22, 1.34, 0);
  rackFrame.castShadow = true;
  root.add(rackFrame);

  // Rack upright stays
  const stayL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8), chromeMaterial);
  stayL.position.set(-1.35, 1.05, 0.18);
  stayL.rotation.z = 0.4;
  root.add(stayL);

  const stayR = stayL.clone();
  stayR.position.z = -0.18;
  root.add(stayR);

  // Rear Fender
  const rearFenderGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.26, 24, 1, true, Math.PI * 0.45, Math.PI * 0.7);
  const rearFender = new THREE.Mesh(rearFenderGeo, paintMaterial);
  rearFender.rotation.x = Math.PI / 2;
  rearFender.position.set(-1.45, 0.65, 0);
  rearFender.castShadow = true;
  root.add(rearFender);

  // Rear Brake Lamp & Turn Signals
  const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.16), reflectorRed);
  tailLight.position.set(-1.58, 1.2, 0);
  tailLight.castShadow = true;
  root.add(tailLight);

  const rearIndicatorL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12), reflectorOrange);
  rearIndicatorL.rotation.x = Math.PI / 2;
  rearIndicatorL.position.set(-1.54, 1.18, 0.18);
  root.add(rearIndicatorL);

  const rearIndicatorR = rearIndicatorL.clone();
  rearIndicatorR.position.z = -0.18;
  root.add(rearIndicatorR);

  // Rear License Plate
  const rearPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.3), plateMat);
  rearPlate.position.set(-1.62, 0.98, 0);
  root.add(rearPlate);

  // Ground contact centering: offset so the wheels rest nicely at y=0
  root.position.y = -0.65;

  return { rootGroup: root, frontWheel, rearWheel, forkGroup } as any;
}

/**
 * Creates an authentic 3D Nigerian Keke Tricycle (Bajaj RE 200cc style).
 * Features commercial yellow bodywork, Akwa Ibom green transit stripe,
 * driver cabin with handlebar, 3-passenger rear cushioned bench,
 * black vinyl weather canopy roof, and rear mounted spare tire!
 */
export function createKeke3DModel(): {
  rootGroup: THREE.Group;
  frontWheel: THREE.Group;
  rearLeftWheel: THREE.Group;
  rearRightWheel: THREE.Group;
  steerGroup: THREE.Group;
} {
  const root = new THREE.Group();

  // Materials
  const yellowPaint = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Commercial Nigerian transit yellow
    metalness: 0.5,
    roughness: 0.35,
  });

  const greenStripe = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Akwa Ibom State Transit Green Livery
    metalness: 0.4,
    roughness: 0.3,
  });

  const blackCanopy = new THREE.MeshStandardMaterial({
    color: 0x18181b, // Heavy-duty waterproof vinyl roof
    roughness: 0.92,
    metalness: 0.05,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.95,
    roughness: 0.15,
  });

  const blackChassis = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.5,
  });

  const tireRubber = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.1,
    roughness: 0.85,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.6,
    roughness: 0.08,
    transmission: 0.9,
    ior: 1.5,
  });

  const seatVinyl = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.85,
    metalness: 0.1,
  });

  const reflectorRed = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.3,
  });

  const reflectorOrange = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.25,
  });

  function createTricycleWheel(radius: number, width: number): THREE.Group {
    const wheel = new THREE.Group();

    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
    const tire = new THREE.Mesh(tireGeo, tireRubber);
    tire.rotation.x = Math.PI / 2;
    tire.castShadow = true;
    tire.receiveShadow = true;
    wheel.add(tire);

    // Steel Hub
    const hubGeo = new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width * 1.05, 16);
    const hub = new THREE.Mesh(hubGeo, chromeMaterial);
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);

    // 4 Lug nuts
    for (let i = 0; i < 4; i++) {
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6), chromeMaterial);
      nut.rotation.x = Math.PI / 2;
      const angle = (i / 4) * Math.PI * 2;
      nut.position.set(Math.cos(angle) * radius * 0.3, Math.sin(angle) * radius * 0.3, width * 0.55);
      wheel.add(nut);
    }

    return wheel;
  }

  // --- REAR AXLE & REAR WHEELS ---
  const rearLeftWheel = createTricycleWheel(0.48, 0.22);
  rearLeftWheel.position.set(-1.15, 0.48, 0.78);
  root.add(rearLeftWheel);

  const rearRightWheel = createTricycleWheel(0.48, 0.22);
  rearRightWheel.position.set(-1.15, 0.48, -0.78);
  root.add(rearRightWheel);

  // Rear Axle Beam & Differential
  const axleGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.55, 12);
  const axle = new THREE.Mesh(axleGeo, blackChassis);
  axle.rotation.x = Math.PI / 2;
  axle.position.set(-1.15, 0.48, 0);
  root.add(axle);

  const diffGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const diff = new THREE.Mesh(diffGeo, blackChassis);
  diff.position.set(-1.15, 0.48, 0);
  root.add(diff);

  // --- FRONT STEER GROUP & SINGLE FRONT WHEEL ---
  const steerGroup = new THREE.Group();
  steerGroup.position.set(1.4, 0.48, 0);

  const frontWheel = createTricycleWheel(0.48, 0.2);
  steerGroup.add(frontWheel);

  // Front Single Fork Stanchion (Trailing link suspension)
  const frontFork = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.15, 16), chromeMaterial);
  frontFork.position.set(-0.1, 0.5, 0.16);
  frontFork.rotation.z = -0.3;
  steerGroup.add(frontFork);

  // Front Mudguard (Yellow curved apron fender)
  const frontFender = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.56, 0.28, 20, 1, true, -Math.PI * 0.2, Math.PI * 0.75),
    yellowPaint
  );
  frontFender.rotation.x = Math.PI / 2;
  frontFender.position.set(0, 0, 0);
  frontFender.castShadow = true;
  steerGroup.add(frontFender);

  root.add(steerGroup);

  // --- LOWER STEEL CHASSIS TUBES & FLOOR ---
  const floorGeo = new THREE.BoxGeometry(2.5, 0.08, 1.55);
  const floorMesh = new THREE.Mesh(floorGeo, blackChassis);
  floorMesh.position.set(0.05, 0.42, 0);
  floorMesh.castShadow = true;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  // --- MAIN CABIN BODYWORK (Curved steel lower shell) ---
  // Rear tub (Passenger compartment tub)
  const tubGeo = new THREE.BoxGeometry(1.6, 0.75, 1.56);
  const rearTub = new THREE.Mesh(tubGeo, yellowPaint);
  rearTub.position.set(-0.6, 0.78, 0);
  rearTub.castShadow = true;
  root.add(rearTub);

  // Akwa Ibom State Transit Green Livery Band around passenger tub
  const greenBandGeo = new THREE.BoxGeometry(1.62, 0.18, 1.58);
  const greenBand = new THREE.Mesh(greenBandGeo, greenStripe);
  greenBand.position.set(-0.6, 0.88, 0);
  root.add(greenBand);

  // Front Cowling / Nose apron
  const noseGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.82, 16, 1, false, -Math.PI / 2, Math.PI);
  const noseMesh = new THREE.Mesh(noseGeo, yellowPaint);
  noseMesh.rotation.y = Math.PI / 2;
  noseMesh.position.set(0.85, 0.82, 0);
  noseMesh.scale.set(0.7, 1, 0.98);
  noseMesh.castShadow = true;
  root.add(noseMesh);

  // Front Green stripe on nose
  const noseStripeGeo = new THREE.CylinderGeometry(0.79, 0.79, 0.18, 16, 1, false, -Math.PI / 2, Math.PI);
  const noseStripe = new THREE.Mesh(noseStripeGeo, greenStripe);
  noseStripe.rotation.y = Math.PI / 2;
  noseStripe.position.set(0.85, 0.88, 0);
  noseStripe.scale.set(0.71, 1, 0.99);
  root.add(noseStripe);

  // Front Headlight Pod (Single central rectangular or pod lamp)
  const headlightPod = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.32), chromeMaterial);
  headlightPod.position.set(1.42, 0.96, 0);
  headlightPod.castShadow = true;
  root.add(headlightPod);

  const headlightGlow = new THREE.PointLight(0xfff5c0, 2, 8);
  headlightGlow.position.set(1.55, 0.96, 0);
  root.add(headlightGlow);

  // Front Indicators
  const indL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), reflectorOrange);
  indL.rotation.x = Math.PI / 2;
  indL.position.set(1.35, 0.96, 0.35);
  root.add(indL);

  const indR = indL.clone();
  indR.position.z = -0.35;
  root.add(indR);

  // Front Number Plate (KJA-789-LG)
  const kekeFrontPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.36), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
  kekeFrontPlate.position.set(1.42, 0.68, 0);
  root.add(kekeFrontPlate);

  // --- WINDSHIELD & SAFETY GLASS ---
  // Windshield frame
  const wsFrameGeo = new THREE.BoxGeometry(0.08, 0.75, 1.48);
  const wsFrame = new THREE.Mesh(wsFrameGeo, blackChassis);
  wsFrame.position.set(0.68, 1.55, 0);
  wsFrame.rotation.z = -0.22;
  root.add(wsFrame);

  // Safety Glass
  const glassGeo = new THREE.BoxGeometry(0.02, 0.68, 1.38);
  const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
  glassMesh.position.set(0.68, 1.55, 0);
  glassMesh.rotation.z = -0.22;
  root.add(glassMesh);

  // Windshield Wiper
  const wiperArm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.35, 0.02), blackChassis);
  wiperArm.position.set(0.72, 1.55, 0.12);
  wiperArm.rotation.z = -0.45;
  root.add(wiperArm);

  const wiperBlade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.32, 0.015), blackChassis);
  wiperBlade.position.set(0.74, 1.62, 0.22);
  wiperBlade.rotation.z = -0.3;
  root.add(wiperBlade);

  // --- CABIN INTERIOR ---
  // Driver Seat
  const driverSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.48), seatVinyl);
  driverSeat.position.set(0.18, 0.65, 0);
  driverSeat.castShadow = true;
  root.add(driverSeat);

  // Driver Handlebar & Dashboard Pod
  const dashPod = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.55), blackChassis);
  dashPod.position.set(0.55, 1.15, 0);
  root.add(dashPod);

  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 12), chromeMaterial);
  handleBar.rotation.x = Math.PI / 2;
  handleBar.position.set(0.5, 1.25, 0);
  root.add(handleBar);

  // Rear 3-Passenger Cushioned Bench Seat
  const rearSeatBase = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 1.45), seatVinyl);
  rearSeatBase.position.set(-0.95, 0.68, 0);
  rearSeatBase.castShadow = true;
  root.add(rearSeatBase);

  const rearSeatBack = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 1.45), seatVinyl);
  rearSeatBack.position.set(-1.22, 1.05, 0);
  rearSeatBack.castShadow = true;
  root.add(rearSeatBack);

  // --- TUBULAR ROLL-CAGE PILLARS & CANOPY FRAME ---
  const pillarMat = blackChassis;
  const pillarGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.25, 10);

  // Front Left Pillar
  const fPillarL = new THREE.Mesh(pillarGeo, pillarMat);
  fPillarL.position.set(0.65, 1.62, 0.74);
  fPillarL.rotation.z = -0.15;
  root.add(fPillarL);

  const fPillarR = fPillarL.clone();
  fPillarR.position.z = -0.74;
  root.add(fPillarR);

  // Rear Left Pillar
  const rPillarL = new THREE.Mesh(pillarGeo, pillarMat);
  rPillarL.position.set(-1.35, 1.62, 0.74);
  root.add(rPillarL);

  const rPillarR = rPillarL.clone();
  rPillarR.position.z = -0.74;
  root.add(rPillarR);

  // Center Door Opening Pillars
  const mPillarL = new THREE.Mesh(pillarGeo, pillarMat);
  mPillarL.position.set(-0.35, 1.62, 0.74);
  root.add(mPillarL);

  const mPillarR = mPillarL.clone();
  mPillarR.position.z = -0.74;
  root.add(mPillarR);

  // --- WATERPROOF CANOPY VINYL ROOF ---
  const roofGeo = new THREE.BoxGeometry(2.35, 0.12, 1.62);
  const roofMesh = new THREE.Mesh(roofGeo, blackCanopy);
  roofMesh.position.set(-0.35, 2.22, 0);
  roofMesh.castShadow = true;
  roofMesh.receiveShadow = true;
  root.add(roofMesh);

  // Rolled weather rain curtains on sides
  const curtainGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.5, 12);
  const curtainL = new THREE.Mesh(curtainGeo, blackCanopy);
  curtainL.rotation.z = Math.PI / 2;
  curtainL.position.set(-0.35, 2.15, 0.78);
  root.add(curtainL);

  const curtainR = curtainL.clone();
  curtainR.position.z = -0.78;
  root.add(curtainR);

  // Rear Vinyl Window (Transparent slit in canopy)
  const rearCanopyPanel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 1.58), blackCanopy);
  rearCanopyPanel.position.set(-1.42, 1.85, 0);
  root.add(rearCanopyPanel);

  const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 0.95), glassMaterial);
  rearWindow.position.set(-1.42, 1.85, 0);
  root.add(rearWindow);

  // --- REAR IMPACT BUMPER & MOUNTED SPARE TYRE ---
  const bumperGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.65, 12);
  const rearBumper = new THREE.Mesh(bumperGeo, chromeMaterial);
  rearBumper.rotation.x = Math.PI / 2;
  rearBumper.position.set(-1.45, 0.48, 0);
  rearBumper.castShadow = true;
  root.add(rearBumper);

  // Mounted Spare Tyre on rear tailgate
  const spareWheel = createTricycleWheel(0.44, 0.18);
  spareWheel.rotation.y = Math.PI / 2;
  spareWheel.position.set(-1.48, 0.98, 0);
  root.add(spareWheel);

  // Spare Wheel Vinyl Cover with "BAJAJ RE" emblem
  const spareCoverGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 24);
  const spareCover = new THREE.Mesh(spareCoverGeo, blackCanopy);
  spareCover.rotation.z = Math.PI / 2;
  spareCover.position.set(-1.58, 0.98, 0);
  root.add(spareCover);

  // Rear Tail Lights
  const rearTailL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.22), reflectorRed);
  rearTailL.position.set(-1.42, 0.72, 0.68);
  root.add(rearTailL);

  const rearTailR = rearTailL.clone();
  rearTailR.position.z = -0.68;
  root.add(rearTailR);

  // Rear Verified License Plate
  const kekeRearPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.36), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
  kekeRearPlate.position.set(-1.42, 0.55, 0);
  root.add(kekeRearPlate);

  // Ground centering
  root.position.y = -0.48;

  return { rootGroup: root, frontWheel, rearLeftWheel, rearRightWheel, steerGroup } as any;
}
