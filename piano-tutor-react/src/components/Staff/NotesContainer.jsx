import React from 'react';
import NoteRectangle from './NoteRectangle';

const NotesContainer = ({ notes = [], currentTime = 0, isPlaying = false }) => {
  return (
    <div className="notes-container">
      {notes.map((note, index) => (
        <NoteRectangle
          key={`${note.pitch}-${note.startTime}-${index}`}
          note={note}
          currentTime={currentTime}
          isPlaying={isPlaying}
        />
      ))}
    </div>
  );
};

export default NotesContainer;
