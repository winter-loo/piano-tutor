import React, { useState } from 'react';
import { useGameState } from './useGameState.js';
import { usePerformanceTracking } from './usePerformanceTracking.js';

/**
 * Demo component showing how useGameState and usePerformanceTracking work together
 * This demonstrates the game logic and performance tracking functionality
 */
const GameLogicDemo = () => {
  const gameState = useGameState();
  const performance = usePerformanceTracking();
  
  const [demoSong] = useState({
    title: 'Demo Song',
    notes: [
      { pitch: 'C4', startTime: 0, duration: 1 },
      { pitch: 'D4', startTime: 1, duration: 1 },
      { pitch: 'E4', startTime: 2, duration: 1 },
      { pitch: 'F4', startTime: 3, duration: 1 },
    ],
  });

  const handleStartGame = () => {
    gameState.startGame(demoSong);
  };

  const handleNotePress = (note) => {
    const evaluation = gameState.handleNotePress(note);
    
    // Track the performance
    performance.trackNotePerformance({
      note,
      isCorrect: evaluation.isCorrect,
      timingError: evaluation.timing,
      timingAccuracy: evaluation.timingAccuracy,
    });
  };

  const stats = gameState.getGameStats();
  const performanceSummary = performance.getPerformanceSummary();
  const suggestions = performance.getImprovementSuggestions();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Game Logic & Performance Tracking Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Game Controls</h3>
        <button onClick={handleStartGame} disabled={gameState.isPlaying}>
          Start Game
        </button>
        <button onClick={gameState.pauseGame} disabled={!gameState.isPlaying || gameState.isPaused}>
          Pause
        </button>
        <button onClick={gameState.resumeGame} disabled={!gameState.isPaused}>
          Resume
        </button>
        <button onClick={gameState.resetGame}>
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Note Practice</h3>
        <p>Current Time: {gameState.currentTime.toFixed(2)}s</p>
        <div>
          {['C4', 'D4', 'E4', 'F4'].map(note => (
            <button
              key={note}
              onClick={() => handleNotePress(note)}
              disabled={!gameState.isPlaying || gameState.isPaused}
              style={{
                margin: '5px',
                padding: '10px',
                backgroundColor: gameState.isKeyCorrect(note) ? '#4CAF50' : 
                                gameState.isKeyIncorrect(note) ? '#f44336' : '#e0e0e0',
                color: gameState.isKeyCorrect(note) || gameState.isKeyIncorrect(note) ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: gameState.isPlaying && !gameState.isPaused ? 'pointer' : 'not-allowed',
              }}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Game Statistics</h3>
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <p><strong>Score:</strong> {stats.score}</p>
            <p><strong>Accuracy:</strong> {stats.accuracy.toFixed(1)}%</p>
            <p><strong>Progress:</strong> {(stats.progress * 100).toFixed(1)}%</p>
            <p><strong>Current Streak:</strong> {stats.currentStreak}</p>
            <p><strong>Best Streak:</strong> {stats.bestStreak}</p>
            <p><strong>Total Notes:</strong> {stats.totalNotes}</p>
            <p><strong>Correct:</strong> {stats.correctNotes}</p>
            <p><strong>Incorrect:</strong> {stats.incorrectNotes}</p>
            <p><strong>Missed:</strong> {stats.missedNotes}</p>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Performance Metrics</h3>
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <p><strong>Session Duration:</strong> {performanceSummary.session.duration.toFixed(1)}s</p>
            <p><strong>Notes Per Minute:</strong> {performanceSummary.session.notesPerMinute.toFixed(1)}</p>
            <p><strong>Recent Accuracy:</strong> {performanceSummary.realtime.recentAccuracy.toFixed(1)}%</p>
            <p><strong>Consistency:</strong> {(performanceSummary.realtime.consistency * 100).toFixed(1)}%</p>
            <p><strong>Momentum:</strong> {performanceSummary.realtime.momentum > 0 ? '↗️' : performanceSummary.realtime.momentum < 0 ? '↘️' : '→'}</p>
            
            <h4>Timing Distribution:</h4>
            <div style={{ fontSize: '12px' }}>
              <p>Perfect: {performanceSummary.detailed.timingDistribution.perfect}</p>
              <p>Early: {performanceSummary.detailed.timingDistribution.early}</p>
              <p>Late: {performanceSummary.detailed.timingDistribution.late}</p>
              <p>Missed: {performanceSummary.detailed.timingDistribution.missed}</p>
            </div>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Improvement Suggestions</h3>
          <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
            {suggestions.map((suggestion, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <span style={{ 
                  backgroundColor: suggestion.priority === 'high' ? '#f44336' : 
                                  suggestion.priority === 'medium' ? '#ff9800' : '#4caf50',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginRight: '10px'
                }}>
                  {suggestion.priority.toUpperCase()}
                </span>
                <strong>{suggestion.type}:</strong> {suggestion.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <p>1. Click "Start Game" to begin</p>
        <p>2. Press the note buttons in sequence: C4 → D4 → E4 → F4</p>
        <p>3. Try to press each note at the right time (every 1 second)</p>
        <p>4. Watch your accuracy and performance metrics update in real-time</p>
        <p>5. Green buttons = correct notes, Red buttons = incorrect notes</p>
      </div>
    </div>
  );
};

export default GameLogicDemo;