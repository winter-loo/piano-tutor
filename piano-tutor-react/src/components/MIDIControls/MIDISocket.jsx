import React from 'react';
import useMIDI from '../../hooks/useMIDI.js';

/**
 * MIDISocket component - Realistic visual design with connection states
 * Displays a MIDI socket that shows connection status and opens configuration popup
 */
const MIDISocket = ({ onClick }) => {
  const { 
    isConnected, 
    isConnecting, 
    selectedDevice, 
    connectionError 
  } = useMIDI();

  // Determine socket state class
  const getSocketStateClass = () => {
    if (isConnecting) return 'connecting';
    if (isConnected) return 'connected';
    return 'disconnected';
  };

  // Generate tooltip text based on connection state
  const getTooltipText = () => {
    if (isConnecting) return 'Connecting to MIDI device...';
    if (isConnected && selectedDevice) {
      return `Connected to ${selectedDevice.name}`;
    }
    if (connectionError) return `Connection error: ${connectionError}`;
    return 'Click to configure MIDI device';
  };

  return (
    <div className="midi-socket-container">
      <div 
        className={`midi-socket ${getSocketStateClass()}`}
        onClick={onClick}
        title={getTooltipText()}
        aria-label="MIDI Device Configuration"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <div className="socket-interior"></div>
      </div>
    </div>
  );
};

export default MIDISocket;
