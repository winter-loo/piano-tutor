import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PianoKeyboard.css';
import PianoKey from './PianoKey';
import MIDIControls from '../MIDIControls/MIDIControls';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useTouch } from '../../hooks/useTouch';
import useMIDI from '../../hooks/useMIDI';
import useGameStore from '../../stores/gameStore';
import useUIStore from '../../stores/uiStore';

const PianoKeyboard = ({
  onKeyPress,
  onKeyRelease,
  activeKeys = new Set(),
  correctKeys = new Set(),
  incorrectKeys = new Set(),
  disabled = false,
  className = '',
}) => {
  // Local state for pressed keys tracking
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [keyboardReady, setKeyboardReady] = useState(false);
  
  // Refs for managing async operations and keyboard state
  const pendingOperations = useRef(new Map());
  const keyboardRef = useRef(null);
  
  // Hooks
  const { 
    playNote, 
    stopNote, 
    initializeAudio, 
    isAudioInitialized,
    isAudioReady,
    resumeAudioContext 
  } = useAudioEngine();
  const { keyLayout, findBlackKeyAfter, getKeyboardDimensions } = useKeyboard();
  const { setMessageHandlers, activeNotes } = useMIDI();
  const { isTouchDevice, createTouchHandlers, preventDefaultTouch } = useTouch();
  
  // Store integration
  const { showKeyLabels, animationsEnabled } = useUIStore();
  const { 
    addPressedKey, 
    removePressedKey,
    isKeyPressed,
    isKeyCorrect,
    isKeyIncorrect 
  } = useGameStore();

  // Destructure keyboard layout with enhanced positioning
  const { whiteKeys, blackKeys } = keyLayout;

  // Initialize keyboard on mount
  useEffect(() => {
    setKeyboardReady(true);
    console.log('🎹 [KEYBOARD] Piano keyboard initialized');
  }, []);



  // Memoize keyboard dimensions for responsive design
  const keyboardDimensions = useMemo(() => {
    return getKeyboardDimensions();
  }, [getKeyboardDimensions]);

  // Memoize key states for performance with enhanced state tracking
  const keyStates = useMemo(() => {
    const states = new Map();
    
    [...whiteKeys, ...blackKeys].forEach(key => {
      const note = key.note;
      states.set(note, {
        isPressed: pressedKeys.has(note) || isKeyPressed(note) || activeNotes.has(note),
        isActive: activeKeys.has(note) || activeNotes.has(note),
        isCorrect: correctKeys.has(note) || isKeyCorrect(note),
        isIncorrect: incorrectKeys.has(note) || isKeyIncorrect(note),
      });
    });
    
    return states;
  }, [
    whiteKeys, 
    blackKeys, 
    pressedKeys, 
    activeKeys, 
    correctKeys, 
    incorrectKeys,
    activeNotes,
    isKeyPressed,
    isKeyCorrect,
    isKeyIncorrect
  ]);

  // Handle key press with enhanced error handling and state management
  const handleKeyPress = useCallback(
    async (event, keyData) => {
      if (disabled || !keyboardReady) {
        console.log(`🎹 [KEYBOARD] Key press ignored - disabled: ${disabled}, ready: ${keyboardReady}`);
        return;
      }
      
      const note = keyData.note;

      // Prevent duplicate operations
      if (pendingOperations.current.has(note) || pressedKeys.has(note)) {
        console.log(`🎹 [KEYBOARD] Key press ignored - already processing or pressed: ${note}`);
        return;
      }

      try {
        // Ensure audio context is ready for immediate feedback
        if (!isAudioReady) {
          console.log('🎹 [KEYBOARD] Resuming audio context for immediate feedback');
          await resumeAudioContext();
        }

        // Create and track the key press operation
        const keyPressOperation = performKeyPress(event, keyData);
        pendingOperations.current.set(note, keyPressOperation);
        
        await keyPressOperation;
      } catch (error) {
        console.error(`🎹 [KEYBOARD] Error handling key press for ${note}:`, error);
      } finally {
        pendingOperations.current.delete(note);
      }
    },
    [disabled, keyboardReady, pressedKeys, isAudioReady, resumeAudioContext]
  );

  // Perform the actual key press operation with enhanced feedback
  const performKeyPress = useCallback(
    async (event, keyData) => {
      const note = keyData.note;
      const velocity = calculateVelocity(event, keyData);
      const timestamp = Date.now();

      console.log(`🎹 [KEYBOARD] Performing key press: ${note} (velocity: ${velocity})`);

      // Update local state immediately for responsive UI
      setPressedKeys(prev => new Set([...prev, note]));
      
      // Update game store
      addPressedKey(note);

      // Play audio feedback with immediate response
      try {
        await playNote(note, velocity);
        console.log(`🎹 [KEYBOARD] Audio feedback played for ${note}`);
      } catch (audioError) {
        console.warn(`🎹 [KEYBOARD] Audio playback failed for ${note}:`, audioError);
        // Continue without audio - visual feedback still works
      }

      // Notify parent component with enhanced event data
      if (onKeyPress) {
        onKeyPress({
          note,
          velocity,
          source: 'virtual',
          timestamp,
          keyData,
          event: {
            type: event.type,
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
      }

      console.log(`🎹 [KEYBOARD] Key press completed: ${note} (velocity: ${velocity})`);
    },
    [playNote, onKeyPress, addPressedKey]
  );

  // Calculate velocity based on interaction type and force
  const calculateVelocity = useCallback((event, keyData) => {
    // Base velocity for virtual keyboard
    let velocity = 0.8;
    
    // Adjust velocity based on interaction type
    if (event.type === 'touchstart') {
      // Touch events can provide force information
      const touch = event.touches?.[0];
      if (touch && touch.force !== undefined) {
        velocity = Math.min(1.0, Math.max(0.3, touch.force * 1.2));
      }
    } else if (event.type === 'mousedown') {
      // Mouse events - use default velocity but could be enhanced
      velocity = 0.8;
    }
    
    // Slight velocity variation for black vs white keys (black keys typically played softer)
    if (keyData.type === 'black') {
      velocity *= 0.9;
    }
    
    return Math.round(velocity * 100) / 100; // Round to 2 decimal places
  }, []);

  // Handle key release with proper cleanup
  const handleKeyRelease = useCallback(
    async (event, keyData) => {
      if (disabled || !keyboardReady) {
        console.log(`🎹 [KEYBOARD] Key release ignored - disabled: ${disabled}, ready: ${keyboardReady}`);
        return;
      }
      
      const note = keyData.note;

      // Wait for any pending operations to complete
      if (pendingOperations.current.has(note)) {
        try {
          await pendingOperations.current.get(note);
        } catch (error) {
          console.warn(`🎹 [KEYBOARD] Pending operation error for ${note}:`, error);
        }
      }

      // Only proceed if key is actually pressed
      if (!pressedKeys.has(note) && !isKeyPressed(note)) {
        console.log(`🎹 [KEYBOARD] Key release ignored - not pressed: ${note}`);
        return;
      }

      try {
        await performKeyRelease(event, keyData);
      } catch (error) {
        console.error(`🎹 [KEYBOARD] Error handling key release for ${note}:`, error);
      }
    },
    [disabled, keyboardReady, pressedKeys, isKeyPressed]
  );

  // Perform the actual key release operation with enhanced cleanup
  const performKeyRelease = useCallback(
    async (event, keyData) => {
      const note = keyData.note;
      const timestamp = Date.now();

      console.log(`🎹 [KEYBOARD] Performing key release: ${note}`);

      // Update local state immediately for responsive UI
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      
      // Update game store
      removePressedKey(note);

      // Clear correct/incorrect visual feedback on key release
      const gameStore = useGameStore.getState();
      if (gameStore.isKeyCorrect(note)) {
        gameStore.correctKeys.delete(note);
      }
      if (gameStore.isKeyIncorrect(note)) {
        gameStore.incorrectKeys.delete(note);
      }

      // Stop audio with proper cleanup
      try {
        await stopNote(note);
        console.log(`🎹 [KEYBOARD] Audio stopped for ${note}`);
      } catch (audioError) {
        console.warn(`🎹 [KEYBOARD] Audio stop failed for ${note}:`, audioError);
      }

      // Notify parent component with enhanced event data
      if (onKeyRelease) {
        onKeyRelease({
          note,
          source: 'virtual',
          timestamp,
          keyData,
          event: {
            type: event.type,
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
      }

      console.log(`🎹 [KEYBOARD] Key release completed: ${note}`);
    },
    [stopNote, onKeyRelease, removePressedKey]
  );

  // Handle mouse/touch leave to prevent stuck keys with enhanced detection
  const handleKeyLeave = useCallback(
    (event, keyData) => {
      const note = keyData.note;
      
      // Auto-release key if it's currently pressed to prevent stuck keys
      if (pressedKeys.has(note) || isKeyPressed(note)) {
        console.log(`🎹 [KEYBOARD] Auto-releasing key on leave: ${note}`);
        handleKeyRelease(event, keyData);
      }
    },
    [pressedKeys, isKeyPressed, handleKeyRelease]
  );

  // Handle keyboard focus and blur events
  const handleKeyboardFocus = useCallback(() => {
    console.log('🎹 [KEYBOARD] Keyboard focused');
  }, []);

  const handleKeyboardBlur = useCallback(() => {
    console.log('🎹 [KEYBOARD] Keyboard blurred - releasing all keys');
    // Release all pressed keys when keyboard loses focus
    pressedKeys.forEach(note => {
      const keyData = [...whiteKeys, ...blackKeys].find(key => key.note === note);
      if (keyData) {
        performKeyRelease({ type: 'blur' }, keyData);
      }
    });
  }, [pressedKeys, whiteKeys, blackKeys, performKeyRelease]);

  // Set up MIDI message handlers
  useEffect(() => {
    const handleMIDINotePressed = (noteData) => {
      console.log('🎹 [KEYBOARD] MIDI note pressed:', noteData);
      
      // Find the key data for this note
      const keyData = [...whiteKeys, ...blackKeys].find(key => key.note === noteData.note);
      if (keyData) {
        // Create a synthetic event for MIDI input
        const syntheticEvent = {
          type: 'midi',
          clientX: 0,
          clientY: 0,
          touches: null,
        };
        
        // Trigger the same key press handler used for virtual keyboard
        handleKeyPress(syntheticEvent, keyData);
      }
    };

    const handleMIDINoteReleased = (noteData) => {
      console.log('🎹 [KEYBOARD] MIDI note released:', noteData);
      
      // Find the key data for this note
      const keyData = [...whiteKeys, ...blackKeys].find(key => key.note === noteData.note);
      if (keyData) {
        // Create a synthetic event for MIDI input
        const syntheticEvent = {
          type: 'midi',
          clientX: 0,
          clientY: 0,
          touches: null,
        };
        
        // Trigger the same key release handler used for virtual keyboard
        handleKeyRelease(syntheticEvent, keyData);
      }
    };

    // Set the MIDI message handlers
    setMessageHandlers({
      onNotePressed: handleMIDINotePressed,
      onNoteReleased: handleMIDINoteReleased,
    });

    console.log('🎹 [KEYBOARD] MIDI message handlers set up');
  }, [whiteKeys, blackKeys, handleKeyPress, handleKeyRelease, setMessageHandlers]);

  // Render individual piano key using PianoKey component with enhanced props
  const renderPianoKey = useCallback(
    (keyData) => {
      const keyState = keyStates.get(keyData.note) || {};
      
      return (
        <PianoKey
          key={keyData.note}
          keyData={keyData}
          isPressed={keyState.isPressed}
          isActive={keyState.isActive}
          isCorrect={keyState.isCorrect}
          isIncorrect={keyState.isIncorrect}
          onPress={handleKeyPress}
          onRelease={handleKeyRelease}
          onLeave={handleKeyLeave}
          showLabel={showKeyLabels}
          animationsEnabled={animationsEnabled}
          disabled={disabled || !keyboardReady}
        />
      );
    },
    [
      keyStates, 
      handleKeyPress, 
      handleKeyRelease, 
      handleKeyLeave, 
      showKeyLabels,
      animationsEnabled,
      disabled,
      keyboardReady
    ]
  );

  // Memoize keyboard container classes
  const containerClasses = useMemo(() => {
    let classes = 'keyboard-container';
    if (className) classes += ` ${className}`;
    return classes;
  }, [className]);

  return (
    <div 
      className={containerClasses}
      style={{
        '--keyboard-width': `${keyboardDimensions.width}px`,
        '--keyboard-height': `${keyboardDimensions.height}px`,
      }}
    >
      {/* MIDI Controls - positioned absolutely in top right */}
      <MIDIControls />
      
      <div 
        ref={keyboardRef}
        className="keyboard"
        onFocus={handleKeyboardFocus}
        onBlur={handleKeyboardBlur}
        tabIndex={-1}
        role="application"
        aria-label="Virtual Piano Keyboard"
        aria-disabled={disabled}
      >
        {whiteKeys.map((whiteKey, index) => {
          const blackKeyAfter = findBlackKeyAfter(whiteKey.note);

          return (
            <div 
              key={whiteKey.note} 
              className="piano-key-container"
              data-key-position={index}
              style={{
                '--key-position': index,
                '--has-black-key': blackKeyAfter ? 'true' : 'false'
              }}
            >
              {renderPianoKey(whiteKey)}
              {blackKeyAfter && renderPianoKey(blackKeyAfter)}
            </div>
          );
        })}
      </div>
      

    </div>
  );
};

// PropTypes for type checking
PianoKeyboard.propTypes = {
  onKeyPress: PropTypes.func,
  onKeyRelease: PropTypes.func,
  activeKeys: PropTypes.instanceOf(Set),
  correctKeys: PropTypes.instanceOf(Set),
  incorrectKeys: PropTypes.instanceOf(Set),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

PianoKeyboard.defaultProps = {
  onKeyPress: null,
  onKeyRelease: null,
  activeKeys: new Set(),
  correctKeys: new Set(),
  incorrectKeys: new Set(),
  disabled: false,
  className: '',
};

export default React.memo(PianoKeyboard);
