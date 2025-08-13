import React from 'react';

const NoteRectangle = ({ note, currentTime = 0, isPlaying = false }) => {
  const {
    pitch,
    startTime,
    duration,
    x,
    y,
    width = 22,
    height = 22,
    type = 'quarter'
  } = note;

  // Determine if this note is currently being played
  const isCurrent = isPlaying && 
    currentTime >= startTime && 
    currentTime <= (startTime + duration);

  // Apply different styles based on note state
  const noteClasses = [
    'note-rectangle',
    isCurrent ? 'current' : '',
    note.isCorrect === false ? 'incorrect-note' : '',
    note.timingFeedback ? `timing-${note.timingFeedback}` : ''
  ].filter(Boolean).join(' ');

  // Note colors based on pitch (extracted from original CSS)
  const getNoteColor = (pitch) => {
    const noteColors = {
      'C': '#CE82FF',
      'D': '#FF9602', 
      'E': '#57CD03',
      'F': '#CC348E',
      'G': '#3498db',
      'A': '#e74c3c',
      'B': '#f39c12'
    };
    
    const noteName = pitch.replace(/[0-9]/g, ''); // Remove octave number
    return noteColors[noteName] || '#64c83d';
  };

  const noteStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: getNoteColor(pitch),
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
    zIndex: isCurrent ? 15 : 5
  };

  return (
    <div 
      className={noteClasses}
      style={noteStyle}
      data-pitch={pitch}
      data-start-time={startTime}
      data-duration={duration}
      title={`${pitch} - ${type} note`}
    >
      {/* Note content - could include note name or musical symbol */}
      <span className="note-label">{pitch}</span>
    </div>
  );
};

export default NoteRectangle;
