import React, { useState, useEffect } from 'react'
import './App.css'
import StaffContainer from './components/StaffContainer/StaffContainer'
import NoteRectangle from './components/StaffContainer/NoteRectangle'
import { NotePositioning } from './utils/NotePositioning'

function App() {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [tempo, setTempo] = useState(60);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);

  // Initialize note positioning utility
  const notePositioning = new NotePositioning();

  // Sample notes data matching the original app
  const sampleNotes = [
    { pitch: 'C4', startTime: 0, duration: 1, type: 'quarter' },
    { pitch: 'D4', startTime: 1, duration: 1, type: 'quarter' },
    { pitch: 'E4', startTime: 2, duration: 1, type: 'quarter' },
    { pitch: 'F4', startTime: 3, duration: 1, type: 'quarter' },
    { pitch: 'G4', startTime: 4, duration: 2, type: 'half' },
    { pitch: 'A4', startTime: 6, duration: 1, type: 'quarter' },
    { pitch: 'B4', startTime: 7, duration: 1, type: 'quarter' },
    { pitch: 'C5', startTime: 8, duration: 2, type: 'half' },
  ];

  const handleProgressClick = (percentage) => {
    setProgressPercentage(percentage);
    const newTime = (percentage / 100) * 10; // 10 seconds total
    const newNoteIndex = sampleNotes.findIndex(note => note.startTime > newTime) - 1;
    setCurrentNoteIndex(Math.max(0, newNoteIndex));
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);
  };

  return (
    <div className="app-container">
      <StaffContainer
        progressPercentage={progressPercentage}
        onProgressClick={handleProgressClick}
        tempo={tempo}
        onTempoChange={handleTempoChange}
      >
        {/* Render note rectangles */}
        {sampleNotes.map((note, index) => {
          const position = notePositioning.calculateNotePosition(note, index, sampleNotes);
          return (
            <NoteRectangle
              key={index}
              note={note}
              left={position.left}
              top={position.top}
              width={position.width}
              isCurrent={index === currentNoteIndex}
              isCorrect={false}
            />
          );
        })}
      </StaffContainer>
    </div>
  )
}

export default App
