// Web Audio API sound effects & background music — no backend needed
let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
};

// ─── Sound effects ───

export const playJumpSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
};

export const playBoostJumpSound = () => {
  const ctx = getCtx();
  // Layered whoosh
  [440, 660, 880].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 2.2, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime + i * 0.03);
    osc.stop(ctx.currentTime + 0.35);
  });
};

export const playLandSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
};

export const playCollectSound = () => {
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.3);
  });
};

export const playHitSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};

export const playGameOverSound = () => {
  const ctx = getCtx();
  const notes = [440, 415, 370, 311, 262];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
    gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.4);
    osc.start(ctx.currentTime + i * 0.18);
    osc.stop(ctx.currentTime + i * 0.18 + 0.4);
  });
};

export const playWinSound = () => {
  const ctx = getCtx();
  const melody = [523, 587, 659, 784, 880, 1047];
  melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.4);
  });
};

export const playLevelCompleteSound = () => {
  const ctx = getCtx();
  const notes = [659, 784, 880, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.35);
  });
};

// ─── Background Music System ───

interface MusicConfig {
  notes: number[];
  durations: number[];
  type: OscillatorType;
  tempo: number; // seconds per beat
  volume: number;
  bassNotes?: number[];
  padNotes?: number[];
}

const LEVEL_MUSIC: Record<number, MusicConfig> = {
  1: {
    // Garden — gentle, dreamy waltz
    notes: [523, 587, 659, 784, 659, 587, 523, 494, 523, 659, 784, 880, 784, 659, 523, 587],
    durations: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2],
    type: 'sine',
    tempo: 0.28,
    volume: 0.045,
    bassNotes: [262, 262, 330, 330, 392, 392, 330, 262],
    padNotes: [330, 392, 494],
  },
  2: {
    // Sunset — warm, flowing melody
    notes: [392, 440, 523, 587, 659, 587, 523, 494, 440, 523, 587, 659, 784, 659, 587, 523],
    durations: [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2],
    type: 'triangle',
    tempo: 0.3,
    volume: 0.04,
    bassNotes: [196, 220, 262, 220, 196, 220, 262, 294],
    padNotes: [392, 494, 587],
  },
  3: {
    // Twilight — mysterious, ethereal
    notes: [440, 523, 659, 784, 880, 784, 659, 523, 587, 698, 880, 784, 659, 587, 523, 440],
    durations: [2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2],
    type: 'sine',
    tempo: 0.35,
    volume: 0.04,
    bassNotes: [220, 262, 330, 262, 220, 247, 294, 262],
    padNotes: [330, 440, 523],
  },
  4: {
    // Night — deep, ambient, slow
    notes: [330, 392, 440, 523, 494, 440, 392, 370, 330, 392, 494, 523, 587, 523, 440, 392],
    durations: [2, 2, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2],
    type: 'sine',
    tempo: 0.4,
    volume: 0.035,
    bassNotes: [165, 196, 220, 196, 165, 185, 220, 196],
    padNotes: [262, 330, 392],
  },
  5: {
    // Love's Summit — triumphant, uplifting
    notes: [523, 659, 784, 880, 1047, 880, 784, 880, 1047, 1175, 1047, 880, 784, 659, 784, 880],
    durations: [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
    type: 'triangle',
    tempo: 0.25,
    volume: 0.04,
    bassNotes: [262, 330, 392, 440, 523, 440, 392, 330],
    padNotes: [523, 659, 784],
  },
};

let musicNodes: { oscillators: OscillatorNode[]; gains: GainNode[]; timer: number | null; stopped: boolean } | null = null;

const scheduleMusicLoop = (ctx: AudioContext, config: MusicConfig, masterGain: GainNode) => {
  if (musicNodes?.stopped) return;

  let time = ctx.currentTime + 0.05;

  // Melody
  config.notes.forEach((freq, i) => {
    const dur = config.durations[i] * config.tempo;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.type = config.type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(config.volume, time);
    gain.gain.setValueAtTime(config.volume, time + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);
    osc.start(time);
    osc.stop(time + dur);
    if (musicNodes) musicNodes.oscillators.push(osc);
    time += dur;
  });

  // Bass line
  if (config.bassNotes) {
    let bassTime = ctx.currentTime + 0.05;
    const bassDur = (config.notes.length / config.bassNotes.length) * config.tempo;
    config.bassNotes.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, bassTime);
      gain.gain.setValueAtTime(config.volume * 0.6, bassTime);
      gain.gain.exponentialRampToValueAtTime(0.001, bassTime + bassDur * 0.9);
      osc.start(bassTime);
      osc.stop(bassTime + bassDur);
      if (musicNodes) musicNodes.oscillators.push(osc);
      bassTime += bassDur;
    });
  }

  // Ambient pad (sustained chord)
  if (config.padNotes) {
    const totalDuration = config.notes.reduce((sum, _, i) => sum + config.durations[i] * config.tempo, 0);
    config.padNotes.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(config.volume * 0.25, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(config.volume * 0.25, ctx.currentTime + totalDuration * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalDuration);
      osc.start(ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + totalDuration + 0.1);
      if (musicNodes) musicNodes.oscillators.push(osc);
    });
  }

  // Schedule next loop
  const totalDuration = config.notes.reduce((sum, _, i) => sum + config.durations[i] * config.tempo, 0);
  const timer = window.setTimeout(() => {
    if (musicNodes && !musicNodes.stopped) {
      musicNodes.oscillators = []; // clear old refs
      scheduleMusicLoop(ctx, config, masterGain);
    }
  }, totalDuration * 1000 - 100);

  if (musicNodes) musicNodes.timer = timer;
};

export const startLevelMusic = (level: number) => {
  stopLevelMusic();

  const config = LEVEL_MUSIC[level];
  if (!config) return;

  const ctx = getCtx();
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1, ctx.currentTime);
  masterGain.connect(ctx.destination);

  musicNodes = { oscillators: [], gains: [masterGain], timer: null, stopped: false };
  scheduleMusicLoop(ctx, config, masterGain);
};

export const stopLevelMusic = () => {
  if (!musicNodes) return;
  musicNodes.stopped = true;
  if (musicNodes.timer !== null) clearTimeout(musicNodes.timer);
  musicNodes.gains.forEach(g => {
    try { g.gain.exponentialRampToValueAtTime(0.001, (audioCtx?.currentTime ?? 0) + 0.3); } catch {}
  });
  musicNodes.oscillators.forEach(o => {
    try { o.stop((audioCtx?.currentTime ?? 0) + 0.4); } catch {}
  });
  musicNodes = null;
};
