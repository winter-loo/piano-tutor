import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  // Overlay states
  showStartOverlay: true,
  showEndingOverlay: false,
  showMIDIConfigPopup: false,
  showSettingsModal: false,
  showHelpModal: false,

  // Loading states
  isLoading: false,
  loadingMessage: '',
  isAudioLoading: false,
  isMIDILoading: false,

  // Error states
  hasError: false,
  errorMessage: '',
  errorType: null, // 'audio', 'midi', 'network', 'general'

  // UI preferences
  theme: 'light', // 'light', 'dark', 'auto'
  showKeyLabels: true,
  showFingeringHints: true,
  showNoteNames: true,
  animationsEnabled: true,

  // Layout preferences
  keyboardPosition: 'bottom', // 'bottom', 'top'
  staffSize: 'medium', // 'small', 'medium', 'large'
  compactMode: false,

  // Notification system
  notifications: [],
  nextNotificationId: 1,

  // Modal and popup management
  activeModal: null, // 'settings', 'help', 'midi-config', null
  modalHistory: [],

  // Overlay actions
  showStartOverlay: () => set({ showStartOverlay: true }),
  hideStartOverlay: () => set({ showStartOverlay: false }),

  showEndingOverlay: () => set({ showEndingOverlay: true }),
  hideEndingOverlay: () => set({ showEndingOverlay: false }),

  showMIDIConfig: () =>
    set({
      showMIDIConfigPopup: true,
      activeModal: 'midi-config',
    }),
  hideMIDIConfig: () =>
    set({
      showMIDIConfigPopup: false,
      activeModal: null,
    }),

  showSettings: () =>
    set({
      showSettingsModal: true,
      activeModal: 'settings',
    }),
  hideSettings: () =>
    set({
      showSettingsModal: false,
      activeModal: null,
    }),

  showHelp: () =>
    set({
      showHelpModal: true,
      activeModal: 'help',
    }),
  hideHelp: () =>
    set({
      showHelpModal: false,
      activeModal: null,
    }),

  // Loading state management
  setLoading: (loading, message = '') =>
    set({
      isLoading: loading,
      loadingMessage: message,
    }),

  setAudioLoading: loading => set({ isAudioLoading: loading }),
  setMIDILoading: loading => set({ isMIDILoading: loading }),

  // Error handling
  setError: (message, type = 'general') =>
    set({
      hasError: true,
      errorMessage: message,
      errorType: type,
    }),

  clearError: () =>
    set({
      hasError: false,
      errorMessage: '',
      errorType: null,
    }),

  // UI preferences
  setTheme: theme => set({ theme }),
  toggleTheme: () =>
    set(state => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  setShowKeyLabels: show => set({ showKeyLabels: show }),
  toggleKeyLabels: () =>
    set(state => ({ showKeyLabels: !state.showKeyLabels })),

  setShowFingeringHints: show => set({ showFingeringHints: show }),
  toggleFingeringHints: () =>
    set(state => ({ showFingeringHints: !state.showFingeringHints })),

  setShowNoteNames: show => set({ showNoteNames: show }),
  toggleNoteNames: () =>
    set(state => ({ showNoteNames: !state.showNoteNames })),

  setAnimationsEnabled: enabled => set({ animationsEnabled: enabled }),
  toggleAnimations: () =>
    set(state => ({ animationsEnabled: !state.animationsEnabled })),

  // Layout preferences
  setKeyboardPosition: position => set({ keyboardPosition: position }),
  setStaffSize: size => set({ staffSize: size }),
  setCompactMode: compact => set({ compactMode: compact }),
  toggleCompactMode: () => set(state => ({ compactMode: !state.compactMode })),

  // Notification system
  addNotification: notification =>
    set(state => {
      const newNotification = {
        id: state.nextNotificationId,
        timestamp: Date.now(),
        type: 'info', // 'info', 'success', 'warning', 'error'
        autoClose: true,
        duration: 5000,
        ...notification,
      };

      return {
        notifications: [...state.notifications, newNotification],
        nextNotificationId: state.nextNotificationId + 1,
      };
    }),

  removeNotification: id =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  // Modal management
  openModal: modalType =>
    set(state => ({
      activeModal: modalType,
      modalHistory: [...state.modalHistory, modalType],
      [`show${modalType.charAt(0).toUpperCase() + modalType.slice(1)}Modal`]: true,
    })),

  closeModal: () =>
    set(state => {
      const currentModal = state.activeModal;
      const newHistory = state.modalHistory.slice(0, -1);
      const previousModal = newHistory[newHistory.length - 1] || null;

      return {
        activeModal: previousModal,
        modalHistory: newHistory,
        [`show${currentModal?.charAt(0).toUpperCase() + currentModal?.slice(1)}Modal`]: false,
      };
    }),

  closeAllModals: () =>
    set({
      activeModal: null,
      modalHistory: [],
      showSettingsModal: false,
      showHelpModal: false,
      showMIDIConfigPopup: false,
    }),

  // Utility actions
  reset: () =>
    set({
      showStartOverlay: true,
      showEndingOverlay: false,
      showMIDIConfigPopup: false,
      showSettingsModal: false,
      showHelpModal: false,
      isLoading: false,
      loadingMessage: '',
      isAudioLoading: false,
      isMIDILoading: false,
      hasError: false,
      errorMessage: '',
      errorType: null,
      notifications: [],
      activeModal: null,
      modalHistory: [],
    }),

  // Computed getters
  hasActiveModal: () => {
    const state = get();
    return state.activeModal !== null;
  },

  getActiveNotifications: () => {
    const state = get();
    return state.notifications.filter(n => !n.dismissed);
  },

  isAnyLoading: () => {
    const state = get();
    return state.isLoading || state.isAudioLoading || state.isMIDILoading;
  },
}));

export default useUIStore;
