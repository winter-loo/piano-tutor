# 🚀 React + Vite Refactoring Plan

## Overview
This document outlines the comprehensive plan to modularize the 11,884-line piano tutor app from a single `index.html` file into a modern React + Vite project structure.

## 📋 **Phase 1: Project Setup & Structure**

### **1.1 Initialize React + Vite Project**
```bash
npm create vite@latest piano-tutor-react -- --template react
cd piano-tutor-react
npm install
```

### **1.2 Install Dependencies**
```bash
# Audio & MIDI
npm install tone @types/webmidi

# UI & Styling
npm install styled-components
# OR
npm install @emotion/react @emotion/styled

# State Management
npm install zustand  # Lightweight alternative to Redux
```

## 📋 **Phase 2: Component Extraction Strategy**

### **2.1 Core Components Priority**
1. **StaffNotation** - Staff lines, notes, playback line (PRIORITY)
2. **PianoKeyboard** - Extract piano key rendering & interaction
3. **AudioEngine** - Tone.js integration & audio management
4. **MIDIControls** - MIDI device connection & settings

### **2.2 Component Breakdown**

#### **PianoKeyboard Component**
```jsx
// Extract from lines ~264-461 in your index.html
const PianoKeyboard = () => {
  const { pressedKeys, handleKeyPress, handleKeyRelease } = useKeyboard();
  
  return (
    <div className="keyboard-container">
      {keys.map(key => (
        <PianoKey 
          key={key.note}
          note={key.note}
          type={key.type}
          isPressed={pressedKeys.has(key.note)}
          onPress={handleKeyPress}
          onRelease={handleKeyRelease}
        />
      ))}
    </div>
  );
};
```

#### **StaffNotation Component**
```jsx
// Extract from lines ~78-263 in your index.html
const StaffNotation = () => {
  const { notes, currentTime, isPlaying } = useGameState();
  
  return (
    <div className="staff-container">
      <div className="staff-lines">
        {[1,2,3,4,5].map(line => <div key={line} className="staff-line" />)}
      </div>
      <div className="staff">
        <div className="treble-clef">𝄞</div>
        <PlaybackLine currentTime={currentTime} />
        <NotesContainer notes={notes} />
      </div>
    </div>
  );
};
```

#### **MIDI Controls Component**
```jsx
// Extract MIDI functionality from your existing classes
const MIDIControls = () => {
  const { isConnected, deviceName, connect, disconnect } = useMIDI();
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="midi-controls">
      <MIDISocket 
        isConnected={isConnected}
        onClick={() => setShowSettings(true)}
      />
      {showSettings && (
        <MIDISettingsPopup 
          onClose={() => setShowSettings(false)}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      )}
    </div>
  );
};
```

## 📋 **Phase 3: State Management Migration**

### **3.1 Extract JavaScript Classes**
Your current classes to convert:
- `PianoTutorApp` → React App component + hooks
- `AudioEngine` → `useAudioEngine` hook + Zustand store
- `MIDIManager` → `useMIDI` hook + Zustand store
- `MIDISettingsPopupManager` → React component

### **3.2 Zustand Stores**

#### **Audio Store**
```javascript
// stores/audioStore.js
import { create } from 'zustand';

export const useAudioStore = create((set, get) => ({
  // State
  isPlaying: false,
  currentTime: 0,
  tempo: 120,
  volume: 0.7,
  audioEngine: null,
  
  // Actions
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setTempo: (tempo) => set({ tempo }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  
  // Audio Engine Methods
  initializeAudio: async () => {
    // Initialize Tone.js and audio engine
  },
  playNote: (note, duration) => {
    // Play individual note
  },
}));
```

#### **MIDI Store**
```javascript
// stores/midiStore.js
import { create } from 'zustand';

export const useMIDIStore = create((set, get) => ({
  // State
  isConnected: false,
  deviceName: '',
  availableDevices: [],
  selectedDevice: null,
  
  // Actions
  connect: (device) => set({ 
    isConnected: true, 
    deviceName: device.name,
    selectedDevice: device 
  }),
  disconnect: () => set({ 
    isConnected: false, 
    deviceName: '',
    selectedDevice: null 
  }),
  setAvailableDevices: (devices) => set({ availableDevices: devices }),
}));
```

