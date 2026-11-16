/**
 * Web Audio API Sound Synthesizer & Real-time Window Synchronizer
 * Standar suara turnamen Taekwondo tanpa perlu file MP3 eksternal (100% offline).
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBuzzer() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const duration = 1.35; // Durasi buzzer khas turnamen

    // Dual-oscillator untuk menghasilkan suara klakson buzzer profesional
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(285, now);
    osc1.frequency.exponentialRampToValueAtTime(270, now + duration);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(427.5, now);
    osc2.frequency.exponentialRampToValueAtTime(405, now + duration);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gainNode.gain.setValueAtTime(0.4, now + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playBeep(freq = 880, duration = 0.18, type = 'sine') {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playKalyeo() {
    // 2 nada cepat tanda jeda wasit
    this.playBeep(659.25, 0.12, 'square');
    setTimeout(() => this.playBeep(523.25, 0.18, 'square'), 120);
  }

  playGamJeom() {
    // Nada peringatan rendah
    this.playBeep(330, 0.25, 'triangle');
  }

  playPoint() {
    // Nada ringan saat poin bertambah
    this.playBeep(1046.5, 0.08, 'sine');
  }

  // Rhythmic Synth Beat untuk Poomsae Freestyle (128 BPM)
  startFreestyleBeat() {
    if (!this.soundEnabled || this.beatInterval) return;
    this.init();
    let step = 0;
    this.beatInterval = setInterval(() => {
      if (!this.soundEnabled) return;
      if (step % 2 === 0) {
        this.playBeep(110, 0.08, 'triangle'); // Kick bass
      } else {
        this.playBeep(1200, 0.03, 'sine'); // Hi-hat
      }
      step++;
    }, 468);
  }

  stopFreestyleBeat() {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
  }
}

// Sinkronisasi Antar Tab / Jendela (Operator <-> Layar Tampilan LED)
class BoardSync {
  constructor(onMessageCallback) {
    this.channelName = 'tkd_scoreboard_event_channel';
    this.onMessage = onMessageCallback;
    this.channel = null;

    if ('BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event) => {
          if (this.onMessage && event.data) {
            this.onMessage(event.data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not available, falling back to localStorage');
      }
    }

    // Fallback via window storage event
    window.addEventListener('storage', (e) => {
      if (e.key === 'tkd_sync_payload' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (this.onMessage) this.onMessage(data);
        } catch (err) {}
      }
    });
  }

  broadcast(type, payload) {
    const data = { type, payload, timestamp: Date.now() };
    if (this.channel) {
      this.channel.postMessage(data);
    }
    // Update local storage for fallback cross-tab sync
    try {
      localStorage.setItem('tkd_sync_payload', JSON.stringify(data));
    } catch (e) {}
  }
}

window.soundSys = new SoundSynthesizer();

