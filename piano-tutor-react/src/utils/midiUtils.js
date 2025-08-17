/**
 * MIDI utility functions - extracted from original HTML
 */

import { MIDI_CONFIG } from './constants.js';

/**
 * Parse MIDI message data
 * @param {Uint8Array} data - Raw MIDI message data
 * @returns {Object} Parsed MIDI message object
 */
export function parseMIDIMessage(data) {
  if (!data || data.length === 0) {
    return null;
  }

  const status = data[0];
  const command = status & 0xf0;
  const channel = status & 0x0f;

  const message = {
    command,
    channel,
    status,
    data: Array.from(data),
  };

  switch (command) {
    case MIDI_CONFIG.NOTE_ON:
      message.type = 'noteOn';
      message.note = data[1];
      message.velocity = data[2];
      message.noteName = midiNoteToNoteName(data[1]);
      break;

    case MIDI_CONFIG.NOTE_OFF:
      message.type = 'noteOff';
      message.note = data[1];
      message.velocity = data[2];
      message.noteName = midiNoteToNoteName(data[1]);
      break;

    case MIDI_CONFIG.CONTROL_CHANGE:
      message.type = 'controlChange';
      message.controller = data[1];
      message.value = data[2];
      break;

    default:
      message.type = 'unknown';
      break;
  }

  return message;
}

/**
 * Convert MIDI note number to note name
 * @param {number} midiNote - MIDI note number (0-127)
 * @returns {string} Note name (e.g., "C4", "F#3")
 */
export function midiNoteToNoteName(midiNote) {
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  return noteNames[noteIndex] + octave;
}

/**
 * Convert note name to MIDI note number
 * @param {string} noteName - Note name (e.g., "C4", "F#3")
 * @returns {number} MIDI note number (0-127)
 */
export function noteNameToMidiNote(noteName) {
  const noteMap = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11,
  };

  const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  const [, note, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const noteValue = noteMap[note];

  if (noteValue === undefined) {
    throw new Error(`Invalid note: ${note}`);
  }

  return (octave + 1) * 12 + noteValue;
}

/**
 * Check if browser supports Web MIDI API
 * @returns {boolean} True if MIDI is supported
 */
export function isMIDISupported() {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.requestMIDIAccess === 'function'
  );
}

/**
 * Initialize MIDI access
 * @param {Object} options - MIDI access options
 * @returns {Promise<MIDIAccess>} MIDI access object
 */
export async function initializeMIDI(options = {}) {
  if (!isMIDISupported()) {
    throw new Error('Web MIDI API is not supported in this browser');
  }

  try {
    const midiAccess = await navigator.requestMIDIAccess({
      sysex: false,
      ...options,
    });

    console.log('MIDI access initialized successfully');
    return midiAccess;
  } catch (error) {
    console.error('Failed to initialize MIDI access:', error);
    throw error;
  }
}

/**
 * Get available MIDI input devices
 * @param {MIDIAccess} midiAccess - MIDI access object
 * @returns {Map} Map of available input devices
 */
export function getAvailableInputDevices(midiAccess) {
  const devices = new Map();

  if (!midiAccess) {
    return devices;
  }

  for (const input of midiAccess.inputs.values()) {
    if (input.state === 'connected') {
      devices.set(input.id, {
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer,
        type: input.type,
        state: input.state,
        connection: input.connection,
      });
    }
  }

  return devices;
}

/**
 * Connect to a MIDI input device
 * @param {MIDIAccess} midiAccess - MIDI access object
 * @param {string} deviceId - Device ID to connect to
 * @param {Function} messageHandler - Function to handle MIDI messages
 * @returns {MIDIInput|null} Connected MIDI input device
 */
export function connectToMIDIDevice(midiAccess, deviceId, messageHandler) {
  if (!midiAccess) {
    console.error('MIDI access not available');
    return null;
  }

  const device = midiAccess.inputs.get(deviceId);
  if (!device) {
    console.error(`MIDI device not found: ${deviceId}`);
    return null;
  }

  try {
    device.onmidimessage = event => {
      const message = parseMIDIMessage(event.data);
      if (message && messageHandler) {
        messageHandler(message, event);
      }
    };

    console.log(`Connected to MIDI device: ${device.name}`);
    return device;
  } catch (error) {
    console.error('Failed to connect to MIDI device:', error);
    return null;
  }
}

/**
 * Disconnect from a MIDI input device
 * @param {MIDIInput} device - MIDI input device to disconnect
 */
export function disconnectFromMIDIDevice(device) {
  if (device) {
    device.onmidimessage = null;
    console.log(`Disconnected from MIDI device: ${device.name}`);
  }
}

/**
 * Check if a MIDI message is a note on message with velocity > 0
 * @param {Object} message - Parsed MIDI message
 * @returns {boolean} True if it's a note on message
 */
export function isNoteOnMessage(message) {
  return (
    message &&
    message.type === 'noteOn' &&
    message.velocity > MIDI_CONFIG.VELOCITY_THRESHOLD
  );
}

/**
 * Check if a MIDI message is a note off message or note on with velocity 0
 * @param {Object} message - Parsed MIDI message
 * @returns {boolean} True if it's a note off message
 */
export function isNoteOffMessage(message) {
  return (
    message &&
    (message.type === 'noteOff' ||
      (message.type === 'noteOn' && message.velocity === 0))
  );
}

/**
 * Convert MIDI velocity to normalized volume (0-1)
 * @param {number} velocity - MIDI velocity (0-127)
 * @returns {number} Normalized volume (0-1)
 */
export function velocityToVolume(velocity) {
  return Math.max(0, Math.min(1, velocity / 127));
}

/**
 * Get frequency range for piano decay characteristics
 * @param {string} noteName - Note name (e.g., "C4")
 * @returns {string} Frequency range ('bass', 'mid', 'treble')
 */
export function getFrequencyRange(noteName) {
  const match = noteName.match(/^[A-G][#b]?(\d+)$/);
  if (!match) {
    return 'mid';
  }

  const octave = parseInt(match[1], 10);

  if (octave <= 3) {
    return 'bass';
  } else if (octave >= 5) {
    return 'treble';
  } else {
    return 'mid';
  }
}
