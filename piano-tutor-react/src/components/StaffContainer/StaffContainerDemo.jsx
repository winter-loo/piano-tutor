import React, { useState, useEffect } from 'react';
import StaffContainer from './StaffContainer';
import NoteRectangle from './NoteRectangle';

const StaffContainerDemo = () => {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [tempo, setTempo] = useState(60);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Calculate note positions (simplified version of original logic)
  const getNotePosition = (note) => {
    const pitchToY = {
      'C5': 10,   // Above staff
      'B4': 20,   // Top line
      'A4': 30,   // Between top lines
      'G4': 40,   // Second line
      'F4': 50,   // Between middle lines
      'E4': 60,   // Middle line
      'D4': 70,   // Between lower lines
      'C4': 80,   // Fourth line
      'B3': 90,   // Below staff
      'A3': 100   // Below staff
    };
    
    return {
      left: note.startTime * 80, // 80px per beat
      top: pitchToY[note.pitch] || 60,
      width: note.duration * 40 // 40px per beat for width
    };
  };

  const handleProgressClick = (percentage) => {
    setProgressPercentage(percentage);
    const newTime = (percentage / 100) * 10; // 10 seconds total
    const newNoteIndex = sampleNotes.findIndex(note => note.startTime > newTime) - 1;
    setCurrentNoteIndex(Math.max(0, newNoteIndex));
  };

  const handleTempoChange = (newTempo) => {
    setTempo(newTempo);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Simple playback simulation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgressPercentage(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          setIsPlaying(false);
          return 100;
        }
        
        // Update current note based on progress
        const currentTime = (newProgress / 100) * 10;
        const noteIndex = sampleNotes.findIndex(note => 
          currentTime >= note.startTime && currentTime < note.startTime + note.duration
        );
        setCurrentNoteIndex(noteIndex);
        
        return newProgress;
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [isPlaying, sampleNotes]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>🎼 StaffContainer Component - Exact UI Match</h2>
        <p>This component exactly matches the staff-container from the original index.html</p>
        
        <div style={{ margin: '20px 0', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={togglePlayback}
            style={{
              padding: '10px 20px',
              backgroundColor: isPlaying ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          
          <button 
            onClick={() => {
              setProgressPercentage(0);
              setCurrentNoteIndex(-1);
              setIsPlaying(false);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <StaffContainer
        progressPercentage={progressPercentage}
        onProgressClick={handleProgressClick}
        tempo={tempo}
        onTempoChange={handleTempoChange}
      >
        {/* Render note rectangles */}
        {sampleNotes.map((note, index) => {
          const position = getNotePosition(note);
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

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>✅ Features Extracted from Original:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Progress Bar:</strong> Interactive click-to-seek functionality</li>
          <li><strong>Playback Line:</strong> Visual indicator at 120px from left</li>
          <li><strong>Staff Lines:</strong> 5 horizontal lines positioned exactly as original</li>
          <li><strong>Treble Clef:</strong> Musical symbol positioned at left (𝄞)</li>
          <li><strong>Notes Container:</strong> Animated content area for note rectangles</li>
          <li><strong>Tempo Control:</strong> Dropdown with musical note symbol (♩=)</li>
          <li><strong>Styling:</strong> Exact colors, shadows, positioning, and responsive design</li>
        </ul>
        
        <p><strong>Current Status:</strong> Progress: {progressPercentage.toFixed(1)}% | Tempo: {tempo} BPM | Current Note: {currentNoteIndex >= 0 ? sampleNotes[currentNoteIndex]?.pitch : 'None'}</p>
      </div>
    </div>
  );
};

export default StaffContainerDemo;
