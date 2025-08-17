import React, { useCallback, useEffect } from 'react';
import useAudioStore from '../../stores/audioStore.js';
import './Controls.css';

const TempoControl = ({ className = '', disabled = false }) => {
  const { tempo, setTempo, isPlaying } = useAudioStore();

  // Discrete BPM values matching original implementation
  const tempoOptions = [40, 60, 72, 90, 120, 144, 168, 180, 200];

  const handleTempoChange = useCallback(
    event => {
      const newTempo = parseInt(event.target.value, 10);
      if (newTempo && !isNaN(newTempo)) {
        console.log(`🎵 [TEMPO-CONTROL] Tempo changed from ${tempo} to ${newTempo} BPM`);
        setTempo(newTempo);
      }
    },
    [tempo, setTempo]
  );

  // Ensure current tempo is valid, fallback to closest option
  const validTempo = useCallback(() => {
    if (tempoOptions.includes(tempo)) {
      return tempo;
    }
    // Find closest tempo option
    return tempoOptions.reduce((closest, option) =>
      Math.abs(option - tempo) < Math.abs(closest - tempo) ? option : closest
    );
  }, [tempo, tempoOptions]);

  // Sync with audio store if tempo changes externally
  useEffect(() => {
    const currentValidTempo = validTempo();
    if (currentValidTempo !== tempo) {
      console.log(
        `🎵 [TEMPO-CONTROL] Syncing tempo from ${tempo} to valid option ${currentValidTempo}`
      );
      setTempo(currentValidTempo);
    }
  }, [tempo, validTempo, setTempo]);

  const controlClasses = [
    'tempo-control',
    className,
    disabled ? 'disabled' : '',
    isPlaying ? 'playing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={controlClasses}>
      <label className="tempo-label" htmlFor="tempoSelector">
        ♩=
      </label>
      <select
        className="tempo-selector"
        id="tempoSelector"
        value={validTempo()}
        onChange={handleTempoChange}
        disabled={disabled}
        aria-label="Select tempo in beats per minute"
      >
        {tempoOptions.map(tempoValue => (
          <option key={tempoValue} value={tempoValue}>
            {tempoValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TempoControl;