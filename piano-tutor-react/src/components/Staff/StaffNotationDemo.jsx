import React from 'react';
import StaffNotation from './StaffNotation';
import { useStaff } from '../../hooks/useStaff';

// Sample notes for demonstration
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

const StaffNotationDemo = () => {
  const {
    notes,
    currentTime,
    isPlaying,
    tempo,
    progressPercentage,
    handlePlay,
    handlePause,
    handleReset,
    handleTempoChange,
    handleProgressClick
  } = useStaff(sampleNotes);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>StaffNotation Component Demo</h1>
      
      {/* Control Panel */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button 
          onClick={isPlaying ? handlePause : handlePlay}
          style={{
            padding: '8px 16px',
            backgroundColor: isPlaying ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button 
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        
        <span style={{ marginLeft: '20px' }}>
          Time: {currentTime.toFixed(1)}s
        </span>
        
        <span>
          Progress: {progressPercentage.toFixed(1)}%
        </span>
      </div>

      {/* Staff Notation Component */}
      <StaffNotation
        notes={notes}
        currentTime={currentTime}
        isPlaying={isPlaying}
        tempo={tempo}
        onTempoChange={handleTempoChange}
        onProgressClick={handleProgressClick}
        progressPercentage={progressPercentage}
      />

      {/* Component Info */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '8px' 
      }}>
        <h3>Component Features</h3>
        <ul>
          <li><strong>Interactive Progress Bar:</strong> Click to jump to any position</li>
          <li><strong>Tempo Control:</strong> Change playback speed (40-120 BPM)</li>
          <li><strong>Real-time Playback:</strong> Visual indication of current note</li>
          <li><strong>Note Positioning:</strong> Automatic positioning based on pitch and timing</li>
          <li><strong>Responsive Design:</strong> Adapts to different screen sizes</li>
        </ul>
        
        <h4 style={{ marginTop: '15px' }}>Component Structure:</h4>
        <ul>
          <li><code>StaffNotation.jsx</code> - Main container component</li>
          <li><code>PlaybackLine.jsx</code> - Shows current playback position</li>
          <li><code>NotesContainer.jsx</code> - Container for all notes</li>
          <li><code>NoteRectangle.jsx</code> - Individual note rendering</li>
          <li><code>TempoControl.jsx</code> - Tempo selection control</li>
          <li><code>ProgressBar.jsx</code> - Interactive progress indicator</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffNotationDemo;
