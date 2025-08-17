# Design Document

## Overview

This design document outlines the technical approach for fixing critical bugs and implementing missing features in the Piano Tutor React application. The application has been successfully refactored from the original HTML implementation, but several key functionalities need to be restored to achieve feature parity with the original design.

The fixes focus on eight main areas: progress bar navigation, tempo control styling, staff snapping behavior, keyboard visual consistency, audio feedback, staff scrolling, progress bar accuracy, and MIDI integration reliability.

## Architecture

### Component Structure

The application follows a modular React architecture with the following key components:

- **App.jsx**: Main application container managing state and orchestrating components
- **StaffNotation.jsx**: Staff display with playback line and note visualization
- **ProgressBar.jsx**: Interactive progress control for song navigation
- **TempoControl.jsx**: BPM selection interface
- **PianoKeyboard.jsx**: Virtual piano with visual and audio feedback
- **MIDIControls.jsx**: MIDI device connection and configuration

### State Management

The application uses Zustand stores for state management:

- **audioStore**: Audio playback, timing, and tempo state
- **gameStore**: Game logic, key states, and progress tracking
- **midiStore**: MIDI device connection and input handling
- **uiStore**: UI state and error handling

### Integration Points

Key integration points that require fixes:

1. **Progress Bar ↔ Staff Navigation**: Click-to-seek functionality
2. **Staff ↔ Audio Store**: Position synchronization during playback
3. **Piano Keyboard ↔ Audio Engine**: Sound feedback on key press
4. **MIDI Input ↔ Virtual Keyboard**: Unified key state management

## Components and Interfaces

### Enhanced ProgressBar Component

**Current Issues:**
- Progress bar clicks don't properly update staff position
- Dragging doesn't provide real-time staff updates
- No snapping to nearest note after interaction

**Design Solution:**
```javascript
// Enhanced ProgressBar interface
interface ProgressBarProps {
  onSeek: (targetTime: number, percentage: number) => void;
  onDragStart?: () => void;
  onDragEnd?: (finalPosition: number) => void;
  enableSnapping?: boolean;
  snapToNotes?: boolean;
}
```

**Key Methods:**
- `handleProgressBarClick()`: Calculate time and trigger staff jump
- `handleDragUpdate()`: Continuous staff position updates during drag
- `snapToNearestNote()`: Post-drag alignment with musical content

### Enhanced StaffNotation Component

**Current Issues:**
- Manual navigation doesn't properly constrain boundaries
- No smooth snapping after drag operations
- Staff position doesn't sync with progress bar clicks

**Design Solution:**
```javascript
// Enhanced StaffNotation interface
interface StaffNotationProps {
  onPositionChange: (position: number, time: number) => void;
  enableSnapping: boolean;
  snapThreshold: number; // pixels
  constrainToBounds: boolean;
}
```

**Key Methods:**
- `jumpToPosition(percentage: number)`: Immediate position jump from progress bar
- `snapToNearestNote()`: Find and align to closest note
- `constrainPosition(position: number)`: Boundary validation
- `smoothTransition(targetPosition: number)`: Animated position changes

### Enhanced TempoControl Component

**Current Issues:**
- Displays "BPM" text after the number (should be clean like original)
- Doesn't match the minimal design of the original implementation

**Design Solution:**
```javascript
// Clean tempo display matching original
const TempoControl = () => {
  return (
    <div className="tempo-control">
      <label className="tempo-label">♩=</label>
      <select className="tempo-selector" value={tempo}>
        {tempoOptions.map(value => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
      {/* Remove BPM text to match original */}
    </div>
  );
};
```

### Enhanced PianoKeyboard Component

**Current Issues:**
- Key colors don't match original implementation exactly
- Missing audio feedback on virtual key presses
- Incorrect key highlighting states

**Design Solution:**
```javascript
// Enhanced key state management
interface KeyState {
  isPressed: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  correctNoteClass?: string; // For color-coded feedback
  timingFeedback?: 'early' | 'late' | 'perfect';
}

// Audio feedback integration
const handleKeyPress = async (keyData) => {
  // Visual feedback (immediate)
  updateKeyState(keyData.note, { isPressed: true });
  
  // Audio feedback (with error handling)
  try {
    await playNote(keyData.note, velocity);
  } catch (error) {
    console.warn('Audio playback failed:', error);
    // Continue with visual feedback only
  }
  
  // Game logic integration
  const result = handleNotePress(keyData.note);
  updateKeyVisualFeedback(keyData.note, result);
};
```

## Data Models

### Position Synchronization Model

```javascript
interface PositionState {
  currentTime: number;        // Audio playback time (seconds)
  staffPosition: number;      // Staff scroll position (pixels)
  progressPercentage: number; // Progress bar position (0-100)
  isManualNavigation: boolean; // User is dragging/clicking
}

interface NoteAttachment {
  noteIndex: number;
  noteStartTime: number;
  notePosition: number; // pixels
  attachmentOffset: number; // Fine-tuning offset
}
```

### Audio Feedback Model

```javascript
interface AudioFeedbackConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
  polyphonic: boolean; // Multiple notes simultaneously
  sustainTime: number; // Note release timing
  fallbackToVisual: boolean; // Continue without audio if unavailable
}

interface KeyPressEvent {
  note: string;
  velocity: number;
  source: 'virtual' | 'midi';
  timestamp: number;
  audioFeedback: boolean;
}
```

