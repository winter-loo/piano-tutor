import React, { useState } from 'react';
import MIDISocket from './MIDISocket.jsx';
import MIDIConfigPopup from './MIDIConfigPopup.jsx';
import './MIDIControls.css';

/**
 * MIDIControls component - Main container for MIDI functionality
 * Manages the socket display and configuration popup
 */
const MIDIControls = () => {
  const [showConfigPopup, setShowConfigPopup] = useState(false);

  const handleSocketClick = () => {
    setShowConfigPopup(true);
  };

  const handleClosePopup = () => {
    setShowConfigPopup(false);
  };

  return (
    <>
      <MIDISocket onClick={handleSocketClick} />
      <MIDIConfigPopup 
        isOpen={showConfigPopup} 
        onClose={handleClosePopup} 
      />
    </>
  );
};

export default MIDIControls;