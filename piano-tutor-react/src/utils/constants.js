/**
 * Constants for the Piano Tutor App
 */

// Default tempo settings
export const DEFAULT_TEMPO = 60;
export const TEMPO_OPTIONS = [40, 60, 72, 90, 120];

// Staff configuration
export const STAFF_CONFIG = {
  TOP: 59,
  LINE_SPACING: 20,
  HEIGHT: 80,
  NOTE_HEIGHT: 22,
  LINE_HEIGHT: 2,
  LINES_COUNT: 5
};

// Note colors based on pitch
export const NOTE_COLORS = {
  'C': '#CE82FF',
  'D': '#FF9602', 
  'E': '#57CD03',
  'F': '#CC348E',
  'G': '#3498db',
  'A': '#e74c3c',
  'B': '#f39c12'
};

// Note types and their widths
export const NOTE_TYPES = {
  'whole': { width: 44, duration: 4 },
  'half': { width: 33, duration: 2 },
  'quarter': { width: 22, duration: 1 },
  'eighth': { width: 22, duration: 0.5 },
  'sixteenth': { width: 22, duration: 0.25 }
};

// Playback configuration
export const PLAYBACK_CONFIG = {
  DEFAULT_POSITION: 120,
  PIXELS_PER_BEAT: 120,
  ANIMATION_DURATION: 100 // milliseconds
};

// Timing evaluation
export const TIMING_CONFIG = {
  TOLERANCE_PIXELS: 30,
  EARLY_THRESHOLD: -0.2, // seconds
  LATE_THRESHOLD: 0.2,   // seconds
  PERFECT_THRESHOLD: 0.05 // seconds
};
