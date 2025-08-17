import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import './StaffNotation.css';
import PlaybackLine from './PlaybackLine';
import NotesContainer from './NotesContainer';
import IncorrectNoteHint from './IncorrectNoteHint';
import { TempoControl, ProgressBar } from '../Controls';
import useAudioStore from '../../stores/audioStore';
import useGameStore from '../../stores/gameStore';
import { STAFF_CONFIG } from '../../utils/constants';
import { NotePositioning } from '../../utils/notePositioning';

const StaffNotation = ({
  notes = [],
  measures = [],
  currentTime = 0,
  isPlaying = false,
  tempo = 60,
  onTempoChange,
  onProgressClick,
  progressPercentage = 0,
  className = '',
}) => {
  const staffContainerRef = useRef(null);
  const staffRef = useRef(null);

  // Manual navigation state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastTouchX, setLastTouchX] = useState(0);
  
  // Progress bar drag state to prevent conflicts
  const [isProgressBarDragging, setIsProgressBarDragging] = useState(false);
  
  // Incorrect note hints state
  const [incorrectNoteHints, setIncorrectNoteHints] = useState([]);

  // Store integration
  const audioStore = useAudioStore();
  const gameStore = useGameStore();

  // Use store values if props are not provided, ensuring valid numbers
  const effectiveCurrentTime = useMemo(() => {
    const time = currentTime || audioStore.currentTime || 0;
    return isNaN(time) ? 0 : Number(time);
  }, [currentTime, audioStore.currentTime]);
  
  const effectiveIsPlaying = isPlaying || audioStore.isPlaying;
  const effectiveTempo = tempo || audioStore.tempo;
  const effectiveNotes = notes.length > 0 ? notes : gameStore.currentNotes;

  // Staff lines configuration
  const staffLines = useMemo(
    () =>
      Array.from({ length: STAFF_CONFIG.LINES_COUNT }, (_, index) => index + 1),
    []
  );

  // Handle tempo changes
  const handleTempoChange = newTempo => {
    if (onTempoChange) {
      onTempoChange(newTempo);
    } else {
      audioStore.setTempo(newTempo);
    }
  };

  // Calculate total song width using proper note positioning
  const totalSongWidth = useMemo(() => {
    if (!measures || measures.length === 0) return 0;
    
    const notePositioning = new NotePositioning();
    const positionedNotes = notePositioning.calculateAllNotePositions(measures);
    
    if (positionedNotes.length === 0) return 0;
    
    // Calculate total width using the same logic as original HTML
    const maxX = Math.max(...positionedNotes.map(note => note.x + note.width));
    return maxX + 200; // Add padding for smooth ending
  }, [measures]);

  // Helper function to constrain position within song boundaries
  const constrainPosition = useCallback((position) => {
    const minPosition = 0; // Beginning of song
    const maxPosition = totalSongWidth; // End of song
    
    // Clamp position between min and max
    return Math.max(minPosition, Math.min(position, maxPosition));
  }, [totalSongWidth]);

  // Find nearest note to a given position (implementing attachToNearestNote logic)
  const findNearestNote = useCallback((targetPosition) => {
    if (!effectiveNotes || effectiveNotes.length === 0) return null;

    let closestNoteIndex = null;
    let closestDistance = Infinity;
    let closestOffset = 0;

    // Check all notes to find the one closest to the target position
    for (let i = 0; i < effectiveNotes.length; i++) {
      const note = effectiveNotes[i];

      // Skip rest notes
      if (note.pitch === 'rest') continue;

      // Calculate distance from note's left edge to target position
      const offset = note.x - targetPosition;
      const distance = Math.abs(offset);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestNoteIndex = i;
        closestOffset = offset;
      }

      // Early exit if we've passed the target position by too much
      if (note.x > targetPosition + 200) {
        break;
      }
    }

    return closestNoteIndex !== null ? {
      noteIndex: closestNoteIndex,
      note: effectiveNotes[closestNoteIndex],
      offset: closestOffset,
      distance: closestDistance
    } : null;
  }, [effectiveNotes]);

  // Attach to nearest note (implementing original attachToNearestNote functionality)
  const attachToNearestNote = useCallback((targetPosition) => {
    const nearestNote = findNearestNote(targetPosition);
    
    if (nearestNote) {
      // Adjust position to align with the nearest note
      const adjustedPosition = targetPosition + nearestNote.offset;
      const constrainedPosition = constrainPosition(adjustedPosition);
      
      console.log(`[attachToNearestNote] note(index ${nearestNote.noteIndex}), targetPosition: ${targetPosition} adjustedPosition: ${adjustedPosition} offset: ${nearestNote.offset}`);
      
      return constrainedPosition;
    }
    
    return constrainPosition(targetPosition);
  }, [findNearestNote, constrainPosition]);

  // Handle progress bar clicks with note attachment
  const handleProgressClick = useCallback((percentage) => {
    if (onProgressClick) {
      onProgressClick(percentage);
    } else {
      // Calculate time based on percentage and duration
      const newTime = (percentage / 100) * audioStore.duration;
      audioStore.setCurrentTime(newTime);
      
      // Calculate corresponding staff position using the memoized total width
      if (totalSongWidth > 0) {
        const targetPosition = (percentage / 100) * totalSongWidth;
        
        // Attach to nearest note (implementing requirement 1.2)
        const attachedPosition = attachToNearestNote(targetPosition);
        
        // Update staff position immediately
        setCurrentPosition(attachedPosition);
        
        // Apply the position to the notes container with smooth transition
        const notesContainer = staffContainerRef.current?.querySelector('.notes-container');
        if (notesContainer) {
          notesContainer.style.transform = `translate3d(-${attachedPosition}px, 0, 0)`;
          notesContainer.style.transition = 'transform 0.3s ease'; // Smooth transition animation
        }
        
        console.log(`Progress bar clicked: ${percentage}% -> Target: ${targetPosition}px -> Attached: ${attachedPosition}px (Total width: ${totalSongWidth}px)`);
      }
    }
  }, [onProgressClick, audioStore, totalSongWidth, attachToNearestNote]);

  // Calculate progress percentage
  const calculatedProgress = useMemo(() => {
    if (progressPercentage > 0) return progressPercentage;
    return audioStore.getProgress() * 100;
  }, [progressPercentage, audioStore.currentTime, audioStore.duration]);

  // Manual navigation event handlers
  const handlePointerStart = useCallback((event) => {
    // Prevent staff dragging if progress bar is being dragged
    if (isProgressBarDragging) {
      return;
    }
    
    event.preventDefault();
    
    // Get the pointer position with error handling
    let clientX;
    if (event.type === 'touchstart') {
      if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
      } else {
        return;
      }
    } else {
      clientX = event.clientX;
    }

    console.log('Pointer interaction started at:', clientX, '- Manual navigation active');

    // Pause automatic playback when manual interaction begins
    if (effectiveIsPlaying && audioStore.pause) {
      audioStore.pause();
      console.log('Automatic playback paused for manual navigation');
    }

    // Initialize drag state
    setIsDragging(true);
    setDragStartX(clientX);
    setDragStartPosition(currentPosition);
    setLastTouchX(clientX);
  }, [effectiveIsPlaying, audioStore, currentPosition, isProgressBarDragging]);

  const handlePointerMove = useCallback((event) => {
    if (!isDragging || isProgressBarDragging) return;

    // Prevent default browser behaviors for smooth interaction
    event.preventDefault();

    // Get the current pointer position with error handling
    let clientX;
    if (event.type === 'touchmove') {
      if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
      } else {
        return;
      }
    } else {
      clientX = event.clientX;
    }

    // Calculate drag distance and apply sensitivity
    const dragDistance = clientX - dragStartX;
    const dragSensitivity = 1.2; // Slightly amplify drag movements
    const adjustedDragDistance = dragDistance * dragSensitivity;

    // Update the current position based on drag distance
    // Negative drag distance moves staff left (forward in time)
    // Positive drag distance moves staff right (backward in time)
    const newPosition = dragStartPosition - adjustedDragDistance;
    
    // Apply boundary constraints
    const constrainedPosition = constrainPosition(newPosition);
    
    setCurrentPosition(constrainedPosition);
    setLastTouchX(clientX);

    // Apply transform to notes-container (like original HTML) with hardware acceleration
    const notesContainer = staffRef.current?.querySelector('.notes-container');
    if (notesContainer) {
      // Use translate3d for hardware acceleration and remove transition during manual interaction
      notesContainer.style.transform = `translate3d(${-constrainedPosition}px, 0, 0)`;
      notesContainer.style.transition = 'none';
    }

    // Update progress based on position
    const totalWidth = effectiveNotes.length * 88; // Approximate total width
    if (totalWidth > 0) {
      const progressPercent = Math.max(0, Math.min(100, (constrainedPosition / totalWidth) * 100));
      if (onProgressClick) {
        onProgressClick(progressPercent);
      }
    }
  }, [isDragging, dragStartX, dragStartPosition, staffRef, effectiveNotes, onProgressClick, constrainPosition, isProgressBarDragging]);

  const handlePointerEnd = useCallback((event) => {
    if (!isDragging || isProgressBarDragging) return;

    console.log('Manual navigation ended');

    // Implement staff snapping to nearest note after manual drag (requirement 3.1, 3.2)
    const attachedPosition = attachToNearestNote(currentPosition);
    
    // Update position to snapped location
    setCurrentPosition(attachedPosition);
    
    // Apply snapped position with smooth transition (requirement 3.3)
    const notesContainer = staffRef.current?.querySelector('.notes-container');
    if (notesContainer) {
      notesContainer.style.transform = `translate3d(-${attachedPosition}px, 0, 0)`;
      notesContainer.style.transition = 'transform 0.3s ease'; // Smooth snapping animation
    }

    // Reset drag state
    setIsDragging(false);
    setDragStartX(0);
    setDragStartPosition(0);
    
    console.log(`Manual drag ended: snapped to position ${attachedPosition}px`);
  }, [isDragging, staffRef, currentPosition, attachToNearestNote, isProgressBarDragging]);

  // Initialize staff interaction handlers
  useEffect(() => {
    const staffContainer = staffRef.current;
    if (!staffContainer) return;

    // Mouse event handlers
    staffContainer.addEventListener('mousedown', handlePointerStart);
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerEnd);

    // Touch event handlers
    staffContainer.addEventListener('touchstart', handlePointerStart, { passive: false });
    document.addEventListener('touchmove', handlePointerMove, { passive: false });
    document.addEventListener('touchend', handlePointerEnd);

    console.log('Staff interaction handlers initialized');

    return () => {
      // Cleanup event listeners
      staffContainer.removeEventListener('mousedown', handlePointerStart);
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerEnd);
      staffContainer.removeEventListener('touchstart', handlePointerStart);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerEnd);
    };
  }, [handlePointerStart, handlePointerMove, handlePointerEnd]);

  // Self-driving animation loop using requestAnimationFrame (like original HTML implementation)
  useEffect(() => {
    let animationId = null;
    let startTime = null;
    let initialPosition = currentPosition;

    const animate = (timestamp) => {
      if (!effectiveIsPlaying || isDragging || isProgressBarDragging) {
        return;
      }

      // Initialize start time on first frame
      if (startTime === null) {
        startTime = timestamp - (initialPosition / 60); // Convert position back to time
      }

      // Calculate elapsed time and new position
      const elapsedTime = timestamp - startTime;
      const newPosition = elapsedTime * 0.06; // 60px per second = 0.06px per ms

      // Update staff position
      const notesContainer = staffRef.current?.querySelector('.notes-container');
      if (notesContainer) {
        notesContainer.style.transform = `translate3d(-${newPosition}px, 0, 0)`;
        notesContainer.style.transition = 'none'; // Remove transition for smooth requestAnimationFrame
        setCurrentPosition(newPosition);
      }

      // Check if we've reached the end of the song
      if (newPosition >= totalSongWidth) {
        console.log('Song playback completed');
        // Stop playback by calling audioStore or onProgressClick
        if (audioStore.pause) {
          audioStore.pause();
        }
        return;
      }

      // Continue animation loop
      animationId = requestAnimationFrame(animate);
    };

    // Start animation loop when playing
    if (effectiveIsPlaying && !isDragging && !isProgressBarDragging) {
      animationId = requestAnimationFrame(animate);
    }

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [effectiveIsPlaying, isDragging, isProgressBarDragging, totalSongWidth, audioStore]);

  // Function to display incorrect note hint (like original implementation)
  const displayIncorrectNoteHint = useCallback((incorrectNote) => {
    const timestamp = Date.now();
    const newHint = {
      note: incorrectNote,
      timestamp: timestamp
    };
    
    setIncorrectNoteHints(prev => [...prev, newHint]);
    console.log(`Displaying incorrect note hint: ${incorrectNote} at playback line`);
  }, []);

  // Expose displayIncorrectNoteHint function to parent components
  useEffect(() => {
    if (staffContainerRef.current) {
      staffContainerRef.current.displayIncorrectNoteHint = displayIncorrectNoteHint;
    }
  }, [displayIncorrectNoteHint]);

  const containerClasses = `staff-container ${className}`.trim();

  return (
    <div className={containerClasses} ref={staffContainerRef}>
      {/* Progress Bar */}
      <ProgressBar
        onSeek={(targetTime, percentage) => {
          // Handle both time and percentage for proper staff positioning
          handleProgressClick(percentage);
        }}
        onDragStart={() => {
          // Set progress bar drag state to prevent conflicts with staff dragging
          setIsProgressBarDragging(true);
          
          // Pause playback during drag operations
          if (effectiveIsPlaying && audioStore.pause) {
            audioStore.pause();
            console.log('Playback paused for progress bar drag');
          }
        }}
        onDragMove={(targetTime, percentage) => {
          // Real-time staff updates during progress bar drag (requirement 1.4)
          if (totalSongWidth > 0) {
            const targetPosition = (percentage / 100) * totalSongWidth;
            
            // Update staff position immediately without snapping during drag
            setCurrentPosition(targetPosition);
            const notesContainer = staffContainerRef.current?.querySelector('.notes-container');
            if (notesContainer) {
              notesContainer.style.transform = `translate3d(-${targetPosition}px, 0, 0)`;
              notesContainer.style.transition = 'none'; // No transition during drag for immediate feedback
            }
            
            console.log(`Progress bar drag move: ${percentage.toFixed(1)}% -> Staff position: ${targetPosition}px`);
          }
        }}
        onDragEnd={(finalPercentage) => {
          // Clear progress bar drag state
          setIsProgressBarDragging(false);
          
          // Attach to nearest note after drag ends (implementing requirement 1.4)
          if (totalSongWidth > 0) {
            const targetPosition = (finalPercentage / 100) * totalSongWidth;
            const attachedPosition = attachToNearestNote(targetPosition);
            
            // Update staff position with smooth transition
            setCurrentPosition(attachedPosition);
            const notesContainer = staffContainerRef.current?.querySelector('.notes-container');
            if (notesContainer) {
              notesContainer.style.transform = `translate3d(-${attachedPosition}px, 0, 0)`;
              notesContainer.style.transition = 'transform 0.3s ease';
            }
            
            console.log(`Progress bar drag ended: ${finalPercentage}% -> Attached to position: ${attachedPosition}px`);
          }
        }}
      />

      {/* Playback Line with smooth animation */}
      <PlaybackLine
        currentTime={effectiveCurrentTime}
        isPlaying={effectiveIsPlaying}
      />

      {/* Static staff lines that remain fixed during animation */}
      <div className="staff-lines">
        {staffLines.map(lineNumber => (
          <div key={lineNumber} className="staff-line" />
        ))}
      </div>

      {/* Static treble clef that doesn't move */}
      <div className="treble-clef">𝄞</div>

      {/* Animated content container - only this moves */}
      <div className={`staff ${isDragging ? 'dragging' : ''}`} ref={staffRef}>
        <NotesContainer
          notes={effectiveNotes}
          measures={measures}
          currentTime={effectiveCurrentTime}
          isPlaying={effectiveIsPlaying}
        />
        
        {/* Incorrect note hints positioned at playback line */}
        {incorrectNoteHints.map((hint, index) => (
          <IncorrectNoteHint
            key={`${hint.note}-${hint.timestamp}-${index}`}
            incorrectNote={hint.note}
            playbackLinePosition={30} // Fixed playback line position
            onRemove={(note) => {
              setIncorrectNoteHints(prev => 
                prev.filter(h => !(h.note === note && h.timestamp === hint.timestamp))
              );
            }}
            autoRemoveDelay={1000}
          />
        ))}
      </div>

      {/* Tempo control - integrated musical design */}
      <TempoControl />
    </div>
  );
};

export default StaffNotation;
