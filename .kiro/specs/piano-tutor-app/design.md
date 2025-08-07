# Design Document

## Overview

The Piano Tutor App is a web-based application that displays musical notation and provides visual playback feedback through a moving staff mechanism. The app will render the "Different Colors" by Walk the Moon song data on a musical staff with a stationary vertical playback line, while the staff moves horizontally to create a scrolling effect.

## Architecture

### Technology Stack
- **Frontend Framework**: Vanilla JavaScript (HTML5/CSS3/JS)
- **Audio Engine**: Tone.js library for professional audio synthesis and effects
- **Music Notation Rendering**: HTML5 Canvas or CSS-based colored rectangles for note representation
- **Animation**: CSS transforms and JavaScript requestAnimationFrame for smooth staff movement
- **Data Source**: Hardcoded note data from different_colors_WALK_THE_MOON.md

### Core Components
1. **Staff Renderer**: Creates and manages the visual music staff using colored rectangles
2. **Playback Controller**: Handles timing and staff movement animation
3. **UI Controller**: Manages user interactions and app state
4. **Fingering Guide**: Provides right-hand finger positioning hints for optimal playing technique
5. **Virtual Piano Keyboard**: Interactive keyboard interface for note playback and learning

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

### FingeringGuide
```javascript
class FingeringGuide {
  getFingeringForNote(pitch, context)
  displayFingeringHint(noteIndex)
  getOptimalFingeringSequence(measures)
}
```

**Responsibilities:**
- Provide right-hand finger number suggestions (1-5) for each note
- Consider hand position and smooth transitions between notes
- Display fingering hints above or below notes
- Optimize fingering patterns for musical phrases

### VirtualPianoKeyboard
```javascript
class VirtualPianoKeyboard {
  createKeyboard(containerElement)
  renderKeys(noteRange)
  handleKeyPress(keyNote)
  handleKeyRelease(keyNote)
  handleKeyHold(keyNote, duration)
  highlightKey(keyNote, duration)
  syncWithStaff(currentNote)
  provideFeedback(isCorrect)
  
  // Learning Feedback Methods
  setExpectedNote(noteNote)
  clearExpectedNote()
  setLearningMode(enabled)
  setPlaybackActive(active)
  processLearningFeedback(keyData)
  showCorrectFeedback(keyNote)
  showIncorrectFeedback(keyNote)
  updateLearningProgressDisplay()
  resetLearningStats()
  getLearningStats()
}
```

**Responsibilities:**
- Render interactive piano keyboard with white and black keys
- Handle user clicks, holds, and releases on piano keys
- Coordinate with Tone.js audio engine for realistic piano sounds
- Support polyphonic audio playback for multiple simultaneous keys
- Manage key press/hold/release states for sustained audio
- Provide visual feedback for key presses with realistic timing
- Synchronize key highlighting with staff playback
- Show positive feedback for correct note matching
- Maintain keyboard state and visual updates
- **Learning Feedback System:**
  - Detect when note rectangles intersect the playback line
  - Compare user key presses with expected notes
  - Provide immediate visual feedback (green for correct, red for incorrect)
  - Track and display learning progress metrics in real-time
  - Maintain consistent feedback behavior across all tempo settings
  - Reset and manage learning statistics throughout sessions

### ToneJSAudioEngine
```javascript
class ToneJSAudioEngine {
  constructor()
  initializeAudio()
  createPianoSynth()
  playNote(note, velocity, duration)
  sustainNote(note, velocity)
  releaseNote(note)
  setMasterVolume(volume)
  addReverb(roomSize, dampening)
  dispose()
}
```

**Responsibilities:**
- Initialize Tone.js audio context and synthesizers
- Create realistic piano synthesizer with multiple oscillators and envelopes
- Handle note triggering with velocity sensitivity
- Manage sustained notes for key hold functionality
- Apply audio effects (reverb, compression) for realistic piano sound
- Support polyphonic playback for chord playing
- Optimize audio performance and manage memory usage
- Handle audio context suspension/resumption for browser policies

### IntersectionLineRenderer
```javascript
class IntersectionLineRenderer {
  constructor(staffContainer)
  createIntersectionLine(note, color, yPosition, maxDuration)
  showIntersectionLine(noteElement, keyColor, noteDuration)
  hideIntersectionLine(lineElement)
  fadeOutIntersectionLine(lineElement)
  calculateLinePosition(noteRect, playbackLineRect)
  getKeyColor(noteName)
  trackKeyPress(note, lineElement)
  handleKeyRelease(note)
  cleanupExpiredLines()
  dispose()
}
```

