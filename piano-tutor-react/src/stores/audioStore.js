import { create } from 'zustand';

const useAudioStore = create((set, get) => ({
  // Audio engine state
  isInitialized: false,
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  duration: 0,

  // Audio settings
  tempo: 60,
  volume: 0.7,
  masterVolume: 1.0,

  // Playback controls
  playbackRate: 1.0,
  isLooping: false,

  // Audio effects
  reverbEnabled: true,
  reverbAmount: 0.3,

  // Audio engine actions
  setInitialized: initialized => set({ isInitialized: initialized }),

  // Playback controls
  play: () => set({ isPlaying: true, isPaused: false }),
  pause: () => set({ isPlaying: false, isPaused: true }),
  stop: () =>
    set({
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
    }),

  // Time controls
  setCurrentTime: time => set({ currentTime: time }),
  setDuration: duration => set({ duration }),

  // Audio settings
  setTempo: tempo => {
    const clampedTempo = Math.max(30, Math.min(200, tempo));
    set({ tempo: clampedTempo });
  },

  setVolume: volume => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    set({ volume: clampedVolume });
  },

  setMasterVolume: volume => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    set({ masterVolume: clampedVolume });
  },

  setPlaybackRate: rate => {
    const clampedRate = Math.max(0.25, Math.min(2.0, rate));
    set({ playbackRate: clampedRate });
  },

  toggleLooping: () => set(state => ({ isLooping: !state.isLooping })),

  // Audio effects
  setReverbEnabled: enabled => set({ reverbEnabled: enabled }),
  setReverbAmount: amount => {
    const clampedAmount = Math.max(0, Math.min(1, amount));
    set({ reverbAmount: clampedAmount });
  },

  // Utility actions
  reset: () =>
    set({
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      tempo: 60,
      volume: 0.7,
      playbackRate: 1.0,
      isLooping: false,
    }),

  // Computed getters
  getEffectiveVolume: () => {
    const state = get();
    return state.volume * state.masterVolume;
  },

  getProgress: () => {
    const state = get();
    return state.duration > 0 ? state.currentTime / state.duration : 0;
  },
}));

export default useAudioStore;