### MIDI Integration Model

```javascript
interface MIDIState {
  isConnected: boolean;
  deviceName: string;
  inputLatency: number;
  outputEnabled: boolean;
  autoConnect: boolean;
}

interface MIDIEvent {
  type: 'noteOn' | 'noteOff';
  note: string;
  velocity: number;
  timestamp: number;
  channel: number;
}
```

## Error Handling

### Audio System Error Handling

```javascript
class AudioErrorHandler {
  static async handleAudioFailure(error, fallbackAction) {
    console.warn('Audio system error:', error);
    
    // Attempt recovery
    try {
      await this.reinitializeAudio();
    } catch (recoveryError) {
      // Graceful degradation - continue with visual feedback only
      this.enableVisualOnlyMode();
      if (fallbackAction) fallbackAction();
    }
  }
  
  static enableVisualOnlyMode() {
    // Update UI to indicate audio is unavailable
    // Ensure all interactions continue to work visually
  }
}
```

### MIDI Connection Error Handling

```javascript
class MIDIErrorHandler {
  static handleConnectionFailure(error) {
    // Log error but don't block application
    console.warn('MIDI connection failed:', error);
    
    // Update UI to show disconnected state
    midiStore.setConnectionState('disconnected');
    
    // Continue with virtual keyboard only
    return { fallbackMode: 'virtual', error: error.message };
  }
}
```

### Navigation Boundary Handling

```javascript
class NavigationConstraints {
  static constrainStaffPosition(position, totalWidth) {
    const minPosition = 0;
    const maxPosition = Math.max(0, totalWidth - VIEWPORT_WIDTH);
    return Math.max(minPosition, Math.min(position, maxPosition));
  }
  
  static findNearestNote(position, notes) {
    return notes.reduce((nearest, note) => {
      const distance = Math.abs(note.x - position);
      return distance < Math.abs(nearest.x - position) ? note : nearest;
    });
  }
}
```

## Testing Strategy

### Unit Testing

**Component Tests:**
- ProgressBar: Click handling, drag operations, percentage calculations
- TempoControl: Value selection, discrete BPM validation
- StaffNotation: Position calculations, boundary constraints, snapping logic
- PianoKeyboard: Key state management, audio integration, visual feedback

**Store Tests:**
- audioStore: Time synchronization, tempo changes, playback state
- gameStore: Key press handling, score tracking, game state transitions
- midiStore: Connection management, input processing, device selection

### Integration Testing

**Navigation Flow Tests:**
```javascript
describe('Progress Bar to Staff Navigation', () => {
  test('clicking progress bar updates staff position immediately', async () => {
    // Click at 50% progress
    fireEvent.click(progressBar, { clientX: 250 }); // 50% of 500px width
    
    // Verify staff position updates
    expect(staffPosition).toBe(expectedPosition);
    expect(audioStore.currentTime).toBe(expectedTime);
  });
  
  test('dragging progress bar provides continuous updates', async () => {
    // Start drag
    fireEvent.mouseDown(progressBar, { clientX: 100 });
    
    // Move during drag
    fireEvent.mouseMove(document, { clientX: 200 });
    
    // Verify continuous updates
    expect(staffPosition).toHaveBeenUpdatedContinuously();
  });
});
```

**Audio Feedback Tests:**
```javascript
describe('Piano Keyboard Audio Integration', () => {
  test('virtual key press triggers audio playback', async () => {
    const mockPlayNote = jest.fn();
    useAudioEngine.mockReturnValue({ playNote: mockPlayNote });
    
    fireEvent.mouseDown(getByTestId('key-C4'));
    
    await waitFor(() => {
      expect(mockPlayNote).toHaveBeenCalledWith('C4', expect.any(Number));
    });
  });
  
  test('audio failure does not break visual feedback', async () => {
    const mockPlayNote = jest.fn().mockRejectedValue(new Error('Audio failed'));
    useAudioEngine.mockReturnValue({ playNote: mockPlayNote });
    
    fireEvent.mouseDown(getByTestId('key-C4'));
    
    // Visual feedback should still work
    expect(getByTestId('key-C4')).toHaveClass('pressed');
  });
});
```

### End-to-End Testing

**User Workflow Tests:**
1. **Progress Navigation**: Click progress bar → verify staff jumps → verify playback line attaches to note
2. **Manual Staff Navigation**: Drag staff → release → verify snapping to nearest note
3. **Audio Feedback**: Press virtual keys → verify immediate audio response
4. **MIDI Integration**: Connect MIDI device → press physical keys → verify same response as virtual keys

**Performance Tests:**
- Staff scrolling smoothness during playback
- Progress bar responsiveness during drag operations
- Audio latency measurements for key presses
- Memory usage during extended play sessions

### Accessibility Testing

- Keyboard navigation for all interactive elements
- Screen reader compatibility for progress indicators
- High contrast mode support for visual feedback
- Touch device compatibility for mobile users

This design ensures that all identified bugs are systematically addressed while maintaining the existing architecture and improving the overall user experience to match the original HTML implementation.