**Responsibilities:**
- Create and manage intersection line elements for correct note feedback
- Position intersection lines to align with staff notes and playback line
- Apply unique colors matching the corresponding piano keys
- Handle duration-based visibility tied to key press/release events
- Track key press states to manage intersection line lifecycle
- Implement immediate line removal on key release
- Handle smooth fade-out animations for completed note durations
- Calculate precise positioning based on note rectangles and playback line
- Manage lifecycle of intersection line elements to prevent memory leaks
- Coordinate with keyboard feedback system for color consistency
- Optimize rendering performance for multiple simultaneous lines

### MIDIController
```javascript
class MIDIController {
  constructor()
  initializeMIDI()
  scanForDevices()
  connectToDevice(deviceId)
  disconnectDevice()
  handleMIDIMessage(message)
  parseMIDINoteOn(data)
  parseMIDINoteOff(data)
  convertMIDINoteToName(noteNumber)
  getConnectedDevices()
  setMIDIInputCallback(callback)
  dispose()
}
```

**Responsibilities:**
- Initialize Web MIDI API and request MIDI access
- Scan for and list available MIDI input devices (pianos, keyboards)
- Establish connections to selected MIDI devices
- Parse incoming MIDI messages (note on/off, velocity, control changes)
- Convert MIDI note numbers to standard note names (C4, D4, etc.)
- Handle MIDI device connection/disconnection events
- Provide device selection interface for users
- Forward processed MIDI events to the main application
- Manage MIDI device state and error handling
- Support multiple simultaneous MIDI device connections

### MIDIDeviceManager
```javascript
class MIDIDeviceManager {
  constructor()
  getAvailableDevices()
  createDeviceSelectionUI()
  handleDeviceSelection(deviceId)
  showConnectionStatus(isConnected, deviceName)
  handleConnectionError(error)
  updateDeviceList()
  saveDevicePreferences()
  loadDevicePreferences()
}
```

**Responsibilities:**
- Manage MIDI device discovery and enumeration
- Create and update device selection user interface
- Handle user device selection and connection preferences
- Display connection status and error messages to users
- Persist user device preferences across sessions
- Provide visual feedback for MIDI connectivity state
- Handle device hot-plugging (connect/disconnect during use)
- Manage device naming and identification

### Fingering Recommendations for "Different Colors"

**Right Hand Finger Numbers:** 1=Thumb, 2=Index, 3=Middle, 4=Ring, 5=Pinky

**Measures 1-4 (Main Theme):**
- **Measure 1**: D(2), F(4), C(1) - Start with index finger on D, ring finger on F, thumb crosses under for C
- **Measure 2**: G(5), A(1), G(5), F(4) - Pinky on G, thumb on A, back to pinky for G, ring finger for F
- **Measure 3**: D(2), F(4), C(1) - Same fingering as measure 1 for consistency
- **Measure 4**: G(5), A(1), G(5), F(4) - Same fingering as measure 2

**Measures 5-10 (Bridge Section):**
- **Measure 5**: A(1), C5(3), A(1), F(4) - Thumb on A, middle finger on high C, thumb back to A, ring finger on F
- **Measure 6**: A(1), G(5), F(4) - Thumb on A, pinky on G, ring finger on F (longer durations)
- **Measures 7-10**: Repeat fingering patterns from measures 5-6

**Measures 11-12 (Return to Theme):**
- Same fingering as measures 1-2

**Key Fingering Principles Applied:**
- Thumb crossings for smooth scalar passages
- Consistent fingering for repeated phrases
- Hand position changes minimized for comfort
- Strong fingers (thumb, middle) on accented beats

## MIDI Piano Connectivity Design

### Web MIDI API Integration

