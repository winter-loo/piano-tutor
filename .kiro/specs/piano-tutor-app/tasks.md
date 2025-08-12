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

  - [x] 4.3 Add note highlighting during playback
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

  - [x] 6.2 Highlight current fingering during playback
    - Emphasize fingering number for currently playing note
    - Coordinate fingering display with note highlighting
    - Update fingering emphasis as playback progresses
    - _Requirements: 3.4_

- [ ] 7. Implement timing and synchronization
  - [x] 7.1 Calculate note timing intervals
    - Convert note durations to millisecond timing values
    - Account for different note types (quarter, eighth, dotted quarter, half)
    - Create timing array for smooth playback progression
    - _Requirements: 2.3, 3.3_

  - [x] 7.2 Synchronize staff movement with note timing
    - Match staff movement speed to calculated note timings
    - Ensure notes align properly with vertical line at correct times
    - Handle tempo consistency throughout playback
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 8. Add responsive design and polish
  - [x] 8.1 Implement responsive layout
    - Ensure staff scales appropriately on different screen sizes
    - Maintain proper proportions for notes and spacing
    - Test layout on mobile and desktop viewports
    - _Requirements: 4.1, 4.2_

  - [x] 8.2 Add visual polish and error handling
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

  - [x] 10.5 Add tempo display and feedback
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

  - [x] 12.7 Add keyboard accessibility and polish
    - Implemented responsive keyboard layout for desktop and mobile devices
    - Added comprehensive touch and mouse event handling
    - Integrated Tone.js audio with optimized performance and low latency
    - Implemented polyphonic audio support for multiple simultaneous keys
    - Added visual feedback states (pressed, active, correct, incorrect)
    - Maintained clean, uncluttered design consistent with app interface
    - Added auto-start playback functionality when keys are pressed
    - _Requirements: 7.10, 8.6, 8.7_

- [x] 17. Implement current tempo control system
  - [x] 17.1 Implement discrete tempo markings
    - Implemented tempo values (40, 60, 72, 90, 120) with correct speed multipliers
    - Created TEMPO_MARKINGS constant with BPM values and playback speed calculations
    - Added HTML select options for all tempo values with musical notation (♩=)
    - Set default tempo to 60 BPM for optimal learning experience
    - Integrated tempo changes with playback system and manual navigation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

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

- [x] 14. Implement enhanced progress bar navigation
  - [x] 14.1 Enhance existing progress bar with click-to-jump functionality
    - Create ProgressBarController class to manage enhanced progress bar features
    - Add click event handlers to existing simple-progress-bar element
    - Implement position calculation from click coordinates to staff position
    - Ensure click navigation works during both playback and pause states
    - _Requirements: 11.1_

  - [x] 14.2 Integrate progress bar navigation with playback system
    - Implement jumpToPosition method to update staff position immediately
    - Coordinate with PlaybackController to update internal position tracking
    - Ensure progress bar updates don't interfere with normal playback progress
    - Handle boundary validation to prevent navigation beyond song limits
    - Update current note index when jumping to new positions
    - _Requirements: 11.1_

  - [x] 14.3 Add progress bar interaction state management
    - Implement interaction state tracking to prevent conflicts during user clicks
    - Add visual feedback classes for interaction states
    - Ensure smooth transitions between normal and interaction states
    - Handle rapid successive clicks without position conflicts
    - Maintain progress bar responsiveness across different screen sizes
    - _Requirements: 11.1_

- [x] 15. Implement enhanced timing evaluation system
  - [x] 15.1 Create TimingEvaluationSystem class for precise timing detection
    - Implement note head position calculation relative to playback line
    - Add note rectangle bounds calculation for timing evaluation
    - Create timing evaluation logic for correct, early, late, and incorrect scenarios
    - Implement pixel-perfect timing detection with configurable tolerance
    - Add expected note detection based on playback line position
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 15.2 Implement incorrect note visual feedback system
    - Create gray eighth note display for incorrect key presses
    - Position incorrect notes aligned with playback line left boundary
    - Implement automatic cleanup of incorrect note elements after delay
    - Add note stem and flag rendering for proper eighth note appearance
    - Handle multiple simultaneous incorrect notes without visual conflicts
    - _Requirements: 12.4, 12.5, 12.6_

  - [x] 15.3 Integrate timing evaluation with existing learning feedback
    - Enhance existing learning feedback system to use precise timing evaluation
    - Implement timing feedback messages (correct, too early, too late, incorrect)
    - Add visual feedback display for timing evaluation results
    - Coordinate timing evaluation with keyboard and MIDI input systems
    - Ensure timing evaluation works consistently across all tempo settings
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [x] 15.4 Add timing evaluation error handling and performance optimization
    - Implement fallback timing detection for edge cases
    - Add boundary checking for note position calculations
    - Handle DOM element access errors gracefully
    - Optimize timing evaluation performance for real-time response
    - Add cleanup mechanisms to prevent memory leaks from temporary elements
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

    - Implement fallback timing detection for edge cases

