import React, { useState } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ percentage = 0, onClick }) => {
  const [isInteracting, setIsInteracting] = useState(false);

  const handleClick = event => {
    if (!onClick) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercentage = (clickX / rect.width) * 100;

    onClick(Math.max(0, Math.min(100, clickPercentage)));
  };

  const handleMouseDown = () => {
    setIsInteracting(true);
  };

  const handleMouseUp = () => {
    setIsInteracting(false);
  };

  const progressBarClasses = [
    'simple-progress-bar',
    isInteracting ? 'interacting' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={progressBarClasses}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="simple-progress-fill"
        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
      />
    </div>
  );
};

export default ProgressBar;