#### **Game State Store**
```javascript
// stores/gameStore.js
import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // State
  currentNotes: [],
  pressedKeys: new Set(),
  score: 0,
  accuracy: 0,
  correctNotes: 0,
  incorrectNotes: 0,
  
  // Actions
  addPressedKey: (key) => set((state) => ({
    pressedKeys: new Set([...state.pressedKeys, key])
  })),
  removePressedKey: (key) => set((state) => {
    const newPressed = new Set(state.pressedKeys);
    newPressed.delete(key);
    return { pressedKeys: newPressed };
  }),
  updateScore: (points) => set((state) => ({
    score: state.score + points
  })),
  resetGame: () => set({
    pressedKeys: new Set(),
    score: 0,
    accuracy: 0,
    correctNotes: 0,
    incorrectNotes: 0,
  }),
}));
```

### **3.3 Custom Hooks**

#### **useAudioEngine Hook**
```javascript
// hooks/useAudioEngine.js
import { useEffect, useRef } from 'react';
import { useAudioStore } from '../stores/audioStore';
import * as Tone from 'tone';

export const useAudioEngine = () => {
  const audioEngineRef = useRef(null);
  const { tempo, volume, setCurrentTime } = useAudioStore();
  
  useEffect(() => {
    // Initialize Tone.js
    const initAudio = async () => {
      await Tone.start();
      // Initialize your audio engine here
    };
    
    initAudio();
    
    return () => {
      // Cleanup
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);
  
  const playNote = (note, duration = '8n') => {
    // Implement note playing logic
  };
  
  const stopNote = (note) => {
    // Implement note stopping logic
  };
  
  return {
    playNote,
    stopNote,
    isReady: !!audioEngineRef.current,
  };
};
```

#### **useMIDI Hook**
```javascript
// hooks/useMIDI.js
import { useEffect } from 'react';
import { useMIDIStore } from '../stores/midiStore';

export const useMIDI = () => {
  const { 
    isConnected, 
    deviceName, 
    availableDevices,
    connect, 
    disconnect,
    setAvailableDevices 
  } = useMIDIStore();
  
  useEffect(() => {
    // Initialize Web MIDI API
    const initMIDI = async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const devices = Array.from(midiAccess.inputs.values());
        setAvailableDevices(devices);
      } catch (error) {
        console.error('MIDI initialization failed:', error);
      }
    };
    
    initMIDI();
  }, []);
  
  return {
    isConnected,
    deviceName,
    availableDevices,
    connect,
    disconnect,
  };
};
```

## 📋 **Phase 4: Migration Steps**

### **Step 1: Setup & Basic Structure** (Day 1-2)
1. Create new Vite project
2. Install dependencies
3. Set up project structure
4. Copy over HTML structure to App.jsx
5. Move global CSS to separate files

### **Step 2: Extract Static Components** (Day 2-3)
1. **PianoKeyboard Component**
   - Extract piano key HTML structure
   - Move related CSS to component modules
   - Create PianoKey subcomponent
   
2. **StaffNotation Component**
   - Extract staff lines and notation area
   - Move staff-related CSS
   - Create subcomponents (PlaybackLine, NoteRectangle)

3. **Control Components**
   - TempoControl
   - ProgressBar
   - StartOverlay

### **Step 3: Add Interactivity** (Day 3-5)
1. Convert event handlers to React events
2. Implement custom hooks for complex logic
3. Set up Zustand stores
4. Connect components to state management

### **Step 4: Audio Integration** (Day 5-7)
1. Move Tone.js initialization to useAudioEngine hook
2. Convert AudioEngine class to React patterns
3. Implement audio playback functionality
4. Test audio functionality across components

### **Step 5: MIDI Integration** (Day 7-9)
1. Extract MIDI classes to useMIDI hook
2. Convert MIDISettingsPopupManager to React component
3. Implement MIDI device connection logic
4. Test device connections and input handling

### **Step 6: Polish & Optimization** (Day 9-12)
1. Add error boundaries for robust error handling
2. Implement code splitting for better performance
3. Add loading states and transitions
4. Optimize re-renders with React.memo and useMemo
5. Add TypeScript (optional but recommended)
6. Write unit tests for critical components

## 📝 **Notes**

- Keep the original `index.html` as reference during migration
- Test audio functionality frequently during development
- Consider implementing a feature flag system for gradual rollout
- Document any breaking changes or new requirements
- Plan for mobile responsiveness from the start

## 🎯 **Success Criteria**

- [ ] All existing functionality preserved
- [ ] Improved code organization and maintainability
- [ ] Better performance (faster load times, smoother interactions)
- [ ] Cross-device compatibility maintained
- [ ] Easy to add new features
- [ ] Clear path to future mobile app development
