// Web Audio API Synthesizer & Speech Engine for Direct In-App VoIP Calls
// Zero external media files needed - 100% reliable inside browser & iframes

class CallAudioEngine {
  private ctx: AudioContext | null = null;
  private ringOsc1: OscillatorNode | null = null;
  private ringOsc2: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: number | null = null;
  private isRinging: boolean = false;
  private micStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;

  private initCtx(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play outgoing ringing tone (Standard ring-back tone: 400Hz + 450Hz dual tone cadence)
  startOutgoingRinging() {
    this.stopRinging();
    const ctx = this.initCtx();
    this.isRinging = true;

    const playBurst = () => {
      if (!this.isRinging || ctx.state === 'closed') return;
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(400, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0, now);
        // Fade in
        gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
        // Ring for 1.2 seconds
        gain.gain.setValueAtTime(0.12, now + 1.2);
        // Fade out
        gain.gain.linearRampToValueAtTime(0, now + 1.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.3);
        osc2.stop(now + 1.3);
      } catch (err) {
        console.warn('Audio burst error', err);
      }
    };

    playBurst();
    // Repeat every 3 seconds
    this.ringInterval = window.setInterval(playBurst, 3000);
  }

  // Play incoming ringtone for receiver (Driver or Passenger)
  startIncomingRingtone() {
    this.stopRinging();
    const ctx = this.initCtx();
    this.isRinging = true;

    const playMelody = () => {
      if (!this.isRinging || ctx.state === 'closed') return;
      try {
        const now = ctx.currentTime;
        const notes = [587.33, 659.25, 783.99, 880.0, 1046.5]; // D5, E5, G5, A5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + i * 0.14;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + 0.2);
        });
      } catch (err) {
        console.warn('Incoming melody error', err);
      }
    };

    playMelody();
    this.ringInterval = window.setInterval(playMelody, 2200);
  }

  // Stop any active ringing tone
  stopRinging() {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Play ascending connected chime
  playCallConnected() {
    this.stopRinging();
    const ctx = this.initCtx();
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {
      // Ignore
    }
  }

  // Play descending disconnect tone
  playCallEnded() {
    this.stopRinging();
    const ctx = this.initCtx();
    try {
      const now = ctx.currentTime;
      [440, 349.23, 261.63].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.12;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {
      // Ignore
    }
  }

  // Play authentic DTMF keypad tone (for dialpad button presses)
  playDTMFTone(key: string) {
    const ctx = this.initCtx();
    const dtmfFreqs: Record<string, [number, number]> = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '*': [941, 1209],
      '0': [941, 1336],
      '#': [941, 1477],
    };

    const freqs = dtmfFreqs[key];
    if (!freqs) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(freqs[0], now);
      osc2.frequency.setValueAtTime(freqs[1], now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  // Attempt real microphone stream for audio visualizer
  async setupMicrophone(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micStream = stream;
      const ctx = this.initCtx();
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.micSource = ctx.createMediaStreamSource(stream);
      this.micSource.connect(this.analyser);
      return true;
    } catch {
      // Microphone access denied or in restricted iframe - fallback works automatically
      return false;
    }
  }

  getAudioFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.analyser = null;
  }

  // Realistic synthesized voice response from Driver
  speakDriverResponse(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95; // Slightly deeper, natural tone

      // Try selecting English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en-NG') ||
          v.lang.startsWith('en-GB') ||
          v.lang.startsWith('en-US')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        onStart?.();
      };
      utterance.onend = () => {
        onEnd?.();
      };
      utterance.onerror = () => {
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const callAudioEngine = new CallAudioEngine();
