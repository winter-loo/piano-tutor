# Design Document

## Overview

The Piano Tutor App is a web-based application that displays musical notation and provides visual playback feedback through a moving staff mechanism. The app will render the "Different Colors" by Walk the Moon song data on a musical staff with a stationary vertical playback line, while the staff moves horizontally to create a scrolling effect.

## Architecture

### Technology Stack
- **Frontend Framework**: Vanilla JavaScript (HTML5/CSS3/JS)
- **Music Notation Rendering**: HTML5 Canvas or CSS-based colored rectangles for note representation
- **Animation**: CSS transforms and JavaScript requestAnimationFrame for smooth staff movement
- **Data Source**: Hardcoded note data from different_colors_WALK_THE_MOON.md

### Core Components
1. **Staff Renderer**: Creates and manages the visual music staff using colored rectangles
2. **Playback Controller**: Handles timing and staff movement animation
3. **UI Controller**: Manages user interactions and app state

## Components and Interfaces

### StaffRenderer
```javascript
class StaffRenderer {
  createStaff(containerElement, width, height)
  renderNotes(noteData, measures)
  updateStaffPosition(xOffset)
  getStaffWidth()
}
```

**Responsibilities:**
- Create HTML5 canvas or CSS-based staff with 5 horizontal lines
- Render treble clef symbol at the beginning of the staff
- Display notes as colored rectangles positioned on staff lines/spaces
- Calculate rectangle width based on note duration (quarter, eighth, etc.)
- Handle staff positioning and coordinate transformations
- Manage staff visual updates during playback

### PlaybackController
```javascript
class PlaybackController {
  startPlayback()
  pausePlayback()
  resetPlayback()
  updatePlaybackPosition(timestamp)
  calculateNoteTimings(noteData)
}
```

**Responsibilities:**
- Control playback timing and animation loop
- Calculate note positions and timing intervals
- Manage staff movement animation using requestAnimationFrame
- Handle playback state (playing, paused, stopped)
- Synchronize visual feedback with note positions

### UIController
```javascript
class UIController {
  initializeInterface()
  setupPlaybackControls()
  handlePlayPause()
  handleReset()
  updatePlaybackIndicator(currentNote)
}
```

**Responsibilities:**
- Initialize DOM elements and event listeners
- Manage playback control buttons (play/pause/reset)
- Handle user interactions
- Update visual feedback for current note
- Coordinate between other components

## Data Models

### Note Data Structure
```javascript
{
  measure: number,
  notes: [
    {
      pitch: string,     // Note name: "D", "F", "C", "G", "A", "C5"
      duration: string,  // Duration type: "quarter", "eighth", "dotted quarter", "half"
      timing: number,    // Calculated playback timing in milliseconds
      yPosition: number, // Vertical position on staff (line or space)
      width: number      // Rectangle width based on duration
    }
  ]
}
```

### App State
```javascript
{
  isPlaying: boolean,
  currentPosition: number,    // Current playback position in pixels
  staffWidth: number,         // Total width of rendered staff
  playbackSpeed: number,      // Pixels per millisecond movement speed
  currentNoteIndex: number,   // Index of currently highlighted note
  notePositions: Array       // Calculated x-positions of each note
}
```

## Error Handling

### Rendering Errors
- **Canvas initialization failure**: Fallback to CSS-based rectangle rendering
- **Staff line rendering issues**: Use fallback CSS borders for staff lines
- **Note positioning errors**: Use default spacing with warning
- **Rectangle rendering issues**: Fallback to simple colored div elements

### Playback Errors
- **Animation frame issues**: Fallback to setTimeout-based animation
- **Timing calculation errors**: Use default note spacing
- **State synchronization issues**: Reset to initial state

## Testing Strategy

### Unit Tests
- **StaffRenderer**: Test staff creation, note positioning, visual updates
- **PlaybackController**: Test timing calculations, animation control, state management
- **UIController**: Test user interactions, state updates, error display

### Integration Tests
- **Data Flow**: Test complete pipeline from hardcoded data to rendered staff
- **Playback Synchronization**: Test staff movement with note highlighting
- **User Interactions**: Test play/pause/reset functionality
- **Error Scenarios**: Test graceful degradation and error recovery

### Visual Tests
- **Staff Rendering**: Verify correct note positions and spacing
- **Animation Smoothness**: Test staff movement at different speeds
- **Responsive Design**: Test layout on different screen sizes
- **Cross-browser Compatibility**: Test on major browsers

### Performance Tests
- **Rendering Performance**: Measure staff creation and update times
- **Animation Performance**: Monitor frame rates during playback
- **Memory Usage**: Check for memory leaks during extended use
- **Load Time**: Measure initial app loading and data parsing time