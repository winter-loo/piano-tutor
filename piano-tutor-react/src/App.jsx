import React, { useEffect, useMemo, useCallback } from 'react';
import './App.css';

// Import responsive styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/responsive.css';

// Components
import StaffNotation from './components/Staff/StaffNotation';
import PianoKeyboard from './components/PianoKeyboard/PianoKeyboard';
import MIDIControls from './components/MIDIControls/MIDIControls';
import StartOverlay from './components/Overlays/StartOverlay';
import EndingOverlay from './components/Overlays/EndingOverlay';
import ErrorBoundary from './components/UI/ErrorBoundary';
import LoadingSpinner from './components/UI/LoadingSpinner';
import RotationMessage from './components/UI/RotationMessage';

// Demo Components
import MusicStaffDemo from './components/Staff/MusicStaffDemo';
import DemoNavigation from './components/DemoNavigation';

// Hooks
import { useAudioEngine } from './hooks/useAudioEngine';
import useMIDI from './hooks/useMIDI';
import { useGameState } from './hooks/useGameState';
import { usePerformanceTracking } from './hooks/usePerformanceTracking';

// Stores
import useAudioStore from './stores/audioStore';
import useGameStore from './stores/gameStore';
import useMIDIStore from './stores/midiStore';
import useUIStore from './stores/uiStore';

// Utils
import { NotePositioning } from './utils/notePositioning';

