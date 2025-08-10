# Requirements Document

## Introduction

This document outlines the requirements for a minimal piano tutor app MVP. The app will display musical notation on a staff and provide a visual playback mechanism using a moving vertical line. The focus is on simplicity and core functionality, displaying notes from the "Different Colors" by Walk the Moon song data.

## Requirements

### Requirement 1

**User Story:** As a piano student, I want to see musical notes displayed on a horizontal staff, so that I can read and follow the music notation.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL display a horizontal music staff with 5 lines
2. WHEN the staff is rendered THEN the system SHALL include a treble clef symbol at the beginning of the staff
3. WHEN notes are loaded THEN the system SHALL position notes correctly on the staff lines and spaces according to their pitch
4. WHEN displaying notes THEN the system SHALL show different note types (quarter notes, eighth notes, dotted quarter notes, half notes) with correct visual representation

### Requirement 2

**User Story:** As a piano student, I want to see notes from a specific song loaded onto the staff, so that I can practice playing that piece.

#### Acceptance Criteria

1. WHEN the app initializes THEN the system SHALL load note data from the different_colors_WALK_THE_MOON.md file
2. WHEN parsing the note data THEN the system SHALL correctly interpret note names (D, F, C, G, A, C5) and their positions
3. WHEN parsing the note data THEN the system SHALL correctly interpret note durations (quarter, eighth, dotted quarter, half notes)
4. WHEN displaying the song THEN the system SHALL arrange notes in measures as specified in the source data
5. WHEN notes are positioned THEN the system SHALL place them horizontally in sequence after the treble clef

### Requirement 3

**User Story:** As a piano student, I want to see a stationary vertical line with the music staff moving underneath it, so that I can follow along with the music timing.

#### Acceptance Criteria

1. WHEN the app is ready THEN the system SHALL display a fixed vertical line positioned after the treble clef symbol
2. WHEN playback begins THEN the system SHALL move the music staff horizontally from right to left
3. WHEN the staff moves THEN the system SHALL pass each note position through the stationary vertical line
4. WHEN a note aligns with the vertical line THEN the system SHALL visually indicate the current note being played
5. WHEN playback ends THEN the system SHALL reset the staff position to the starting position

### Requirement 4

**User Story:** As a piano student, I want a simple interface with minimal controls, so that I can focus on learning without distractions.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL display only essential UI elements (staff, notes, playback line)
2. WHEN the interface is rendered THEN the system SHALL use a clean, uncluttered design
3. WHEN the app is displayed THEN the system SHALL prioritize the music staff as the primary visual element
4. WHEN controls are needed THEN the system SHALL provide only basic playback controls (play/pause/reset)

### Requirement 5

**User Story:** As a piano student, I want to manually navigate through the music by swiping or dragging, so that I can review specific sections at my own pace.

#### Acceptance Criteria

1. WHEN the user swipes right on the staff area THEN the system SHALL move the staff rightward to show earlier parts of the music
2. WHEN the user swipes left on the staff area THEN the system SHALL move the staff leftward to show later parts of the music
3. WHEN the user drags horizontally on the staff THEN the system SHALL move the staff smoothly in the corresponding direction
4. WHEN manual navigation occurs during playback THEN the system SHALL pause automatic playback and allow manual control
5. WHEN the user stops manual interaction THEN the system SHALL resume playback from the current staff position when playback is started again

### Requirement 6

**User Story:** As a piano student, I want to adjust the playback tempo using discrete BPM values, so that I can practice at different speeds appropriate for my skill level.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL provide a tempo control interface with discrete BPM values
2. WHEN tempo options are displayed THEN the system SHALL include the following discrete BPM values: 40, 60, 76, 108, 120, 168, 180, and 200
3. WHEN a tempo is selected THEN the system SHALL adjust the playback speed to match the corresponding BPM value
4. WHEN tempo changes during playback THEN the system SHALL smoothly transition to the new speed without interrupting the current position
5. WHEN a tempo is selected THEN the system SHALL display the current BPM value to the user
6. WHEN the app initializes THEN the system SHALL default to 120 BPM

### Requirement 7

**User Story:** As a piano student, I want to interact with a virtual piano keyboard with realistic audio using Tone.js, so that I can click keys to play the notes shown on the staff and practice the song interactively with professional sound quality.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL display a virtual piano keyboard below the music staff
2. WHEN the keyboard is rendered THEN the system SHALL show white keys for natural notes (C, D, E, F, G, A, B) and black keys for sharps/flats
3. WHEN the keyboard is displayed THEN the system SHALL include all notes used in the song (C, D, F, G, A, C5) as clickable keys
4. WHEN a user clicks a piano key THEN the system SHALL play the corresponding audio note sound using Tone.js library
5. WHEN a user presses and holds a piano key THEN the system SHALL sustain the note sound for the duration of the press
6. WHEN a user releases a held piano key THEN the system SHALL fade out the note sound naturally
7. WHEN a user clicks correctly a piano key THEN the system SHALL highlight the note with a unique color specific to that piano key
8. WHEN the user clicks a key that matches the current note in the playback THEN the system SHALL provide positive visual feedback with the key's unique color
9. WHEN a user clicks incorrectly a piano key THEN the system SHALL set the pressed piano key to gray color
10. WHEN a user clicks correctly the piano key and playback is not active THEN the system SHALL start the playback automatically
11. WHEN the virtual keyboard is displayed THEN the system SHALL maintain the clean, uncluttered design consistent with the rest of the interface

