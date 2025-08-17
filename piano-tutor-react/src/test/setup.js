import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API for testing
global.AudioContext = class MockAudioContext {
  constructor() {
    this.state = 'suspended';
    this.destination = {};
    this.currentTime = 0;
    this.sampleRate = 44100;
  }

  resume() {
    this.state = 'running';
    return Promise.resolve();
  }

  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }

  close() {
    this.state = 'closed';
    return Promise.resolve();
  }

  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: { value: 440 },
      type: 'sine',
    };
  }

  createGain() {
    return {
      connect: () => {},
      gain: { value: 1 },
    };
  }

  createAnalyser() {
    return {
      connect: () => {},
      fftSize: 2048,
      frequencyBinCount: 1024,
    };
  }

  createBiquadFilter() {
    return {
      connect: () => {},
      frequency: { value: 350 },
      Q: { value: 1 },
      type: 'lowpass',
    };
  }

  createConvolver() {
    return {
      connect: () => {},
      buffer: null,
    };
  }

  createDelay() {
    return {
      connect: () => {},
      delayTime: { value: 0 },
    };
  }

  createDynamicsCompressor() {
    return {
      connect: () => {},
      threshold: { value: -24 },
      knee: { value: 30 },
      ratio: { value: 12 },
      attack: { value: 0.003 },
      release: { value: 0.25 },
    };
  }

  createWaveShaper() {
    return {
      connect: () => {},
      curve: null,
      oversample: '4x',
    };
  }

  decodeAudioData() {
    return Promise.resolve({
      length: 44100,
      sampleRate: 44100,
      numberOfChannels: 2,
    });
  }
};

global.webkitAudioContext = global.AudioContext;

// Mock Tone.js
vi.mock('tone', async () => {
  const mockSynth = {
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    triggerAttackRelease: vi.fn(),
    connect: vi.fn().mockReturnThis(),
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    volume: { value: -12 },
  };

  const mockPolySynth = vi.fn(() => mockSynth);
  mockPolySynth.prototype = mockSynth;

  const mockReverb = {
    connect: vi.fn().mockReturnThis(),
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    roomSize: { value: 0.7 },
    dampening: { value: 3000 },
  };

  const mockTransport = {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    bpm: { value: 120 },
    position: '0:0:0',
    state: 'stopped',
    schedule: vi.fn(),
    cancel: vi.fn(),
  };

  return {
    start: vi.fn().mockResolvedValue(undefined),
    getContext: vi.fn(() => ({
      state: 'running',
      resume: vi.fn().mockResolvedValue(undefined),
    })),
    PolySynth: mockPolySynth,
    Synth: vi.fn(() => mockSynth),
    Reverb: vi.fn(() => mockReverb),
    Transport: mockTransport,
    Destination: {
      volume: { value: -12 },
    },
    now: vi.fn(() => 0),
    Time: vi.fn((time) => ({ toSeconds: () => parseFloat(time) || 0 })),
    Frequency: vi.fn((freq) => ({ toFrequency: () => parseFloat(freq) || 440 })),
  };
});

// Mock MIDI API for testing
global.navigator.requestMIDIAccess = () =>
  Promise.resolve({
    inputs: new Map(),
    outputs: new Map(),
    onstatechange: null,
  });

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
