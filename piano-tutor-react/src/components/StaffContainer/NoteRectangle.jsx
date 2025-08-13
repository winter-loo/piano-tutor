import React from 'react';

const NoteRectangle = ({ 
  note, 
  left, 
  top, 
  width = 40, 
  isCurrent = false, 
  isCorrect = false 
}) => {
  // Note colors based on pitch - exact from original HTML
  const getNoteColor = (pitch) => {
    const noteColors = {
      'C': '#CE82FF',  // Purple
      'D': '#FF9602',  // Orange
      'E': '#57CD03',  // Green
      'F': '#CC348E',  // Pink
      'G': '#7090FF',  // Blue
      'A': '#FF87D0',  // Light Pink
      'B': '#00CE9C'   // Teal
    };
    
    const noteName = pitch.charAt(0);
    return noteColors[noteName] || '#95a5a6';
  };

  const noteStyle = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    backgroundColor: getNoteColor(note.pitch)
  };

  return (
    <div 
      className={`note-rectangle ${isCurrent ? 'current' : ''} ${isCorrect ? 'correct-note' : ''}`}
      style={noteStyle}
      title={`${note.pitch} - ${note.type} note`}
    />
  );
};

export default NoteRectangle;
