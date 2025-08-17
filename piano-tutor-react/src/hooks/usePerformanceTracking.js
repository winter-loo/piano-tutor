import { useState, useCallback, useRef, useEffect } from 'react';
import useGameStore from '../stores/gameStore.js';
import { TIMING_CONFIG } from '../utils/constants.js';

/**
 * Custom hook for tracking detailed performance metrics and statistics
 * Provides comprehensive analysis of player performance over time
 */
export const usePerformanceTracking = () => {
  const {
    // Game state
    isPlaying,
    totalNotes,
    correctNotes,
    incorrectNotes,
    missedNotes,
    currentStreak,
    bestStreak,
    timingErrors,
    getAccuracy,
    getAverageTimingError,
  } = useGameStore();

  // Performance tracking state
  const [sessionStats, setSessionStats] = useState({
    sessionStartTime: null,
    sessionDuration: 0,
    notesPerMinute: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    totalSessions: 0,
  });

  const [detailedMetrics, setDetailedMetrics] = useState({
    timingDistribution: {
      perfect: 0,
      early: 0,
      late: 0,
      missed: 0,
    },
    accuracyHistory: [],
    streakHistory: [],
    difficultyProgression: [],
    practiceTime: 0,
  });

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    currentAccuracy: 0,
    recentAccuracy: 0, // Last 10 notes
    momentum: 0, // Trend indicator
    consistency: 0, // Variance in timing
    improvement: 0, // Compared to previous sessions
  });

  // Refs for tracking
  const sessionStartRef = useRef(null);
  const recentNotesRef = useRef([]); // Last 10 notes for recent accuracy
  const timingHistoryRef = useRef([]); // Detailed timing history
  const accuracyHistoryRef = useRef([]); // Historical accuracy data
  const performanceIntervalRef = useRef(null);

  /**
   * Start performance tracking session
   */
  const startPerformanceTracking = useCallback(() => {
    console.log('📊 [PERFORMANCE] Starting performance tracking session');
    
    const now = Date.now();
    sessionStartRef.current = now;
    
    setSessionStats(prev => ({
      ...prev,
      sessionStartTime: now,
      sessionDuration: 0,
    }));

    // Reset realtime metrics
    setRealtimeMetrics({
      currentAccuracy: 0,
      recentAccuracy: 0,
      momentum: 0,
      consistency: 0,
      improvement: 0,
    });

    // Clear recent tracking
    recentNotesRef.current = [];
    timingHistoryRef.current = [];

    // Start realtime updates
    performanceIntervalRef.current = setInterval(updateRealtimeMetrics, 1000);
  }, []);

  /**
   * Stop performance tracking session
   */
  const stopPerformanceTracking = useCallback(() => {
    console.log('📊 [PERFORMANCE] Stopping performance tracking session');
    
    if (performanceIntervalRef.current) {
      clearInterval(performanceIntervalRef.current);
      performanceIntervalRef.current = null;
    }

    // Calculate final session stats
    const sessionDuration = sessionStartRef.current ? 
      (Date.now() - sessionStartRef.current) / 1000 : 0;
    
    const finalAccuracy = getAccuracy();
    
    setSessionStats(prev => ({
      ...prev,
      sessionDuration,
      totalSessions: prev.totalSessions + 1,
      averageAccuracy: (prev.averageAccuracy * prev.totalSessions + finalAccuracy) / (prev.totalSessions + 1),
      bestAccuracy: Math.max(prev.bestAccuracy, finalAccuracy),
    }));

    // Save session to history
    saveSessionToHistory(finalAccuracy, sessionDuration);
  }, [getAccuracy]);

  /**
   * Track a note performance event
   */
  const trackNotePerformance = useCallback((noteData) => {
    const {
      note,
      isCorrect,
      timingError,
      timingAccuracy,
      timestamp = Date.now(),
    } = noteData;

    console.log('📊 [PERFORMANCE] Tracking note performance:', note, timingAccuracy);

    // Add to recent notes (keep last 10)
    recentNotesRef.current.push({
      note,
      isCorrect,
      timingError,
      timingAccuracy,
      timestamp,
    });

    if (recentNotesRef.current.length > 10) {
      recentNotesRef.current.shift();
    }

    // Add to timing history
    timingHistoryRef.current.push({
      timestamp,
      timingError,
      timingAccuracy,
      isCorrect,
    });

    // Update timing distribution
    setDetailedMetrics(prev => ({
      ...prev,
      timingDistribution: {
        ...prev.timingDistribution,
        [timingAccuracy]: prev.timingDistribution[timingAccuracy] + 1,
      },
    }));

    // Update realtime metrics
    updateRealtimeMetrics();
  }, []);

  /**
   * Update realtime performance metrics
   */
  const updateRealtimeMetrics = useCallback(() => {
    const currentAccuracy = getAccuracy();
    
    // Calculate recent accuracy (last 10 notes)
    const recentCorrect = recentNotesRef.current.filter(note => note.isCorrect).length;
    const recentAccuracy = recentNotesRef.current.length > 0 ? 
      (recentCorrect / recentNotesRef.current.length) * 100 : 0;

    // Calculate momentum (trend over recent notes)
    const momentum = calculateMomentum();

    // Calculate consistency (timing variance)
    const consistency = calculateConsistency();

    // Calculate notes per minute
    const notesPerMinute = calculateNotesPerMinute();

    setRealtimeMetrics({
      currentAccuracy,
      recentAccuracy,
      momentum,
      consistency,
      improvement: 0, // Will be calculated against historical data
    });

    setSessionStats(prev => ({
      ...prev,
      notesPerMinute,
      sessionDuration: sessionStartRef.current ? 
        (Date.now() - sessionStartRef.current) / 1000 : 0,
    }));
  }, [getAccuracy]);

  /**
   * Calculate performance momentum (trend indicator)
   */
  const calculateMomentum = useCallback(() => {
    if (recentNotesRef.current.length < 5) return 0;

    const recent = recentNotesRef.current.slice(-5);
    const older = recentNotesRef.current.slice(-10, -5);

    if (older.length === 0) return 0;

    const recentAccuracy = recent.filter(n => n.isCorrect).length / recent.length;
    const olderAccuracy = older.filter(n => n.isCorrect).length / older.length;

    return recentAccuracy - olderAccuracy;
  }, []);

  /**
   * Calculate timing consistency
   */
  const calculateConsistency = useCallback(() => {
    if (timingHistoryRef.current.length < 5) return 0;

    const recentTimings = timingHistoryRef.current
      .slice(-10)
      .map(entry => Math.abs(entry.timingError))
      .filter(error => error < TIMING_CONFIG.LATE_THRESHOLD);

    if (recentTimings.length === 0) return 0;

    const mean = recentTimings.reduce((sum, error) => sum + error, 0) / recentTimings.length;
    const variance = recentTimings.reduce((sum, error) => sum + Math.pow(error - mean, 2), 0) / recentTimings.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to consistency score (lower deviation = higher consistency)
    return Math.max(0, 1 - (standardDeviation / TIMING_CONFIG.LATE_THRESHOLD));
  }, []);

  /**
   * Calculate notes per minute
   */
  const calculateNotesPerMinute = useCallback(() => {
    if (!sessionStartRef.current || totalNotes === 0) return 0;

    const sessionDurationMinutes = (Date.now() - sessionStartRef.current) / (1000 * 60);
    return sessionDurationMinutes > 0 ? totalNotes / sessionDurationMinutes : 0;
  }, [totalNotes]);

  /**
   * Save session data to history
   */
  const saveSessionToHistory = useCallback((accuracy, duration) => {
    const sessionData = {
      timestamp: Date.now(),
      accuracy,
      duration,
      totalNotes,
      correctNotes,
      incorrectNotes,
      missedNotes,
      bestStreak,
      averageTimingError: getAverageTimingError(),
      notesPerMinute: calculateNotesPerMinute(),
    };

    setDetailedMetrics(prev => ({
      ...prev,
      accuracyHistory: [...prev.accuracyHistory, sessionData].slice(-50), // Keep last 50 sessions
      practiceTime: prev.practiceTime + duration,
    }));

    console.log('📊 [PERFORMANCE] Session saved to history:', sessionData);
  }, [totalNotes, correctNotes, incorrectNotes, missedNotes, bestStreak, getAverageTimingError, calculateNotesPerMinute]);

  /**
   * Get performance summary
   */
  const getPerformanceSummary = useCallback(() => {
    return {
      // Current session
      session: {
        duration: sessionStats.sessionDuration,
        accuracy: getAccuracy(),
        notesPerMinute: sessionStats.notesPerMinute,
        totalNotes,
        correctNotes,
        incorrectNotes,
        missedNotes,
      },
      
      // Realtime metrics
      realtime: realtimeMetrics,
      
      // Historical data
      historical: {
        totalSessions: sessionStats.totalSessions,
        averageAccuracy: sessionStats.averageAccuracy,
        bestAccuracy: sessionStats.bestAccuracy,
        totalPracticeTime: detailedMetrics.practiceTime,
      },
      
      // Detailed metrics
      detailed: {
        timingDistribution: detailedMetrics.timingDistribution,
        streakHistory: [{ bestStreak, currentStreak }],
        consistency: realtimeMetrics.consistency,
        momentum: realtimeMetrics.momentum,
      },
    };
  }, [
    sessionStats, getAccuracy, totalNotes, correctNotes, incorrectNotes, 
    missedNotes, realtimeMetrics, detailedMetrics, bestStreak, currentStreak
  ]);

  /**
   * Get improvement suggestions based on performance data
   */
  const getImprovementSuggestions = useCallback(() => {
    const suggestions = [];
    const summary = getPerformanceSummary();

    // Accuracy-based suggestions
    if (summary.session.accuracy < 70) {
      suggestions.push({
        type: 'accuracy',
        priority: 'high',
        message: 'Focus on accuracy over speed. Try practicing at a slower tempo.',
      });
    }

    // Timing-based suggestions
    if (summary.detailed.consistency < 0.5) {
      suggestions.push({
        type: 'timing',
        priority: 'medium',
        message: 'Work on timing consistency. Use a metronome to improve rhythm.',
      });
    }

    // Speed-based suggestions
    if (summary.session.notesPerMinute < 30 && summary.session.accuracy > 85) {
      suggestions.push({
        type: 'speed',
        priority: 'low',
        message: 'Great accuracy! Try gradually increasing the tempo.',
      });
    }

    // Streak-based suggestions
    if (bestStreak < 5) {
      suggestions.push({
        type: 'focus',
        priority: 'medium',
        message: 'Focus on building longer streaks. Take breaks when you feel frustrated.',
      });
    }

    return suggestions;
  }, [getPerformanceSummary, bestStreak]);

  /**
   * Export performance data
   */
  const exportPerformanceData = useCallback(() => {
    return {
      summary: getPerformanceSummary(),
      rawData: {
        timingHistory: timingHistoryRef.current,
        accuracyHistory: detailedMetrics.accuracyHistory,
        recentNotes: recentNotesRef.current,
      },
      metadata: {
        exportTime: Date.now(),
        version: '1.0',
      },
    };
  }, [getPerformanceSummary, detailedMetrics.accuracyHistory]);

  /**
   * Reset all performance data
   */
  const resetPerformanceData = useCallback(() => {
    console.log('📊 [PERFORMANCE] Resetting all performance data');
    
    setSessionStats({
      sessionStartTime: null,
      sessionDuration: 0,
      notesPerMinute: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalSessions: 0,
    });

    setDetailedMetrics({
      timingDistribution: {
        perfect: 0,
        early: 0,
        late: 0,
        missed: 0,
      },
      accuracyHistory: [],
      streakHistory: [],
      difficultyProgression: [],
      practiceTime: 0,
    });

    setRealtimeMetrics({
      currentAccuracy: 0,
      recentAccuracy: 0,
      momentum: 0,
      consistency: 0,
      improvement: 0,
    });

    // Clear refs
    recentNotesRef.current = [];
    timingHistoryRef.current = [];
    accuracyHistoryRef.current = [];
    sessionStartRef.current = null;

    if (performanceIntervalRef.current) {
      clearInterval(performanceIntervalRef.current);
      performanceIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (performanceIntervalRef.current) {
        clearInterval(performanceIntervalRef.current);
      }
    };
  }, []);

  // Auto-start tracking when game starts
  useEffect(() => {
    if (isPlaying && !sessionStartRef.current) {
      startPerformanceTracking();
    } else if (!isPlaying && sessionStartRef.current) {
      stopPerformanceTracking();
    }
  }, [isPlaying, startPerformanceTracking, stopPerformanceTracking]);

  return {
    // Performance data
    sessionStats,
    detailedMetrics,
    realtimeMetrics,
    
    // Control functions
    startPerformanceTracking,
    stopPerformanceTracking,
    trackNotePerformance,
    resetPerformanceData,
    
    // Analysis functions
    getPerformanceSummary,
    getImprovementSuggestions,
    exportPerformanceData,
    
    // Utility functions
    calculateMomentum,
    calculateConsistency,
    calculateNotesPerMinute,
  };
};

export default usePerformanceTracking;