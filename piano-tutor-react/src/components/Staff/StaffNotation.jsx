import React, { useRef, useEffect } from 'react';
import './StaffNotation.css';
import PlaybackLine from './PlaybackLine';
import NotesContainer from './NotesContainer';
import TempoControl from './TempoControl';
import ProgressBar from './ProgressBar';

const StaffNotation = ({ 
  notes = [], 
  currentTime = 0, 
  isPlaying = false,
  tempo = 60,
  onTempoChange,
  onProgressClick,
  progressPercentage = 0
}) => {
  const staffContainerRef = useRef(null);
  const staffRef = useRef(null);

  // Staff lines configuration
  const staffLines = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="staff-container" ref={staffContainerRef}>
      {/* Progress Bar */}
      <ProgressBar 
        percentage={progressPercentage}
        onClick={onProgressClick}
      />

      {/* Playback Line */}
      <PlaybackLine currentTime={currentTime} />

      {/* Static staff lines that remain fixed during animation */}
      <div className="staff-lines">
        {staffLines.map(lineNumber => (
          <div key={lineNumber} className="staff-line" />
        ))}
      </div>

      {/* Static treble clef that doesn't move */}
      <div className="treble-clef">𝄞</div>

      {/* Animated content container - only this moves */}
      <div className="staff" ref={staffRef}>
        <NotesContainer 
          notes={notes}
          currentTime={currentTime}
          isPlaying={isPlaying}
        />
      </div>

      {/* Tempo control - integrated musical design */}
      <TempoControl 
        tempo={tempo}
        onChange={onTempoChange}
      />
    </div>
  );
};

export default StaffNotation;
