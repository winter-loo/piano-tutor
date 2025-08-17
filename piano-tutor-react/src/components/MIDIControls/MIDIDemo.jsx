import React, { useEffect, useState } from 'react';
import useMIDI from '../../hooks/useMIDI.js';

/**
 * Demo component showing how to use the useMIDI hook
 * This demonstrates the comprehensive MIDI functionality
 */
const MIDIDemo = () => {
  const {
    // State
    isSupported,
    isInitialized,
    isConnected,
    isConnecting,
    connectionError,
    selectedDevice,
    availableDevices,
    activeNotes,
    statistics,

    // Actions
    initializeMIDI,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
    setMessageHandlers,
    resetMIDI,

    // Utilities
    hasActiveNotes,
    isNoteActive,
    getConnectedDeviceName,
  } = useMIDI();

  const [noteLog, setNoteLog] = useState([]);

  // Set up MIDI message handlers
  useEffect(() => {
    setMessageHandlers({
      onNotePressed: noteData => {
        console.log('Note pressed:', noteData);
        setNoteLog(prev => [
          ...prev.slice(-9),
          {
            type: 'press',
            note: noteData.note,
            velocity: noteData.velocity,
            timestamp: Date.now(),
          },
        ]);
      },
      onNoteReleased: noteData => {
        console.log('Note released:', noteData);
        setNoteLog(prev => [
          ...prev.slice(-9),
          {
            type: 'release',
            note: noteData.note,
            velocity: noteData.velocity,
            timestamp: Date.now(),
          },
        ]);
      },
      onDeviceStateChange: event => {
        console.log('Device state changed:', event);
      },
      onError: error => {
        console.error('MIDI error:', error);
      },
    });
  }, [setMessageHandlers]);

  const handleInitialize = async () => {
    const success = await initializeMIDI();
    if (success) {
      console.log('MIDI initialized successfully');
    } else {
      console.error('MIDI initialization failed');
    }
  };

  const handleConnect = async deviceId => {
    const success = await connectToDevice(deviceId);
    if (success) {
      console.log('Connected to device');
    } else {
      console.error('Failed to connect to device');
    }
  };

  const handleDisconnect = () => {
    disconnectFromDevice();
    console.log('Disconnected from device');
  };

  const handleScan = () => {
    scanForDevices();
    console.log('Scanning for devices...');
  };

  const handleReset = () => {
    resetMIDI();
    setNoteLog([]);
    console.log('MIDI system reset');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>MIDI Hook Demo</h2>

      {/* MIDI Support Status */}
      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h3>MIDI Status</h3>
        <p>
          <strong>Supported:</strong> {isSupported ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>Initialized:</strong> {isInitialized ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>Connected:</strong> {isConnected ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>Connecting:</strong> {isConnecting ? '🔄 Yes' : '❌ No'}
        </p>
        <p>
          <strong>Connected Device:</strong> {getConnectedDeviceName()}
        </p>
        {connectionError && (
          <p style={{ color: 'red' }}>
            <strong>Error:</strong> {connectionError}
          </p>
        )}
      </div>

      {/* Control Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Controls</h3>
        <button
          onClick={handleInitialize}
          disabled={isInitialized || isConnecting}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Initialize MIDI
        </button>
        <button
          onClick={handleScan}
          disabled={!isInitialized}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Scan Devices
        </button>
        <button
          onClick={handleDisconnect}
          disabled={!isConnected}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Disconnect
        </button>
        <button
          onClick={handleReset}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
          }}
        >
          Reset
        </button>
      </div>

      {/* Available Devices */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Available Devices ({availableDevices.length})</h3>
        {availableDevices.length === 0 ? (
          <p>
            No MIDI devices found. Make sure your MIDI device is connected and
            try scanning.
          </p>
        ) : (
          <div>
            {availableDevices.map(device => (
              <div
                key={device.id}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor:
                    selectedDevice?.id === device.id ? '#e8f5e8' : 'white',
                }}
              >
                <p>
                  <strong>{device.name}</strong> ({device.manufacturer})
                </p>
                <p>ID: {device.id}</p>
                <p>
                  State: {device.state} | Connection: {device.connection}
                </p>
                <button
                  onClick={() => handleConnect(device.id)}
                  disabled={isConnected && selectedDevice?.id === device.id}
                  style={{ padding: '5px 10px' }}
                >
                  {selectedDevice?.id === device.id ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Notes */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Active Notes</h3>
        <p>
          <strong>Has Active Notes:</strong>{' '}
          {hasActiveNotes ? '🎵 Yes' : '🔇 No'}
        </p>
        <p>
          <strong>Active Notes Count:</strong> {activeNotes.size}
        </p>
        {activeNotes.size > 0 && (
          <div>
            <strong>Currently Pressed:</strong>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                marginTop: '5px',
              }}
            >
              {Array.from(activeNotes).map(note => (
                <span
                  key={note}
                  style={{
                    padding: '3px 8px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    borderRadius: '3px',
                    fontSize: '12px',
                  }}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Statistics</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px',
          }}
        >
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f0f8ff',
              borderRadius: '5px',
            }}
          >
            <strong>Messages:</strong> {statistics.messagesReceived}
          </div>
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f0fff0',
              borderRadius: '5px',
            }}
          >
            <strong>Notes Pressed:</strong> {statistics.notesPressed}
          </div>
          <div
            style={{
              padding: '10px',
              backgroundColor: '#fff8f0',
              borderRadius: '5px',
            }}
          >
            <strong>Notes Released:</strong> {statistics.notesReleased}
          </div>
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f8f0ff',
              borderRadius: '5px',
            }}
          >
            <strong>Control Changes:</strong> {statistics.controlChanges}
          </div>
          <div
            style={{
              padding: '10px',
              backgroundColor: '#fff0f0',
              borderRadius: '5px',
            }}
          >
            <strong>Errors:</strong> {statistics.errors}
          </div>
        </div>
        {statistics.lastActivity && (
          <p style={{ marginTop: '10px' }}>
            <strong>Last Activity:</strong>{' '}
            {new Date(statistics.lastActivity).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Note Log */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Recent MIDI Activity</h3>
        <div
          style={{
            height: '200px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            backgroundColor: '#fafafa',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          {noteLog.length === 0 ? (
            <p>No MIDI activity yet. Connect a device and play some notes!</p>
          ) : (
            noteLog.map((entry, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                <span
                  style={{
                    color: entry.type === 'press' ? '#4CAF50' : '#FF9800',
                  }}
                >
                  {entry.type === 'press' ? '▼' : '▲'}
                </span>{' '}
                <strong>{entry.note}</strong> vel: {entry.velocity.toFixed(3)}{' '}
                <span style={{ color: '#666' }}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test Utilities */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Test Utilities</h3>
        <div>
          <label>
            Test Note Active:
            <input
              type="text"
              placeholder="e.g., C4"
              onChange={e => {
                const note = e.target.value;
                const isActive = isNoteActive(note);
                console.log(
                  `Note ${note} is ${isActive ? 'active' : 'not active'}`
                );
              }}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#e8f4fd',
          borderRadius: '5px',
          borderLeft: '4px solid #2196F3',
        }}
      >
        <h3>Instructions</h3>
        <ol>
          <li>Click "Initialize MIDI" to start the MIDI system</li>
          <li>Connect your MIDI device (piano, keyboard, etc.)</li>
          <li>Click "Scan Devices" to find your device</li>
          <li>Click "Connect" next to your device</li>
          <li>Play notes on your MIDI device to see real-time activity</li>
        </ol>
        <p>
          <strong>Note:</strong> This demo requires a browser that supports the
          Web MIDI API (Chrome, Edge, Opera).
        </p>
      </div>
    </div>
  );
};

export default MIDIDemo;
