import { useState, useEffect, useRef } from 'react';
import { NotePositioning } from '../utils/notePositioning';
import { DEFAULT_TEMPO, PLAYBACK_CONFIG } from '../utils/constants';

/**
 * Custom hook for managing staff notation state and interactions
 */
export const useStaff = (initialNotes = []) => {
  const [notes, setNotes] = useState(initialNotes);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(DEFAULT_TEMPO);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const notePositioning = useRef(new NotePositioning());
  const playbackTimer = useRef(null);
  const startTime = useRef(null);

  // Calculate total duration of the piece
  const totalDuration =
    notes.length > 0
      ? Math.max(...notes.map(note => note.startTime + (note.duration || 1)))
      : 0;

  // Position notes when notes or tempo change
  const positionedNotes = notePositioning.current.positionNotes(notes, tempo);

  // Handle tempo changes
  const handleTempoChange = newTempo => {
    setTempo(newTempo);
    // If playing, restart with new tempo
    if (isPlaying) {
      handlePause();
      setTimeout(() => handlePlay(), 100);
    }
  };

  // Handle play/pause
  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      startTime.current = Date.now() - currentTime * 1000;

      playbackTimer.current = setInterval(() => {
        const elapsed = (Date.now() - startTime.current) / 1000;
        setCurrentTime(elapsed);

        // Update progress percentage
        if (totalDuration > 0) {
          setProgressPercentage((elapsed / totalDuration) * 100);
        }

        // Stop when reaching the end
        if (elapsed >= totalDuration) {
          handlePause();
          setCurrentTime(totalDuration);
          setProgressPercentage(100);
        }
      }, PLAYBACK_CONFIG.ANIMATION_DURATION);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (playbackTimer.current) {
      clearInterval(playbackTimer.current);
      playbackTimer.current = null;
    }
  };

  // Handle progress bar clicks
  const handleProgressClick = percentage => {
    const newTime = (percentage / 100) * totalDuration;
    setCurrentTime(newTime);
    setProgressPercentage(percentage);

    if (isPlaying) {
      startTime.current = Date.now() - newTime * 1000;
    }
  };

  // Reset to beginning
  const handleReset = () => {
    handlePause();
    setCurrentTime(0);
    setProgressPercentage(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, []);

  return {
    // State
    notes: positionedNotes,
    currentTime,
    isPlaying,
    tempo,
    progressPercentage,
    totalDuration,

    // Actions
    handlePlay,
    handlePause,
    handleReset,
    handleTempoChange,
    handleProgressClick,
    setNotes,

    // Utilities
    notePositioning: notePositioning.current,
  };
};
