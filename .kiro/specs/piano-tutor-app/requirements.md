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