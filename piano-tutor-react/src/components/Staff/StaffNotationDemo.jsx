import React, { useState, useEffect, useMemo } from 'react';
import StaffNotation from './StaffNotation';
import { NotePositioning } from '../../utils/notePositioning';

const StaffNotationDemo = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(60);

  // Original song data from index.html - "Different Colors" by Walk the Moon
  const originalSongData = {
    measures: [
      {
        notes: [
          { pitch: 'D4', duration: 'quarter', fingering: 2 },
          { pitch: 'F4', duration: 'quarter', fingering: 4 },
          { pitch: 'C4', duration: 'quarter', fingering: 1 },
          { pitch: 'rest', duration: 'quarter', fingering: null },
        ],
      },
      {
        notes: [
          { pitch: 'G4', duration: 'quarter', fingering: 5 },
          { pitch: 'A4', duration: 'eighth', fingering: 1 },
          { pitch: 'G4', duration: 'eighth', fingering: 5 },
          { pitch: 'F4', duration: 'quarter', fingering: 4 },
        ],
      },
      {
        notes: [
          { pitch: 'A4', duration: 'quarter', fingering: 1 },
          { pitch: 'C5', duration: 'quarter', fingering: 3 },
          { pitch: 'A4', duration: 'dotted_quarter', fingering: 1 },
          { pitch: 'F4', duration: 'eighth', fingering: 4 },
        ],
      },
    ],
  };

  // Calculate positioned notes using the positioning system
  const notePositioning = useMemo(() => new NotePositioning(), []);
  const sampleNotes = useMemo(() => {
    return notePositioning.calculateAllNotePositions(originalSongData.measures);
  }, [notePositioning]);

  // Calculate total song duration
  const totalDuration = useMemo(() => {
    if (sampleNotes.length === 0) return 10;
    return Math.max(...sampleNotes.map(note => note.startTime + (note.duration || 1)));
  }, [sampleNotes]);

  // Simulate playback
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleTempoChange = newTempo => {
    setTempo(newTempo);
  };

  const handleProgressClick = percentage => {
    const newTime = (percentage / 100) * totalDuration;
    setCurrentTime(newTime);
  };

  const progressPercentage = (currentTime / totalDuration) * 100;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>StaffNotation Component Demo</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePlay} style={{ marginRight: '10px' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleReset} style={{ marginRight: '10px' }}>
          Reset
        </button>
        <span>Current Time: {currentTime.toFixed(1)}s</span>
        <span style={{ marginLeft: '20px' }}>Tempo: {tempo} BPM</span>
      </div>

      <StaffNotation
        notes={sampleNotes}
        measures={originalSongData.measures}
        currentTime={currentTime}
        isPlaying={isPlaying}
        tempo={tempo}
        onTempoChange={handleTempoChange}
        onProgressClick={handleProgressClick}
        progressPercentage={progressPercentage}
      />

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>This demo shows the StaffNotation component with:</p>
        <ul>
          <li>5 sample notes (C4, D4, E4, F4, G4)</li>
          <li>Playback line animation</li>
          <li>Note highlighting during playback</li>
          <li>Tempo control</li>
          <li>Progress bar with click-to-seek</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffNotationDemo;
