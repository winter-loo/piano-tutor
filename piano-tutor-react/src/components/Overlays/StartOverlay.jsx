import React, { useState, useEffect } from 'react';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';
import useUIStore from '../../stores/uiStore.js';
import './Overlays.css';

const StartOverlay = ({ onStart }) => {
  const { initializeAudio, isAudioInitialized, audioError } = useAudioEngine();
  const { 
    showStartOverlay, 
    hideStartOverlay, 
    isAudioLoading, 
    setAudioLoading,
    setError,
    clearError 
  } = useUIStore();

  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationError, setInitializationError] = useState(null);

  // Handle start button click - initialize audio engine like original index.html
  const handleStart = async () => {
    try {
      setIsInitializing(true);
      setInitializationError(null);
      setAudioLoading(true);
      clearError();

      console.log('🎹 [START-OVERLAY] Starting audio initialization...');

      // Initialize audio engine (like original index.html start overlay click)
      const audioInitialized = await initializeAudio();
      
      if (!audioInitialized) {
        throw new Error('Failed to initialize audio engine');
      }

      console.log('🎹 [START-OVERLAY] Audio initialization successful');

      // Call the onStart callback if provided (this should initialize game state)
      if (onStart) {
        await onStart();
      }

      // Hide the start overlay - now ready for piano key presses to trigger playback
      hideStartOverlay();

    } catch (error) {
      console.error('🎹 [START-OVERLAY] Initialization failed:', error);
      setInitializationError(error.message);
      setError(error.message, 'audio');
    } finally {
      setIsInitializing(false);
      setAudioLoading(false);
    }
  };

  // Handle overlay background click (close overlay)
  const handleOverlayClick = (event) => {
    // Only close if clicking the overlay background, not the content
    if (event.target === event.currentTarget) {
      hideStartOverlay();
    }
  };

  // Handle escape key to close overlay
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showStartOverlay) {
        hideStartOverlay();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showStartOverlay, hideStartOverlay]);

  // Don't render if overlay should not be shown
  if (!showStartOverlay) {
    return null;
  }

  return (
    <div 
      className="start-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-overlay-title"
      aria-describedby="start-overlay-description"
    >
      <div className="start-overlay-content">
        <div className="app-branding">
          <span className="logo" role="img" aria-label="Piano">🎹</span>
        </div>
        
        <h1 id="start-overlay-title">Piano Tutor</h1>
        
        <p className="subtitle">
          Learn to play "Different Colors" by Walk the Moon
        </p>
        
        <p className="description" id="start-overlay-description">
          Interactive piano learning with real-time feedback, MIDI support, and professional audio synthesis.
          Click Start to begin your musical journey!
        </p>

        {/* Error display */}
        {(initializationError || audioError) && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span className="error-text">
              {initializationError || audioError}
            </span>
            <button 
              className="error-retry"
              onClick={() => {
                setInitializationError(null);
                clearError();
              }}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Start button */}
        <button 
          className="start-button"
          onClick={handleStart}
          disabled={isInitializing || isAudioLoading}
          aria-describedby={isInitializing ? "loading-indicator" : undefined}
        >
          {isInitializing ? 'Initializing...' : 'Start Learning'}
        </button>

        {/* Loading indicator */}
        {(isInitializing || isAudioLoading) && (
          <div className="loading-indicator" id="loading-indicator" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true"></span>
            <span className="loading-text">
              {isAudioInitialized ? 'Preparing lesson...' : 'Initializing audio engine...'}
            </span>
          </div>
        )}

        {/* Audio status indicator */}
        {isAudioInitialized && !isInitializing && (
          <div className="audio-status success" role="status">
            <span className="status-icon">✓</span>
            <span className="status-text">Audio engine ready</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartOverlay;