**MIDI Device Detection and Connection:**
```javascript
class MIDIController {
  async initializeMIDI() {
    try {
      // Request MIDI access from browser
      this.midiAccess = await navigator.requestMIDIAccess();
      
      // Set up device change listeners
      this.midiAccess.onstatechange = (event) => {
        this.handleDeviceStateChange(event);
      };
      
      // Scan for available input devices
      this.scanForInputDevices();
      
      console.log('MIDI system initialized successfully');
      return true;
    } catch (error) {
      console.error('MIDI initialization failed:', error);
      return false;
    }
  }
  
  scanForInputDevices() {
    this.availableDevices = new Map();
    
    for (let input of this.midiAccess.inputs.values()) {
      if (input.state === 'connected') {
        this.availableDevices.set(input.id, {
          id: input.id,
          name: input.name,
          manufacturer: input.manufacturer,
          type: input.type,
          connection: input.connection
        });
      }
    }
    
    this.updateDeviceSelectionUI();
    
    // Automatically connect to first available device if none is currently connected
    if (this.availableDevices.size > 0 && !this.connectedDevice) {
      const firstDevice = this.availableDevices.values().next().value;
      this.autoConnectToDevice(firstDevice.id);
    }
  }
  
  async autoConnectToDevice(deviceId) {
    try {
      await this.connectToDevice(deviceId);
      console.log(`Automatically connected to MIDI device: ${this.connectedDevice.name}`);
      
      // Update UI to reflect automatic connection
      if (this.deviceManager) {
        this.deviceManager.showConnectionStatus(true, this.connectedDevice.name);
        this.deviceManager.updateDeviceSelection(deviceId);
      }
    } catch (error) {
      console.warn('Failed to auto-connect to MIDI device:', error);
    }
  }
  
  async connectToDevice(deviceId) {
    const device = this.midiAccess.inputs.get(deviceId);
    
    if (!device) {
      throw new Error(`MIDI device ${deviceId} not found`);
    }
    
    // Set up MIDI message handler
    device.onmidimessage = (message) => {
      this.handleMIDIMessage(message);
    };
    
    this.connectedDevice = device;
    this.isConnected = true;
    
    console.log(`Connected to MIDI device: ${device.name}`);
    return true;
  }
  
  handleMIDIMessage(message) {
    const [command, note, velocity] = message.data;
    
    // Parse MIDI command type
    const commandType = command & 0xF0;
    const channel = command & 0x0F;
    
    switch (commandType) {
      case 0x90: // Note On
        if (velocity > 0) {
          this.handleNoteOn(note, velocity);
        } else {
          this.handleNoteOff(note, 0);
        }
        break;
        
      case 0x80: // Note Off
        this.handleNoteOff(note, velocity);
        break;
        
      default:
        // Handle other MIDI messages (control changes, etc.)
        break;
    }
  }
  
  handleNoteOn(midiNote, velocity) {
    const noteName = this.convertMIDINoteToName(midiNote);
    const normalizedVelocity = velocity / 127; // Convert to 0-1 range
    
    // Forward to main application
    if (this.onNotePressed) {
      this.onNotePressed({
        note: noteName,
        velocity: normalizedVelocity,
        source: 'midi',
        midiNote: midiNote,
        timestamp: Date.now()
      });
    }
  }
  
  handleNoteOff(midiNote, velocity) {
    const noteName = this.convertMIDINoteToName(midiNote);
    
    // Forward to main application
    if (this.onNoteReleased) {
      this.onNoteReleased({
        note: noteName,
        source: 'midi',
        midiNote: midiNote,
        timestamp: Date.now()
      });
    }
  }
  
  convertMIDINoteToName(midiNote) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    
    return `${noteNames[noteIndex]}${octave}`;
  }
}
```

**MIDI Device Selection Interface:**
```javascript
class MIDIDeviceManager {
  createDeviceSelectionUI() {
    const devicePanel = document.createElement('div');
    devicePanel.className = 'midi-device-panel';
    devicePanel.innerHTML = `
      <h3>MIDI Piano Connection</h3>
      <div class="device-status">
        <span class="status-indicator" id="midiStatus">Disconnected</span>
        <span class="device-name" id="connectedDevice">No device selected</span>
      </div>
      <div class="device-list">
        <label for="midiDeviceSelect">Select MIDI Device:</label>
        <select id="midiDeviceSelect">
          <option value="">No MIDI device</option>
        </select>
        <button id="refreshDevices">Refresh</button>
      </div>
      <div class="connection-help">
        <p>Connect your piano or MIDI keyboard via USB or MIDI interface.</p>
        <p>Supported: Digital pianos, MIDI keyboards, MIDI controllers</p>
      </div>
    `;
    
    return devicePanel;
  }
  
  updateDeviceList(devices) {
    const select = document.getElementById('midiDeviceSelect');
    
    // Clear existing options (except "No device")
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }
    
    // Add available devices
    devices.forEach((device, deviceId) => {
      const option = document.createElement('option');
      option.value = deviceId;
      option.textContent = `${device.name} (${device.manufacturer})`;
      select.appendChild(option);
    });
  }
  
  showConnectionStatus(isConnected, deviceName = '') {
    const statusIndicator = document.getElementById('midiStatus');
    const deviceNameElement = document.getElementById('connectedDevice');
    
    if (isConnected) {
      statusIndicator.textContent = 'Connected';
      statusIndicator.className = 'status-indicator connected';
      deviceNameElement.textContent = deviceName;
    } else {
      statusIndicator.textContent = 'Disconnected';
      statusIndicator.className = 'status-indicator disconnected';
      deviceNameElement.textContent = 'No device selected';
    }
  }
}
```

