import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Individual piano key component with visual feedback and interaction handling
 */
const PianoKey = ({
  keyData,
  isPressed = false,
  isActive = false,
  isCorrect = false,
  isIncorrect = false,
  onPress,
  onRelease,
  onLeave,
  showLabel = true,
  animationsEnabled = true,
  disabled = false,
}) => {
  // Memoize CSS classes for performance with enhanced visual feedback states
  const keyClasses = useMemo(() => {
    const { note, type } = keyData;
    const noteName = note.replace(/[0-9]/g, ''); // Remove octave number for color coding
    
    let classes = `piano-key ${type}`;
    
    // Disabled state
    if (disabled) {
      classes += ' disabled';
    }
    
    // Interaction states with priority order (most important last)
    if (isPressed) {
      classes += ' pressed';
    }
    
    if (isActive) {
      classes += ' active';
    }
    
    // Visual feedback states with color coding
    if (isCorrect) {
      classes += ` correct correct-${noteName}`;
    }
    
    if (isIncorrect) {
      classes += ' incorrect incorrect-gray';
    }
    
    return classes;
  }, [keyData, isPressed, isActive, isCorrect, isIncorrect, disabled, animationsEnabled]);

  // Handle mouse/touch events with proper event handling and disabled state
  const handleMouseDown = useCallback((event) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    onPress?.(event, keyData);
  }, [onPress, keyData, disabled]);

  const handleMouseUp = useCallback((event) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    onRelease?.(event, keyData);
  }, [onRelease, keyData, disabled]);

  const handleMouseLeave = useCallback((event) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    onLeave?.(event, keyData);
  }, [onLeave, keyData, disabled]);

  const handleTouchStart = useCallback((event) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    onPress?.(event, keyData);
  }, [onPress, keyData, disabled]);

  const handleTouchEnd = useCallback((event) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    onRelease?.(event, keyData);
  }, [onRelease, keyData, disabled]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((event) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onPress?.(event, keyData);
    }
  }, [onPress, keyData, disabled]);

  const handleKeyUp = useCallback((event) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onRelease?.(event, keyData);
    }
  }, [onRelease, keyData, disabled]);

  // Prevent context menu
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div
      className={keyClasses}
      data-note={keyData.note}
      data-type={keyData.type}
      data-testid={`piano-key-${keyData.note}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onContextMenu={handleContextMenu}

      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Piano key ${keyData.note} ${keyData.type}`}
      aria-pressed={isPressed}
      aria-disabled={disabled}
    >
      {showLabel && (
        <span className="key-label" aria-hidden="true">
          {keyData.label}
        </span>
      )}
    </div>
  );
};

PianoKey.propTypes = {
  keyData: PropTypes.shape({
    note: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['white', 'black']).isRequired,
    position: PropTypes.number,
    afterWhiteKey: PropTypes.string,
  }).isRequired,
  isPressed: PropTypes.bool,
  isActive: PropTypes.bool,
  isCorrect: PropTypes.bool,
  isIncorrect: PropTypes.bool,
  onPress: PropTypes.func,
  onRelease: PropTypes.func,
  onLeave: PropTypes.func,
  showLabel: PropTypes.bool,
  animationsEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default React.memo(PianoKey);