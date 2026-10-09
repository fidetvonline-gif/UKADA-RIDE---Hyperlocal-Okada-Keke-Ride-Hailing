// Web Audio API Synthesizer for In-App Direct Voice Calls
// No third-party plugins, zero external audio asset dependencies

class CallAudioService {
  private ctx: AudioContext | null = null;
  private ringOsc1: OscillatorNode | null = null;
  private ringOsc2: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: number | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play realistic dual-tone telephone ringing (440Hz + 480Hz)
  startOutgoingRinging() {
    this.stopRinging();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const playBurst = () => {
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.2);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);

        osc1.stop(ctx.currentTime + 1.35);
        osc2.stop(ctx.currentTime + 1.35);
      } catch (e) {
        console.warn('Audio synthesis error:', e);
      }
    };

    playBurst();
    this.ringInterval = window.setInterval(playBurst, 3000);
  }

  // Stop ringing sound
  stopRinging() {
    if (this.ringInterval !== null) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Play upbeat connected chime
  playConnectedChime() {
    this.stopRinging();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn('Connected chime error:', e);
    }
  }

  // Play call ended tone
  playCallEndTone() {
    this.stopRinging();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.setValueAtTime(320, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Call end tone error:', e);
    }
  }

  // Optional realistic driver voice greeting using SpeechSynthesis
  speakDriverGreeting(driverName: string, vehicleType: string, pickupLandmark: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const text = `Hello! This is ${driverName}, your ${vehicleType === 'okada' ? 'Okada rider' : 'Keke driver'}. I am currently on my way to ${pickupLandmark}. Please look out for my vehicle, I'll be there in a moment!`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Driver greeting speech error:', e);
    }
  }

  // Quick driver automated acknowledgement when passenger sends a quick in-call message
  speakDriverReply(replyText: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(replyText);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Driver reply speech error:', e);
    }
  }
}

export const callAudio = new CallAudioService();
