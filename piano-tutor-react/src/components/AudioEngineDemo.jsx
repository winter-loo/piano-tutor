/**
 * Demo component to test the enhanced useAudioEngine hook
 */

import React, { useState, useEffect } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';

const AudioEngineDemo = () => {
  const [testResults, setTestResults] = useState([]);

  const {
    isAudioInitialized,
    isAudioReady,
    isAudioEnabled,
    audioError,
    initializeAudio,
    playNote,
    stopNote,
    stopAllNotes,
    setVolume,
    setMasterVolume,
    setReverbEnabled,
    getAudioStatus,
    calculatePianoDecayParams,
  } = useAudioEngine();

  // Initialize audio on mount
  useEffect(() => {
    const init = async () => {
      console.log('🧪 [DEMO] Initializing audio engine...');
      const success = await initializeAudio();
      addTestResult(`Audio initialization: ${success ? 'SUCCESS' : 'FAILED'}`);
    };
    init();
  }, [initializeAudio]);

  const addTestResult = message => {
    setTestResults(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testPlayNote = async () => {
    try {
      addTestResult('Testing note playback...');
      await playNote('C4', 0.8);
      addTestResult('✅ C4 note played successfully');

      setTimeout(async () => {
        await stopNote('C4');
        addTestResult('✅ C4 note stopped successfully');
      }, 2000);
    } catch (error) {
      addTestResult(`❌ Error playing note: ${error.message}`);
    }
  };

  const testPianoDecay = () => {
    const testNotes = ['C3', 'C4', 'C6'];
    testNotes.forEach(note => {
      const params = calculatePianoDecayParams(note);
      addTestResult(
        `${note} decay: ${params.category} (${params.sustainTime}s, rate: ${params.decayRate})`
      );
    });
  };

  const testVolumeControl = () => {
    setVolume(0.5);
    setMasterVolume(0.8);
    addTestResult('✅ Volume controls tested');
  };

  const testReverbControl = () => {
    setReverbEnabled(false);
    setTimeout(() => {
      setReverbEnabled(true);
      addTestResult('✅ Reverb toggle tested');
    }, 1000);
  };

  const getStatusInfo = () => {
    const status = getAudioStatus();
    addTestResult(`Status: ${JSON.stringify(status, null, 2)}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🎵 Enhanced Audio Engine Demo</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Status</h3>
        <p>Initialized: {isAudioInitialized ? '✅' : '❌'}</p>
        <p>Ready: {isAudioReady ? '✅' : '❌'}</p>
        <p>Enabled: {isAudioEnabled ? '✅' : '❌'}</p>
        {audioError && <p style={{ color: 'red' }}>Error: {audioError}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Tests</h3>
        <button onClick={testPlayNote} disabled={!isAudioReady}>
          Test Note Playback (C4)
        </button>
        <button onClick={testPianoDecay} style={{ marginLeft: '10px' }}>
          Test Piano Decay Calculation
        </button>
        <button onClick={testVolumeControl} style={{ marginLeft: '10px' }}>
          Test Volume Control
        </button>
        <button onClick={testReverbControl} style={{ marginLeft: '10px' }}>
          Test Reverb Control
        </button>
        <button onClick={getStatusInfo} style={{ marginLeft: '10px' }}>
          Get Status Info
        </button>
        <button onClick={stopAllNotes} style={{ marginLeft: '10px' }}>
          Stop All Notes
        </button>
      </div>

      <div>
        <h3>Test Results</h3>
        <div
          style={{
            height: '300px',
            overflow: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: '#f5f5f5',
          }}
        >
          {testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioEngineDemo;
