import React from 'react';

const PlaybackLine = ({ currentTime = 0 }) => {
  // Calculate the left position based on current time
  // This would need to be adjusted based on your timing calculations
  const leftPosition = 120; // Default position, should be calculated based on currentTime

  return (
    <div 
      className="playback-line"
      style={{ left: `${leftPosition}px` }}
    />
  );
};

export default PlaybackLine;