- [x] 16. Implement learning progress tracking and statistics display
  - [x] 16.1 Create learning progress display interface
    - Implemented real-time statistics panel with correct/incorrect counts
    - Added total attempts, accuracy percentage, and current streak tracking
    - Created responsive design for desktop and mobile devices
    - Integrated statistics updates with keyboard and MIDI input systems
    - _Requirements: 13.1, 13.2, 13.3, 13.7_

  - [x] 16.2 Implement performance tracking and streak management
    - Added real-time performance statistics calculation
    - Implemented streak counter with reset on incorrect attempts
    - Created accuracy percentage calculation (correct/total × 100)
    - Added MIDI-specific statistics tracking when MIDI input is detected
    - Integrated performance tracking with timing evaluation system
    - _Requirements: 13.4, 13.5, 13.6, 13.7_

- [x] 17. Implement comprehensive MIDI device management system
  - [x] 17.1 Create advanced MIDI device manager with UI
    - Implemented comprehensive device selection interface with status indicators
    - Added connection status display (connected, disconnected, connecting, error, auto-connected)
    - Created device refresh functionality with visual feedback
    - Implemented auto-connect preference with persistent settings
    - Added user-friendly error messages and troubleshooting guidance
    - _Requirements: 14.1, 14.2, 14.3, 14.7, 14.8_

  - [x] 17.2 Implement MIDI connection management and retry logic
    - Created MIDIConnectionManager for handling device connections
    - Implemented exponential backoff retry logic for failed connections
    - Added connection history tracking and performance monitoring
    - Created graceful fallback to virtual keyboard on connection loss
    - Implemented device preference persistence across browser sessions
    - _Requirements: 14.4, 14.5, 14.6, 14.8_

- [x] 18. Implement advanced MIDI performance optimization
  - [x] 18.1 Create MIDI message buffering and processing optimization
    - Implemented MIDIMessageBuffer for high-frequency input handling
    - Added adaptive message processing with batch optimization
    - Created message queue management with overflow protection
    - Implemented performance monitoring and automatic optimization
    - _Requirements: 15.1, 15.5, 15.6, 15.7_

  - [x] 18.2 Implement MIDI latency compensation and error handling
    - Created MIDILatencyCompensator for input delay correction
    - Implemented comprehensive error handling with user-friendly messages
    - Added browser compatibility detection and workarounds
    - Created performance metrics collection and reporting
    - Implemented graceful message dropping for system stability
    - _Requirements: 15.2, 15.3, 15.4, 15.5, 15.7_

- [x] 19. Implement enhanced audio system with global initialization
  - [x] 19.1 Create comprehensive Tone.js audio engine
    - Implemented professional piano synthesizer with realistic sound
    - Added polyphonic audio support for multiple simultaneous notes
    - Created audio effects (reverb, compression) for authentic piano sound
    - Implemented velocity sensitivity for dynamic response
    - Added global audio initialization on first user interaction
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 20. Implement start and ending overlay pages
  - [x] 20.1 Create start overlay page interface
    - Design and implement start overlay that covers the main interface on app load
    - Add prominent "Start" button with welcome message and app branding
    - Style overlay with clean, professional design matching app aesthetic
    - Implement overlay positioning and z-index management for proper layering
    - Add smooth fade-in animation when overlay appears
    - _Requirements: 16.1, 16.2_

  - [x] 20.2 Implement start overlay functionality and audio initialization
    - Add click event handler for "Start" button to initialize audio engine
    - Ensure Tone.js audio context is properly initialized and ready for playback
    - Implement smooth overlay removal animation when start button is clicked
    - Add loading indicator during audio initialization if needed
    - Handle audio initialization errors gracefully with user feedback
    - _Requirements: 16.3, 16.4_

  - [x] 20.3 Create ending overlay page interface
    - Design and implement ending overlay that appears when song playback completes
    - Create comprehensive performance metrics display with visual indicators
    - Add sections for accuracy, correct/incorrect counts, streak information, and timing statistics
    - Implement performance level indicators (excellent, good, needs improvement) with color coding
    - Style overlay with celebration or encouragement messaging based on performance
    - _Requirements: 16.5, 16.6, 16.8_

  - [x] 20.4 Implement ending overlay functionality and performance display
    - Integrate ending overlay trigger with song playback completion detection
    - Calculate and display comprehensive performance metrics from learning statistics
    - Show MIDI-specific statistics when MIDI input was used during the session
    - Add restart and return-to-beginning functionality with proper state reset
    - Implement performance statistics reset when user chooses to restart
    - Add smooth overlay animations for appearance and dismissal
    - _Requirements: 16.5, 16.6, 16.7, 16.9, 16.10_

  - [x] 20.5 Integrate overlay system with existing app components
    - Ensure start overlay prevents interaction with main interface until dismissed
    - Coordinate ending overlay with playback controller to detect song completion
    - Integrate performance metrics collection with existing learning progress system
    - Handle overlay state management during manual navigation and tempo changes
    - Test overlay system compatibility with MIDI and virtual keyboard inputs
    - _Requirements: 16.1, 16.3, 16.5, 16.6, 16.10_

