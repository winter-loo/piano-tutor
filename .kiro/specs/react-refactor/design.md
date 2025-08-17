# Design Document

## Overview

This design document outlines the architecture and implementation approach for refactoring the Piano Tutor application from a monolithic HTML file into a modern React application. The design preserves all existing functionality while creating a maintainable, scalable component architecture.

## Architecture

### High-Level Architecture

The application follows a modern React architecture with the following key principles:

1. **Component-Based Architecture**: UI is broken down into reusable, single-responsibility components
2. **Custom Hooks Pattern**: Complex logic is encapsulated in custom hooks for reusability
3. **State Management**: Zustand for global state, local state for component-specific data
4. **Separation of Concerns**: Clear boundaries between UI, business logic, and data management
5. **Performance Optimization**: Code splitting, memoization, and efficient re-rendering strategies

### Directory Structure

```
piano-tutor-react/
├── src/
│   ├── components/
│   │   ├── StaffNotation/
│   │   │   ├── StaffNotation.jsx
│   │   │   ├── StaffNotation.css
│   │   │   ├── PlaybackLine.jsx
│   │   │   ├── NotesContainer.jsx
│   │   │   └── NoteRectangle.jsx
│   │   ├── PianoKeyboard/
│   │   │   ├── PianoKeyboard.jsx
│   │   │   ├── PianoKeyboard.css
│   │   │   └── PianoKey.jsx
│   │   ├── MIDIControls/
│   │   │   ├── MIDISocket.jsx
│   │   │   ├── MIDIConfigPopup.jsx
│   │   │   └── MIDIControls.css
│   │   ├── Controls/
│   │   │   ├── TempoControl.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── Controls.css
│   │   ├── Overlays/
│   │   │   ├── StartOverlay.jsx
│   │   │   ├── EndingOverlay.jsx
│   │   │   └── Overlays.css
│   │   └── UI/
│   │       ├── ErrorBoundary.jsx
│   │       └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── useAudioEngine.js
│   │   ├── useMIDI.js
│   │   ├── useGameState.js
│   │   ├── useKeyboard.js
│   │   └── usePerformanceTracking.js
│   ├── stores/
│   │   ├── audioStore.js
│   │   ├── midiStore.js
│   │   ├── gameStore.js
│   │   └── uiStore.js
│   ├── utils/
│   │   ├── notePositioning.js
│   │   ├── constants.js
│   │   ├── midiUtils.js
│   │   └── audioUtils.js
│   ├── data/
│   │   └── songData.js
│   └── styles/
│       ├── globals.css
│       ├── variables.css
│       └── responsive.css
```

## Components and Interfaces

### Core Components

#### 1. App Component
**Purpose**: Root application component that orchestrates all other components
**Props**: None (root component)
**State**: Manages global application state through Zustand stores

```jsx
const App = () => {
  const { isAudioInitialized, initializeAudio } = useAudioEngine();
  const { showStartOverlay, showEndingOverlay } = useUIStore();
  
  return (
    <ErrorBoundary>
      {showStartOverlay && <StartOverlay onStart={initializeAudio} />}
      {showEndingOverlay && <EndingOverlay />}
      <div className="app-container">
        <StaffNotation />
        <PianoKeyboard />
        <MIDIControls />
      </div>
    </ErrorBoundary>
  );
};
```

#### 2. StaffNotation Component
**Purpose**: Renders the musical staff with notes, playback line, and controls
**Props**: 
- `notes`: Array of note objects
- `currentTime`: Current playback time
- `isPlaying`: Boolean playback state

```jsx
const StaffNotation = ({ notes, currentTime, isPlaying }) => {
  return (
    <div className="staff-container">
      <ProgressBar />
      <TempoControl />
      <div className="staff-lines">
        {[1,2,3,4,5].map(line => <div key={line} className="staff-line" />)}
      </div>
      <div className="staff">
        <div className="treble-clef">𝄞</div>
        <PlaybackLine currentTime={currentTime} />
        <NotesContainer notes={notes} currentTime={currentTime} />
      </div>
    </div>
  );
};
```

#### 3. PianoKeyboard Component
**Purpose**: Virtual piano keyboard with visual feedback and audio playback
**Props**:
- `onKeyPress`: Function called when key is pressed
- `onKeyRelease`: Function called when key is released
- `activeKeys`: Set of currently active keys
- `correctKeys`: Set of correctly pressed keys
- `incorrectKeys`: Set of incorrectly pressed keys

