import React from 'react';
import './RotationMessage.css';

/**
 * RotationMessage Component
 * 
 * Displays a message encouraging users to rotate their mobile device to landscape mode
 * for the best Piano Tutor experience. Only shown on mobile devices in portrait mode.
 */
const RotationMessage = () => {
  return (
    <div className="rotate-message">
      <div className="rotate-message-content">
        <div className="rotate-icon" aria-hidden="true">
          📱 ↻
        </div>
        <h2>Rotate Your Device</h2>
        <p>
          For the best Piano Tutor experience, please rotate your device to landscape mode.
        </p>
        <p className="rotate-hint">
          The piano keyboard and staff notation work better in landscape orientation.
        </p>
      </div>
    </div>
  );
};

export default RotationMessage;