### MIDI Integration with Existing Components

**Enhanced Virtual Keyboard Integration:**
```javascript
class EnhancedVirtualPianoKeyboard {
  constructor() {
    // ... existing constructor code ...
    
    // Initialize MIDI controller
    this.midiController = new MIDIController();
    this.midiDeviceManager = new MIDIDeviceManager();
    this.midiEnabled = false;
    
    // Set up MIDI event callbacks
    this.midiController.onNotePressed = (noteData) => {
      this.handleMIDINotePressed(noteData);
    };
    
    this.midiController.onNoteReleased = (noteData) => {
      this.handleMIDINoteReleased(noteData);
    };
  }
  
  async initializeMIDI() {
    try {
      const success = await this.midiController.initializeMIDI();
      if (success) {
        this.midiEnabled = true;
        this.createMIDIDeviceUI();
        console.log('MIDI integration enabled');
      }
      return success;
    } catch (error) {
      console.warn('MIDI not available:', error);
      return false;
    }
  }
  
  handleMIDINotePressed(noteData) {
    const { note, velocity, source } = noteData;
    
    // Treat MIDI input the same as virtual keyboard input
    this.handleKeyPress({
      note: note,
      velocity: velocity,
      source: source,
      timestamp: noteData.timestamp
    });
    
    // Visual feedback on virtual keyboard
    this.highlightKey(note, 'midi-active');
    
    // Process learning feedback if active
    if (this.learningFeedback.isLearningMode) {
      this.processLearningFeedback(note);
    }
  }
  
  handleMIDINoteReleased(noteData) {
    const { note, source } = noteData;
    
    // Handle note release
    this.handleKeyRelease({
      note: note,
      source: source,
      timestamp: noteData.timestamp
    });
    
    // Remove visual feedback
    this.removeKeyHighlight(note, 'midi-active');
  }
  
  // Enhanced key press handler supporting both virtual and MIDI input
  handleKeyPress(keyData) {
    const { note, velocity = 0.8, source = 'virtual' } = keyData;
    
    // Play audio (same for both virtual and MIDI)
    this.audioEngine.playNote(note, velocity);
    
    // Visual feedback
    this.highlightKey(note, source === 'midi' ? 'midi-pressed' : 'virtual-pressed');
    
    // Auto-start playback if not active
    if (!this.isPlaybackActive && this.onAutoStartPlayback) {
      this.onAutoStartPlayback(keyData);
    }
    
    // Trigger main key press handler
    if (this.onKeyPressed) {
      this.onKeyPressed(keyData);
    }
    
    console.log(`Key pressed: ${note} (${source}, velocity: ${velocity})`);
  }
}
```

**Learning Feedback with MIDI Support:**
```javascript
class EnhancedLearningFeedback {
  processLearningFeedback(keyNote, source = 'virtual') {
    if (!this.isPlaybackActive || !this.expectedNote) {
      return false;
    }
    
    const isCorrect = keyNote === this.expectedNote;
    
    // Update statistics (same for virtual and MIDI input)
    this.updateLearningStats(keyNote, isCorrect, source);
    
    // Visual feedback with source indication
    if (isCorrect) {
      this.showCorrectFeedback(keyNote, source);
    } else {
      this.showIncorrectFeedback(keyNote, source);
    }
    
    return isCorrect;
  }
  
  updateLearningStats(keyNote, isCorrect, source) {
    this.statistics.totalAttempts++;
    this.statistics.lastPlayedKey = keyNote;
    this.statistics.inputSource = source; // Track input method
    
    if (isCorrect) {
      this.statistics.correctMatches++;
      this.statistics.currentStreak++;
      
      if (this.statistics.currentStreak > this.statistics.bestStreak) {
        this.statistics.bestStreak = this.statistics.currentStreak;
      }
    } else {
      this.statistics.incorrectAttempts++;
      this.statistics.currentStreak = 0;
    }
    
    // Calculate accuracy
    this.statistics.accuracyRate = this.statistics.totalAttempts > 0 
      ? (this.statistics.correctMatches / this.statistics.totalAttempts) * 100 
      : 0;
    
    // Track MIDI vs virtual performance separately
    if (source === 'midi') {
      this.statistics.midiAttempts = (this.statistics.midiAttempts || 0) + 1;
      if (isCorrect) {
        this.statistics.midiCorrect = (this.statistics.midiCorrect || 0) + 1;
      }
    }
  }
  
  showCorrectFeedback(keyNote, source) {
    const keyElement = this.getKeyElement(keyNote);
    if (keyElement) {
      const feedbackClass = source === 'midi' ? 'midi-correct' : 'virtual-correct';
      keyElement.classList.add(feedbackClass);
      
      setTimeout(() => {
        keyElement.classList.remove(feedbackClass);
      }, 500);
    }
  }
}
```