```jsx
const PianoKeyboard = ({ 
  onKeyPress, 
  onKeyRelease, 
  activeKeys, 
  correctKeys, 
  incorrectKeys 
}) => {
  const { playNote, stopNote } = useAudioEngine();
  const { keyLayout } = useKeyboard();
  
  return (
    <div className="keyboard-container">
      <MIDISocket />
      <div className="keyboard">
        {keyLayout.map(key => (
          <PianoKey
            key={key.note}
            keyData={key}
            isActive={activeKeys.has(key.note)}
            isCorrect={correctKeys.has(key.note)}
            isIncorrect={incorrectKeys.has(key.note)}
            onPress={onKeyPress}
            onRelease={onKeyRelease}
          />
        ))}
      </div>
    </div>
  );
};
```

#### 4. MIDIControls Component
**Purpose**: MIDI device connection and configuration interface
**Props**: None (uses MIDI store)

```jsx
const MIDIControls = () => {
  const { 
    isConnected, 
    deviceName, 
    availableDevices,
    connect,
    disconnect 
  } = useMIDI();
  const [showConfig, setShowConfig] = useState(false);
  
  return (
    <>
      <MIDISocket 
        isConnected={isConnected}
        onClick={() => setShowConfig(true)}
      />
      {showConfig && (
        <MIDIConfigPopup
          devices={availableDevices}
          onConnect={connect}
          onDisconnect={disconnect}
          onClose={() => setShowConfig(false)}
        />
      )}
    </>
  );
};
```

### Custom Hooks

#### 1. useAudioEngine Hook
**Purpose**: Manages Tone.js audio engine and note playback
**Returns**: Audio control functions and state

```javascript
const useAudioEngine = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const synthRef = useRef(null);
  
  const initializeAudio = async () => {
    await Tone.start();
    synthRef.current = new Tone.PolySynth().toDestination();
    setIsInitialized(true);
  };
  
  const playNote = (note, velocity = 0.8) => {
    if (synthRef.current) {
      synthRef.current.triggerAttack(note, undefined, velocity);
    }
  };
  
  const stopNote = (note) => {
    if (synthRef.current) {
      synthRef.current.triggerRelease(note);
    }
  };
  
  return { isInitialized, initializeAudio, playNote, stopNote };
};
```

#### 2. useMIDI Hook
**Purpose**: Manages MIDI device connections and message handling
**Returns**: MIDI state and control functions

```javascript
const useMIDI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const midiAccessRef = useRef(null);
  
  const initializeMIDI = async () => {
    try {
      midiAccessRef.current = await navigator.requestMIDIAccess();
      scanDevices();
    } catch (error) {
      console.error('MIDI initialization failed:', error);
    }
  };
  
  const connect = async (deviceId) => {
    // Connection logic
  };
  
  const disconnect = () => {
    // Disconnection logic
  };
  
  return { isConnected, availableDevices, connect, disconnect };
};
```

#### 3. useGameState Hook
**Purpose**: Manages game logic, scoring, and note tracking
**Returns**: Game state and control functions

```javascript
const useGameState = () => {
  const [currentNotes, setCurrentNotes] = useState([]);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  const handleNotePress = (note) => {
    // Game logic for note evaluation
  };
  
  const resetGame = () => {
    setScore(0);
    setAccuracy(0);
    setCurrentNotes([]);
  };
  
  return { currentNotes, score, accuracy, handleNotePress, resetGame };
};
```

### State Management (Zustand Stores)

#### 1. Audio Store
```javascript
const useAudioStore = create((set, get) => ({
  isPlaying: false,
  currentTime: 0,
  tempo: 60,
  volume: 0.7,
  
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setTempo: (tempo) => set({ tempo }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
}));
```

#### 2. MIDI Store
```javascript
const useMIDIStore = create((set, get) => ({
  isConnected: false,
  deviceName: '',
  availableDevices: [],
  selectedDevice: null,
  
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
}));
```

