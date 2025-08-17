import React, { useMemo } from 'react';
import NoteRectangle from './NoteRectangle';
import MeasureBars from './MeasureBars';
import useGameStore from '../../stores/gameStore';
import { NotePositioning } from '../../utils/notePositioning';

const NotesContainer = ({
  notes = [],
  measures = [],
  currentTime = 0,
  isPlaying = false,
  className = '',
  style = {},
}) => {
  const gameStore = useGameStore();
  const notePositioning = useMemo(() => new NotePositioning(), []);

  // Process notes with positioning data
  const positionedNotes = useMemo(() => {
    if (!notes.length) return [];

    return notes.map((note, index) => {
      // If note already has positioning data, use it
      if (note.x !== undefined && note.y !== undefined) {
        return note;
      }

      // Otherwise calculate positioning
      const x = note.startTime ? note.startTime * 100 : index * 88; // 88px per note spacing
      const y = notePositioning.getVerticalPosition(note.pitch);
      const width = notePositioning.getNoteWidth(note.duration || 'quarter');
      const color = notePositioning.getNoteColor(note.pitch);

      return {
        ...note,
        x,
        y,
        width,
        color,
        noteIndex: index,
      };
    });
  }, [notes, notePositioning]);

  // Determine which notes are currently active/expected
  const activeNotes = useMemo(() => {
    if (!isPlaying) return new Set();

    return new Set(
      positionedNotes
        .filter(
          note =>
            currentTime >= note.startTime &&
            currentTime <= note.startTime + (note.duration || 1)
        )
        .map(note => note.pitch)
    );
  }, [positionedNotes, currentTime, isPlaying]);

  // Container classes and styles
  const containerClasses = `notes-container ${className}`.trim();
  const containerStyle = {
    position: 'absolute',
    left: '30px', // Offset from playback line position
    top: '0',
    height: '200px',
    transition: 'transform 0.1s linear',
    willChange: 'transform',
    ...style,
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Render measure bars */}
      <MeasureBars measures={measures} />
      
      {/* Render notes */}
      {positionedNotes.map((note, index) => {
        const noteKey = `${note.pitch}-${note.startTime}-${index}`;
        const isCurrent = activeNotes.has(note.pitch);
        const isCorrect = gameStore.isKeyCorrect(note.pitch);
        const isIncorrect = gameStore.isKeyIncorrect(note.pitch);

        return (
          <NoteRectangle
            key={noteKey}
            note={note}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isCurrent={isCurrent}
            isCorrect={isCorrect}
            isIncorrect={isIncorrect}
          />
        );
      })}
    </div>
  );
};

export default NotesContainer;
