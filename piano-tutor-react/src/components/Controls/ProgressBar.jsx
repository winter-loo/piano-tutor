import React, { useState, useCallback, useEffect, useRef } from 'react';
import useAudioStore from '../../stores/audioStore.js';
import './Controls.css';

const ProgressBar = ({ 
  className = '', 
  disabled = false,
  onSeek = null,
  onDragStart = null,
  onDragMove = null,
  onDragEnd = null,
  showHoverEffects = true,
  smoothUpdates = true 
}) => {
  const { currentTime, duration, isPlaying, setCurrentTime } = useAudioStore();
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);
  const interactionTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Calculate progress percentage with proper clamping
  const progressPercentage = duration > 0 
    ? Math.max(0, Math.min(100, (currentTime / duration) * 100))
    : 0;

  // Handle click-to-seek functionality
  const handleProgressBarClick = useCallback(
    event => {
      if (disabled || isInteracting) {
        console.debug('🎵 [PROGRESS-BAR] Ignoring click during interaction or disabled state');
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickPercentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
      const targetTime = (clickPercentage / 100) * duration;

      console.log(
        `🎵 [PROGRESS-BAR] Seek clicked: ${clickPercentage.toFixed(1)}% -> ${targetTime.toFixed(2)}s`
      );

      // Set interaction state to prevent conflicts
      setIsInteracting(true);

      // Update time in store
      setCurrentTime(targetTime);

      // Call external seek handler if provided (pass percentage for staff positioning)
      if (onSeek) {
        onSeek(targetTime, clickPercentage);
      }

      // Reset interaction state after delay
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      interactionTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
        interactionTimeoutRef.current = null;
      }, 300);
    },
    [disabled, isInteracting, duration, setCurrentTime, onSeek]
  );

  // Handle mouse down for drag start
  const handleMouseDown = useCallback(
    event => {
      if (disabled) return;

      setIsDragging(true);
      setIsInteracting(true);
      
      // Call drag start handler if provided
      if (onDragStart) {
        onDragStart();
      }
      
      // Handle initial click
      handleProgressBarClick(event);
    },
    [disabled, handleProgressBarClick, onDragStart]
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    event => {
      if (!isDragging || disabled) return;

      event.preventDefault();
      
      // Calculate real-time position during drag
      const rect = progressBarRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = event.clientX - rect.left;
        const clickPercentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
        const targetTime = (clickPercentage / 100) * duration;

        console.log(
          `🎵 [PROGRESS-BAR] Drag move: ${clickPercentage.toFixed(1)}% -> ${targetTime.toFixed(2)}s`
        );

        // Update time in store for real-time feedback
        setCurrentTime(targetTime);

        // Call external drag move handler for real-time updates during drag
        if (onDragMove) {
          onDragMove(targetTime, clickPercentage);
        }
        
        // Also call onSeek for backward compatibility
        if (onSeek) {
          onSeek(targetTime, clickPercentage);
        }
      }
    },
    [isDragging, disabled, duration, setCurrentTime, onSeek]
  );

  // Handle mouse up for drag end
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // Call drag end handler if provided
      if (onDragEnd) {
        const rect = progressBarRef.current?.getBoundingClientRect();
        if (rect) {
          const finalPercentage = Math.max(0, Math.min(100, progressPercentage));
          onDragEnd(finalPercentage);
        }
      }
      
      // Keep isInteracting true briefly to prevent immediate updates
      setTimeout(() => setIsInteracting(false), 100);
    }
  }, [isDragging, onDragEnd, progressPercentage]);

  // Handle mouse enter for hover effects
  const handleMouseEnter = useCallback(() => {
    if (!showHoverEffects || disabled) return;
    
    if (progressBarRef.current && !isInteracting) {
      progressBarRef.current.style.height = window.innerWidth <= 768 ? '8px' : '6px';
    }
  }, [showHoverEffects, disabled, isInteracting]);

  // Handle mouse leave for hover effects
  const handleMouseLeave = useCallback(() => {
    if (!showHoverEffects || disabled) return;
    
    if (progressBarRef.current && !isInteracting) {
      progressBarRef.current.style.height = window.innerWidth <= 768 ? '6px' : '4px';
    }
  }, [showHoverEffects, disabled, isInteracting]);

  // Handle window resize for responsive behavior
  const handleResize = useCallback(() => {
    if (!progressBarRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const defaultHeight = isMobile ? '6px' : '4px';
    const hoverHeight = isMobile ? '8px' : '6px';

    if (isInteracting) {
      progressBarRef.current.style.height = hoverHeight;
    } else {
      progressBarRef.current.style.height = defaultHeight;
    }
  }, [isInteracting]);

  // Smooth progress updates using requestAnimationFrame
  const updateProgressSmooth = useCallback(() => {
    if (!progressBarRef.current || isInteracting || !smoothUpdates) return;

    const fillElement = progressBarRef.current.querySelector('.progress-fill');
    if (fillElement) {
      const clampedPercentage = Math.max(0, Math.min(100, progressPercentage));
      fillElement.style.width = `${clampedPercentage}%`;
    }
  }, [progressPercentage, isInteracting, smoothUpdates]);

  // Set up global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection during drag

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Set up window resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Update progress with smooth animation
  useEffect(() => {
    if (smoothUpdates && !isInteracting) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateProgressSmooth);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateProgressSmooth, smoothUpdates, isInteracting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const progressBarClasses = [
    'progress-bar',
    className,
    disabled ? 'disabled' : '',
    isInteracting ? 'interacting' : '',
    isDragging ? 'dragging' : '',
    isPlaying ? 'playing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const progressFillClasses = [
    'progress-fill',
    isInteracting ? 'interacting' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={progressBarRef}
      className={progressBarClasses}
      onClick={handleProgressBarClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(progressPercentage)}
      aria-label={`Playback progress: ${Math.round(progressPercentage)}%`}
      style={{
        cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'pointer',
      }}
    >
      <div
        className={progressFillClasses}
        style={{
          width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;