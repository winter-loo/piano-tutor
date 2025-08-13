import React from 'react';
import './StaffContainer.css';

const StaffContainer = ({ 
  progressPercentage = 0, 
  onProgressClick,
  tempo = 60,
  onTempoChange,
  children 
}) => {
  const handleProgressBarClick = (event) => {
    if (onProgressClick) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = (clickX / rect.width) * 100;
      onProgressClick(percentage);
    }
  };

  const handleTempoChange = (event) => {
    if (onTempoChange) {
      onTempoChange(parseInt(event.target.value));
    }
  };

  return (
    <div className="staff-container">
      {/* Simple Progress Bar */}
      <div className="simple-progress-bar" onClick={handleProgressBarClick}>
        <div 
          className="simple-progress-fill" 
          id="progressFill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="playback-line"></div>

      {/* Static staff lines that don't move */}
      <div className="staff-lines">
        <div className="staff-line"></div>
        <div className="staff-line"></div>
        <div className="staff-line"></div>
        <div className="staff-line"></div>
        <div className="staff-line"></div>
      </div>

      {/* Static treble clef that doesn't move */}
      <div className="treble-clef">𝄞</div>

      {/* Animated content container */}
      <div className="staff">
        <div className="notes-container">
          {/* Notes will be dynamically added here */}
          {children}
        </div>
      </div>

      {/* Tempo control - integrated musical design */}
      <div className="tempo-control">
        <label className="tempo-label" htmlFor="tempoSelector">♩=</label>
        <select 
          className="tempo-selector" 
          id="tempoSelector"
          value={tempo}
          onChange={handleTempoChange}
        >
          <option value="40">40</option>
          <option value="60">60</option>
          <option value="72">72</option>
          <option value="90">90</option>
          <option value="120">120</option>
        </select>
      </div>
    </div>
  );
};

export default StaffContainer;
