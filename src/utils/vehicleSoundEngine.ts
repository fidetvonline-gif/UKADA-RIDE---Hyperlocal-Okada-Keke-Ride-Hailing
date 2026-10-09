// Synthesizer for Authentic Nigerian Okada & Keke Engine and Horn Audio
// Zero external files - 100% Web Audio API reliable in browser and iframes

class VehicleAudioEngine {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning: boolean = false;
  private vehicleType: 'okada' | 'keke' = 'okada';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public startEngine(type: 'okada' | 'keke') {
    this.initContext();
    if (!this.ctx) return;
    this.stopEngine();

    this.vehicleType = type;
    const now = this.ctx.currentTime;

    // Create primary engine oscillator (sawtooth for combustion thumps)
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';

    // Sub-harmonic oscillator for low-frequency engine vibration
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'triangle';

    // Low-pass filter to simulate engine block enclosure
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';

    if (type === 'okada') {
      // Bajaj Boxer 150cc 4-stroke thumping idle (~28-32 Hz base pulse)
      this.engineOsc.frequency.setValueAtTime(32, now);
      this.subOsc.frequency.setValueAtTime(16, now);
      filter.frequency.setValueAtTime(180, now);
    } else {
      // Keke Bajaj RE 200cc rapid putt-putt idle (~22-26 Hz)
      this.engineOsc.frequency.setValueAtTime(26, now);
      this.subOsc.frequency.setValueAtTime(13, now);
      filter.frequency.setValueAtTime(150, now);
    }

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.001, now);
    this.engineGain.gain.exponentialRampToValueAtTime(0.08, now + 0.3);

    this.engineOsc.connect(filter);
    this.subOsc.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc.start(now);
    this.subOsc.start(now);
    this.isEngineRunning = true;
  }

  public stopEngine() {
    if (!this.ctx || !this.isEngineRunning) return;
    try {
      if (this.engineGain) {
        const now = this.ctx.currentTime;
        this.engineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        setTimeout(() => {
          this.engineOsc?.stop();
          this.subOsc?.stop();
          this.engineOsc?.disconnect();
          this.subOsc?.disconnect();
          this.engineOsc = null;
          this.subOsc = null;
          this.isEngineRunning = false;
        }, 220);
      }
    } catch {
      this.isEngineRunning = false;
    }
  }

  public toggleEngine(type: 'okada' | 'keke'): boolean {
    if (this.isEngineRunning) {
      this.stopEngine();
      return false;
    } else {
      this.startEngine(type);
      return true;
    }
  }

  // Authentic Nigerian dual-tone commercial vehicle horn ("Pip-Pip!")
  public playHorn(type: 'okada' | 'keke') {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';

    if (type === 'okada') {
      // Sharp motorcycle horn (420Hz + 480Hz)
      osc1.frequency.setValueAtTime(420, now);
      osc2.frequency.setValueAtTime(485, now);
    } else {
      // Piercing commercial Keke buzzer horn (380Hz + 440Hz)
      osc1.frequency.setValueAtTime(380, now);
      osc2.frequency.setValueAtTime(440, now);
    }

    gain.gain.setValueAtTime(0.15, now);
    // Double beep pattern: beep... short gap... beep
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.setValueAtTime(0, now + 0.12);
    gain.gain.setValueAtTime(0.18, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  public isRunning(): boolean {
    return this.isEngineRunning;
  }
}

export const vehicleSoundEngine = new VehicleAudioEngine();
