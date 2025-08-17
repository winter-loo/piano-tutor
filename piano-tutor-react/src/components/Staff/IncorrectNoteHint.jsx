import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { NotePositioning } from '../../utils/notePositioning';

/**
 * Component to display incorrect note hints on the staff
 * Shows a gray note at the playback line position when user presses wrong key
 */
const IncorrectNoteHint = ({ 
  incorrectNote, 
  playbackLinePosition = 30, // Default playback line position
  onRemove,
  autoRemoveDelay = 1000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const notePositioning = useMemo(() => new NotePositioning(), []);

  // Auto-remove after delay (like original implementation)
  useEffect(() => {
    if (!incorrectNote || !isVisible) return;

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      // Call onRemove callback after fade out animation
      setTimeout(() => {
        onRemove?.(incorrectNote);
      }, 300); // Match CSS transition duration
    }, autoRemoveDelay);

    return () => clearTimeout(timeoutId);
  }, [incorrectNote, autoRemoveDelay, onRemove, isVisible]);

  // Calculate note position and dimensions
  const noteStyle = useMemo(() => {
    if (!incorrectNote) return {};

    // Get vertical position based on note pitch (like original)
    const yPosition = notePositioning.getVerticalPosition(incorrectNote);
    
    // Get note width (eighth note like original)
    const width = notePositioning.getNoteWidth('eighth');
    
    return {
      position: 'absolute',
      left: `${playbackLinePosition}px`, // Position at playback line
      top: `${yPosition}px`,
      width: `${width}px`,
      height: '22px',
      borderRadius: '4px',
      zIndex: 20,
      // Gray styling for incorrect note (matching original CSS)
      backgroundColor: '#cccccc',
      opacity: isVisible ? 0.8 : 0,
      color: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      transition: 'opacity 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
      pointerEvents: 'none', // Don't interfere with other interactions
    };
  }, [incorrectNote, playbackLinePosition, notePositioning, isVisible]);

  // Don't render if no incorrect note
  if (!incorrectNote) return null;

  return (
    <div
      className="incorrect-note-hint"
      style={noteStyle}
      data-incorrect-note={incorrectNote}
    >
      {/* Show note name inside the hint */}
      {incorrectNote.replace(/[0-9]/g, '')} {/* Remove octave number */}
    </div>
  );
};

IncorrectNoteHint.propTypes = {
  incorrectNote: PropTypes.string, // Note name like "C4", "F#4", etc.
  playbackLinePosition: PropTypes.number, // X position of playback line
  onRemove: PropTypes.func, // Callback when hint is removed
  autoRemoveDelay: PropTypes.number, // Delay before auto-removal in ms
};

export default React.memo(IncorrectNoteHint);
