import { useMemo } from 'react';
import { NOTE_COLORS } from '../../utils/constants';

const NoteRectangle = ({
  note,
  currentTime = 0,
  isPlaying = false,
  isCurrent = false,
  isCorrect = false,
  isIncorrect = false,
  className = '',
  style = {},
}) => {
  const {
    pitch,
    startTime = 0,
    duration = 1,
    x = 0,
    y = 0,
    width = 22,
    height = 22,
    type = 'quarter',
    color,
    noteIndex,
  } = note;

  // Determine note state based on timing and user input
  const noteState = useMemo(() => {
    if (isIncorrect) return 'incorrect';
    if (isCorrect) return 'correct';
    if (
      isCurrent ||
      (isPlaying &&
        currentTime >= startTime &&
        currentTime <= startTime + duration)
    ) {
      return 'current';
    }
    return 'default';
  }, [
    isPlaying,
    currentTime,
    startTime,
    duration,
    isCurrent,
    isCorrect,
    isIncorrect,
  ]);

  // Get note color from constants or use provided color
  const getNoteColor = useMemo(() => {
    if (color) return color;

    const noteName = pitch.replace(/[0-9]/g, ''); // Remove octave number
    return NOTE_COLORS[noteName] || '#cccccc';
  }, [pitch, color]);

  // Apply different styles based on note state
  const noteClasses = [
    'note-rectangle',
    `pitch-${pitch}`,
    `state-${noteState}`,
    noteState === 'current' ? 'current' : '',
    noteState === 'correct' ? 'correct-note' : '',
    note.timingFeedback ? `timing-${note.timingFeedback}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Calculate dynamic styles based on state
  const dynamicStyles = useMemo(() => {
    const baseStyle = {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: getNoteColor,
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      userSelect: 'none',
    };

    // Apply state-specific styling
    switch (noteState) {
      case 'current':
        return {
          ...baseStyle,
          transform: 'scale(1.1)',
          boxShadow: '0 0 10px rgba(231, 76, 60, 0.6)',
          zIndex: 15,
        };
      case 'correct':
        return {
          ...baseStyle,
          boxShadow: '0 0 15px rgba(40, 167, 69, 0.8)',
          zIndex: 10,
          transform: 'scale(1.05)',
        };
      case 'incorrect':
        return {
          ...baseStyle,
          // backgroundColor: '#cccccc !important',
          // opacity: 0.8,
          // zIndex: 20,
        };
      default:
        return {
          ...baseStyle,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          zIndex: 5,
        };
    }
  }, [x, y, width, height, getNoteColor, noteState]);

  // Combine with custom styles
  const combinedStyle = { ...dynamicStyles, ...style };

  // Handle note click for interaction
  const handleNoteClick = () => {
    // Could emit events for note selection or interaction
    console.log(`Note clicked: ${pitch} at ${startTime}`);
  };

  return (
    <div
      className={noteClasses}
      style={combinedStyle}
      data-pitch={pitch}
      data-start-time={startTime}
      data-duration={duration}
      data-note-index={noteIndex}
      data-state={noteState}
      title={`${pitch} - ${type} note (${startTime}s)`}
      onClick={handleNoteClick}
      role="button"
      tabIndex={0}
      aria-label={`${pitch} ${type} note at ${startTime} seconds`}
    >
      {/* Note content - could include note name or musical symbol */}
      <span
        className="note-label"
        style={{
          fontSize: '10px',
          color: 'white',
          fontWeight: 'bold',
          textShadow: '0 1px 1px rgba(0,0,0,0.3)',
          display: 'block',
          textAlign: 'center',
          lineHeight: `${height}px`,
        }}
      >
        {pitch}
      </span>
    </div>
  );
};

export default NoteRectangle;
