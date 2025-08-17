import React, { useMemo } from 'react';
import { NotePositioning } from '../../utils/notePositioning';

const MeasureBars = ({ measures = [], className = '' }) => {
  // Calculate measure bar positions using the positioning system
  const measurePositions = useMemo(() => {
    if (!measures.length) return [];
    
    const notePositioning = new NotePositioning();
    // Calculate all note positions to get measure positions as a side effect
    const positionedNotes = notePositioning.calculateAllNotePositions(measures);
    // Get the measure bar positions
    const positions = notePositioning.getMeasureBarPositions();
    
    // Add a final measure bar after the last measure (end of song)
    // Use the same spacing logic as the positioning system
    if (positionedNotes.length > 0) {
      const lastNote = positionedNotes[positionedNotes.length - 1];
      // Follow the same logic as in calculateAllNotePositions:
      // Remove the last note spacing and add margin before measure bar
      const finalBarPosition = lastNote.x + lastNote.width + 6; // measureBarMargin = 6
      positions.push(finalBarPosition);
    }
    
    return positions;
  }, [measures]);

  const containerClasses = `measure-bars ${className}`.trim();

  return (
    <div className={containerClasses}>
      {measurePositions.map((xPosition, measureIndex) => {
        const isLastBar = measureIndex === measurePositions.length - 1;
        const measureNumber = isLastBar ? 'End' : measureIndex + 1;
        const title = isLastBar ? 'End of Song' : `Measure ${measureIndex + 1}`;
        
        return (
          <div
            key={`measure-bar-${measureIndex}`}
            className="measure-bar"
            style={{ left: `${xPosition}px` }}
            data-measure={measureNumber}
            title={title}
          />
        );
      })}
    </div>
  );
};

export default MeasureBars;