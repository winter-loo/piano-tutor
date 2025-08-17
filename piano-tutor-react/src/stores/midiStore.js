import { create } from 'zustand';

const useMIDIStore = create((set, get) => ({
  // MIDI connection state
  isSupported: false,
  isInitialized: false,
  isConnected: false,
  isConnecting: false,
  connectionError: null,

  // Device information
  selectedDevice: null,
  availableDevices: [],
  connectedDevices: [],

  // MIDI settings
  autoConnect: true,
  velocity: 0.8,
  channel: 1,

  // Input state
  activeNotes: new Set(),
  lastNoteOn: null,
  lastNoteOff: null,

  // Connection actions
  setSupported: supported => set({ isSupported: supported }),
  setInitialized: initialized => set({ isInitialized: initialized }),

  setConnecting: connecting =>
    set({
      isConnecting: connecting,
      connectionError: connecting ? null : get().connectionError,
    }),

  setConnected: (connected, device = null) =>
    set({
      isConnected: connected,
      isConnecting: false,
      selectedDevice: connected ? device : null,
      connectionError: null,
    }),

  setConnectionError: error =>
    set({
      connectionError: error,
      isConnecting: false,
      isConnected: false,
    }),

  // Device management
  setAvailableDevices: devices => set({ availableDevices: devices }),

  addAvailableDevice: device =>
    set(state => ({
      availableDevices: [
        ...state.availableDevices.filter(d => d.id !== device.id),
        device,
      ],
    })),

  removeAvailableDevice: deviceId =>
    set(state => ({
      availableDevices: state.availableDevices.filter(d => d.id !== deviceId),
      selectedDevice:
        state.selectedDevice?.id === deviceId ? null : state.selectedDevice,
      isConnected:
        state.selectedDevice?.id === deviceId ? false : state.isConnected,
    })),

  setConnectedDevices: devices => set({ connectedDevices: devices }),

  selectDevice: device => set({ selectedDevice: device }),

  // MIDI settings
  setAutoConnect: autoConnect => set({ autoConnect }),
  setVelocity: velocity => {
    const clampedVelocity = Math.max(0, Math.min(1, velocity));
    set({ velocity: clampedVelocity });
  },
  setChannel: channel => {
    const clampedChannel = Math.max(1, Math.min(16, channel));
    set({ channel: clampedChannel });
  },

  // Note input handling
  addActiveNote: note =>
    set(state => ({
      activeNotes: new Set([...state.activeNotes, note]),
      lastNoteOn: { note, timestamp: Date.now() },
    })),

  removeActiveNote: note =>
    set(state => {
      const newActiveNotes = new Set(state.activeNotes);
      newActiveNotes.delete(note);
      return {
        activeNotes: newActiveNotes,
        lastNoteOff: { note, timestamp: Date.now() },
      };
    }),

  clearActiveNotes: () =>
    set({
      activeNotes: new Set(),
      lastNoteOn: null,
      lastNoteOff: null,
    }),

  // Utility actions
  disconnect: () =>
    set({
      isConnected: false,
      isConnecting: false,
      selectedDevice: null,
      activeNotes: new Set(),
      connectionError: null,
    }),

  reset: () =>
    set({
      isConnected: false,
      isConnecting: false,
      selectedDevice: null,
      availableDevices: [],
      connectedDevices: [],
      activeNotes: new Set(),
      connectionError: null,
      velocity: 0.8,
      channel: 1,
      lastNoteOn: null,
      lastNoteOff: null,
    }),

  // Computed getters
  getDeviceById: deviceId => {
    const state = get();
    return state.availableDevices.find(device => device.id === deviceId);
  },

  hasActiveNotes: () => {
    const state = get();
    return state.activeNotes.size > 0;
  },

  isNoteActive: note => {
    const state = get();
    return state.activeNotes.has(note);
  },
}));

export default useMIDIStore;
