import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Game state
  isPlaying: false,
  isPaused: false,
  isCompleted: false,
  gameMode: 'practice', // 'practice', 'challenge', 'freeplay'

  // Current song/lesson data
  currentNotes: [],
  currentNoteIndex: 0,

  // Note tracking
  pressedKeys: new Set(),
  correctKeys: new Set(),
  incorrectKeys: new Set(),
  expectedNotes: new Set(),

  // Scoring and performance
  score: 0,
  totalNotes: 0,
  correctNotes: 0,
  incorrectNotes: 0,
  missedNotes: 0,
  accuracy: 0,

  // Streak tracking
  currentStreak: 0,
  bestStreak: 0,
  streakMultiplier: 1,

  // Timing and performance metrics
  averageTimingError: 0,
  timingErrors: [],
  notesPerMinute: 0,

  // Game progression
  level: 1,
  experience: 0,
  experienceToNext: 100,

  // Game actions
  startGame: song =>
    set({
      isPlaying: true,
      isPaused: false,
      isCompleted: false,
      currentNotes: song,
      currentNoteIndex: 0,
      score: 0,
      correctNotes: 0,
      incorrectNotes: 0,
      missedNotes: 0,
      currentStreak: 0,
      timingErrors: [],
      pressedKeys: new Set(),
      correctKeys: new Set(),
      incorrectKeys: new Set(),
      expectedNotes: new Set(),
    }),

  pauseGame: () => set({ isPaused: true, isPlaying: false }),
  resumeGame: () => set({ isPaused: false, isPlaying: true }),

  endGame: () =>
    set(state => {
      const accuracy =
        state.totalNotes > 0
          ? (state.correctNotes / state.totalNotes) * 100
          : 0;
      return {
        isPlaying: false,
        isPaused: false,
        isCompleted: true,
        accuracy,
      };
    }),

  // Note interaction
  addPressedKey: key =>
    set(state => ({
      pressedKeys: new Set([...state.pressedKeys, key]),
    })),

  removePressedKey: key =>
    set(state => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.delete(key);
      return { pressedKeys: newPressedKeys };
    }),

  addCorrectKey: key =>
    set(state => ({
      correctKeys: new Set([...state.correctKeys, key]),
    })),

  addIncorrectKey: key =>
    set(state => ({
      incorrectKeys: new Set([...state.incorrectKeys, key]),
    })),

  clearKeyStates: () =>
    set({
      pressedKeys: new Set(),
      correctKeys: new Set(),
      incorrectKeys: new Set(),
    }),

  // Note evaluation
  evaluateNote: (note, timing) =>
    set(state => {
      const isCorrect = state.expectedNotes.has(note);
      const timingError = Math.abs(timing);

      if (isCorrect) {
        const newCorrectNotes = state.correctNotes + 1;
        const newCurrentStreak = state.currentStreak + 1;
        const newBestStreak = Math.max(state.bestStreak, newCurrentStreak);
        const streakBonus = Math.floor(newCurrentStreak / 10) * 10;
        const baseScore = 10;
        const timingBonus = Math.max(0, 10 - timingError);
        const scoreIncrease =
          (baseScore + timingBonus + streakBonus) * state.streakMultiplier;

        return {
          correctNotes: newCorrectNotes,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          score: state.score + scoreIncrease,
          timingErrors: [...state.timingErrors, timingError],
          totalNotes: state.totalNotes + 1,
          correctKeys: new Set([...state.correctKeys, note]),
          streakMultiplier: Math.min(
            3,
            1 + Math.floor(newCurrentStreak / 20) * 0.5
          ),
        };
      } else {
        return {
          incorrectNotes: state.incorrectNotes + 1,
          currentStreak: 0,
          streakMultiplier: 1,
          totalNotes: state.totalNotes + 1,
          incorrectKeys: new Set([...state.incorrectKeys, note]),
        };
      }
    }),

  missNote: () =>
    set(state => ({
      missedNotes: state.missedNotes + 1,
      currentStreak: 0,
      streakMultiplier: 1,
      totalNotes: state.totalNotes + 1,
    })),

  // Expected notes management
  setExpectedNotes: notes => set({ expectedNotes: new Set(notes) }),
  addExpectedNote: note =>
    set(state => ({
      expectedNotes: new Set([...state.expectedNotes, note]),
    })),
  removeExpectedNote: note =>
    set(state => {
      const newExpectedNotes = new Set(state.expectedNotes);
      newExpectedNotes.delete(note);
      return { expectedNotes: newExpectedNotes };
    }),

  // Progress tracking
  advanceNoteIndex: () =>
    set(state => ({
      currentNoteIndex: Math.min(
        state.currentNoteIndex + 1,
        state.currentNotes.length - 1
      ),
    })),

  setNoteIndex: index =>
    set(state => ({
      currentNoteIndex: Math.max(
        0,
        Math.min(index, state.currentNotes.length - 1)
      ),
    })),

  // Experience and leveling
  addExperience: exp =>
    set(state => {
      const newExperience = state.experience + exp;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const experienceToNext = newLevel * 100 - newExperience;

      return {
        experience: newExperience,
        level: newLevel,
        experienceToNext: Math.max(0, experienceToNext),
      };
    }),

  // Game mode
  setGameMode: mode => set({ gameMode: mode }),

  // Reset functions
  resetScore: () =>
    set({
      score: 0,
      correctNotes: 0,
      incorrectNotes: 0,
      missedNotes: 0,
      totalNotes: 0,
      currentStreak: 0,
      streakMultiplier: 1,
      timingErrors: [],
      accuracy: 0,
    }),

  resetGame: () =>
    set({
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      currentNotes: [],
      currentNoteIndex: 0,
      pressedKeys: new Set(),
      correctKeys: new Set(),
      incorrectKeys: new Set(),
      expectedNotes: new Set(),
      score: 0,
      totalNotes: 0,
      correctNotes: 0,
      incorrectNotes: 0,
      missedNotes: 0,
      accuracy: 0,
      currentStreak: 0,
      streakMultiplier: 1,
      timingErrors: [],
      notesPerMinute: 0,
    }),

  // Computed getters
  getAccuracy: () => {
    const state = get();
    return state.totalNotes > 0
      ? (state.correctNotes / state.totalNotes) * 100
      : 0;
  },

  getAverageTimingError: () => {
    const state = get();
    if (state.timingErrors.length === 0) return 0;
    return (
      state.timingErrors.reduce((sum, error) => sum + error, 0) /
      state.timingErrors.length
    );
  },

  getCurrentNote: () => {
    const state = get();
    return state.currentNotes[state.currentNoteIndex] || null;
  },

  getProgress: () => {
    const state = get();
    return state.currentNotes.length > 0
      ? state.currentNoteIndex / state.currentNotes.length
      : 0;
  },

  isKeyPressed: key => {
    const state = get();
    return state.pressedKeys.has(key);
  },

  isKeyCorrect: key => {
    const state = get();
    return state.correctKeys.has(key);
  },

  isKeyIncorrect: key => {
    const state = get();
    return state.incorrectKeys.has(key);
  },
}));

export default useGameStore;
