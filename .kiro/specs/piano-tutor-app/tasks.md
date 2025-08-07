# Implementation Plan

- [x] 1. Set up project structure and basic HTML layout
  - Create index.html with basic structure for piano tutor app
  - Add CSS container for staff, playback line, and controls
  - Include basic styling for clean, minimal interface
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2. Create hardcoded note data structure
  - Define JavaScript object containing all 12 measures from different_colors_WALK_THE_MOON.md
  - Include note names, durations, and measure organization
  - Add fingering recommendations for each note
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Implement staff rendering system
  - [x] 3.1 Create staff lines and treble clef
    - Draw 5 horizontal staff lines using CSS or Canvas
    - Add treble clef symbol at the beginning of staff
    - Set up proper spacing and proportions
    - _Requirements: 1.1, 1.2_

  - [x] 3.2 Implement note positioning logic
    - Calculate vertical positions for each note (D, F, C, G, A, C5) on staff
    - Map note names to staff line/space positions
    - Create coordinate system for note placement
    - _Requirements: 1.3, 2.4_

  - [x] 3.3 Render notes as colored rectangles
    - Create colored rectangles for each note based on duration
    - Position r\ectangles correctly on staff lines/spaces
    - Implement different widths for different note durations
    - _Requirements: 1.4, 2.5_

- [ ] 4. Create playback visualization system
  - [x] 4.1 Implement stationary vertical playback line
    - Create fixed vertical line positioned after treble clef
    - Style line to be clearly visible over staff
    - Position line at correct horizontal location
    - _Requirements: 3.1_

  - [x] 4.2 Implement staff movement animation
    - Create CSS transform-based horizontal movement for staff container
    - Use requestAnimationFrame for smooth animation
    - Calculate movement speed based on note timing
    - _Requirements: 3.2, 3.3_

  - [ ] 4.3 Add note highlighting during playback
    - Highlight current note when it aligns with vertical line
    - Change note color or add visual indicator for active note
    - Update highlighting as staff moves through notes
    - _Requirements: 3.4_

- [ ] 5. Implement playback controls
  - [x] 5.1 Create play/pause functionality
    - Add play/pause button with appropriate styling
    - Implement start/stop animation logic
    - Handle playback state management
    - _Requirements: 4.4, 3.2_

- [ ] 6. Add fingering guide display
  - [x] 6.1 Implement fingering number display
    - Show finger numbers (1-5) inside the rectangle of each note
    - Style fingering numbers to be clearly readable
    - _Requirements: 2.1, 2.2_

  - [ ] 6.2 Highlight current fingering during playback
    - Emphasize fingering number for currently playing note
    - Coordinate fingering display with note highlighting
    - Update fingering emphasis as playback progresses
    - _Requirements: 3.4_

- [ ] 7. Implement timing and synchronization
  - [ ] 7.1 Calculate note timing intervals
    - Convert note durations to millisecond timing values
    - Account for different note types (quarter, eighth, dotted quarter, half)
    - Create timing array for smooth playback progression
    - _Requirements: 2.3, 3.3_

  - [ ] 7.2 Synchronize staff movement with note timing
    - Match staff movement speed to calculated note timings
    - Ensure notes align properly with vertical line at correct times
    - Handle tempo consistency throughout playback
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 8. Add responsive design and polish
  - [ ] 8.1 Implement responsive layout
    - Ensure staff scales appropriately on different screen sizes
    - Maintain proper proportions for notes and spacing
    - Test layout on mobile and desktop viewports
    - _Requirements: 4.1, 4.2_

  - [ ] 8.2 Add visual polish and error handling
    - Implement smooth transitions and animations
    - Add error handling for edge cases
    - Ensure clean, professional appearance
    - Test cross-browser compatibility
    - _Requirements: 4.2, 4.3_

