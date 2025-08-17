/**
 * Audio utility functions for Tone.js integration - extracted from original HTML
 */

import * as Tone from 'tone';
import { AUDIO_CONFIG, PIANO_DECAY } from './constants.js';
import { getFrequencyRange } from './midiUtils.js';

/**
 * Check if Tone.js is available
 * @returns {boolean} True if Tone.js is loaded
 */
export function isToneJSAvailable() {
  return typeof Tone !== 'undefined' && Tone.context;
}

/**
 * Initialize Tone.js audio context
 * @returns {Promise<boolean>} True if initialization successful
 */
export async function initializeToneJS() {
  if (!isToneJSAvailable()) {
    throw new Error('Tone.js library not loaded');
  }

  try {
    await Tone.start();
    console.log('Tone.js audio context started');
    console.log('Audio context state:', Tone.context.state);
    console.log('Sample rate:', Tone.context.sampleRate);
    return true;
  } catch (error) {
    console.error('Failed to start Tone.js audio context:', error);
    throw error;
  }
}

/**
 * Create a polyphonic piano synthesizer with realistic settings
 * @returns {Object} Configured Tone.js PolySynth
 */
export function createPianoSynth() {
  if (!isToneJSAvailable()) {
    throw new Error('Tone.js not available');
  }

  return new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: AUDIO_CONFIG.OSCILLATOR.TYPE,
      harmonicity: AUDIO_CONFIG.OSCILLATOR.HARMONICITY,
      modulationType: AUDIO_CONFIG.OSCILLATOR.MODULATION_TYPE,
      modulationIndex: AUDIO_CONFIG.OSCILLATOR.MODULATION_INDEX,
    },
    envelope: {
      attack: AUDIO_CONFIG.ENVELOPE.ATTACK,
      decay: AUDIO_CONFIG.ENVELOPE.DECAY,
      sustain: AUDIO_CONFIG.ENVELOPE.SUSTAIN,
      release: AUDIO_CONFIG.ENVELOPE.RELEASE,
    },
  }).set({
    volume: -12, // Set synth volume to allow headroom for effects
  });
}

/**
 * Create reverb effect for piano realism
 * @returns {Object} Configured Tone.js Reverb
 */
export function createReverb() {
  if (!isToneJSAvailable()) {
    throw new Error('Tone.js not available');
  }

  return new Tone.Reverb({
    decay: AUDIO_CONFIG.EFFECTS.REVERB.DECAY,
    wet: AUDIO_CONFIG.EFFECTS.REVERB.WET,
  });
}

/**
 * Create compressor for dynamic control
 * @returns {Object} Configured Tone.js Compressor
 */
export function createCompressor() {
  if (!isToneJSAvailable()) {
    throw new Error('Tone.js not available');
  }

  return new Tone.Compressor({
    threshold: AUDIO_CONFIG.EFFECTS.COMPRESSOR.THRESHOLD,
    ratio: AUDIO_CONFIG.EFFECTS.COMPRESSOR.RATIO,
    attack: AUDIO_CONFIG.EFFECTS.COMPRESSOR.ATTACK,
    release: AUDIO_CONFIG.EFFECTS.COMPRESSOR.RELEASE,
  });
}

/**
 * Create master volume control
 * @param {number} volumeDb - Volume in decibels
 * @returns {Object} Configured Tone.js Volume
 */
export function createMasterVolume(volumeDb = AUDIO_CONFIG.MASTER_VOLUME_DB) {
  if (!isToneJSAvailable()) {
    throw new Error('Tone.js not available');
  }

  return new Tone.Volume(volumeDb);
}

/**
 * Connect audio chain: synth → compressor → reverb → masterVolume → destination
 * @param {Object} synth - Tone.js synthesizer
 * @param {Object} compressor - Tone.js compressor
 * @param {Object} reverb - Tone.js reverb
 * @param {Object} masterVolume - Tone.js volume control
 */
export function connectAudioChain(synth, compressor, reverb, masterVolume) {
  if (!isToneJSAvailable()) {
    throw new Error('Tone.js not available');
  }

  synth.chain(compressor, reverb, masterVolume, Tone.Destination);
}

