# Requirements Document

## Introduction

This specification outlines the requirements for fixing critical bugs and implementing missing features in the Piano Tutor React application. The application has been successfully refactored from the original HTML implementation, but several key functionalities are not working correctly or are missing entirely. These fixes are essential to restore feature parity with the original implementation and provide a smooth user experience.

## Requirements

### Requirement 1

**User Story:** As a user, I want to be able to click on the progress bar to jump to any position in the song, so that I can practice specific sections or navigate through the piece efficiently.

#### Acceptance Criteria

1. WHEN I click anywhere on the progress bar THEN the staff notation SHALL immediately jump to the corresponding position in the song
2. WHEN I click on the progress bar THEN the playback line SHALL attach to the nearest note (look at the original index.html to find out what is the 'attach' action)
3. WHEN I click on the progress bar THEN the staff SHALL scroll horizontally to show the correct notes for that time position
4. WHEN I drag on the progress bar THEN the staff SHALL continuously update its position during the drag operation

### Requirement 2

**User Story:** As a user, I want the tempo control interface to be clean and professional, so that it matches the original design and doesn't display unnecessary text.

#### Acceptance Criteria

1. WHEN I view the tempo control THEN it SHALL display only the quarter note symbol (♩=) and the BPM number
2. WHEN I view the tempo control THEN it SHALL NOT display the text "BPM" after the number
3. WHEN I change the tempo THEN the display SHALL remain clean with only the essential information
4. WHEN I interact with the tempo control THEN it SHALL maintain the same discrete BPM values as the original (40, 60, 72, 90, 120, 144, 168, 180, 200)

### Requirement 3

**User Story:** As a user, I want the staff to automatically snap to the nearest note when I finish dragging, so that the playback line aligns properly with the musical content.

#### Acceptance Criteria

1. WHEN I finish dragging on the staff THEN the staff position SHALL automatically adjust to align the playback line with the nearest note
2. WHEN I finish dragging on the staff THEN the system SHALL attach the playback line to the nearest note (see the original index.html to find out what is an 'attach' action)
3. WHEN the staff snaps to a note THEN the transition SHALL be smooth and visually appealing
4. WHEN there are no notes nearby THEN the staff SHALL snap to the nearest measure boundary

### Requirement 4

**User Story:** As a user, I want the virtual piano keyboard to have the same visual style as the original implementation, so that the interface is consistent and familiar.

#### Acceptance Criteria

1. WHEN I view the virtual keyboard THEN the key colors SHALL match the original implementation exactly
2. WHEN I view the virtual keyboard THEN the key dimensions and proportions SHALL match the original design
3. WHEN I press a key THEN the visual feedback (highlighting, shadows) SHALL match the original styling
4. WHEN keys are in different states (correct, incorrect, active) THEN the color coding SHALL match the original implementation
5. WHEN I view the keyboard on mobile devices THEN the responsive behavior SHALL match the original design
6. WHEN an incorrect key is pressed THEN the system should have the same feedback as the original design

### Requirement 5

**User Story:** As a user, I want to hear audio feedback when I press keys on the virtual piano keyboard, so that I can learn proper timing and pitch recognition.

#### Acceptance Criteria

1. WHEN I press a key on the virtual keyboard THEN I SHALL immediately hear the corresponding note played
2. WHEN I release a key on the virtual keyboard THEN the note SHALL stop playing cleanly without artifacts
3. WHEN I press multiple keys simultaneously THEN all notes SHALL play together (polyphonic playback)
4. WHEN I press keys rapidly THEN each key press SHALL trigger audio without delay or missed notes
5. WHEN audio is not available THEN the keyboard SHALL still provide visual feedback and continue to function

### Requirement 6

**User Story:** As a user, I want the staff notation to scroll smoothly and maintain proper positioning during playback, so that I can follow along with the music effectively.

#### Acceptance Criteria

1. WHEN the song is playing THEN the staff SHALL scroll smoothly to keep the current notes visible
2. WHEN I manually navigate the staff THEN the scrolling SHALL be responsive and smooth
3. WHEN the playback line reaches the edge of the visible area THEN the staff SHALL automatically scroll to keep it centered
4. WHEN I jump to a different position THEN the staff SHALL immediately show the correct notes for that position
5. WHEN the staff scrolls THEN the measure bars and note positions SHALL remain properly aligned

### Requirement 7

**User Story:** As a user, I want the progress bar to accurately reflect the current playback position and respond to user interactions, so that I can monitor and control playback effectively.

#### Acceptance Criteria

1. WHEN the song is playing THEN the progress bar SHALL update smoothly to show the current position
2. WHEN I click on the progress bar THEN the progress indicator SHALL immediately jump to the clicked position
3. WHEN I drag the progress bar THEN it SHALL provide real-time feedback during the drag operation
4. WHEN the progress bar updates THEN it SHALL maintain smooth animations without jitter or lag
5. WHEN the song ends THEN the progress bar SHALL show 100% completion

### Requirement 8

**User Story:** As a user, I want the MIDI controls and device connection to work reliably, so that I can use my physical piano with the application.

#### Acceptance Criteria

1. WHEN I connect a MIDI device THEN the connection status SHALL be clearly displayed
2. WHEN I play notes on my MIDI device THEN they SHALL trigger the same responses as virtual keyboard presses
3. WHEN I use MIDI input THEN the visual feedback on the virtual keyboard SHALL match the pressed keys
4. WHEN MIDI devices are disconnected THEN the application SHALL gracefully fall back to virtual keyboard mode
5. WHEN MIDI input is received THEN the audio playback SHALL work identically to virtual keyboard input