#### 3. Game Store
```javascript
const useGameStore = create((set, get) => ({
  currentNotes: [],
  pressedKeys: new Set(),
  score: 0,
  accuracy: 0,
  correctNotes: 0,
  incorrectNotes: 0,
  
  addPressedKey: (key) => set((state) => ({
    pressedKeys: new Set([...state.pressedKeys, key])
  })),
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

## Data Models

### Note Model
```javascript
const NoteModel = {
  pitch: 'C4',           // Note name with octave
  startTime: 0,          // Start time in seconds
  duration: 1,           // Duration in seconds
  type: 'quarter',       // Note type (quarter, half, etc.)
  fingering: 1,          // Suggested fingering (1-5)
  velocity: 0.8,         // Note velocity (0-1)
  isRest: false         // Whether this is a rest
};
```

### MIDI Device Model
```javascript
const MIDIDeviceModel = {
  id: 'device-id',
  name: 'Piano Device',
  manufacturer: 'Yamaha',
  type: 'input',
  state: 'connected',
  connection: 'open'
};
```

### Performance Metrics Model
```javascript
const PerformanceMetricsModel = {
  totalNotes: 0,
  correctNotes: 0,
  incorrectNotes: 0,
  accuracy: 0,
  averageTiming: 0,
  bestStreak: 0,
  currentStreak: 0,
  startTime: null,
  endTime: null
};
```

## Error Handling

### Error Boundary Component
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Piano Tutor Error:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>The piano tutor encountered an error. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Error Handling Strategies
1. **Audio Errors**: Graceful fallback to silent mode with visual feedback
2. **MIDI Errors**: Fallback to virtual keyboard with user notification
3. **Component Errors**: Error boundaries with fallback UI
4. **Network Errors**: Retry mechanisms with user feedback

## Testing Strategy

### Unit Testing
- **Components**: Test rendering, props handling, and user interactions
- **Hooks**: Test state management and side effects
- **Utilities**: Test pure functions and calculations
- **Stores**: Test state mutations and actions

### Integration Testing
- **Audio Integration**: Test Tone.js integration with mocked audio context
- **MIDI Integration**: Test MIDI device simulation and message handling
- **Component Integration**: Test component communication and data flow

### End-to-End Testing
- **User Workflows**: Test complete user journeys from start to finish
- **Cross-browser Testing**: Ensure compatibility across different browsers
- **Performance Testing**: Verify audio latency and rendering performance

### Testing Tools
- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing framework
- **Web Audio Test API**: Mock Web Audio API for testing

## Performance Considerations

### Optimization Strategies
1. **Code Splitting**: Lazy load components and features
2. **Memoization**: Use React.memo and useMemo for expensive operations
3. **Virtual Scrolling**: For large note sequences
4. **Audio Buffer Management**: Efficient audio resource management
5. **MIDI Message Throttling**: Handle high-frequency MIDI input efficiently

### Bundle Optimization
- **Tree Shaking**: Remove unused code from Tone.js and other libraries
- **Dynamic Imports**: Load features on demand
- **Asset Optimization**: Compress and optimize static assets
- **Service Worker**: Cache resources for offline functionality

### Runtime Performance
- **RAF-based Animation**: Use requestAnimationFrame for smooth animations
- **Debounced Updates**: Throttle frequent state updates
- **Memory Management**: Proper cleanup of audio resources and event listeners
- **Efficient Re-rendering**: Minimize unnecessary component re-renders

## Migration Strategy

### Phase 1: Foundation Setup
1. Create React + Vite project structure
2. Set up build tools and development environment
3. Install and configure dependencies
4. Create basic component structure

### Phase 2: Core Components
1. Extract and convert StaffNotation component
2. Extract and convert PianoKeyboard component
3. Implement basic state management with Zustand
4. Create custom hooks for audio and MIDI

### Phase 3: Advanced Features
1. Implement MIDI device management
2. Add overlay components (Start/End screens)
3. Integrate performance tracking
4. Add error handling and loading states

### Phase 4: Polish and Optimization
1. Implement code splitting and lazy loading
2. Add comprehensive testing suite
3. Optimize performance and bundle size
4. Add documentation and deployment setup

## Browser Compatibility

### Supported Browsers
- **Chrome**: 88+ (full Web Audio and MIDI support)
- **Firefox**: 85+ (Web Audio support, limited MIDI)
- **Safari**: 14+ (Web Audio support, no MIDI)
- **Edge**: 88+ (full Web Audio and MIDI support)

### Fallback Strategies
- **No MIDI Support**: Graceful degradation to virtual keyboard only
- **Limited Audio Support**: Basic audio playback with reduced features
- **Older Browsers**: Progressive enhancement with core functionality

### Feature Detection
```javascript
const checkBrowserSupport = () => {
  return {
    webAudio: !!(window.AudioContext || window.webkitAudioContext),
    midi: !!navigator.requestMIDIAccess,
    es6: typeof Symbol !== 'undefined',
    modules: 'noModule' in HTMLScriptElement.prototype
  };
};
```