### MIDI Device Compatibility

**Supported MIDI Devices:**
- **Digital Pianos**: Yamaha, Roland, Kawai, Casio digital pianos with USB MIDI
- **MIDI Keyboards**: M-Audio, Akai, Novation, Arturia MIDI controllers
- **Stage Pianos**: Nord, Korg, Roland stage pianos with MIDI output
- **Acoustic Pianos with MIDI**: Yamaha Disklavier, PianoDisc systems
- **MIDI Interfaces**: USB-to-MIDI adapters for older instruments

**MIDI Message Support:**
- **Note On/Off**: Primary input for key press/release detection
- **Velocity Sensitivity**: Dynamic response based on key press strength
- **Sustain Pedal**: CC64 for sustain pedal support (future enhancement)
- **Expression Pedal**: CC11 for dynamic expression (future enhancement)
- **Program Change**: Instrument selection (future enhancement)

**Connection Methods:**
- **USB MIDI**: Direct USB connection (most common)
- **5-pin DIN MIDI**: Traditional MIDI cables via USB interface
- **Wireless MIDI**: Bluetooth MIDI (where supported by browser)

## Virtual Piano Keyboard Design

### Keyboard Layout and Visual Design

**Key Arrangement:**
- **White Keys**: C, D, E, F, G, A, B (natural notes) - wider rectangular keys
- **Black Keys**: C#, D#, F#, G#, A# (sharps/flats) - narrower keys positioned between white keys
- **Key Range**: At minimum C4 to C6 to cover all song notes (C, D, F, G, A, C5)
- **Visual Style**: Clean, modern design matching the app's aesthetic

**Key Dimensions:**
- **White Keys**: 40px width × 120px height
- **Black Keys**: 24px width × 80px height
- **Key Spacing**: 1px gap between white keys
- **Black Key Positioning**: Offset to overlap white key boundaries

**Color Scheme:**
- **White Keys**: #ffffff background, #333333 border, #f0f0f0 when pressed
- **Black Keys**: #333333 background, #000000 border, #555555 when pressed
- **Unique Key Colors for Correct Feedback**: Each piano key has a distinct color when played correctly:
  - **C**: #B66FD1 (light purple)
  - **D**: #E38C25 (orange)
  - **E**: #3FB241 (green)
  - **F**: #B23D74 (magenta)
  - **G**: #4B6ECC (blue)
  - **A**: #D78CAB (pink)
  - **B**: #30A89A (teal)
- **Incorrect Key Feedback**: #808080 (gray) for incorrect key presses
- **Key Labels**: Optional note names (C, D, E, etc.) in small text

### Audio System Architecture with Tone.js

**Professional Audio Implementation using Tone.js:**

```javascript
class ToneJSAudioEngine {
  constructor() {
    this.synth = null;
    this.reverb = null;
    this.compressor = null;
    this.masterVolume = null;
    this.sustainedNotes = new Map(); // Track held notes
    this.isInitialized = false;
  }
  
  async initializeAudio() {
    await Tone.start();
    
    // Create polyphonic piano synthesizer
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle",
        harmonicity: 2,
        modulationType: "sine",
        modulationIndex: 0.5
      },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2
      }
    });
    
    // Add realistic piano effects
    this.reverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0.3
    });
    
    this.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 8,
      attack: 0.003,
      release: 0.1
    });
    
    this.masterVolume = new Tone.Volume(-6);
    
    // Connect audio chain
    this.synth.chain(this.compressor, this.reverb, this.masterVolume, Tone.Destination);
    
    this.isInitialized = true;
  }
  
  playNote(note, velocity = 0.8, duration) {
    if (!this.isInitialized) return;
    
    if (duration) {
      // Trigger note for specific duration
      this.synth.triggerAttackRelease(note, duration, undefined, velocity);
    } else {
      // Start sustained note (for key hold)
      this.synth.triggerAttack(note, undefined, velocity);
      this.sustainedNotes.set(note, Date.now());
    }
  }
  
  releaseNote(note) {
    if (!this.isInitialized || !this.sustainedNotes.has(note)) return;
    
    this.synth.triggerRelease(note);
    this.sustainedNotes.delete(note);
  }
  
  setMasterVolume(volume) {
    if (this.masterVolume) {
      this.masterVolume.volume.value = volume;
    }
  }
  
  dispose() {
    if (this.synth) this.synth.dispose();
    if (this.reverb) this.reverb.dispose();
    if (this.compressor) this.compressor.dispose();
    if (this.masterVolume) this.masterVolume.dispose();
  }
}
```

