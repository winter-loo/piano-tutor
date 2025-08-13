/**
 * Note positioning system for treble clef staff - exact copy from original HTML
 */
export class NotePositioning {
  constructor() {
    // Staff configuration - exact values from original
    this.staffTop = 59; // Top of staff lines container
    this.staffLineSpacing = 20; // Distance between staff lines
    this.staffHeight = 80; // Total height of staff lines area
    this.noteHeight = 22;
    this.staffLineHeight = 2;
    let halfHeight = (this.noteHeight - this.staffLineHeight) / 2;

    // Note pitch to position mapping - exact from original
    this.notePositions = {
      "A3": this.staffTop + 6 * this.staffLineSpacing - halfHeight,
      "B3": this.staffTop + 5 * this.staffLineSpacing,
      "C4": this.staffTop + 5 * this.staffLineSpacing - halfHeight,
      "D4": this.staffTop + 4 * this.staffLineSpacing,
      "E4": this.staffTop + 4 * this.staffLineSpacing - halfHeight,
      "F4": this.staffTop + 3 * this.staffLineSpacing,
      "G4": this.staffTop + 3 * this.staffLineSpacing - halfHeight,
      "A4": this.staffTop + 2 * this.staffLineSpacing,
      "B4": this.staffTop + 2 * this.staffLineSpacing - halfHeight,
      "C5": this.staffTop + 1 * this.staffLineSpacing,
      "D5": this.staffTop + 1 * this.staffLineSpacing - halfHeight,
      "E5": this.staffTop + 0 * this.staffLineSpacing,
      "F5": this.staffTop + 0 * this.staffLineSpacing - halfHeight,
      "G5": this.staffTop + -1 * this.staffLineSpacing,
      "A5": this.staffTop + -1 * this.staffLineSpacing - halfHeight,
      "B5": this.staffTop + -2 * this.staffLineSpacing,
    };

    this.measurePositions = [];
  }

  /**
   * Get the vertical position for a note on the staff
   * @param {string} pitch - Note pitch (e.g., "D", "F", "C", "G", "A", "C5")
   * @returns {number} Y-coordinate position from top of staff container
   */
  getVerticalPosition(pitch) {
    if (pitch == "rest") {
      // TODO: calculate 'rest' note position by its duration
      return 99; // Default to middle line
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
      "eighth": 38,
      "quarter": 76,
      "dotted_quarter": 114,
      "half": 152,
      "whole": 304,
    };
    return widthMap[duration] || widthMap["quarter"];
  }

  /**
   * Get note color based on pitch
   * @param {string} pitch - Note pitch
   * @returns {string} Color hex code
   */
  getNoteColor(pitch) {
    const colorMap = {
      "C": "#CE82FF",
      "D": "#FF9602",
      "E": "#57CD03",
      "F": "#CC348E",
      "G": "#7090FF",
      "A": "#FF87D0",
      "B": "#00CE9C",
    };
    return colorMap[pitch[0]] || null;
  }

  /**
   * Calculate position for a single note using even distribution across available width
   * @param {Object} note - Note object with pitch, type, etc.
   * @param {number} noteIndex - Index of this note in the array
   * @param {Array} allNotes - Array of all notes for even distribution
   * @returns {Object} Position object with left, top, width
   */
  calculateNotePosition(note, noteIndex, allNotes) {
    // Calculate even distribution across available width in the staff container
    // Use screen width minus margins for treble clef and padding
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const availableWidth = screenWidth - 140; // Account for treble clef (90px) + margins (50px)
    const noteWidth = this.getNoteWidth(note.type);
    const totalNotes = allNotes.length;
    
    // Distribute notes evenly across available width
    const totalNoteWidth = totalNotes * noteWidth;
    const remainingSpace = Math.max(0, availableWidth - totalNoteWidth);
    const spacing = totalNotes > 1 ? remainingSpace / (totalNotes - 1) : 0;
    const xPosition = noteIndex * (noteWidth + spacing);

    return {
      left: xPosition,
      top: this.getVerticalPosition(note.pitch) || this.getVerticalPosition("E4"), // Default to middle line
      width: noteWidth,
      color: this.getNoteColor(note.pitch)
    };
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
