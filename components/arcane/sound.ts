// Ambient sound, generated in the browser with Web Audio (no audio files).
// A low drone through a slowly breathing filter, plus a soft chime when the
// film changes chapter. Off until the visitor turns it on.

const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // C major pentatonic

class ArcaneSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private delay: DelayNode | null = null;
  on = false;

  private build() {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Echo for the chimes.
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.38;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.42;
    delay.connect(feedback).connect(delay);
    delay.connect(master);

    // Drone: two detuned saws and a sine an octave down, into a lowpass.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    filter.Q.value = 6;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.05;
    filter.connect(droneGain).connect(master);
    for (const [type, freq, detune] of [
      ["sawtooth", 55, -7],
      ["sawtooth", 55, 7],
      ["sine", 27.5, 0],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(filter);
      o.start();
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    this.ctx = ctx;
    this.master = master;
    this.delay = delay;
  }

  toggle() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    this.on = !this.on;
    if (this.on) ctx.resume();
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.setTargetAtTime(this.on ? 0.9 : 0, ctx.currentTime, 0.4);
    if (this.on) this.chime(2);
    return this.on;
  }

  chime(count = 1) {
    if (!this.on || !this.ctx) return;
    const ctx = this.ctx;
    for (let i = 0; i < count; i++) {
      const t = ctx.currentTime + i * 0.12;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = NOTES[(Math.random() * NOTES.length) | 0];
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g);
      g.connect(this.master!);
      g.connect(this.delay!);
      o.start(t);
      o.stop(t + 1.7);
    }
  }
}

export const sound = typeof window === "undefined" ? null : new ArcaneSound();