### Requirement 8

**User Story:** As a piano student, I want realistic piano audio with professional sound quality, so that I can practice with authentic piano tones that respond naturally to my interactions.

#### Acceptance Criteria

1. WHEN the app initializes THEN the system SHALL load Tone.js library for professional audio synthesis
2. WHEN a piano key is pressed THEN the system SHALL generate realistic piano tones using Tone.js synthesizers
3. WHEN multiple keys are pressed simultaneously THEN the system SHALL play polyphonic audio without distortion
4. WHEN a key is held down THEN the system SHALL sustain the note with natural decay characteristics
5. WHEN a key is released THEN the system SHALL apply appropriate release envelope for realistic sound termination
6. WHEN the audio system is active THEN the system SHALL maintain low latency for responsive key presses
7. WHEN the app runs on different devices THEN the system SHALL optimize audio performance for the platform

### Requirement 9

**User Story:** As a piano student, I want to see visual intersection feedback when I play the correct notes, so that I can clearly understand when my timing and note selection are accurate.

#### Acceptance Criteria

1. WHEN a user clicks the correct piano key during playback THEN the system SHALL display a short colored block line that intersects with the corresponding note on the staff
2. WHEN the intersection line is displayed THEN the system SHALL use the same unique color as the piano key that was pressed
3. WHEN the intersection line appears THEN the system SHALL position it vertically to intersect with the center of the note rectangle on the staff
4. WHEN the intersection line is shown THEN the system SHALL display it for the duration of the note being played, up to a maximum of the note's actual duration
5. WHEN a user releases the piano key before the note's duration ends THEN the system SHALL make the intersection line disappear at the same time as the key release
6. WHEN a user holds the piano key for the full note duration THEN the system SHALL fade out the intersection line smoothly when the note duration completes
7. WHEN multiple correct notes are played in sequence THEN the system SHALL display multiple intersection lines with their respective colors
8. WHEN the intersection line fades out THEN the system SHALL use a smooth animation transition

### Requirement 10

**User Story:** As a piano student, I want to connect my real piano or MIDI keyboard to the app through MIDI connectors, so that I can practice with my actual instrument while receiving feedback and guidance from the app.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL detect and list available MIDI input devices connected to the computer
2. WHEN a MIDI device is detected and available THEN the system SHALL automatically connect to and use the first available MIDI device without requiring manual selection
3. WHEN multiple MIDI devices are available THEN the system SHALL provide a device selection interface for the user to choose their preferred piano/keyboard
4. WHEN a MIDI device is selected manually THEN the system SHALL establish a connection and listen for MIDI note events
5. WHEN a key is pressed on the connected piano THEN the system SHALL receive the MIDI note-on message and process it as user input
6. WHEN a key is released on the connected piano THEN the system SHALL receive the MIDI note-off message and handle the note release
7. WHEN a correct note is played on the real piano THEN the system SHALL provide the same visual feedback as virtual keyboard interactions including unique key colors and intersection lines
8. WHEN the real piano input matches the current playback note THEN the system SHALL highlight the note and advance the learning progress
9. WHEN both virtual and real piano inputs are available THEN the system SHALL accept input from both sources simultaneously
10. WHEN MIDI connection is lost THEN the system SHALL gracefully fall back to virtual keyboard mode and notify the user
11. WHEN the user plays on the real piano and playback is not active THEN the system SHALL start the playback automatically
12. WHEN MIDI velocity data is available THEN the system SHALL use it to provide dynamic audio response and visual feedback intensity

### Requirement 11

**User Story:** As a piano student, I want to click on the progress bar to navigate to specific positions in the music, so that I can quickly jump to any section I want to practice.

#### Acceptance Criteria

1. WHEN a user clicks on the progress bar THEN the system SHALL move the staff to the correct position corresponding to the clicked location

### Requirement 12

**User Story:** As a piano student, I want precise timing feedback when I play notes, so that I can understand if I'm playing too early, too late, or at the correct time.

#### Acceptance Criteria

1. WHEN a user clicks a piano key correctly and the note's head is within the bounds of the playback line THEN the system SHALL count it as a correct press
2. WHEN a user clicks a piano key correctly but the note's head is not within the bounds of the playback line AND the playback line is within the bounds of the note's rectangle bounds THEN the system SHALL report that it's too late
3. WHEN a user clicks a piano key correctly but the note's head has not yet reached the playback line range THEN the system SHALL report that it's too early
4. WHEN a user clicks a piano key incorrectly THEN the system SHALL show the clicked piano key as the corresponding note in the staff with gray color
5. WHEN an incorrect note is displayed on the staff THEN the system SHALL render it as an eighth note
6. WHEN an incorrect note is displayed on the staff THEN the system SHALL align the note's head with the left boundary of the playback line