**Tone.js Note Mapping:**
- **C4**: "C4"
- **D4**: "D4" 
- **F4**: "F4"
- **G4**: "G4"
- **A4**: "A4"
- **C5**: "C5"

**Key Press/Hold/Release Handling:**
```javascript
class KeyboardInteractionHandler {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.pressedKeys = new Set();
    this.keyElements = new Map();
  }
  
  handleKeyDown(keyElement, note) {
    if (this.pressedKeys.has(note)) return; // Prevent key repeat
    
    this.pressedKeys.add(note);
    keyElement.classList.add('pressed');
    
    // Start sustained note
    this.audioEngine.playNote(note, 0.8);
  }
  
  handleKeyUp(keyElement, note) {
    if (!this.pressedKeys.has(note)) return;
    
    this.pressedKeys.delete(note);
    keyElement.classList.remove('pressed');
    
    // Release sustained note
    this.audioEngine.releaseNote(note);
  }
  
  handleKeyClick(keyElement, note) {
    // For quick clicks without hold
    keyElement.classList.add('pressed');
    this.audioEngine.playNote(note, 0.8, "8n"); // Eighth note duration
    
    setTimeout(() => {
      keyElement.classList.remove('pressed');
    }, 150);
  }
}
```

### Integration with Existing Components

**Staff Synchronization:**
- When a note is highlighted on the staff during playback, the corresponding key highlights on the keyboard
- Key highlighting uses the same color scheme as staff note highlighting
- Timing synchronization ensures keyboard and staff highlights are perfectly aligned

**Playback Integration:**
- Keyboard remains interactive during playback
- User can click keys to play along with the song
- Correct key presses during playback show positive feedback (green highlight)
- Incorrect key presses show neutral feedback (brief flash)

**Interactive Learning Feedback System:**
- **Trigger Condition**: When the left edge of a note rectangle touches the vertical playback line, the system activates learning feedback mode for that specific note
- **Expected Note Detection**: The system identifies which note should be played based on the note rectangle currently intersecting the playback line
- **User Input Processing**: When a user clicks any piano key during this active state, the system compares the clicked key with the expected note
- **Positive Feedback**: If the user clicks the correct key (matching the expected note), the system provides:
  - Piano key displays its unique color highlight for the duration of the key press
  - A short colored block line appears that intersects with the corresponding note on the staff
  - The intersection line uses the same unique color as the piano key
  - The intersection line remains visible for the duration of the key press, up to the maximum duration of the note
  - The intersection line disappears when the user releases the key or when the note's duration completes, whichever comes first
- **Negative Feedback**: If the user clicks an incorrect key, that key displays a gray color with a shake animation (0.3 second duration)
- **Progress Tracking**: The system maintains real-time statistics including:
  - Correct matches count
  - Incorrect attempts count
  - Total attempts count
  - Current streak (consecutive correct matches)
  - Accuracy percentage
- **Visual Progress Display**: A dedicated progress panel shows all learning metrics in real-time, updating immediately after each user interaction
- **Tempo Consistency**: The learning feedback system maintains consistent behavior across all tempo settings (40-200 BPM), using the same note detection logic regardless of playback speed

**Manual Navigation Compatibility:**
- Keyboard continues to work when user manually navigates the staff
- Key highlighting updates based on the note currently under the playback line
- No conflicts with drag/swipe interactions on the staff area