function App() {
  // Check for demo mode from URL parameters - memoized to prevent infinite re-renders
  const { demoMode, hasDemoParam } = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('demo');
    const hasDemo = urlParams.has('demo');
    
    console.log('🎹 [APP] URL params:', window.location.search);
    console.log('🎹 [APP] Demo mode:', mode);
    console.log('🎹 [APP] Has demo param:', hasDemo);
    
    return {
      demoMode: mode,
      hasDemoParam: hasDemo
    };
  }, []); // Empty dependency array - only run once on mount

  // If demo parameter exists, render demo mode
  if (hasDemoParam) {
    let demoComponent;
    let demoTitle = 'Component Demo';

    switch (demoMode) {
      case 'music-staff':
        demoComponent = <MusicStaffDemo />;
        demoTitle = 'Music Staff Demo';
        break;
      case null:
      case '':
        // Show demo navigation when ?demo is present but empty
        demoComponent = <DemoNavigation />;
        demoTitle = 'Component Demos';
        break;
      default:
        demoComponent = (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Demo not found: "{demoMode}"</h2>
            <p>Available demos can be found on the <a href="?demo">demo index page</a>.</p>
          </div>
        );
        demoTitle = 'Demo Not Found';
    }

    return (
      <ErrorBoundary>
        <div className="demo-container">
          <div className="demo-header">
            <h1>Piano Tutor - {demoTitle}</h1>
            <a href="/" className="back-link">← Back to App</a>
          </div>
          {demoComponent}
        </div>
      </ErrorBoundary>
    );
  }

  // console.log('🎹 [APP] Rendering main app - not in demo mode');

  // Audio store state
  const {
    isInitialized: isAudioInitialized,
    isPlaying: isAudioPlaying,
    currentTime,
    tempo,
    setTempo,
    setCurrentTime,
    setDuration,
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
  } = useAudioStore();

  // Game store state
  const {
    isPlaying: isGamePlaying,
    isPaused: isGamePaused,
    isCompleted: isGameCompleted,
    currentSong,
    pressedKeys,
    correctKeys,
    incorrectKeys,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
  } = useGameStore();

  // UI store state
  const {
    showStartOverlay,
    showEndingOverlay,
    hideStartOverlay,
    showEndingOverlay: showEndingOverlayAction,
    isLoading,
    hasError,
    errorMessage,
    setError,
    clearError,
  } = useUIStore();

  // MIDI store state
  const { isConnected: isMIDIConnected } = useMIDIStore();

  // Custom hooks
  const {
    isAudioReady,
    audioError,
    initializeAudio,
    playNote,
    stopNote,
  } = useAudioEngine();

  const {
    initializeMIDI,
    setMessageHandlers,
  } = useMIDI();

  const {
    handleNotePress,
    handleNoteRelease,
    updateGameTime,
  } = useGameState();

  const {
    startPerformanceTracking,
    stopPerformanceTracking,
    trackNotePerformance,
  } = usePerformanceTracking();

  // Initialize note positioning utility
  const notePositioning = useMemo(() => new NotePositioning(), []);

  // Song data - "Different Colors" by Walk the Moon
  const songData = useMemo(() => ({
    title: 'Different Colors',
    artist: 'Walk the Moon',
    measures: [
      {
        notes: [
          { pitch: 'D4', duration: 'quarter', fingering: 2 },
          { pitch: 'F4', duration: 'quarter', fingering: 4 },
          { pitch: 'C4', duration: 'quarter', fingering: 1 },
          { pitch: 'rest', duration: 'quarter', fingering: null },
        ],
      },
      {
        notes: [
          { pitch: 'G4', duration: 'quarter', fingering: 5 },
          { pitch: 'A4', duration: 'eighth', fingering: 1 },
          { pitch: 'G4', duration: 'eighth', fingering: 5 },
          { pitch: 'F4', duration: 'quarter', fingering: 4 },
          { pitch: 'rest', duration: 'quarter', fingering: null },
        ],
      },
      {
        notes: [
          { pitch: 'D4', duration: 'quarter', fingering: 2 },
          { pitch: 'F4', duration: 'quarter', fingering: 4 },
          { pitch: 'C4', duration: 'quarter', fingering: 1 },
          { pitch: 'rest', duration: 'quarter', fingering: null },
        ],
      },
      {
        notes: [
          { pitch: 'G4', duration: 'quarter', fingering: 5 },
          { pitch: 'A4', duration: 'eighth', fingering: 1 },
          { pitch: 'G4', duration: 'eighth', fingering: 5 },
          { pitch: 'F4', duration: 'quarter', fingering: 4 },
          { pitch: 'rest', duration: 'quarter', fingering: null },
        ],
      },
      {
        notes: [
          { pitch: 'A4', duration: 'quarter', fingering: 1 },
          { pitch: 'C5', duration: 'quarter', fingering: 3 },
          { pitch: 'A4', duration: 'dotted_quarter', fingering: 1 },
          { pitch: 'F4', duration: 'eighth', fingering: 4 },
        ],
      },
      {
        notes: [
          { pitch: 'A4', duration: 'dotted_quarter', fingering: 1 },
          { pitch: 'G4', duration: 'eighth', fingering: 5 },
          { pitch: 'F4', duration: 'half', fingering: 4 },
        ],
      },
    ],
  }), []);

  // Calculate positioned notes
  const positionedNotes = useMemo(() => {
    return notePositioning.calculateAllNotePositions(songData.measures);
  }, [notePositioning, songData.measures]);

  // Calculate total song duration based on note count and tempo
  const totalDuration = useMemo(() => {
    if (!songData.measures || songData.measures.length === 0) return 10;
    
    // Calculate total beats (assuming quarter notes = 1 beat each)
    let totalBeats = 0;
    songData.measures.forEach(measure => {
      measure.notes.forEach(note => {
        // Convert note duration to beats
        const durationMap = {
          eighth: 0.5,
          quarter: 1,
          dotted_quarter: 1.5,
          half: 2,
          whole: 4,
        };
        totalBeats += durationMap[note.duration] || 1;
      });
    });
    
    // Convert beats to seconds based on tempo (BPM)
    const beatsPerSecond = tempo / 60;
    const durationInSeconds = totalBeats / beatsPerSecond;
    
    console.log('🎹 [APP] Calculated duration:', {
      totalBeats,
      tempo,
      beatsPerSecond,
      durationInSeconds
    });
    
    return Math.max(durationInSeconds, 10); // Minimum 10 seconds
  }, [songData.measures, tempo]);

  // Set duration in audio store when totalDuration changes
  useEffect(() => {
    if (totalDuration > 0) {
      setDuration(totalDuration);
      console.log('🎹 [APP] Set audio store duration to:', totalDuration);
    }
  }, [totalDuration]); // Remove setDuration from dependencies to prevent circular updates

  // Initialize systems on mount
  useEffect(() => {
    const initializeSystems = async () => {
      try {
        console.log('🎹 [APP] Initializing Piano Tutor systems...');

        // Initialize MIDI if supported
        if (navigator.requestMIDIAccess && initializeMIDI) {
          await initializeMIDI();
        } else {
          console.log('🎹 [APP] MIDI not supported or initializeMIDI not available');
        }

        console.log('🎹 [APP] Systems initialized successfully');
      } catch (error) {
        console.error('🎹 [APP] Error initializing systems:', error);
        if (setError) {
          setError(error.message, 'general');
        }
      }
    };

    initializeSystems();
  }, [initializeMIDI, setError]);

  // Handle application start - simplified version
  const handleStart = useCallback(async () => {
    try {
      console.log('🎹 [APP] Starting Piano Tutor application...');

      // Hide the start overlay first
      if (hideStartOverlay) {
        hideStartOverlay();
      }

      // Try to initialize audio if available
      if (initializeAudio) {
        try {
          await initializeAudio();
          console.log('🎹 [APP] Audio initialized successfully');
        } catch (audioError) {
          console.warn('🎹 [APP] Audio initialization failed, continuing without audio:', audioError);
        }
      }

      // Try to start the game if available
      if (startGame) {
        try {
          startGame(positionedNotes);
          console.log('🎹 [APP] Game started successfully');
        } catch (gameError) {
          console.warn('🎹 [APP] Game start failed, continuing:', gameError);
        }
      }

      // Try to start performance tracking if available
      if (startPerformanceTracking) {
        try {
          startPerformanceTracking();
          console.log('🎹 [APP] Performance tracking started');
        } catch (trackingError) {
          console.warn('🎹 [APP] Performance tracking failed, continuing:', trackingError);
        }
      }

      console.log('🎹 [APP] Application started successfully');
    } catch (error) {
      console.error('🎹 [APP] Error starting application:', error);
      // Don't show error, just hide overlay anyway
      if (hideStartOverlay) {
        hideStartOverlay();
      }
    }
  }, [hideStartOverlay, initializeAudio, startGame, songData, startPerformanceTracking]);

  // Handle game restart
  const handleRestart = useCallback(() => {
    try {
      console.log('🎹 [APP] Restarting game...');

      // Reset game state
      resetGame();

      // Stop audio
      stopAudio();

      // Reset audio time
      setCurrentTime(0);

      // Start new game
      startGame(positionedNotes);

      // Restart performance tracking
      startPerformanceTracking();

      console.log('🎹 [APP] Game restarted successfully');
    } catch (error) {
      console.error('🎹 [APP] Error restarting game:', error);
      setError(error.message, 'general');
    }
  }, [resetGame, stopAudio, setCurrentTime, startGame, songData, startPerformanceTracking, setError]);

  // Get store instances at component level (not inside callback)
  const gameStoreInstance = useGameStore();
  const audioStoreInstance = useAudioStore();

  // Handle piano key press - following original index.html flow
  const handleKeyPress = useCallback(async (keyData) => {
    try {
      console.log('🎹 [APP] Key pressed:', keyData);
      
      // Add key to pressed keys in game store
      gameStoreInstance.addPressedKey(keyData.note);

      // Process learning feedback (like original processLearningFeedback)
      const expectedNote = gameStoreInstance.getCurrentNote();
      const isCorrect = expectedNote && expectedNote.pitch === keyData.note;

      if (isCorrect) {
        console.log(`✅ Correct note: ${keyData.note}`);
        
        // Add to correct keys
        gameStoreInstance.addCorrectKey(keyData.note);
        
        // Start playback if not already playing (like original)
        if (!gameStoreInstance.isPlaying) {
          gameStoreInstance.resumeGame();
          audioStoreInstance.play();
          console.log('🎵 Starting playback from correct key press');
        }

        // Advance to next note
        gameStoreInstance.advanceNoteIndex();
        
        // Track performance
        if (trackNotePerformance) {
          trackNotePerformance({
            note: keyData.note,
            isCorrect: true,
            timingError: 0,
            timingAccuracy: 'perfect',
          });
        }
      } else {
        console.log(`❌ Incorrect note: ${keyData.note}, expected: ${expectedNote?.pitch || 'none'}`);
        
        // Add to incorrect keys
        gameStoreInstance.addIncorrectKey(keyData.note);
        
        // Display incorrect note hint on staff (like original implementation)
        const staffContainer = document.querySelector('.staff-container');
        if (staffContainer && staffContainer.displayIncorrectNoteHint) {
          staffContainer.displayIncorrectNoteHint(keyData.note);
        }
        
        // Track performance
        if (trackNotePerformance) {
          trackNotePerformance({
            note: keyData.note,
            isCorrect: false,
            timingError: 0,
            timingAccuracy: 'incorrect',
          });
        }
      }

      // Play audio feedback
      if (isAudioReady && playNote) {
        await playNote(keyData.note, 0.8);
      }

    } catch (error) {
      console.error('🎹 [APP] Error handling key press:', error);
    }
  }, [gameStoreInstance, audioStoreInstance, isAudioReady, playNote, trackNotePerformance]);

  // Handle piano key release
  const handleKeyRelease = useCallback(async (keyData) => {
    try {
      console.log('🎹 [APP] Key released:', keyData);

      // Handle note release in game logic
      if (handleNoteRelease) {
        handleNoteRelease(keyData.note);
      }

      // Stop audio
      if (isAudioReady && stopNote) {
        await stopNote(keyData.note);
      }

    } catch (error) {
      console.error('🎹 [APP] Error handling key release:', error);
    }
  }, [handleNoteRelease, isAudioReady, stopNote]);

  // Handle tempo changes
  const handleTempoChange = useCallback((newTempo) => {
    console.log('🎹 [APP] Tempo changed to:', newTempo);
    setTempo(newTempo);
  }, [setTempo]);

  // Handle progress bar clicks
  const handleProgressClick = useCallback((percentage) => {
    const newTime = (percentage / 100) * totalDuration;
    console.log('🎹 [APP] Progress clicked:', percentage, '% -> time:', newTime);
    setCurrentTime(newTime);
  }, [totalDuration, setCurrentTime]);

  // Handle game completion
  useEffect(() => {
    if (isGameCompleted && !showEndingOverlay) {
      console.log('🎹 [APP] Game completed, showing ending overlay');

      // Stop performance tracking
      stopPerformanceTracking();

      // Stop audio
      stopAudio();

      // Show ending overlay
      showEndingOverlayAction();
    }
  }, [isGameCompleted, showEndingOverlay, stopPerformanceTracking, stopAudio, showEndingOverlayAction]);

  // Handle MIDI input
  useEffect(() => {
    if (isMIDIConnected) {
      // MIDI message handling is managed by the useMIDI hook
      // and will trigger the appropriate key press/release handlers
      console.log('🎹 [APP] MIDI connected and ready');
    }
  }, [isMIDIConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🎹 [APP] Cleaning up Piano Tutor application...');

      // Stop audio playback
      stopAudio();

      // Stop performance tracking
      stopPerformanceTracking();

      // Clear any errors
      clearError();

      console.log('🎹 [APP] Cleanup completed');
    };
  }, [stopAudio, stopPerformanceTracking, clearError]);

  // Handle browser beforeunload for cleanup
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Stop audio to prevent hanging notes
      stopAudio();

      // Stop performance tracking
      stopPerformanceTracking();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stopAudio, stopPerformanceTracking]);

  // Handle visibility change for resource management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause if playing
        if (isAudioPlaying && isGamePlaying) {
          pauseAudio();
          pauseGame();
          console.log('🎹 [APP] Paused due to page visibility change');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAudioPlaying, isGamePlaying, pauseAudio, pauseGame]);

  // Determine application state for routing logic
  const getApplicationState = () => {
    if (showStartOverlay) return 'start';
    if (showEndingOverlay) return 'ended';
    if (isGamePlaying && !isGamePaused) return 'playing';
    if (isGamePaused) return 'paused';
    return 'ready';
  };

  const applicationState = getApplicationState();

  // Render loading state
  if (isLoading) {
    return (
      <div className="app-container loading">
        <LoadingSpinner size="large" text="Loading Piano Tutor..." />
      </div>
    );
  }

  // Render error state
  if (hasError && !showStartOverlay) {
    return (
      <div className="app-container error">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{errorMessage}</p>
          <button onClick={clearError} className="error-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#f8f9fa',
        position: 'relative'
      }}>
        {/* Start Overlay - using inline styles to avoid CSS conflicts */}
        {showStartOverlay && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '40px 50px',
              textAlign: 'center',
              color: 'white',
              maxWidth: '600px',
              width: '90%',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎹</div>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '700',
                marginBottom: '20px',
                background: 'linear-gradient(45deg, #3498db, #2ecc71)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 20px 0'
              }}>Piano Tutor</h1>
              <p style={{
                fontSize: '1.4rem',
                marginBottom: '15px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '300'
              }}>
                Learn to play "Different Colors" by Walk the Moon
              </p>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '40px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto 40px auto'
              }}>
                Interactive piano learning with real-time feedback, MIDI support, and professional audio synthesis.
                Click Start to begin your musical journey!
              </p>
              <button
                onClick={handleStart}
                style={{
                  background: 'linear-gradient(45deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 40px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(40, 167, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.3)';
                }}
              >
                Start Learning
              </button>
            </div>
          </div>
        )}

        {/* Main Application Interface - only show when start overlay is hidden */}
        {!showStartOverlay && (
          <div className={`app-container app-state-${applicationState}`}>
            {/* Staff Notation */}
            <StaffNotation
              notes={positionedNotes}
              measures={songData.measures}
            />

            {/* Piano Keyboard */}
            <PianoKeyboard
              onKeyPress={handleKeyPress}
              onKeyRelease={handleKeyRelease}
              activeKeys={pressedKeys || new Set()}
              correctKeys={correctKeys || new Set()}
              incorrectKeys={incorrectKeys || new Set()}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
