import React, { useState, useEffect } from 'react';
import useUIStore from '../../stores/uiStore.js';
import useGameStore from '../../stores/gameStore.js';
import './Overlays.css';

const EndingOverlay = ({ onRestart }) => {
  const { 
    showEndingOverlay, 
    hideEndingOverlay,
    animationsEnabled 
  } = useUIStore();
  
  const {
    score,
    accuracy,
    correctNotes,
    incorrectNotes,
    bestStreak,
    getAverageTimingError,
    resetGame
  } = useGameStore();

  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);

  // Generate celebration message based on performance
  useEffect(() => {
    if (showEndingOverlay) {
      const avgTiming = getAverageTimingError();
      let message = '';

      if (accuracy >= 95) {
        message = "Outstanding performance! You've mastered this piece with excellent timing and accuracy.";
      } else if (accuracy >= 85) {
        message = "Great job! Your performance shows real musical talent and dedication.";
      } else if (accuracy >= 75) {
        message = "Well done! You're making excellent progress. Keep practicing!";
      } else if (accuracy >= 60) {
        message = "Good effort! Every practice session brings you closer to mastery.";
      } else {
        message = "Nice try! Remember, every great pianist started with practice. Keep going!";
      }

      setCelebrationMessage(message);

      // Show metrics with a slight delay for better UX
      const timer = setTimeout(() => {
        setShowMetrics(true);
      }, animationsEnabled ? 500 : 0);

      return () => clearTimeout(timer);
    }
  }, [showEndingOverlay, accuracy, getAverageTimingError, animationsEnabled]);

  // Handle restart button click
  const handleRestart = () => {
    try {
      console.log('🎹 [ENDING-OVERLAY] Restarting game...');
      
      // Reset game state
      resetGame();
      
      // Call the onRestart callback if provided
      if (onRestart) {
        onRestart();
      }
      
      // Hide the ending overlay
      hideEndingOverlay();
      
      console.log('🎹 [ENDING-OVERLAY] Game restarted successfully');
    } catch (error) {
      console.error('🎹 [ENDING-OVERLAY] Error restarting game:', error);
    }
  };

  // Handle overlay background click (close overlay)
  const handleOverlayClick = (event) => {
    // Only close if clicking the overlay background, not the content
    if (event.target === event.currentTarget) {
      hideEndingOverlay();
    }
  };

  // Handle escape key to close overlay
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showEndingOverlay) {
        hideEndingOverlay();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showEndingOverlay, hideEndingOverlay]);

  // Format timing value for display
  const formatTiming = (timingMs) => {
    if (timingMs < 1000) {
      return `${Math.round(timingMs)}ms`;
    } else {
      return `${(timingMs / 1000).toFixed(1)}s`;
    }
  };

  // Get performance grade based on accuracy
  const getPerformanceGrade = () => {
    if (accuracy >= 95) return { grade: 'A+', color: '#27ae60' };
    if (accuracy >= 90) return { grade: 'A', color: '#27ae60' };
    if (accuracy >= 85) return { grade: 'B+', color: '#2ecc71' };
    if (accuracy >= 80) return { grade: 'B', color: '#f39c12' };
    if (accuracy >= 75) return { grade: 'C+', color: '#f39c12' };
    if (accuracy >= 70) return { grade: 'C', color: '#e67e22' };
    if (accuracy >= 60) return { grade: 'D', color: '#e74c3c' };
    return { grade: 'F', color: '#c0392b' };
  };

  // Don't render if overlay should not be shown
  if (!showEndingOverlay) {
    return null;
  }

  const performanceGrade = getPerformanceGrade();
  const avgTiming = getAverageTimingError();

  return (
    <div 
      className={`ending-overlay ${showEndingOverlay ? 'show' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ending-overlay-title"
      aria-describedby="ending-overlay-description"
    >
      <div className="ending-overlay-content">
        {/* Celebration message */}
        <div 
          className="celebration-message"
          id="ending-overlay-title"
          role="heading"
          aria-level="1"
        >
          {celebrationMessage}
        </div>

        {/* Performance grade */}
        <div className="performance-grade">
          <span 
            className="grade-value"
            style={{ color: performanceGrade.color }}
            aria-label={`Performance grade: ${performanceGrade.grade}`}
          >
            {performanceGrade.grade}
          </span>
          <span className="grade-label">Performance Grade</span>
        </div>

        {/* Performance metrics */}
        <div 
          className={`performance-metrics ${showMetrics ? 'show' : ''}`}
          id="ending-overlay-description"
          role="region"
          aria-label="Performance metrics"
        >
          <div className="metric-card accuracy">
            <span className="metric-value" aria-label={`Accuracy: ${accuracy.toFixed(1)} percent`}>
              {accuracy.toFixed(1)}%
            </span>
            <span className="metric-label">Accuracy</span>
          </div>

          <div className="metric-card correct">
            <span className="metric-value" aria-label={`Correct notes: ${correctNotes}`}>
              {correctNotes}
            </span>
            <span className="metric-label">Correct</span>
          </div>

          <div className="metric-card incorrect">
            <span className="metric-value" aria-label={`Incorrect notes: ${incorrectNotes}`}>
              {incorrectNotes}
            </span>
            <span className="metric-label">Incorrect</span>
          </div>

          <div className="metric-card streak">
            <span className="metric-value" aria-label={`Best streak: ${bestStreak} notes`}>
              {bestStreak}
            </span>
            <span className="metric-label">Best Streak</span>
          </div>

          <div className="metric-card timing">
            <span className="metric-value" aria-label={`Average timing: ${formatTiming(avgTiming)}`}>
              {formatTiming(avgTiming)}
            </span>
            <span className="metric-label">Avg Timing</span>
          </div>

          <div className="metric-card score">
            <span className="metric-value" aria-label={`Final score: ${score} points`}>
              {score.toLocaleString()}
            </span>
            <span className="metric-label">Score</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="ending-actions">
          <button 
            className="action-button primary"
            onClick={handleRestart}
            aria-describedby="restart-button-description"
          >
            Play Again
          </button>
          
          <button 
            className="action-button secondary"
            onClick={hideEndingOverlay}
            aria-describedby="close-button-description"
          >
            Close
          </button>
        </div>

        {/* Screen reader descriptions */}
        <div className="sr-only">
          <div id="restart-button-description">
            Start a new practice session with the same song
          </div>
          <div id="close-button-description">
            Close this results screen and return to the main interface
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingOverlay;