- [ ] 9. Implement manual staff navigation
  - [x] 9.1 Add touch and mouse event handlers for staff interaction
    - Implement mousedown/touchstart event listeners on staff container
    - Add mousemove/touchmove handlers for drag detection
    - Create mouseup/touchend handlers to complete interaction
    - Prevent default browser behaviors for smooth interaction
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 9.2 Implement horizontal drag functionality
    - Calculate drag distance and direction from pointer events
    - Convert drag movements to staff position changes
    - Apply smooth CSS transforms for real-time staff movement
    - Add momentum and easing for natural feel
    - _Requirements: 5.3_

  - [x] 9.3 Integrate manual navigation with playback system
    - Pause automatic playback when manual interaction begins
    - Update internal position tracking during manual movement
    - Maintain staff position after manual interaction ends
    - Allow resuming playback from manually set position
    - _Requirements: 5.4, 5.5_

  - [x] 9.4 Add boundary constraints and position validation
    - Prevent staff from moving beyond song start/end boundaries
    - Implement smooth bounce-back when reaching limits
    - Validate position changes to ensure notes remain properly aligned
    - Add visual feedback for boundary conditions
    - _Requirements: 5.1, 5.2, 5.5_

- [ ] 10. Implement tempo control with Italian tempo markings
  - [x] 10.1 Create tempo data structure and constants
    - Define Italian tempo markings with corresponding BPM ranges
    - Create mapping between tempo names and playback speeds
    - Set default tempo to Moderato (114 BPM)
    - Calculate playback speed multipliers for each tempo
    - _Requirements: 6.2, 6.6_

  - [x] 10.2 Build tempo selection UI component
    - Create dropdown or button group for tempo selection
    - Display tempo names with Italian markings and BPM ranges
    - Style tempo control to match existing UI design
    - Position tempo control near other playback controls
    - _Requirements: 6.1, 6.5_

  - [x] 10.3 Implement tempo change functionality
    - Add event handlers for tempo selection changes
    - Update playback speed when new tempo is selected
    - Recalculate animation timing based on selected tempo
    - Maintain current playback position during tempo changes
    - _Requirements: 6.3, 6.4_

  - [x] 10.4 Integrate tempo control with playback system
    - Modify animation loop to use current tempo setting
    - Update staff movement speed calculations for different tempos
    - Ensure smooth transitions when changing tempo during playback
    - Preserve manual navigation functionality with tempo changes
    - _Requirements: 6.3, 6.4_

  - [ ] 10.5 Add tempo display and feedback
    - Show current tempo marking prominently in the UI
    - Display current BPM value alongside tempo name
    - Update tempo display when selection changes
    - Add visual feedback for tempo changes
    - _Requirements: 6.5_

