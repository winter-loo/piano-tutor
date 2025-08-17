import React, { useState, useEffect } from 'react';
import useMIDI from '../../hooks/useMIDI.js';
import useMIDIStore from '../../stores/midiStore.js';

/**
 * MIDIConfigPopup component - Device selection, preferences, and troubleshooting
 * Provides comprehensive MIDI device management interface
 */
const MIDIConfigPopup = ({ isOpen, onClose }) => {
  const {
    isConnected,
    isConnecting,
    connectionError,
    selectedDevice,
    availableDevices,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
    statistics
  } = useMIDI();

  const { autoConnect, setAutoConnect } = useMIDIStore();
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Update selected device ID when device changes
  useEffect(() => {
    setSelectedDeviceId(selectedDevice?.id || '');
  }, [selectedDevice]);

  // Handle device selection change
  const handleDeviceSelection = async (deviceId) => {
    setSelectedDeviceId(deviceId);
    
    if (!deviceId) {
      // Disconnect current device
      disconnectFromDevice();
      return;
    }

    try {
      await connectToDevice(deviceId);
    } catch (error) {
      console.error('Failed to connect to device:', error);
    }
  };

  // Handle refresh devices
  const handleRefreshDevices = () => {
    scanForDevices();
  };

  // Handle auto-connect toggle
  const handleAutoConnectToggle = (enabled) => {
    setAutoConnect(enabled);
  };

  // Get status indicator class and text
  const getStatusInfo = () => {
    if (isConnecting) {
      return { class: 'connecting', text: 'Connecting...' };
    }
    if (isConnected && selectedDevice) {
      return { class: 'connected', text: 'Connected' };
    }
    if (connectionError) {
      return { class: 'error', text: 'Error' };
    }
    return { class: 'disconnected', text: 'Disconnected' };
  };

  const statusInfo = getStatusInfo();

  // Handle popup close
  const handleClose = () => {
    onClose?.();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`midi-config-popup ${isOpen ? 'show' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="midi-config-title"
    >
      <div className="midi-config-content">
        <div className="midi-config-header">
          <h3 id="midi-config-title">🎹 MIDI Device Configuration</h3>
          <button 
            className="close-popup-btn" 
            onClick={handleClose}
            title="Close"
            aria-label="Close MIDI configuration"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="midi-config-body">
          {/* Device Status Section */}
          <div className="device-status-section">
            <div className="status-display">
              <span className={`status-indicator ${statusInfo.class}`}>
                {statusInfo.text}
              </span>
              <span className="device-name">
                {selectedDevice ? 
                  `${selectedDevice.name} (${selectedDevice.manufacturer || 'Unknown'})` : 
                  'No device selected'
                }
              </span>
            </div>
          </div>

          {/* Device Selection Section */}
          <div className="device-selection-section">
            <div className="device-controls">
              <label htmlFor="midiDeviceSelect">Select MIDI Device:</label>
              <div className="device-select-container">
                <select 
                  id="midiDeviceSelect"
                  className="device-select"
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceSelection(e.target.value)}
                  disabled={isConnecting}
                >
                  <option value="">No MIDI device</option>
                  {availableDevices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name} ({device.manufacturer || 'Unknown'})
                    </option>
                  ))}
                </select>
                <button 
                  className="refresh-btn"
                  onClick={handleRefreshDevices}
                  title="Refresh device list"
                  disabled={isConnecting}
                >
                  <span className="refresh-icon">⟳</span>
                </button>
              </div>
            </div>

            {/* Device Preferences */}
            <div className="device-preferences">
              <label className="preference-item">
                <input 
                  type="checkbox" 
                  checked={autoConnect}
                  onChange={(e) => handleAutoConnectToggle(e.target.checked)}
                />
                <span className="checkmark"></span>
                Automatically connect to MIDI devices when detected
              </label>
            </div>

            {/* Connection Help */}
            {availableDevices.length === 0 && (
              <div className="connection-help">
                <h4>No MIDI devices found</h4>
                <p>Make sure your MIDI device is:</p>
                <ul>
                  <li>Connected to your computer via USB or MIDI cable</li>
                  <li>Powered on and functioning</li>
                  <li>Recognized by your operating system</li>
                </ul>
                <p>Click the refresh button after connecting your device.</p>
              </div>
            )}

            {/* Error Display */}
            {connectionError && (
              <div className="connection-error">
                <h4>Connection Error</h4>
                <p>{connectionError}</p>
              </div>
            )}

            {/* Statistics (for debugging/info) */}
            {statistics && statistics.messagesReceived > 0 && (
              <div className="connection-stats">
                <h4>Connection Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Messages:</span>
                    <span className="stat-value">{statistics.messagesReceived}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Notes Pressed:</span>
                    <span className="stat-value">{statistics.notesPressed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Notes Released:</span>
                    <span className="stat-value">{statistics.notesReleased}</span>
                  </div>
                  {statistics.errors > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Errors:</span>
                      <span className="stat-value error">{statistics.errors}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Troubleshooting Section */}
            <div className="troubleshooting">
              <h4>Troubleshooting</h4>
              <ul>
                <li><strong>Device not appearing?</strong> Try refreshing the device list or reconnecting your MIDI device.</li>
                <li><strong>Connection fails?</strong> Make sure no other applications are using the MIDI device.</li>
                <li><strong>Notes not registering?</strong> Check that your device is sending on MIDI channel 1 or try different channels.</li>
                <li><strong>Browser compatibility:</strong> MIDI support requires Chrome, Edge, or Opera. Firefox and Safari have limited support.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MIDIConfigPopup;
