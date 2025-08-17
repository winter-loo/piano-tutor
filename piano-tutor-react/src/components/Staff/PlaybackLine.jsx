import React, { useMemo } from 'react';
import { PLAYBACK_CONFIG } from '../../utils/constants';

const PlaybackLine = ({
  currentTime = 0,
  isPlaying = false,
  className = '',
  style = {},
}) => {
  // Ensure currentTime is a valid number
  const safeCurrentTime = useMemo(() => {
    const time = Number(currentTime);
    return isNaN(time) ? 0 : time;
  }, [currentTime]);
  // Calculate the left position based on current time and playback configuration
  const leftPosition = useMemo(() => {
    // Base position from original HTML (120px)
    const basePosition = PLAYBACK_CONFIG.DEFAULT_POSITION;

    // For now, keep the line at the default position as it acts as a reference point
    // The notes container moves instead of the playback line
    return basePosition;
  }, [safeCurrentTime]);

  // Apply smooth animation classes based on playback state
  const playbackLineClasses = [
    'playback-line',
    isPlaying ? 'playing' : 'paused',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Combine styles
  const combinedStyle = {
    left: `${leftPosition}px`,
    ...style,
  };

  return (
    <div
      className={playbackLineClasses}
      style={combinedStyle}
      data-current-time={safeCurrentTime.toString()}
      data-is-playing={isPlaying.toString()}
    />
  );
};

export default PlaybackLine;