- [ ] 21. Comprehensive testing and validation
  - [ ] 21.1 Test note positioning accuracy
    - Verify all notes appear at correct staff positions
    - Test different note durations render with proper widths
    - Validate fingering numbers display correctly
    - _Requirements: 1.3, 1.4, 2.4, 2.5_

  - [ ] 21.2 Test playback functionality
    - Verify smooth staff movement animation
    - Test play/pause/reset controls work correctly
    - Ensure note highlighting synchronizes properly
    - Validate timing accuracy throughout playback
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 21.3 Test manual navigation functionality
    - Verify touch and mouse interactions work on all devices
    - Test smooth dragging and swiping in both directions
    - Ensure playback integration works correctly
    - Validate boundary constraints prevent invalid positions
    - Test position persistence after manual interaction
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 21.4 Test tempo control functionality
    - Verify all Italian tempo markings are available and functional
    - Test tempo changes during playback maintain correct position
    - Validate BPM calculations produce correct playback speeds
    - Ensure tempo display updates correctly with selection changes
    - Test tempo control integration with manual navigation
    - Verify default tempo loads correctly on app initialization
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 21.5 Test virtual piano keyboard functionality with Tone.js
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

  - [ ] 21.6 Test MIDI piano connectivity functionality
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

  - [ ] 21.7 Test enhanced progress bar navigation functionality
    - Verify click-to-jump functionality works accurately across entire progress bar
    - Test progress bar position calculation accuracy for different screen sizes
    - Validate visual feedback (hover effects) work on both desktop and mobile
    - Test progress bar navigation during active playback and pause states
    - Verify progress bar updates don't interfere with normal playback progression
    - Test boundary validation prevents navigation beyond song start/end
    - Validate progress bar interaction state management prevents conflicts
    - Test rapid successive clicks handle smoothly without position errors
    - _Requirements: 11.1_

  - [ ] 21.8 Test enhanced timing evaluation system functionality
    - Verify precise timing detection accuracy for correct note timing
    - Test "too early" detection when note head hasn't reached playback line
    - Validate "too late" detection when playback line is within note bounds
    - Test incorrect note visual feedback displays gray eighth notes correctly
    - Verify incorrect notes align properly with playback line left boundary
    - Test automatic cleanup of incorrect note elements after display delay
    - Validate timing evaluation works consistently across all tempo settings
    - Test timing evaluation integration with both virtual and MIDI input
    - Verify timing feedback messages display correctly for each scenario
    - Test performance optimization handles real-time evaluation smoothly
    - Validate error handling for edge cases and DOM element access failures
    - Test memory management prevents leaks from temporary visual elements
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ] 21.9 Test learning progress tracking and statistics functionality
    - Verify real-time statistics update correctly for correct/incorrect attempts
    - Test accuracy percentage calculation accuracy across different scenarios
    - Validate streak counter increments and resets appropriately
    - Test MIDI-specific statistics display when MIDI input is detected
    - Verify statistics persistence and reset functionality
    - Test responsive design of progress display on different screen sizes
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ] 21.10 Test comprehensive MIDI device management functionality
    - Verify device detection and enumeration works with various MIDI devices
    - Test automatic device connection and auto-connect preference functionality
    - Validate connection status indicators display correctly for all states
    - Test device refresh functionality and visual feedback
    - Verify error handling and user-friendly error messages
    - Test device preference persistence across browser sessions
    - Validate graceful fallback to virtual keyboard on connection loss
    - Test exponential backoff retry logic for failed connections
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

  - [ ] 21.11 Test advanced MIDI performance optimization functionality
    - Verify message buffering handles high-frequency MIDI input correctly
    - Test latency compensation improves timing accuracy
    - Validate comprehensive error handling with user-friendly messages
    - Test browser compatibility detection and workarounds
    - Verify performance metrics collection and automatic optimization
    - Test graceful message dropping prevents system overload
    - Validate adaptive processing adjusts to system performance
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

  - [ ] 21.12 Test enhanced audio system functionality
    - Verify Tone.js audio engine produces realistic piano sounds
    - Test polyphonic audio support for multiple simultaneous notes
    - Validate audio effects (reverb, compression) enhance sound quality
    - Test velocity sensitivity provides dynamic response
    - Verify global audio initialization works on first user interaction
    - Test audio performance and latency across different browsers
    - Validate audio system integration with virtual and MIDI keyboards
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ] 21.13 Test start and ending overlay pages functionality
    - Verify start overlay appears correctly on app load and covers main interface
    - Test "Start" button initializes audio engine and removes overlay smoothly
    - Validate ending overlay appears when song playback completes
    - Test comprehensive performance metrics display with accurate calculations
    - Verify performance level indicators display appropriate visual feedback
    - Test restart functionality resets all statistics and returns to beginning
    - Validate overlay animations and transitions work smoothly
    - Test overlay system integration with MIDI and virtual keyboard inputs
    - Verify overlay state management during manual navigation and tempo changes
    - Test responsive design of overlays on different screen sizes
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10_