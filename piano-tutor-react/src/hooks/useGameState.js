import { useState, useCallback, useRef, useEffect } from 'react';
import useGameStore from '../stores/gameStore.js';
import { TIMING_CONFIG } from '../utils/constants.js';

/**
 * Custom hook for managing game state and note evaluation logic
 * Handles note matching, timing evaluation, and game progression
 */
export const useGameState = () => {
  const {
    // Game state
    isPlaying,
    isPaused,
    isCompleted,
    currentSong,
    currentNotes,
    currentNoteIndex,
    
    // Note tracking
    pressedKeys,
    correctKeys,
    incorrectKeys,
    expectedNotes,
    
    // Scoring
    score,
    totalNotes,
    correctNotes,
    incorrectNotes,
    missedNotes,
    accuracy,
    currentStreak,
    bestStreak,
    streakMultiplier,
    
    // Actions
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    evaluateNote,
    missNote,
    setExpectedNotes,
    addExpectedNote,
    removeExpectedNote,
    advanceNoteIndex,
    setNoteIndex,
    addPressedKey,
    removePressedKey,
    clearKeyStates,
    resetGame,
    
    // Getters
    getAccuracy,
    getCurrentNote,
    getProgress,
    isKeyPressed,
    isKeyCorrect,
    isKeyIncorrect,
  } = useGameStore();

  // Local state for timing and evaluation
  const [currentTime, setCurrentTime] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Refs for timing calculations
  const gameStartTimeRef = useRef(null);
  const noteTimingRef = useRef(new Map()); // Track when notes should be played
  const evaluationTimeoutRef = useRef(null);

  /**
   * Start a new game session
   */
  const handleStartGame = useCallback((song) => {
    console.log('🎮 [GAME-STATE] Starting new game with song:', song?.title || 'Unknown');
    
    gameStartTimeRef.current = Date.now();
    setCurrentTime(0);
    setIsEvaluating(false);
    
    // Initialize note timing map
    noteTimingRef.current.clear();
    if (song?.notes) {
      song.notes.forEach((note, index) => {
        noteTimingRef.current.set(index, {
          expectedTime: note.startTime || 0,
          note: note.pitch || note.note,
          duration: note.duration || 1,
          played: false,
        });
      });
    }
    
    startGame(song);
  }, [startGame]);

  /**
   * Handle note press with timing evaluation
   */
  const handleNotePress = useCallback((note, pressTime = Date.now()) => {
    if (!isPlaying || isPaused) {
      console.log('🎮 [GAME-STATE] Note press ignored - game not active');
      return { isCorrect: false, timing: 0, feedback: 'Game not active' };
    }

    console.log('🎮 [GAME-STATE] Evaluating note press:', note, 'at time:', pressTime);
    
    // Calculate timing relative to game start
    const gameTime = gameStartTimeRef.current ? (pressTime - gameStartTimeRef.current) / 1000 : pressTime / 1000;
    setCurrentTime(gameTime);
    
    // Add to pressed keys
    addPressedKey(note);
    
    // Find the expected note at current time
    const expectedNote = findExpectedNoteAtTime(gameTime);
    
    if (!expectedNote) {
      console.log('🎮 [GAME-STATE] No expected note at current time');
      return evaluateIncorrectNote(note, gameTime, 'No expected note');
    }
    
    // Check if the pressed note matches the expected note
    const isCorrectNote = normalizeNoteName(note) === normalizeNoteName(expectedNote.note);
    
    if (!isCorrectNote) {
      console.log('🎮 [GAME-STATE] Wrong note pressed. Expected:', expectedNote.note, 'Got:', note);
      return evaluateIncorrectNote(note, gameTime, 'Wrong note');
    }
    
    // Calculate timing accuracy
    const timingError = gameTime - expectedNote.expectedTime;
    const timingAccuracy = evaluateTimingAccuracy(timingError);
    
    console.log('🎮 [GAME-STATE] Correct note with timing:', timingAccuracy);
    
    // Mark note as played
    const noteIndex = Array.from(noteTimingRef.current.entries())
      .find(([_, noteData]) => noteData === expectedNote)?.[0];
    
    if (noteIndex !== undefined) {
      const noteData = noteTimingRef.current.get(noteIndex);
      noteData.played = true;
      noteTimingRef.current.set(noteIndex, noteData);
    }
    
    // Evaluate the correct note
    evaluateNote(note, Math.abs(timingError));
    
    return {
      isCorrect: true,
      timing: timingError,
      timingAccuracy,
      feedback: getTimingFeedback(timingAccuracy),
      expectedNote: expectedNote.note,
    };
  }, [isPlaying, isPaused, addPressedKey, evaluateNote]);

  /**
   * Handle note release
   */
  const handleNoteRelease = useCallback((note) => {
    if (!isPlaying) return;
    
    console.log('🎮 [GAME-STATE] Note released:', note);
    removePressedKey(note);
    
    // Clear visual feedback after a delay
    setTimeout(() => {
      const newCorrectKeys = new Set(correctKeys);
      const newIncorrectKeys = new Set(incorrectKeys);
      newCorrectKeys.delete(note);
      newIncorrectKeys.delete(note);
    }, 500);
  }, [isPlaying, removePressedKey, correctKeys, incorrectKeys]);

  /**
   * Find the expected note at a given time
   */
  const findExpectedNoteAtTime = useCallback((gameTime) => {
    const tolerance = TIMING_CONFIG.LATE_THRESHOLD;
    
    // Find notes that should be played around this time
    const candidateNotes = Array.from(noteTimingRef.current.values())
      .filter(noteData => {
        const timeDiff = Math.abs(gameTime - noteData.expectedTime);
        return timeDiff <= tolerance && !noteData.played;
      })
      .sort((a, b) => Math.abs(gameTime - a.expectedTime) - Math.abs(gameTime - b.expectedTime));
    
    return candidateNotes[0] || null;
  }, []);

  /**
   * Evaluate timing accuracy
   */
  const evaluateTimingAccuracy = useCallback((timingError) => {
    const absError = Math.abs(timingError);
    
    if (absError <= TIMING_CONFIG.PERFECT_THRESHOLD) {
      return 'perfect';
    } else if (absError <= TIMING_CONFIG.EARLY_THRESHOLD) {
      return timingError < 0 ? 'early' : 'late';
    } else if (absError <= TIMING_CONFIG.LATE_THRESHOLD) {
      return timingError < 0 ? 'early' : 'late';
    } else {
      return 'missed';
    }
  }, []);

  /**
   * Get timing feedback message
   */
  const getTimingFeedback = useCallback((timingAccuracy) => {
    const feedbackMessages = {
      perfect: 'Perfect!',
      early: 'A bit early',
      late: 'A bit late',
      missed: 'Missed timing',
    };
    
    return feedbackMessages[timingAccuracy] || 'Good';
  }, []);

  /**
   * Evaluate incorrect note press
   */
  const evaluateIncorrectNote = useCallback((note, gameTime, reason) => {
    console.log('🎮 [GAME-STATE] Incorrect note evaluation:', reason);
    
    // Add to incorrect keys for visual feedback
    const newIncorrectKeys = new Set(incorrectKeys);
    newIncorrectKeys.add(note);
    
    // Evaluate as incorrect in store
    evaluateNote(note, 999); // High timing error for incorrect notes
    
    return {
      isCorrect: false,
      timing: 0,
      timingAccuracy: 'incorrect',
      feedback: reason,
      expectedNote: null,
    };
  }, [incorrectKeys, evaluateNote]);

  /**
   * Normalize note names for comparison (handle enharmonic equivalents)
   */
  const normalizeNoteName = useCallback((note) => {
    if (!note) return '';
    
    // Convert flats to sharps for consistent comparison
    const enharmonicMap = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };
    
    // Extract note name and octave
    const match = note.match(/^([A-G][#b]?)(\d+)$/);
    if (!match) return note;
    
    const [, noteName, octave] = match;
    const normalizedNoteName = enharmonicMap[noteName] || noteName;
    
    return `${normalizedNoteName}${octave}`;
  }, []);

  /**
   * Update current time and check for missed notes
   */
  const updateGameTime = useCallback((newTime) => {
    setCurrentTime(newTime);
    
    if (!isPlaying || isPaused) return;
    
    // Check for missed notes
    const currentGameTime = gameStartTimeRef.current ? 
      (Date.now() - gameStartTimeRef.current) / 1000 : newTime;
    
    const missedNotes = Array.from(noteTimingRef.current.entries())
      .filter(([_, noteData]) => {
        const timePassed = currentGameTime - noteData.expectedTime;
        return timePassed > TIMING_CONFIG.LATE_THRESHOLD && !noteData.played;
      });
    
    // Mark missed notes
    missedNotes.forEach(([noteIndex, noteData]) => {
      console.log('🎮 [GAME-STATE] Note missed:', noteData.note, 'at time:', noteData.expectedTime);
      noteData.played = true; // Mark as processed
      noteTimingRef.current.set(noteIndex, noteData);
      missNote();
    });
  }, [isPlaying, isPaused, missNote]);

  /**
   * Set expected notes for current time window
   */
  const updateExpectedNotes = useCallback((gameTime, lookAheadTime = 2.0) => {
    const upcomingNotes = Array.from(noteTimingRef.current.values())
      .filter(noteData => {
        const timeUntilNote = noteData.expectedTime - gameTime;
        return timeUntilNote >= -TIMING_CONFIG.LATE_THRESHOLD && 
               timeUntilNote <= lookAheadTime && 
               !noteData.played;
      })
      .map(noteData => noteData.note);
    
    setExpectedNotes(upcomingNotes);
  }, [setExpectedNotes]);

  /**
   * Get current game statistics
   */
  const getGameStats = useCallback(() => {
    const currentAccuracy = getAccuracy();
    const progress = getProgress();
    
    return {
      score,
      accuracy: currentAccuracy,
      progress,
      totalNotes,
      correctNotes,
      incorrectNotes,
      missedNotes,
      currentStreak,
      bestStreak,
      streakMultiplier,
      currentTime,
      isPlaying,
      isPaused,
      isCompleted,
    };
  }, [
    score, getAccuracy, getProgress, totalNotes, correctNotes, 
    incorrectNotes, missedNotes, currentStreak, bestStreak, 
    streakMultiplier, currentTime, isPlaying, isPaused, isCompleted
  ]);

  /**
   * Check if game should end
   */
  const checkGameCompletion = useCallback(() => {
    if (!isPlaying || isPaused) return;
    
    const allNotesProcessed = Array.from(noteTimingRef.current.values())
      .every(noteData => noteData.played);
    
    if (allNotesProcessed && currentNotes.length > 0) {
      console.log('🎮 [GAME-STATE] Game completed - all notes processed');
      endGame();
    }
  }, [isPlaying, isPaused, currentNotes.length, endGame]);

  /**
   * Reset game state
   */
  const handleResetGame = useCallback(() => {
    console.log('🎮 [GAME-STATE] Resetting game state');
    
    gameStartTimeRef.current = null;
    noteTimingRef.current.clear();
    setCurrentTime(0);
    setIsEvaluating(false);
    
    if (evaluationTimeoutRef.current) {
      clearTimeout(evaluationTimeoutRef.current);
      evaluationTimeoutRef.current = null;
    }
    
    resetGame();
  }, [resetGame]);

  // Update expected notes based on current time
  useEffect(() => {
    if (isPlaying && !isPaused) {
      updateExpectedNotes(currentTime);
      checkGameCompletion();
    }
  }, [currentTime, isPlaying, isPaused, updateExpectedNotes, checkGameCompletion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (evaluationTimeoutRef.current) {
        clearTimeout(evaluationTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Game state
    isPlaying,
    isPaused,
    isCompleted,
    currentTime,
    currentSong,
    currentNotes,
    currentNoteIndex,
    
    // Note tracking
    pressedKeys,
    correctKeys,
    incorrectKeys,
    expectedNotes,
    
    // Game statistics
    getGameStats,
    getAccuracy,
    getCurrentNote,
    getProgress,
    
    // Game controls
    startGame: handleStartGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame: handleResetGame,
    
    // Note evaluation
    handleNotePress,
    handleNoteRelease,
    updateGameTime,
    
    // Utility functions
    normalizeNoteName,
    evaluateTimingAccuracy,
    getTimingFeedback,
    
    // Key state checkers
    isKeyPressed,
    isKeyCorrect,
    isKeyIncorrect,
  };
};

export default useGameState;