/**
 * Play a note with specified parameters
 * @param {Object} synth - Tone.js synthesizer
 * @param {string} note - Note name (e.g., "C4")
 * @param {number} velocity - Note velocity (0-1)
 * @param {string|null} duration - Note duration or null for sustained
 */
export function playNote(synth, note, velocity = 0.8, duration = null) {
  if (!synth) {
    console.warn('Synthesizer not available');
    return;
  }

  try {
    if (duration) {
      synth.triggerAttackRelease(note, duration, undefined, velocity);
    } else {
      synth.triggerAttack(note, undefined, velocity);
    }
  } catch (error) {
    console.error('Failed to play note:', error);
  }
}

/**
 * Stop a sustained note
 * @param {Object} synth - Tone.js synthesizer
 * @param {string} note - Note name to stop
 */
export function stopNote(synth, note) {
  if (!synth) {
    console.warn('Synthesizer not available');
    return;
  }

  try {
    synth.triggerRelease(note);
  } catch (error) {
    console.error('Failed to stop note:', error);
  }
}

/**
 * Get natural decay time for a note based on frequency range
 * @param {string} noteName - Note name (e.g., "C4")
 * @returns {number} Decay time in seconds
 */
export function getNaturalDecayTime(noteName) {
  const range = getFrequencyRange(noteName);

  switch (range) {
    case 'bass':
      return PIANO_DECAY.BASS_NOTES.SUSTAIN_TIME;
    case 'treble':
      return PIANO_DECAY.TREBLE_NOTES.SUSTAIN_TIME;
    case 'mid':
    default:
      return PIANO_DECAY.MID_NOTES.SUSTAIN_TIME;
  }
}

/**
 * Get decay rate for a note based on frequency range
 * @param {string} noteName - Note name (e.g., "C4")
 * @returns {number} Decay rate
 */
export function getDecayRate(noteName) {
  const range = getFrequencyRange(noteName);

  switch (range) {
    case 'bass':
      return PIANO_DECAY.BASS_NOTES.DECAY_RATE;
    case 'treble':
      return PIANO_DECAY.TREBLE_NOTES.DECAY_RATE;
    case 'mid':
    default:
      return PIANO_DECAY.MID_NOTES.DECAY_RATE;
  }
}

/**
 * Calculate note duration in milliseconds based on tempo and note type
 * @param {string} noteType - Note type (quarter, half, etc.)
 * @param {number} tempo - Tempo in BPM
 * @returns {number} Duration in milliseconds
 */
export function calculateNoteDurationMs(noteType, tempo) {
  const beatDuration = 60000 / tempo; // milliseconds per beat

  const durationMap = {
    whole: 4,
    half: 2,
    quarter: 1,
    dotted_quarter: 1.5,
    eighth: 0.5,
    sixteenth: 0.25,
  };

  const beats = durationMap[noteType] || 1;
  return beatDuration * beats;
}

/**
 * Convert velocity (0-127) to Tone.js velocity (0-1)
 * @param {number} midiVelocity - MIDI velocity (0-127)
 * @returns {number} Tone.js velocity (0-1)
 */
export function midiVelocityToToneVelocity(midiVelocity) {
  return Math.max(0, Math.min(1, midiVelocity / 127));
}

/**
 * Dispose of Tone.js audio resources
 * @param {Array} resources - Array of Tone.js objects to dispose
 */
export function disposeAudioResources(resources) {
  resources.forEach(resource => {
    if (resource && typeof resource.dispose === 'function') {
      try {
        resource.dispose();
      } catch (error) {
        console.error('Error disposing audio resource:', error);
      }
    }
  });
}

/**
 * Check if audio context is running
 * @returns {boolean} True if audio context is running
 */
export function isAudioContextRunning() {
  if (!isToneJSAvailable()) {
    return false;
  }

  return Tone.context.state === 'running';
}

/**
 * Get audio context state information
 * @returns {Object} Audio context state information
 */
export function getAudioContextInfo() {
  if (!isToneJSAvailable()) {
    return {
      available: false,
      state: 'unavailable',
      sampleRate: null,
    };
  }

  return {
    available: true,
    state: Tone.context.state,
    sampleRate: Tone.context.sampleRate,
    currentTime: Tone.context.currentTime,
  };
}
