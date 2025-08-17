import React from 'react';
import './TempoControl.css';

const TempoControl = ({ tempo = 60, onChange }) => {
  const tempoOptions = [40, 60, 72, 90, 120];

  const handleTempoChange = event => {
    const newTempo = parseInt(event.target.value);
    if (onChange) {
      onChange(newTempo);
    }
  };

  return (
    <div className="tempo-control">
      <label className="tempo-label" htmlFor="tempoSelector">
        ♩=
      </label>
      <select
        className="tempo-selector"
        id="tempoSelector"
        value={tempo}
        onChange={handleTempoChange}
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
