import { useMemo, useCallback } from 'react';
import { KEYBOARD_CONFIG } from '../utils/constants.js';

/**
 * Custom hook for managing piano keyboard layout and interactions
 */
export const useKeyboard = () => {
  // Define the complete keyboard layout with proper positioning
  const keyLayout = useMemo(() => {
    // White keys in order from left to right
    const whiteKeys = [
      { note: 'A3', label: 'A', type: 'white', position: 0 },
      { note: 'B3', label: 'B', type: 'white', position: 1 },
      { note: 'C4', label: 'C', type: 'white', position: 2 },
      { note: 'D4', label: 'D', type: 'white', position: 3 },
      { note: 'E4', label: 'E', type: 'white', position: 4 },
      { note: 'F4', label: 'F', type: 'white', position: 5 },
      { note: 'G4', label: 'G', type: 'white', position: 6 },
      { note: 'A4', label: 'A', type: 'white', position: 7 },
      { note: 'B4', label: 'B', type: 'white', position: 8 },
      { note: 'C5', label: 'C', type: 'white', position: 9 },
      { note: 'D5', label: 'D', type: 'white', position: 10 },
      { note: 'E5', label: 'E', type: 'white', position: 11 },
      { note: 'F5', label: 'F', type: 'white', position: 12 },
    ];

    // Black keys with their positions relative to white keys
    const blackKeys = [
      { note: 'A#3', label: 'A#', type: 'black', afterWhiteKey: 'A3' },
      { note: 'C#4', label: 'C#', type: 'black', afterWhiteKey: 'C4' },
      { note: 'D#4', label: 'D#', type: 'black', afterWhiteKey: 'D4' },
      { note: 'F#4', label: 'F#', type: 'black', afterWhiteKey: 'F4' },
      { note: 'G#4', label: 'G#', type: 'black', afterWhiteKey: 'G4' },
      { note: 'A#4', label: 'A#', type: 'black', afterWhiteKey: 'A4' },
      { note: 'C#5', label: 'C#', type: 'black', afterWhiteKey: 'C5' },
      { note: 'D#5', label: 'D#', type: 'black', afterWhiteKey: 'D5' },
    ];

    return { whiteKeys, blackKeys };
  }, []);

  // Get all keys as a flat array
  const allKeys = useMemo(() => {
    return [...keyLayout.whiteKeys, ...keyLayout.blackKeys];
  }, [keyLayout]);

  // Find black key that should be positioned after a white key
  const findBlackKeyAfter = useCallback((whiteKeyNote) => {
    return keyLayout.blackKeys.find(blackKey => blackKey.afterWhiteKey === whiteKeyNote);
  }, [keyLayout.blackKeys]);

  // Get key data by note name
  const getKeyByNote = useCallback((note) => {
    return allKeys.find(key => key.note === note);
  }, [allKeys]);

  // Check if a note has a black key after it
  const hasBlackKeyAfter = useCallback((whiteKeyNote) => {
    const noteName = whiteKeyNote.slice(0, -1); // Remove octave
    // Black keys exist after: C, D, F, G, A (but not after E and B)
    return ['C', 'D', 'F', 'G', 'A'].includes(noteName);
  }, []);

  // Get keyboard dimensions for responsive design
  const getKeyboardDimensions = useCallback(() => {
    const whiteKeyCount = keyLayout.whiteKeys.length;
    const totalWidth = whiteKeyCount * (KEYBOARD_CONFIG.WHITE_KEY_WIDTH + KEYBOARD_CONFIG.KEY_MARGIN);
    
    return {
      width: totalWidth,
      height: KEYBOARD_CONFIG.WHITE_KEY_HEIGHT,
      whiteKeyWidth: KEYBOARD_CONFIG.WHITE_KEY_WIDTH,
      whiteKeyHeight: KEYBOARD_CONFIG.WHITE_KEY_HEIGHT,
      blackKeyWidth: KEYBOARD_CONFIG.BLACK_KEY_WIDTH,
      blackKeyHeight: KEYBOARD_CONFIG.BLACK_KEY_HEIGHT,
      keyMargin: KEYBOARD_CONFIG.KEY_MARGIN,
    };
  }, [keyLayout.whiteKeys.length]);

  // Convert MIDI note number to note name
  const midiNoteToNoteName = useCallback((midiNote) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return `${noteNames[noteIndex]}${octave}`;
  }, []);

  // Convert note name to MIDI note number
  const noteNameToMidiNote = useCallback((noteName) => {
    const noteMap = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    const match = noteName.match(/^([A-G]#?)(\d+)$/);
    
    if (!match) return null;
    
    const [, note, octave] = match;
    const noteValue = noteMap[note];
    const octaveValue = parseInt(octave, 10);
    
    return (octaveValue + 1) * 12 + noteValue;
  }, []);

  // Check if a key is within the keyboard range
  const isKeyInRange = useCallback((note) => {
    return allKeys.some(key => key.note === note);
  }, [allKeys]);

  // Get the frequency of a note (for audio purposes)
  const getNoteFrequency = useCallback((noteName) => {
    const A4_FREQUENCY = 440; // Hz
    const A4_MIDI_NOTE = 69;
    const midiNote = noteNameToMidiNote(noteName);
    
    if (midiNote === null) return null;
    
    // Calculate frequency using equal temperament formula
    return A4_FREQUENCY * Math.pow(2, (midiNote - A4_MIDI_NOTE) / 12);
  }, [noteNameToMidiNote]);

  return {
    // Layout data
    keyLayout,
    allKeys,
    whiteKeys: keyLayout.whiteKeys,
    blackKeys: keyLayout.blackKeys,

    // Utility functions
    findBlackKeyAfter,
    getKeyByNote,
    hasBlackKeyAfter,
    getKeyboardDimensions,
    
    // Conversion utilities
    midiNoteToNoteName,
    noteNameToMidiNote,
    getNoteFrequency,
    
    // Validation
    isKeyInRange,
  };
};

export default useKeyboard;