**Tempo Integration:**
- Keyboard responsiveness remains consistent across all tempo settings
- Audio playback timing matches the selected tempo
- Key highlighting duration scales appropriately with tempo changes

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
  notePositions: Array,      // Calculated x-positions of each note
  keyboardState: {
    activeKeys: Set,         // Currently highlighted keys
    pressedKeys: Set,        // Currently pressed keys
    lastPlayedKey: string,   // Last key played by user
    correctMatches: number,  // Count of correct key presses
    audioEnabled: boolean    // Audio playback state
  },
  midiState: {
    isEnabled: boolean,         // MIDI system availability
    isConnected: boolean,       // MIDI device connection status
    connectedDevice: {
      id: string,               // Device identifier
      name: string,             // Device display name
      manufacturer: string,     // Device manufacturer
      type: string              // Device type
    },
    availableDevices: Map,      // All detected MIDI devices
    lastMIDIActivity: number,   // Timestamp of last MIDI message
    inputSource: string,        // 'virtual', 'midi', or 'both'
    midiPreferences: {
      autoConnect: boolean,     // Auto-connect to last used device
      preferredDeviceId: string, // User's preferred device
      velocitySensitivity: number // MIDI velocity response curve
    }
  },
  learningFeedback: {
    isLearningMode: boolean,    // Whether learning feedback is active
    expectedNote: string,       // Current note that should be played
    isPlaybackActive: boolean,  // Whether playback is currently running
    statistics: {
      correctMatches: number,     // Total correct key presses
      incorrectAttempts: number,  // Total incorrect key presses
      totalAttempts: number,      // Total user interactions
      currentStreak: number,      // Current consecutive correct matches
      bestStreak: number,         // Best streak achieved in session
      accuracyRate: number,       // Percentage of correct attempts
      midiAttempts: number,       // MIDI-specific attempts
      midiCorrect: number,        // MIDI-specific correct matches
      virtualAttempts: number,    // Virtual keyboard attempts
      virtualCorrect: number,     // Virtual keyboard correct matches
      inputSourceBreakdown: {     // Performance by input method
        midi: { attempts: number, correct: number, accuracy: number },
        virtual: { attempts: number, correct: number, accuracy: number }
      }
    }
  }
}
```

### Virtual Keyboard Data Models

**Key Definition:**
```javascript
{
  note: string,           // Note name: "C4", "D4", "F4", etc.
  type: string,          // Key type: "white" or "black"
  frequency: number,     // Audio frequency in Hz
  position: {
    x: number,           // X position in keyboard layout
    y: number,           // Y position (0 for white, offset for black)
    width: number,       // Key width in pixels
    height: number       // Key height in pixels
  },
  isActive: boolean,     // Currently highlighted from staff
  isPressed: boolean,    // Currently pressed by user
  element: HTMLElement   // DOM element reference
}
```

**Tone.js Audio Configuration:**
```javascript
{
  synthConfig: {
    oscillator: {
      type: "triangle",
      harmonicity: number,     // Harmonic ratio for realistic piano timbre
      modulationType: string,  // Modulation type for complex waveforms
      modulationIndex: number  // Modulation depth
    },
    envelope: {
      attack: number,          // Attack time in seconds
      decay: number,           // Decay time in seconds  
      sustain: number,         // Sustain level (0.0 to 1.0)
      release: number          // Release time in seconds
    }
  },
  effects: {
    reverb: {
      decay: number,           // Reverb decay time
      wet: number              // Reverb mix level (0.0 to 1.0)
    },
    compressor: {
      threshold: number,       // Compression threshold in dB
      ratio: number,           // Compression ratio
      attack: number,          // Compressor attack time
      release: number          // Compressor release time
    }
  },
  masterVolume: number,        // Master volume in dB
  polyphony: number,           // Maximum simultaneous notes
  sustainedNotes: Map,         // Currently held notes
  isInitialized: boolean       // Audio system ready state
}
```

### MIDI Data Models

**MIDI Device Information:**
```javascript
{
  id: string,                 // Unique device identifier
  name: string,               // Device display name
  manufacturer: string,       // Device manufacturer
  type: string,               // 'input', 'output', or 'input/output'
  state: string,              // 'connected', 'disconnected'
  connection: string,         // 'open', 'closed', 'pending'
  version: string,            // MIDI version supported
  capabilities: {
    noteOn: boolean,          // Supports note on messages
    noteOff: boolean,         // Supports note off messages
    velocity: boolean,        // Supports velocity sensitivity
    aftertouch: boolean,      // Supports aftertouch
    controlChange: boolean,   // Supports control change messages
    programChange: boolean,   // Supports program change
    pitchBend: boolean        // Supports pitch bend
  }
}
```

**MIDI Message Structure:**
```javascript
{
  data: Uint8Array,           // Raw MIDI message bytes
  timestamp: number,          // High-resolution timestamp
  parsed: {
    command: number,          // MIDI command type (0x80-0xFF)
    channel: number,          // MIDI channel (0-15)
    note: number,             // MIDI note number (0-127)
    velocity: number,         // Note velocity (0-127)
    noteName: string,         // Converted note name (C4, D#5, etc.)
    normalizedVelocity: number // Velocity normalized to 0-1 range
  },
  source: {
    deviceId: string,         // Source device identifier
    deviceName: string,       // Source device name
    inputType: string         // 'midi' input type
  }
}
```

**MIDI Connection State:**
```javascript
{
  isSupported: boolean,       // Web MIDI API browser support
  isEnabled: boolean,         // MIDI system enabled by user
  permissionGranted: boolean, // MIDI access permission status
  connectedDevices: Map,      // Currently connected devices
  activeDevice: string,       // Currently selected device ID
  connectionHistory: Array,   // Previously connected devices
  errorState: {
    lastError: string,        // Last error message
    errorCount: number,       // Total error count
    recoveryAttempts: number  // Connection recovery attempts
  },
  performance: {
    messageCount: number,     // Total MIDI messages received
    averageLatency: number,   // Average input latency
    droppedMessages: number,  // Messages lost due to processing delays
    lastActivity: number      // Timestamp of last MIDI activity
  }
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

### Virtual Keyboard Errors
- **Tone.js initialization failure**: Fallback to basic Web Audio API or silent mode
- **Audio Context blocked by browser**: Provide user interaction prompt to enable audio
- **Polyphonic synthesis overload**: Limit simultaneous notes and provide graceful degradation
- **Key rendering issues**: Use simplified rectangular key layout
- **Touch/click event conflicts**: Implement event delegation and conflict resolution
- **Audio latency issues**: Optimize Tone.js buffer sizes and use low-latency mode
- **Sustained note memory leaks**: Implement automatic cleanup for orphaned sustained notes

### MIDI Connectivity Errors
- **Web MIDI API not supported**: Display informative message and disable MIDI features gracefully
- **MIDI access permission denied**: Provide clear instructions for enabling MIDI permissions in browser
- **No MIDI devices detected**: Show helpful message about connecting MIDI devices and refreshing
- **Device connection failure**: Retry connection with exponential backoff, fallback to virtual keyboard
- **Device disconnection during use**: Detect disconnection, notify user, automatically switch to virtual mode
- **MIDI message parsing errors**: Log malformed messages, continue processing valid messages
- **MIDI input latency issues**: Implement input buffering and latency compensation
- **Multiple device conflicts**: Prioritize user-selected device, handle simultaneous inputs gracefully
- **MIDI driver compatibility**: Provide troubleshooting guide for common driver issues
- **Browser MIDI implementation differences**: Implement browser-specific workarounds and feature detection

### Learning Feedback Errors
- **Note detection failure**: Fallback to manual note specification or disable learning mode
- **Progress display update errors**: Use console logging as fallback, continue tracking internally
- **Animation/CSS class conflicts**: Implement class management with timeout cleanup
- **Statistics calculation errors**: Reset to default values and log warning
- **Tempo synchronization issues**: Maintain feedback functionality with default timing
- **Expected note mismatch**: Clear expected note and restart detection cycle
- **MIDI input processing delays**: Implement input queuing and batch processing for high-frequency MIDI data
- **Mixed input source conflicts**: Prioritize MIDI input over virtual keyboard when both are active simultaneously

## Testing Strategy

### Unit Tests
- **StaffRenderer**: Test staff creation, note positioning, visual updates
- **PlaybackController**: Test timing calculations, animation control, state management
- **UIController**: Test user interactions, state updates, error display
- **VirtualPianoKeyboard**: Test key rendering, click handling, audio playback, visual feedback
- **ToneJSAudioEngine**: Test Tone.js initialization, polyphonic synthesis, sustained note management, audio effects chain
- **Learning Feedback System**: Test note detection accuracy, correct/incorrect feedback display, statistics tracking, progress display updates

### Integration Tests
- **Data Flow**: Test complete pipeline from hardcoded data to rendered staff
- **Playback Synchronization**: Test staff movement with note highlighting
- **User Interactions**: Test play/pause/reset functionality
- **Keyboard-Staff Synchronization**: Test keyboard highlighting matches staff playback
- **Audio-Visual Coordination**: Test Tone.js audio playback timing with visual feedback, sustained note synchronization
- **Multi-component Interaction**: Test keyboard, staff, and playback working together
- **Learning Feedback Integration**: Test note rectangle intersection detection, user input processing, feedback display coordination, statistics persistence across playback sessions
- **Tempo-Feedback Coordination**: Test learning feedback consistency across all tempo settings
- **MIDI Integration Tests**: Test MIDI device detection, connection, message processing, and integration with existing components
- **Mixed Input Integration**: Test simultaneous virtual keyboard and MIDI input handling
- **MIDI Learning Feedback**: Test learning feedback system with MIDI input, velocity sensitivity, and performance tracking
- **Device Hot-plugging**: Test device connection/disconnection during active use
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
- **Audio Performance**: Test Tone.js latency, polyphonic performance, sustained note memory management, effects processing overhead
- **Keyboard Responsiveness**: Measure click-to-feedback timing, visual update performance
- **Cross-browser Audio**: Test Tone.js compatibility and performance across different browsers and devices