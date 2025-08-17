/**
 * Note positioning system for treble clef staff - extracted from original HTML
 */
export class NotePositioning {
  constructor() {
    // Staff configuration - exact values from original
    this.staffTop = 59; // Top of staff lines container
    this.staffLineSpacing = 20; // Distance between staff lines
    this.staffHeight = 80; // Total height of staff lines area
    this.noteHeight = 22;
    this.staffLineHeight = 2;
    const halfHeight = (this.noteHeight - this.staffLineHeight) / 2;

    // Note pitch to position mapping - exact from original
    this.notePositions = {
      A3: this.staffTop + 6 * this.staffLineSpacing - halfHeight,
      B3: this.staffTop + 5 * this.staffLineSpacing,
      C4: this.staffTop + 5 * this.staffLineSpacing - halfHeight,
      D4: this.staffTop + 4 * this.staffLineSpacing,
      E4: this.staffTop + 4 * this.staffLineSpacing - halfHeight,
      F4: this.staffTop + 3 * this.staffLineSpacing,
      G4: this.staffTop + 3 * this.staffLineSpacing - halfHeight,
      A4: this.staffTop + 2 * this.staffLineSpacing,
      B4: this.staffTop + 2 * this.staffLineSpacing - halfHeight,
      C5: this.staffTop + 1 * this.staffLineSpacing,
      D5: this.staffTop + 1 * this.staffLineSpacing - halfHeight,
      E5: this.staffTop + 0 * this.staffLineSpacing,
      F5: this.staffTop + 0 * this.staffLineSpacing - halfHeight,
      G5: this.staffTop + -1 * this.staffLineSpacing,
      A5: this.staffTop + -1 * this.staffLineSpacing - halfHeight,
      B5: this.staffTop + -2 * this.staffLineSpacing,
    };

    this.measurePositions = [];
  }

  /**
   * Get the vertical position for a note on the staff
   * @param {string} pitch - Note pitch (e.g., "D4", "F4", "C4", "G4", "A4", "C5")
   * @returns {number} Y-coordinate position from top of staff container
   */
  getVerticalPosition(pitch) {
    if (pitch === 'rest') {
      return 99; // Default to middle line for rest notes
    }
    return this.notePositions[pitch];
  }

  /**
   * Get note width based on duration
   * @param {string} duration - Note duration type
   * @returns {number} Width in pixels for the note rectangle
   */
  getNoteWidth(duration) {
    const widthMap = {
      eighth: 38,
      quarter: 76,
      dotted_quarter: 114,
      half: 152,
      whole: 304,
    };
    return widthMap[duration] || widthMap['quarter'];
  }

  /**
   * Get note color based on pitch
   * @param {string} pitch - Note pitch
   * @returns {string} Color hex code
   */
  getNoteColor(pitch) {
    const colorMap = {
      C: '#CE82FF',
      D: '#FF9602',
      E: '#57CD03',
      F: '#CC348E',
      G: '#7090FF',
      A: '#FF87D0',
      B: '#00CE9C',
    };
    return colorMap[pitch[0]] || null;
  }

  /**
   * Calculate positions for all notes in the song - exact from original HTML
   * @param {Array} measures - Array of measure objects with notes
   * @returns {Array} Array of positioned note objects
   */
  calculateAllNotePositions(measures) {
    const positionedNotes = [];
    let noteIndex = 0;
    let cumulativeX = 0;
    const noteSpacing = 12; // pixels between notes
    const measureBarMargin = 6; // pixels from measure bar to notes
    this.measurePositions = []; // Track measure start positions

    measures.forEach((measure, measureIndex) => {
      // Record the start position of this measure
      this.measurePositions.push(cumulativeX);

      // Add margin after measure bar for first note in measure
      if (measureIndex > 0) {
        cumulativeX += measureBarMargin;
      }

      measure.notes.forEach((note, noteInMeasureIndex) => {
        const noteWidth = this.getNoteWidth(note.duration);
        const noteColor = this.getNoteColor(note.pitch);

        const positionData = {
          ...note,
          measureIndex: measureIndex,
          noteIndex: noteIndex,
          x: cumulativeX,
          y: this.getVerticalPosition(note.pitch),
          width: noteWidth,
          color: noteColor,
        };

        positionedNotes.push(positionData);

        // Move to next note position
        cumulativeX += noteWidth + noteSpacing;
        noteIndex++;
      });

      // Remove the last note spacing and add margin before next measure bar
      cumulativeX -= noteSpacing;
      cumulativeX += measureBarMargin;
    });

    return positionedNotes;
  }

  /**
   * Get measure bar positions
   * @returns {Array} Array of x-positions for measure bars
   */
  getMeasureBarPositions() {
    return this.measurePositions || [];
  }
}

export default NotePositioning;