- [ ] 12. Implement virtual piano keyboard
  - [x] 12.1 Create keyboard layout and visual structure
    - Design and implement white keys (C, D, E, F, G, A, B) with proper dimensions
    - Add black keys (sharps/flats) positioned correctly between white keys
    - Create keyboard container with responsive layout below the staff
    - Style keys with clean design matching app aesthetic
    - _Requirements: 7.1, 7.2, 7.7_

  - [x] 12.2 Implement Tone.js audio engine and keyboard interaction
    - Integrate Tone.js library for professional audio synthesis
    - Create ToneJSAudioEngine class with polyphonic synthesizer
    - Add realistic piano effects (reverb, compression) using Tone.js
    - Implement key press/hold/release handlers for sustained notes
    - Add click/touch event handlers with proper key state management
    - Map note names to Tone.js note format and handle polyphonic playback
    - _Requirements: 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 12.3 Implement visual feedback for key presses
    - Add visual highlighting when piano keys are clicked
    - Create key state management (pressed, active, normal)
    - Implement smooth animations for key press feedback
    - Handle multiple simultaneous key interactions
    - _Requirements: 7.5_

  - [x] 12.4 Integrate keyboard with staff playback synchronization
    - Highlight keyboard keys when corresponding notes are active on staff
    - Synchronize key highlighting timing with staff playback
    - Update keyboard state during manual staff navigation
    - Ensure keyboard highlights match staff note progression
    - _Requirements: 7.3_

  - [x] 12.5 Implement enhanced color-based feedback system for key matches
    - Detect when user clicks correct key during playback using improved intersection algorithm
    - Implement unique color highlighting for each piano key when played correctly (C=#B66FD1 light purple, D=#E38C25 orange, E=#3FB241 green, F=#B23D74 magenta, G=#4B6ECC blue, A=#D78CAB pink, B=#30A89A teal)
    - Set incorrect key presses to gray color with shake animation
    - Use getBoundingClientRect() for accurate note-to-playback-line intersection detection
    - Track next-to-be-played note for optimal performance (O(1) vs O(n))
    - Maintain feedback system across different tempo settings
    - _Requirements: 7.7, 7.8, 7.9_

  - [x] 12.5.1 Implement intersection line feedback system
    - Create IntersectionLineRenderer class for managing visual intersection feedback
    - Generate short colored block lines that intersect with staff notes when correct keys are played
    - Position intersection lines vertically to align with the center of note rectangles on the staff
    - Use the same unique colors as the corresponding piano keys for intersection lines
    - Implement duration-based visibility tied to key press/release events
    - Make intersection lines disappear immediately when user releases piano key
    - Handle automatic fade-out when note duration completes while key is still held
    - Track key press states to manage intersection line lifecycle
    - Handle multiple simultaneous intersection lines for rapid correct note sequences
    - Integrate intersection line system with existing keyboard feedback
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [x] 12.6 Add realistic key press/hold/release functionality
    - Implement mousedown/touchstart for key press with sustained audio
    - Add mouseup/touchend handlers for proper note release
    - Handle mouse/touch leave events to prevent stuck notes
    - Implement visual feedback for key hold states
    - Add polyphonic support for multiple simultaneous key presses
    - Test sustained note performance and memory management
    - _Requirements: 7.5, 7.6, 8.4, 8.5_

  - [ ] 12.7 Add keyboard accessibility and polish
    - Implement keyboard navigation support (arrow keys, enter)
    - Add ARIA labels and accessibility attributes
    - Ensure keyboard works on touch devices and desktop
    - Test Tone.js audio performance and browser compatibility
    - Optimize audio latency and polyphonic performance
    - Maintain clean, uncluttered design consistent with app interface
    - _Requirements: 7.10, 8.6, 8.7_

- [ ] 13. Implement MIDI piano connectivity
  - [x] 13.1 Create MIDI system initialization and device detection
    - Implement Web MIDI API initialization with browser compatibility checks
    - Create MIDIController class for device management and message handling
    - Add MIDI device scanning and enumeration functionality
    - Implement device state change monitoring for hot-plugging support
    - Add error handling for MIDI API unavailability and permission issues
    - _Requirements: 9.1, 9.9_

  - [x] 13.2 Build MIDI device selection interface
    - Create MIDIDeviceManager class for UI management
    - Design device selection dropdown with device names and manufacturers
    - Add connection status indicators (connected/disconnected/error states)
    - Implement device refresh functionality for newly connected devices
    - Create informational help text for MIDI setup and troubleshooting
    - Style MIDI interface to match existing app design
    - _Requirements: 9.2_

  - [x] 13.3 Implement MIDI message processing and note conversion
    - Add MIDI message parsing for note on/off events (0x90/0x80)
    - Implement MIDI note number to note name conversion (C4, D#5, etc.)
    - Add velocity sensitivity processing and normalization (0-127 to 0-1)
    - Handle MIDI channel filtering and multi-channel support
    - Implement message validation and error handling for malformed data
    - Add MIDI message logging and debugging capabilities
    - _Requirements: 9.4, 9.5, 9.11_

  - [x] 13.4 Integrate MIDI input with existing keyboard system
    - Enhance VirtualPianoKeyboard to accept MIDI input events
    - Implement unified key press/release handling for virtual and MIDI sources
    - Add visual feedback for MIDI key presses on virtual keyboard
    - Ensure MIDI input triggers same audio playback as virtual keys
    - Handle simultaneous virtual and MIDI input without conflicts
    - Maintain existing keyboard functionality while adding MIDI support
    - _Requirements: 9.6, 9.8_

  - [x] 13.5 Implement MIDI learning feedback integration with enhanced visual system
    - Extend learning feedback system to process MIDI input
    - Implement MIDI-specific visual feedback using unique key colors and intersection lines
    - Apply gray color feedback for incorrect MIDI key presses
    - Track performance statistics separately for MIDI vs virtual input
    - Ensure correct note detection works with MIDI velocity data
    - Implement auto-start playback functionality for MIDI input
    - Maintain learning feedback consistency across input methods
    - Integrate MIDI input with intersection line rendering system
    - _Requirements: 10.7, 9.10, 9.11_

  - [x] 13.6 Add MIDI connection management and preferences
    - Implement device connection/disconnection handling
    - Add automatic reconnection for previously connected devices
    - Create user preference storage for preferred MIDI devices
    - Handle graceful fallback to virtual keyboard on connection loss
    - Add connection retry logic with exponential backoff
    - Implement MIDI device preference persistence across sessions
    - _Requirements: 9.3, 9.9_

  - [x] 13.7 Add MIDI performance optimization and error handling
    - Implement MIDI input buffering for high-frequency note data
    - Add latency compensation for MIDI input timing
    - Handle MIDI message overflow and dropped message scenarios
    - Optimize MIDI processing performance for real-time response
    - Add comprehensive error logging and user-friendly error messages
    - Implement browser-specific MIDI compatibility workarounds
    - _Requirements: 9.9, 9.11_

  - [x] 13.8 Implement automatic MIDI device selection
    - Add automatic connection to first available MIDI device when detected
    - Implement autoConnectToDevice method in MIDIController class
    - Update device scanning logic to trigger automatic connection
    - Add UI updates to reflect automatic device connection status
    - Ensure automatic selection works with device hot-plugging
    - _Requirements: 9.2_

- [ ] 11. Create comprehensive testing
  - [ ] 11.1 Test note positioning accuracy
    - Verify all notes appear at correct staff positions
    - Test different note durations render with proper widths
    - Validate fingering numbers display correctly
    - _Requirements: 1.3, 1.4, 2.4, 2.5_

  - [ ] 11.2 Test playback functionality
    - Verify smooth staff movement animation
    - Test play/pause/reset controls work correctly
    - Ensure note highlighting synchronizes properly
    - Validate timing accuracy throughout playback
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 11.3 Test manual navigation functionality
    - Verify touch and mouse interactions work on all devices
    - Test smooth dragging and swiping in both directions
    - Ensure playback integration works correctly
    - Validate boundary constraints prevent invalid positions
    - Test position persistence after manual interaction
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 11.4 Test tempo control functionality
    - Verify all Italian tempo markings are available and functional
    - Test tempo changes during playback maintain correct position
    - Validate BPM calculations produce correct playback speeds
    - Ensure tempo display updates correctly with selection changes
    - Test tempo control integration with manual navigation
    - Verify default tempo loads correctly on app initialization
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 11.5 Test virtual piano keyboard functionality with Tone.js
    - Verify keyboard layout renders correctly with proper key dimensions
    - Test all keys respond to clicks/touches with Tone.js audio playback and visual feedback
    - Validate realistic piano audio works for each key with correct pitches and effects
    - Test key press/hold/release functionality with sustained notes
    - Verify polyphonic audio playback for multiple simultaneous keys
    - Ensure keyboard highlighting synchronizes with staff playback
    - Test positive visual feedback for correct key matches during playback
    - Verify improved intersection detection algorithm performance and accuracy
    - Test keyboard integration with tempo changes and manual navigation
    - Validate Tone.js performance across different browsers and devices
    - Test audio latency and sustained note memory management
    - Validate accessibility features and keyboard navigation support
    - Ensure clean, uncluttered design maintains app consistency
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ] 11.6 Test MIDI piano connectivity functionality
    - Verify Web MIDI API initialization and browser compatibility
    - Test MIDI device detection and enumeration with various device types
    - Validate device selection interface and connection status indicators
    - Test automatic device connection when MIDI device is detected
    - Verify automatic connection works with device hot-plugging
    - Test MIDI message parsing accuracy for note on/off events
    - Verify MIDI note number to note name conversion correctness
    - Test velocity sensitivity processing and normalization
    - Validate MIDI input integration with virtual keyboard system
    - Test simultaneous virtual and MIDI input handling
    - Verify MIDI learning feedback integration and performance tracking
    - Test device connection/disconnection handling and graceful fallback
    - Validate MIDI input timing and latency compensation
    - Test MIDI performance with high-frequency input data
    - Verify cross-browser MIDI compatibility and error handling
    - Test MIDI device preference persistence and auto-reconnection
    - Validate MIDI integration with tempo changes and manual navigation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.12_