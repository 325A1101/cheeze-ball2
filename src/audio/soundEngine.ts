/**
 * Web Audio API Sound Engine & Sound Effects for Festival Cheese Ball Booth
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimeoutId: number | null = null;
  private currentStep = 0;
  private userAudioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  public analyser: AnalyserNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.4;
      this.bgmGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Sound Effects ---

  // 1. Hot oil frying sizzle (揚げたてサクサクジュワ〜)
  public playFrySound(duration = 1.2) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Pinkish noise with crackles
        const white = Math.random() * 2 - 1;
        const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 2.5 : 0;
        data[i] = white * 0.4 + crackle;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      noise.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 2. Cheese Stretch Boing (ビヨヨ〜ン)
  public playStretchSound(factor = 1.0) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 220 + factor * 80;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, this.ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {
      // Safe fallback
    }
  }

  // 3. Roulette tick (カチッ)
  public playTickSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Safe fallback
    }
  }

  // 4. Jackpot Win Fanfare (大当たりファンファーレ！)
  public playJackpotSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const time = this.ctx!.currentTime + index * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (index === 3 ? 0.7 : 0.25));

        osc.connect(gain);
        gain.connect(this.analyser || this.ctx!.destination);

        osc.start(time);
        osc.stop(time + (index === 3 ? 0.7 : 0.25));
      });
    } catch {
      // Safe fallback
    }
  }

  // 5. Cash Register Ding (レジ確定音)
  public playRegisterSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(2100, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.6);
      osc2.stop(this.ctx.currentTime + 0.6);
    } catch {
      // Safe fallback
    }
  }

  // 6. Crowd Cheer / Whistle / Shout
  public playCheerSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Whistle sweep
      const whistle = this.ctx.createOscillator();
      const wGain = this.ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(900, this.ctx.currentTime);
      whistle.frequency.linearRampToValueAtTime(1800, this.ctx.currentTime + 0.18);
      whistle.frequency.linearRampToValueAtTime(1300, this.ctx.currentTime + 0.35);

      wGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      wGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      whistle.connect(wGain);
      wGain.connect(this.analyser || this.ctx.destination);
      whistle.start();
      whistle.stop(this.ctx.currentTime + 0.4);

      // Noise wash
      this.playFrySound(0.8);
    } catch {
      // Safe fallback
    }
  }

  // 7. Pop / Click
  public playPopSound(freq = 600) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Safe fallback
    }
  }

  // --- High Energy Built-in Festival Synth BGM (140 BPM) ---
  // Matches the exact upbeat 4/4 festival groove of the song:
  // "Hey! Hey! Ho! Let's go! 1 2 3 Go! チーズボール！"
  public startBuiltinBgm(onBeat?: (step: number) => void) {
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;
    if (this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    this.currentStep = 0;

    const tempo = 142; // Fast energetic festival tempo
    const stepDuration = 60 / tempo / 4; // 16th note

    // Catchy Japanese pop festival melody notes (in Hz)
    // Scale: A Major / F# Minor bouncy pentatonic/pop
    const melodyPattern = [
      // Bar 1: "お腹が空いたら〜"
      554.37, 0, 659.25, 0, 739.99, 739.99, 659.25, 554.37,
      659.25, 0, 554.37, 440.0, 440.0, 0, 493.88, 554.37,
      // Bar 2: "みんなの笑顔が〜"
      659.25, 0, 739.99, 0, 880.00, 880.00, 739.99, 659.25,
      554.37, 659.25, 739.99, 0, 880.00, 0, 739.99, 0,
      // Bar 3: "熱々の魔法を〜"
      554.37, 554.37, 659.25, 0, 739.99, 739.99, 880.00, 0,
      987.77, 880.00, 739.99, 659.25, 739.99, 0, 659.25, 0,
      // Bar 4: "Go Go チーズボール！"
      880.00, 0, 880.00, 0, 987.77, 0, 1108.73, 0,
      880.00, 739.99, 659.25, 554.37, 659.25, 739.99, 880.00, 0
    ];

    const bassPattern = [
      220.0, 0, 220.0, 0, 293.66, 0, 293.66, 0,
      329.63, 0, 329.63, 0, 220.0, 0, 246.94, 0,
      220.0, 0, 220.0, 0, 293.66, 0, 293.66, 0,
      329.63, 0, 329.63, 0, 220.0, 220.0, 277.18, 0
    ];

    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const time = this.ctx.currentTime;
      const stepIdx = this.currentStep % melodyPattern.length;
      const bassIdx = this.currentStep % bassPattern.length;

      // Notify external beat listener (for visualizer & dancing animations)
      if (onBeat) {
        onBeat(this.currentStep);
      }

      // 1. Kick on every quarter note (step % 4 === 0)
      if (this.currentStep % 4 === 0) {
        const kick = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(160, time);
        kick.frequency.exponentialRampToValueAtTime(45, time + 0.09);

        kGain.gain.setValueAtTime(0.4, time);
        kGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

        kick.connect(kGain);
        kGain.connect(this.bgmGain);
        kick.start(time);
        kick.stop(time + 0.12);
      }

      // 2. Snare / Clap on beats 2 and 4 (step % 8 === 4)
      if (this.currentStep % 8 === 4) {
        const snareNoise = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const data = snareNoise.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const sSource = this.ctx.createBufferSource();
        sSource.buffer = snareNoise;

        const sFilter = this.ctx.createBiquadFilter();
        sFilter.type = 'highpass';
        sFilter.frequency.setValueAtTime(1000, time);

        const sGain = this.ctx.createGain();
        sGain.gain.setValueAtTime(0.2, time);
        sGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        sSource.connect(sFilter);
        sFilter.connect(sGain);
        sGain.connect(this.bgmGain);
        sSource.start(time);
      }

      // 3. Hi-hat on 8th / 16th notes
      if (this.currentStep % 2 === 1) {
        const hatBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
        const data = hatBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const hSource = this.ctx.createBufferSource();
        hSource.buffer = hatBuffer;

        const hFilter = this.ctx.createBiquadFilter();
        hFilter.type = 'highpass';
        hFilter.frequency.setValueAtTime(7000, time);

        const hGain = this.ctx.createGain();
        hGain.gain.setValueAtTime(0.07, time);
        hGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        hSource.connect(hFilter);
        hFilter.connect(hGain);
        hGain.connect(this.bgmGain);
        hSource.start(time);
      }

      // 4. Bass synth
      const bassFreq = bassPattern[bassIdx];
      if (bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, time);

        const bFilter = this.ctx.createBiquadFilter();
        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(380, time);

        bGain.gain.setValueAtTime(0.18, time);
        bGain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.5);

        bassOsc.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(this.bgmGain);

        bassOsc.start(time);
        bassOsc.stop(time + stepDuration * 1.5);
      }

      // 5. Bright Lead Synth / Melody
      const melodyFreq = melodyPattern[stepIdx];
      if (melodyFreq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const lGain = this.ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(melodyFreq, time);

        const lFilter = this.ctx.createBiquadFilter();
        lFilter.type = 'lowpass';
        lFilter.frequency.setValueAtTime(2400, time);

        lGain.gain.setValueAtTime(0.12, time);
        lGain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 1.8);

        leadOsc.connect(lFilter);
        lFilter.connect(lGain);
        lGain.connect(this.bgmGain);

        leadOsc.start(time);
        leadOsc.stop(time + stepDuration * 1.8);
      }

      this.currentStep++;
      this.bgmTimeoutId = window.setTimeout(playStep, stepDuration * 1000);
    };

    playStep();
  }

  public stopBuiltinBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public getIsBgmPlaying() {
    return this.isBgmPlaying;
  }

  public setVolume(vol: number) {
    if (this.bgmGain) {
      this.bgmGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  // Connect custom MP3 audio element to the analyser
  public connectAudioElement(audioEl: HTMLAudioElement) {
    this.initContext();
    if (!this.ctx || !this.analyser) return;

    if (!this.mediaSourceNode && audioEl) {
      try {
        this.mediaSourceNode = this.ctx.createMediaElementSource(audioEl);
        this.mediaSourceNode.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      } catch {
        // Already connected or cross-origin safe
      }
    }
  }
}

export const sound = new SoundEngine();
