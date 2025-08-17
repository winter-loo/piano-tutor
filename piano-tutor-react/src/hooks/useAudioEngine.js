import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { AUDIO_CONFIG, PIANO_DECAY } from '../utils/constants.js';
import {
  createPianoSynth,
  createReverb,
  createCompressor,
  createMasterVolume,
  connectAudioChain,
  getNaturalDecayTime,
  getDecayRate,
  disposeAudioResources,
  isAudioContextRunning,
  getAudioContextInfo,
} from '../utils/audioUtils.js';
import useAudioStore from '../stores/audioStore.js';

export const useAudioEngine = () => {
  // Audio store integration
  const {
    isInitialized,
    setInitialized,
    volume,
    masterVolume,
    reverbEnabled,
    reverbAmount,
  } = useAudioStore();

  // Local state for audio engine
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioError, setAudioError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  // Audio components refs
  const synthRef = useRef(null);
  const reverbRef = useRef(null);
  const compressorRef = useRef(null);
  const masterVolumeRef = useRef(null);

  // Note tracking
  const sustainedNotesRef = useRef(new Map());
  const naturalDecayTimersRef = useRef(new Map());

  // Initialize the audio engine with enhanced error handling
  const initializeAudio = useCallback(async () => {
    if (isInitialized) {
      return { success: true, error: null };
    }

    try {
      console.log('🎵 [AUDIO-ENGINE] Initializing enhanced audio engine...');
      setIsLoading(true);
      setAudioError(null);
      setErrorDetails(null);

      // Check if Tone.js is available
      if (typeof Tone === 'undefined') {
        throw new Error('Tone.js library not available');
      }

      // Check if Web Audio API is supported
      if (!window.AudioContext && !window.webkitAudioContext) {
        throw new Error('Web Audio API not supported in this browser');
      }

      // Start Tone.js audio context with timeout
      const startPromise = Tone.start();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Audio initialization timeout')), 10000)
      );
      
      await Promise.race([startPromise, timeoutPromise]);
      
      console.log('🎵 [AUDIO-ENGINE] Tone.js context started');
      console.log('🎵 [AUDIO-ENGINE] Audio context state:', Tone.context.state);
      console.log('🎵 [AUDIO-ENGINE] Sample rate:', Tone.context.sampleRate);

      // Create polyphonic piano synthesizer with realistic settings
      synthRef.current = createPianoSynth();

      // Create audio effects
      reverbRef.current = createReverb();
      compressorRef.current = createCompressor();
      masterVolumeRef.current = createMasterVolume();

      // Connect audio chain: synth → compressor → reverb → masterVolume → destination
      connectAudioChain(
        synthRef.current,
        compressorRef.current,
        reverbRef.current,
        masterVolumeRef.current
      );

      // Wait for reverb to be ready (it needs time to generate impulse response)
      await reverbRef.current.ready;

      setInitialized(true);
      setIsLoading(false);
      console.log(
        '🎵 [AUDIO-ENGINE] Enhanced audio engine initialized successfully'
      );
      console.log('🎵 [AUDIO-ENGINE] Polyphony:', AUDIO_CONFIG.POLYPHONY);

      return { success: true, error: null };
    } catch (error) {
      console.error(
        '🎵 [AUDIO-ENGINE] Failed to initialize audio engine:',
        error
      );
      setIsLoading(false);
      const errorInfo = handleAudioInitializationError(error);
      return { success: false, error: errorInfo };
    }
  }, [isInitialized, setInitialized]);

  // Handle audio initialization errors with fallback strategies
  const handleAudioInitializationError = useCallback(
    error => {
      console.warn(
        '🎵 [AUDIO-ENGINE] Audio engine not available, implementing fallback strategy'
      );

      let errorInfo = {
        type: 'unknown',
        message: 'Audio initialization failed',
        userMessage: 'Audio is not available. The app will continue in silent mode.',
        canRetry: false,
        fallbackAvailable: true,
        suggestions: []
      };

      if (error.message.includes('Tone.js') || error.message.includes('library not available')) {
        errorInfo = {
          type: 'library_missing',
          message: 'Tone.js library not available',
          userMessage: 'Audio library failed to load. Please refresh the page.',
          canRetry: true,
          fallbackAvailable: true,
          suggestions: [
            'Refresh the page',
            'Check your internet connection',
            'Try a different browser'
          ]
        };
        setIsAudioEnabled(false);
      } else if (error.name === 'NotAllowedError') {
        errorInfo = {
          type: 'permission_denied',
          message: 'Audio blocked by browser',
          userMessage: 'Audio is blocked by your browser. Click anywhere to enable audio.',
          canRetry: true,
          fallbackAvailable: true,
          suggestions: [
            'Click anywhere on the page to enable audio',
            'Check browser audio permissions',
            'Ensure your device is not muted'
          ]
        };
        setIsAudioEnabled(true); // Keep enabled, will retry on user interaction
      } else if (error.message.includes('Web Audio API not supported')) {
        errorInfo = {
          type: 'not_supported',
          message: 'Web Audio API not supported',
          userMessage: 'Your browser does not support audio playback. Please use a modern browser.',
          canRetry: false,
          fallbackAvailable: true,
          suggestions: [
            'Use Chrome, Firefox, Safari, or Edge',
            'Update your browser to the latest version',
            'Enable JavaScript if disabled'
          ]
        };
        setIsAudioEnabled(false);
      } else if (error.message.includes('timeout')) {
        errorInfo = {
          type: 'timeout',
          message: 'Audio initialization timeout',
          userMessage: 'Audio initialization is taking too long. Please try again.',
          canRetry: true,
          fallbackAvailable: true,
          suggestions: [
            'Try again in a few seconds',
            'Close other audio applications',
            'Restart your browser'
          ]
        };
        setIsAudioEnabled(true);
      } else {
        errorInfo.suggestions = [
          'Refresh the page',
          'Try a different browser',
          'Check your device audio settings'
        ];
        setIsAudioEnabled(false);
      }

      setAudioError(errorInfo.userMessage);
      setErrorDetails(errorInfo);
      setInitialized(false);

      return errorInfo;
    },
    [setInitialized]
  );

  // Resume audio context if suspended (required for user interaction)
  const resumeAudioContext = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Initialize if not already done
      if (!isInitialized) {
        const result = await initializeAudio();
        setIsLoading(false);
        return result.success;
      }

      // Resume Tone.js context if suspended
      if (Tone.context.state === 'suspended') {
        await Tone.start();
        console.log('🎵 [AUDIO-ENGINE] Audio context resumed successfully');
      }

      // Check if context is now running
      const isReady = Tone.context.state === 'running' && isInitialized;
      setIsLoading(false);
      
      if (isReady) {
        setAudioError(null);
        setErrorDetails(null);
      }
      
      return isReady;
    } catch (error) {
      console.error('🎵 [AUDIO-ENGINE] Error in resumeAudioContext:', error);
      setIsLoading(false);
      handleAudioInitializationError(error);
      return false;
    }
  }, [isInitialized, initializeAudio, handleAudioInitializationError]);

  // Calculate realistic piano decay parameters based on note frequency
  const calculatePianoDecayParams = useCallback(note => {
    // Extract octave number from note name (e.g., 'C4' -> 4)
    const octaveMatch = note.match(/(\d+)$/);
    const octave = octaveMatch ? parseInt(octaveMatch[1]) : 4;

    // Calculate frequency range category
    let decayParams;
    if (octave <= 3) {
      // Bass notes (low frequencies) - sustain longest
      decayParams = PIANO_DECAY.BASS_NOTES;
    } else if (octave <= 5) {
      // Mid notes (middle frequencies) - medium sustain
      decayParams = PIANO_DECAY.MID_NOTES;
    } else {
      // Treble notes (high frequencies) - decay fastest
      decayParams = PIANO_DECAY.TREBLE_NOTES;
    }

    return {
      sustainTime: decayParams.SUSTAIN_TIME,
      decayRate: decayParams.DECAY_RATE,
      octave: octave,
      category: octave <= 3 ? 'bass' : octave <= 5 ? 'mid' : 'treble',
    };
  }, []);

  // Start natural piano decay for a sustained note
  const startNaturalDecay = useCallback((note, velocity, decayParams) => {
    // Clear any existing decay timer for this note
    if (naturalDecayTimersRef.current.has(note)) {
      clearInterval(naturalDecayTimersRef.current.get(note));
    }

    const startTime = Date.now();
    const initialVolume = velocity;
    const { sustainTime, decayRate } = decayParams;

    console.log(
      `🎹 [PIANO-DECAY] Starting natural decay for ${note} (${decayParams.category}): ${sustainTime}s sustain, ${decayRate} decay rate`
    );

    // Create decay timer that gradually reduces volume
    const decayInterval = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

      // Calculate current volume using exponential decay
      const decayFactor = Math.exp(-decayRate * elapsedTime);
      const currentVolume = initialVolume * decayFactor;

      // Check if note should be considered "silent"
      if (
        elapsedTime >= sustainTime ||
        currentVolume < PIANO_DECAY.DECAY_CURVE.SUSTAIN_THRESHOLD
      ) {
        // Natural decay complete - release the note
        console.log(
          `🎹 [PIANO-DECAY] Natural decay complete for ${note} after ${elapsedTime.toFixed(2)}s`
        );
        releaseNoteNaturally(note);
        return;
      }
    }, 100); // Update every 100ms for smooth decay

    naturalDecayTimersRef.current.set(note, decayInterval);
  }, []);

  // Release a note naturally due to piano decay
  const releaseNoteNaturally = useCallback(async note => {
    try {
      // Clear the decay timer
      if (naturalDecayTimersRef.current.has(note)) {
        clearInterval(naturalDecayTimersRef.current.get(note));
        naturalDecayTimersRef.current.delete(note);
      }

      // Release the note with a gentle fade
      if (sustainedNotesRef.current.has(note) && synthRef.current) {
        synthRef.current.triggerRelease(note);
        sustainedNotesRef.current.delete(note);
        console.log(`🎹 [PIANO-DECAY] Released note naturally: ${note}`);
      }
    } catch (error) {
      console.error(
        `🎹 [PIANO-DECAY] Error releasing note naturally: ${note}`,
        error
      );
    }
  }, []);

  // Enhanced play note method with realistic piano decay
  const playNote = useCallback(
    async (note, velocity = 0.8, duration = null) => {
      if (!isAudioEnabled) {
        console.log(`🎵 [AUDIO-ENGINE] Audio disabled - would play ${note}`);
        return;
      }

      try {
        console.log(
          `🎹 [AUDIO-ENGINE] playNote called: ${note}, velocity: ${velocity}, duration: ${duration}`
        );

        // Ensure audio context is ready
        const audioReady = await resumeAudioContext();
        if (!audioReady) {
          console.warn('🎹 [AUDIO-ENGINE] Audio context not ready');
          return;
        }

        // Convert note format if needed (e.g., 'C4' to Tone.js format)
        const toneNote = convertToToneNote(note);

        if (duration) {
          // Check if synth is available before triggering attack release
          if (!synthRef.current) {
            console.warn('🎹 [AUDIO-ENGINE] Synthesizer not available - cannot play note with duration');
            return;
          }

          // Trigger note for specific duration
          synthRef.current.triggerAttackRelease(
            toneNote,
            duration,
            undefined,
            velocity
          );
          console.log(
            `🎹 [AUDIO-ENGINE] Playing note: ${toneNote} for ${duration} with velocity ${velocity}`
          );
        } else {
          // Check if synth is available before triggering attack
          if (!synthRef.current) {
            console.warn('🎹 [AUDIO-ENGINE] Synthesizer not available - cannot play sustained note');
            return;
          }

          // Start sustained note with realistic piano decay
          synthRef.current.triggerAttack(toneNote, undefined, velocity);
          sustainedNotesRef.current.set(note, Date.now());

          // Calculate and start natural piano decay
          const decayParams = calculatePianoDecayParams(note);
          startNaturalDecay(note, velocity, decayParams);

          console.log(
            `🎹 [AUDIO-ENGINE] Starting sustained note with realistic decay: ${toneNote} (${decayParams.category} range, ${decayParams.sustainTime}s sustain)`
          );
        }
      } catch (error) {
        console.error('🎹 [AUDIO-ENGINE] Error playing note:', error);
        handlePlaybackError(error);
      }
    },
    [
      isAudioEnabled,
      resumeAudioContext,
      calculatePianoDecayParams,
      startNaturalDecay,
    ]
  );

  // Release a sustained note (manual release before natural decay)
  const stopNote = useCallback(
    async note => {
      if (!isAudioEnabled || !isInitialized) {
        return;
      }

      try {
        // Clear any natural decay timer for this note
        if (naturalDecayTimersRef.current.has(note)) {
          clearInterval(naturalDecayTimersRef.current.get(note));
          naturalDecayTimersRef.current.delete(note);
          console.log(
            `🎹 [PIANO-DECAY] Cleared natural decay timer for manual release: ${note}`
          );
        }

        // Convert note format if needed
        const toneNote = convertToToneNote(note);

        if (sustainedNotesRef.current.has(note) && synthRef.current) {
          synthRef.current.triggerRelease(toneNote);
          sustainedNotesRef.current.delete(note);
          console.log(
            `🎹 [AUDIO-ENGINE] Released sustained note manually: ${toneNote}`
          );
        }
      } catch (error) {
        console.error('🎹 [AUDIO-ENGINE] Error releasing note:', note, error);
      }
    },
    [isAudioEnabled, isInitialized]
  );

  // Stop all notes
  const stopAllNotes = useCallback(() => {
    if (!synthRef.current) {
      return;
    }

    try {
      // Clear all natural decay timers
      naturalDecayTimersRef.current.forEach((timer, note) => {
        clearInterval(timer);
        console.log(
          `🎹 [PIANO-DECAY] Cleared decay timer for ${note} during stopAll`
        );
      });
      naturalDecayTimersRef.current.clear();

      // Release all sustained notes
      synthRef.current.releaseAll();
      sustainedNotesRef.current.clear();
      console.log('🎹 [AUDIO-ENGINE] Stopped all notes');
    } catch (error) {
      console.error('🎹 [AUDIO-ENGINE] Error stopping all notes:', error);
    }
  }, []);

  // Play a note by name (compatibility with existing interface)
  const playNoteByName = useCallback(
    async (noteName, duration = null) => {
      console.log(
        `🎼 [AUDIO-ENGINE] playNoteByName called: ${noteName}, duration: ${duration}`
      );

      // Convert duration to Tone.js time format if provided
      const toneJSDuration = duration ? `${duration}s` : null;

      await playNote(noteName, 0.8, toneJSDuration);
      console.log(`🎼 [AUDIO-ENGINE] playNoteByName completed for ${noteName}`);
    },
    [playNote]
  );

  // Start sustained note (for key press and hold)
  const sustainNote = useCallback(
    async (note, velocity = 0.8) => {
      await playNote(note, velocity, null);
    },
    [playNote]
  );

  // Handle playback errors with graceful degradation
  const handlePlaybackError = useCallback(error => {
    console.error('🎹 [AUDIO-ENGINE] Audio playback error:', error);

    let errorInfo = {
      type: 'playback_error',
      message: 'Audio playback error',
      userMessage: 'Audio playback failed. Visual feedback will continue.',
      canRetry: true,
      fallbackAvailable: true,
      suggestions: ['Try clicking to resume audio', 'Check device volume']
    };

    // Implement fallback strategies
    if (error.name === 'NotAllowedError') {
      errorInfo = {
        type: 'permission_denied',
        message: 'Audio playback blocked',
        userMessage: 'Audio is blocked. Click anywhere to enable audio playback.',
        canRetry: true,
        fallbackAvailable: true,
        suggestions: [
          'Click anywhere on the page',
          'Check browser audio permissions',
          'Ensure device is not muted'
        ]
      };
    } else if (error.name === 'NotSupportedError') {
      errorInfo = {
        type: 'not_supported',
        message: 'Audio format not supported',
        userMessage: 'Audio format not supported by your browser.',
        canRetry: false,
        fallbackAvailable: true,
        suggestions: [
          'Try a different browser',
          'Update your browser',
          'Continue with visual-only feedback'
        ]
      };
    } else if (error.message.includes('context')) {
      errorInfo = {
        type: 'context_error',
        message: 'Audio context error',
        userMessage: 'Audio system error. Trying to recover...',
        canRetry: true,
        fallbackAvailable: true,
        suggestions: [
          'Wait a moment and try again',
          'Refresh the page if problem persists'
        ]
      };
    }

    setAudioError(errorInfo.userMessage);
    setErrorDetails(errorInfo);
  }, []);

  // Convert note format to Tone.js format
  const convertToToneNote = useCallback(note => {
    // Handle different note formats
    if (note.includes('#')) {
      // Sharp notes: C#4 -> C#4
      return note;
    } else if (note.includes('b')) {
      // Flat notes: Db4 -> C#4 (convert to sharp equivalent)
      const flatToSharp = {
        Db: 'C#',
        Eb: 'D#',
        Gb: 'F#',
        Ab: 'G#',
        Bb: 'A#',
      };
      const noteName = note.slice(0, 2);
      const octave = note.slice(2);
      return flatToSharp[noteName] + octave || note;
    }

    // Natural notes: C4 -> C4
    return note;
  }, []);

  // Set master volume with enhanced control
  const setMasterVolume = useCallback(volumeLevel => {
    // Convert linear volume to dB scale
    const volumeDb = volumeLevel > 0 ? 20 * Math.log10(volumeLevel) : -60;
    const clampedVolumeDb = Math.max(-60, Math.min(0, volumeDb));

    if (masterVolumeRef.current) {
      masterVolumeRef.current.volume.value = clampedVolumeDb;
      console.log(
        `🎵 [AUDIO-ENGINE] Master volume set to: ${volumeLevel} (${clampedVolumeDb.toFixed(1)} dB)`
      );
    }
  }, []);

  // Set individual volume (for note velocity)
  const setVolume = useCallback(volumeLevel => {
    if (synthRef.current) {
      // Convert 0-1 range to decibels (-60 to 0)
      const dbVolume = volumeLevel === 0 ? -Infinity : (volumeLevel - 1) * 60;
      const clampedDbVolume = Math.max(-60, Math.min(0, dbVolume));

      synthRef.current.volume.rampTo(clampedDbVolume, 0.1);
      console.log(
        `🎵 [AUDIO-ENGINE] Synth volume set to: ${volumeLevel} (${clampedDbVolume}dB)`
      );
    }
  }, []);

  // Enable or disable reverb effect
  const setReverbEnabled = useCallback(
    enabled => {
      if (reverbRef.current) {
        reverbRef.current.wet.value = enabled ? reverbAmount : 0;
        console.log(
          `🎵 [AUDIO-ENGINE] Reverb ${enabled ? 'enabled' : 'disabled'}`
        );
      }
    },
    [reverbAmount]
  );

  // Set reverb amount
  const setReverbAmount = useCallback(
    amount => {
      if (reverbRef.current && reverbEnabled) {
        const clampedAmount = Math.max(0, Math.min(1, amount));
        reverbRef.current.wet.value = clampedAmount;
        console.log(`🎵 [AUDIO-ENGINE] Reverb amount set to: ${clampedAmount}`);
      }
    },
    [reverbEnabled]
  );

  // Enable or disable audio playback
  const setAudioEnabled = useCallback(enabled => {
    setIsAudioEnabled(enabled);
    console.log(
      `🎵 [AUDIO-ENGINE] Audio playback ${enabled ? 'enabled' : 'disabled'}`
    );
  }, []);

  // Get current audio engine status
  const getAudioStatus = useCallback(() => {
    const contextInfo = getAudioContextInfo();

    return {
      isInitialized,
      isAudioEnabled,
      isLoading,
      audioError,
      errorDetails,
      audioContextState: contextInfo.state,
      sampleRate: contextInfo.sampleRate,
      sustainedNotes: sustainedNotesRef.current.size,
      polyphony: AUDIO_CONFIG.POLYPHONY,
      toneJSLoaded: typeof Tone !== 'undefined',
      synthReady: !!synthRef.current,
      effectsReady: !!(
        reverbRef.current &&
        compressorRef.current &&
        masterVolumeRef.current
      ),
      naturalDecayTimers: naturalDecayTimersRef.current.size,
    };
  }, [isInitialized, isAudioEnabled, isLoading, audioError, errorDetails]);

  // Sync with audio store volume changes
  useEffect(() => {
    if (isInitialized) {
      setVolume(volume);
    }
  }, [volume, isInitialized, setVolume]);

  // Sync with audio store master volume changes
  useEffect(() => {
    if (isInitialized) {
      setMasterVolume(masterVolume);
    }
  }, [masterVolume, isInitialized, setMasterVolume]);

  // Sync with audio store reverb settings
  useEffect(() => {
    if (isInitialized) {
      setReverbEnabled(reverbEnabled);
    }
  }, [reverbEnabled, isInitialized, setReverbEnabled]);

  useEffect(() => {
    if (isInitialized) {
      setReverbAmount(reverbAmount);
    }
  }, [reverbAmount, isInitialized, setReverbAmount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        // Clear all natural decay timers
        naturalDecayTimersRef.current.forEach((timer, note) => {
          clearInterval(timer);
          console.log(
            `🎹 [PIANO-DECAY] Cleared decay timer for ${note} during cleanup`
          );
        });
        naturalDecayTimersRef.current.clear();

        // Release all sustained notes
        sustainedNotesRef.current.forEach((timestamp, note) => {
          if (synthRef.current) {
            synthRef.current.triggerRelease(note);
          }
        });
        sustainedNotesRef.current.clear();

        // Dispose of Tone.js objects
        const audioResources = [
          synthRef.current,
          reverbRef.current,
          compressorRef.current,
          masterVolumeRef.current,
        ].filter(Boolean);

        disposeAudioResources(audioResources);

        // Clear refs
        synthRef.current = null;
        reverbRef.current = null;
        compressorRef.current = null;
        masterVolumeRef.current = null;

        setInitialized(false);
        console.log(
          '🎹 [AUDIO-ENGINE] Enhanced audio engine disposed with decay cleanup'
        );
      } catch (error) {
        console.error('🎹 [AUDIO-ENGINE] Error disposing audio engine:', error);
      }
    };
  }, [setInitialized]);

  return {
    // State
    isAudioInitialized: isInitialized,
    isAudioReady: isInitialized && isAudioContextRunning(),
    isAudioEnabled,
    isAudioLoading: isLoading,
    audioError,
    audioErrorDetails: errorDetails,

    // Core functions
    initializeAudio,
    resumeAudioContext,

    // Note playback
    playNote,
    stopNote,
    stopAllNotes,
    playNoteByName,
    sustainNote,

    // Audio controls
    setVolume,
    setMasterVolume,
    setReverbEnabled,
    setReverbAmount,
    setAudioEnabled,

    // Utilities
    getAudioStatus,
    convertToToneNote,

    // Advanced features
    calculatePianoDecayParams,
    getNaturalDecayTime: note => getNaturalDecayTime(note),
    getDecayRate: note => getDecayRate(note),
  };
};
