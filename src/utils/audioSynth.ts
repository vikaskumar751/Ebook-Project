// Web Audio API ambient synthesizer for Binaural & Cyber Focus Drones

class DroneAudioEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private currentTrackId: string | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(trackId: string, baseFreq: number = 108): boolean {
    try {
      this.init();
      if (!this.ctx) return false;

      this.stop();

      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // Low pass filter with subtle warmth
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, now);
      this.filter.Q.setValueAtTime(3, now);
      this.filter.connect(this.masterGain);

      // Osc 1 (fundamental)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(baseFreq, now);
      this.osc1.connect(this.filter);

      // Osc 2 (Binaural offset: +7.83Hz Schumann / Theta beat)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(baseFreq + 7.83, now);
      this.osc2.connect(this.filter);

      // Sub Osc (one octave below)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'triangle';
      this.subOsc.frequency.setValueAtTime(baseFreq / 2, now);
      this.subOsc.connect(this.masterGain);

      this.osc1.start(now);
      this.osc2.start(now);
      this.subOsc.start(now);

      this.isRunning = true;
      this.currentTrackId = trackId;
      return true;
    } catch {
      return false;
    }
  }

  public stop() {
    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        setTimeout(() => {
          if (this.osc1) {
            try { this.osc1.stop(); this.osc1.disconnect(); } catch { /* ignore */ }
            this.osc1 = null;
          }
          if (this.osc2) {
            try { this.osc2.stop(); this.osc2.disconnect(); } catch { /* ignore */ }
            this.osc2 = null;
          }
          if (this.subOsc) {
            try { this.subOsc.stop(); this.subOsc.disconnect(); } catch { /* ignore */ }
            this.subOsc = null;
          }
        }, 550);
      } catch {
        // ignore error
      }
    }
    this.isRunning = false;
    this.currentTrackId = null;
  }

  public getStatus() {
    return {
      isPlaying: this.isRunning,
      trackId: this.currentTrackId
    };
  }

  public playBeep(freq: number = 880, duration: number = 0.08) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }
}

export const droneEngine = new DroneAudioEngine();
