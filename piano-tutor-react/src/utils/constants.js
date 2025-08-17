/**
 * Constants for the Piano Tutor App - extracted from original HTML
 */

// Default tempo settings - from original HTML
export const DEFAULT_TEMPO = 60;
export const TEMPO_OPTIONS = [40, 60, 72, 90, 120];

// Staff configuration - exact values from original
export const STAFF_CONFIG = {
  TOP: 59,
  LINE_SPACING: 20,
  HEIGHT: 80,
  NOTE_HEIGHT: 22,
  LINE_HEIGHT: 2,
  LINES_COUNT: 5,
};

// Note colors based on pitch - exact from original HTML
export const NOTE_COLORS = {
  C: '#CE82FF',
  D: '#FF9602',
  E: '#57CD03',
  F: '#CC348E',
  G: '#7090FF',
  A: '#FF87D0',
  B: '#00CE9C',
};

// Note duration widths - exact from original HTML
export const NOTE_WIDTHS = {
  eighth: 38,
  quarter: 76,
  dotted_quarter: 114,
  half: 152,
  whole: 304,
};

// Note types and their durations
export const NOTE_TYPES = {
  whole: { width: 304, duration: 4 },
  half: { width: 152, duration: 2 },
  quarter: { width: 76, duration: 1 },
  dotted_quarter: { width: 114, duration: 1.5 },
  eighth: { width: 38, duration: 0.5 },
  sixteenth: { width: 19, duration: 0.25 },
};

// Playback configuration - from original HTML
export const PLAYBACK_CONFIG = {
  DEFAULT_POSITION: 120,
  PIXELS_PER_BEAT: 120,
  ANIMATION_DURATION: 100, // milliseconds
  NOTE_SPACING: 12, // pixels between notes
  MEASURE_BAR_MARGIN: 6, // pixels from measure bar to notes
};

// Timing evaluation - from original HTML
export const TIMING_CONFIG = {
  TOLERANCE_PIXELS: 30,
  EARLY_THRESHOLD: -0.2, // seconds
  LATE_THRESHOLD: 0.2, // seconds
  PERFECT_THRESHOLD: 0.05, // seconds
};

// Piano keyboard configuration
export const KEYBOARD_CONFIG = {
  WHITE_KEY_WIDTH: 87,
  WHITE_KEY_HEIGHT: 200,
  BLACK_KEY_WIDTH: 49,
  BLACK_KEY_HEIGHT: 130,
  KEY_MARGIN: 1,
};

// MIDI configuration
export const MIDI_CONFIG = {
  NOTE_ON: 0x90,
  NOTE_OFF: 0x80,
  CONTROL_CHANGE: 0xb0,
  VELOCITY_THRESHOLD: 0,
  MAX_POLYPHONY: 32,
};

// Audio configuration - from ToneJS Audio Engine
export const AUDIO_CONFIG = {
  MASTER_VOLUME_DB: 0,
  NOTE_LENGTH: 1.0,
  POLYPHONY: 32,
  ENVELOPE: {
    ATTACK: 0.02,
    DECAY: 0.8,
    SUSTAIN: 0.2,
    RELEASE: 2.0,
  },
  OSCILLATOR: {
    TYPE: 'triangle',
    HARMONICITY: 2,
    MODULATION_TYPE: 'sine',
    MODULATION_INDEX: 0.5,
  },
  EFFECTS: {
    REVERB: {
      DECAY: 3.0,
      WET: 0.25,
    },
    COMPRESSOR: {
      THRESHOLD: -24,
      RATIO: 6,
      ATTACK: 0.005,
      RELEASE: 0.15,
    },
  },
};

// Piano decay characteristics - from original HTML
export const PIANO_DECAY = {
  BASS_NOTES: {
    SUSTAIN_TIME: 8.0,
    DECAY_RATE: 0.15,
  },
  MID_NOTES: {
    SUSTAIN_TIME: 5.0,
    DECAY_RATE: 0.25,
  },
  TREBLE_NOTES: {
    SUSTAIN_TIME: 2.5,
    DECAY_RATE: 0.4,
  },
  DECAY_CURVE: {
    INITIAL_VOLUME: 1.0,
    SUSTAIN_THRESHOLD: 0.1,
    DECAY_FUNCTION: 'exponential',
  },
};
