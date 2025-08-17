import React, { useState, useEffect } from 'react';
import TempoControl from './TempoControl.jsx';
import ProgressBar from './ProgressBar.jsx';
import useAudioStore from '../../stores/audioStore.js';
import './Controls.css';

const ControlsDemo = () => {
  const { 
    tempo, 
    currentTime, 
    duration, 
    isPlaying, 
    setCurrentTime,
    play,
    pause,
    setDuration 
  } = useAudioStore();

  const [demoProgress, setDemoProgress] = useState(0);

  // Initialize demo duration
  useEffect(() => {
    if (duration === 0) {
      setDuration(180); // 3 minutes demo
    }
  }, [duration, setDuration]);

  // Simulate playback progress
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(Math.min(currentTime + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, setCurrentTime]);

  const handleSeek = (targetTime, percentage) => {
    console.log(`🎵 [CONTROLS-DEMO] Seeking to ${targetTime.toFixed(1)}s (${percentage.toFixed(1)}%)`);
    setCurrentTime(targetTime);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const resetDemo = () => {
    pause();
    setCurrentTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="controls-demo">
      <h2>Control Components Demo</h2>
      
      <div className="demo-container">
        <div className="staff-simulation">
          <ProgressBar 
            onSeek={handleSeek}
            className="demo-progress"
          />
          <TempoControl className="demo-tempo" />
          
          <div className="demo-info">
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="tempo-display">
              Tempo: {tempo} BPM
            </div>
            <div className="progress-display">
              Progress: {((currentTime / duration) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="demo-controls">
          <button 
            onClick={togglePlayback}
            className={`play-button ${isPlaying ? 'playing' : ''}`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button onClick={resetDemo} className="reset-button">
            ⏹️ Reset
          </button>
        </div>
        
        <div className="demo-status">
          <p><strong>Status:</strong> {isPlaying ? 'Playing' : 'Paused'}</p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>✅ Discrete BPM tempo selection (40-200)</li>
            <li>✅ Click-to-seek progress bar</li>
            <li>✅ Smooth progress updates</li>
            <li>✅ State synchronization with audio store</li>
            <li>✅ Responsive design</li>
            <li>✅ Accessibility support</li>
          </ul>
        </div>
      </div>
      
      <style jsx>{`
        .controls-demo {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        .demo-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background: #f9f9f9;
        }
        
        .staff-simulation {
          position: relative;
          height: 200px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .demo-info {
          position: absolute;
          top: 50px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .demo-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .play-button, .reset-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        
        .play-button {
          background: #64c83d;
          color: white;
        }
        
        .play-button.playing {
          background: #f39c12;
        }
        
        .reset-button {
          background: #6c757d;
          color: white;
        }
        
        .play-button:hover, .reset-button:hover {
          opacity: 0.8;
        }
        
        .demo-status {
          background: white;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        
        .demo-status ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .demo-status li {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default ControlsDemo;