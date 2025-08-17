import { useState, useEffect, useRef, useCallback } from 'react';
import useMIDIStore from '../stores/midiStore.js';
import {
  isMIDISupported,
  initializeMIDI,
  getAvailableInputDevices,
  connectToMIDIDevice,
  disconnectFromMIDIDevice,
  parseMIDIMessage,
  isNoteOnMessage,
  isNoteOffMessage,
  velocityToVolume,
} from '../utils/midiUtils.js';

/**
 * Comprehensive MIDI hook for device management and message handling
 * Converts the original MIDIController class to React hook pattern
 */
const useMIDI = () => {
  // Zustand store
  const {
    isSupported,
    isInitialized,
    isConnected,
    isConnecting,
    connectionError,
    selectedDevice,
    availableDevices,
    autoConnect,
    velocity,
    channel,
    activeNotes,
    setSupported,
    setInitialized,
    setConnecting,
    setConnected,
    setConnectionError,
    setAvailableDevices,
    addAvailableDevice,
    removeAvailableDevice,
    selectDevice,
    addActiveNote,
    removeActiveNote,
    clearActiveNotes,
    disconnect: storeDisconnect,
    reset: storeReset,
  } = useMIDIStore();

  // Local refs for MIDI access and device management
  const midiAccessRef = useRef(null);
  const connectedDeviceRef = useRef(null);
  const messageHandlersRef = useRef({
    onNotePressed: null,
    onNoteReleased: null,
    onDeviceStateChange: null,
    onError: null,
  });

  // Performance and connection management refs
  const reconnectionAttemptsRef = useRef(0);
  const maxReconnectionAttemptsRef = useRef(5);
  const autoReconnectEnabledRef = useRef(true);
  const lastConnectedDeviceIdRef = useRef(null);
  const messageQueueRef = useRef([]);
  const processingIntervalRef = useRef(null);

  // Statistics and performance tracking
  const [statistics, setStatistics] = useState({
    messagesReceived: 0,
    notesPressed: 0,
    notesReleased: 0,
    controlChanges: 0,
    errors: 0,
    lastActivity: null,
  });

  // Enhanced error handling state
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  /**
   * Initialize MIDI system with browser compatibility checks
   */
  const initializeMIDISystem = useCallback(async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      setErrorDetails(null);

      // Check browser support
      if (!isMIDISupported()) {
        const errorInfo = {
          type: 'not_supported',
          message: 'Web MIDI API not supported',
          userMessage: 'MIDI is not supported in this browser. You can still use the virtual keyboard.',
          canRetry: false,
          fallbackAvailable: true,
          suggestions: [
            'Use Chrome, Edge, or Opera for MIDI support',
            'Update your browser to the latest version',
            'Continue with the virtual keyboard'
          ]
        };
        
        setConnectionError(errorInfo.userMessage);
        setErrorDetails(errorInfo);
        setSupported(false);
        setIsLoading(false);
        return { success: false, error: errorInfo };
      }

      setSupported(true);
      setConnecting(true);

      console.log('Initializing MIDI system...');

      // Initialize MIDI access with timeout
      const initPromise = initializeMIDI({ sysex: false, software: true });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MIDI initialization timeout')), 10000)
      );
      
      const midiAccess = await Promise.race([initPromise, timeoutPromise]);
      midiAccessRef.current = midiAccess;

      // Set up device state change monitoring
      midiAccess.onstatechange = handleDeviceStateChange;

      // Scan for available devices
      scanForDevices();

      // Start message processing
      startMessageProcessing();

      setInitialized(true);
      setConnecting(false);
      setIsLoading(false);

      console.log(
        `MIDI system initialized. Found ${availableDevices.length} devices`
      );

      // Attempt auto-connection if enabled
      if (autoConnect && availableDevices.length > 0) {
        setTimeout(() => {
          attemptAutoConnection();
        }, 200);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('MIDI initialization failed:', error);
      setIsLoading(false);
      setConnecting(false);
      setInitialized(false);
      
      const errorInfo = handleMIDIInitializationError(error);
      return { success: false, error: errorInfo };
    }
  }, [
    autoConnect,
    availableDevices.length,
    setSupported,
    setConnecting,
    setConnectionError,
    setInitialized,
  ]);

  /**
   * Handle MIDI initialization errors with detailed error information
   */
  const handleMIDIInitializationError = useCallback((error) => {
    let errorInfo = {
      type: 'unknown',
      message: 'MIDI initialization failed',
      userMessage: 'MIDI initialization failed. You can continue with the virtual keyboard.',
      canRetry: true,
      fallbackAvailable: true,
      suggestions: ['Try refreshing the page', 'Use the virtual keyboard instead']
    };

    if (error.name === 'NotAllowedError') {
      errorInfo = {
        type: 'permission_denied',
        message: 'MIDI access denied',
        userMessage: 'MIDI access was denied. Please allow MIDI access and try again.',
        canRetry: true,
        fallbackAvailable: true,
        suggestions: [
          'Allow MIDI access in browser settings',
          'Refresh the page and try again',
          'Use the virtual keyboard instead'
        ]
      };
    } else if (error.name === 'NotSupportedError' || error.message.includes('not supported')) {
      errorInfo = {
        type: 'not_supported',
        message: 'MIDI not supported',
        userMessage: 'MIDI is not supported in this browser. Use the virtual keyboard instead.',
        canRetry: false,
        fallbackAvailable: true,
        suggestions: [
          'Use Chrome, Edge, or Opera for MIDI support',
          'Continue with the virtual keyboard',
          'Update your browser'
        ]
      };
    } else if (error.message.includes('timeout')) {
      errorInfo = {
        type: 'timeout',
        message: 'MIDI initialization timeout',
        userMessage: 'MIDI initialization is taking too long. Please try again.',
        canRetry: true,
        fallbackAvailable: true,
        suggestions: [
          'Check if MIDI devices are properly connected',
          'Try again in a few seconds',
          'Restart your browser if the problem persists'
        ]
      };
    } else if (error.message.includes('SecurityError')) {
      errorInfo = {
        type: 'security_error',
        message: 'MIDI security error',
        userMessage: 'MIDI access blocked for security reasons.',
        canRetry: true,
        fallbackAvailable: true,
        suggestions: [
          'Ensure the page is served over HTTPS',
          'Check browser security settings',
          'Try a different browser'
        ]
      };
    }

    setConnectionError(errorInfo.userMessage);
    setErrorDetails(errorInfo);
    
    return errorInfo;
  }, [setConnectionError]);

  /**
   * Scan for available MIDI input devices
   */
  const scanForDevices = useCallback(() => {
    if (!midiAccessRef.current) {
      console.warn('MIDI access not available for device scanning');
      return;
    }

    console.log('Scanning for MIDI input devices...');
    const devices = getAvailableInputDevices(midiAccessRef.current);
    const deviceArray = Array.from(devices.values());

    setAvailableDevices(deviceArray);

    console.log(
      `Device scan complete. Found ${deviceArray.length} available devices`
    );

    // Notify listeners about device list update
    if (messageHandlersRef.current.onDeviceStateChange) {
      messageHandlersRef.current.onDeviceStateChange({
        type: 'scan_complete',
        devices: deviceArray,
      });
    }
  }, [setAvailableDevices]);

  /**
   * Handle MIDI device state changes (hot-plugging support)
   */
  const handleDeviceStateChange = useCallback(
    event => {
      const port = event.port;
      console.log(
        `MIDI device ${port.state}: ${port.name} (${port.manufacturer})`
      );

      if (port.type === 'input') {
        if (port.state === 'connected') {
          // Device connected
          const deviceInfo = {
            id: port.id,
            name: port.name || 'Unknown Device',
            manufacturer: port.manufacturer || 'Unknown Manufacturer',
            type: port.type,
            connection: port.connection,
            state: port.state,
            version: port.version || 'Unknown',
          };

          addAvailableDevice(deviceInfo);
          console.log(`MIDI device connected: ${deviceInfo.name}`);

          // Attempt automatic connection if no device is currently connected
          if (!isConnected && autoConnect) {
            console.log(
              'New MIDI device detected, attempting automatic connection...'
            );
            setTimeout(() => {
              attemptAutoConnection();
            }, 100);
          }
        } else if (port.state === 'disconnected') {
          // Device disconnected
          removeAvailableDevice(port.id);
          console.log(`MIDI device disconnected: ${port.name}`);

          // If this was our connected device, handle disconnection
          if (
            connectedDeviceRef.current &&
            connectedDeviceRef.current.id === port.id
          ) {
            handleDeviceDisconnection(true);
          }
        }

        // Notify listeners about device state change
        if (messageHandlersRef.current.onDeviceStateChange) {
          messageHandlersRef.current.onDeviceStateChange({
            type: port.state,
            device: port,
            devices: availableDevices,
          });
        }
      }
    },
    [
      isConnected,
      autoConnect,
      availableDevices,
      addAvailableDevice,
      removeAvailableDevice,
    ]
  );

  /**
   * Attempt automatic connection to preferred or first available device
   */
  const attemptAutoConnection = useCallback(async () => {
    if (!autoConnect || isConnected) {
      return false;
    }

    if (availableDevices.length === 0) {
      console.log('No MIDI devices available for auto-connection');
      return false;
    }

    // Try to reconnect to last connected device if available
    if (lastConnectedDeviceIdRef.current) {
      const lastDevice = availableDevices.find(
        d => d.id === lastConnectedDeviceIdRef.current
      );
      if (lastDevice) {
        console.log(
          `Attempting to reconnect to last device: ${lastDevice.name}`
        );
        const success = await connectToDevice(lastDevice.id);
        if (success) return true;
      }
    }

    // Connect to first available device
    const firstDevice = availableDevices[0];
    console.log(
      `Auto-connecting to first available device: ${firstDevice.name}`
    );

    return await connectToDevice(firstDevice.id);
  }, [autoConnect, isConnected, availableDevices]);

  /**
   * Connect to a specific MIDI device
   */
  const connectToDevice = useCallback(
    async deviceId => {
      try {
        setIsLoading(true);
        setConnectionError(null);
        setErrorDetails(null);

        if (!midiAccessRef.current) {
          const errorInfo = {
            type: 'not_initialized',
            message: 'MIDI system not initialized',
            userMessage: 'MIDI system is not ready. Please try initializing MIDI first.',
            canRetry: true,
            fallbackAvailable: true,
            suggestions: [
              'Try initializing MIDI again',
              'Refresh the page',
              'Use the virtual keyboard'
            ]
          };
          
          setConnectionError(errorInfo.userMessage);
          setErrorDetails(errorInfo);
          setIsLoading(false);
          return { success: false, error: errorInfo };
        }

        const device = midiAccessRef.current.inputs.get(deviceId);
        if (!device) {
          const errorInfo = {
            type: 'device_not_found',
            message: 'MIDI device not found',
            userMessage: 'The selected MIDI device was not found. Please check your connection.',
            canRetry: true,
            fallbackAvailable: true,
            suggestions: [
              'Check if the device is properly connected',
              'Try scanning for devices again',
              'Use a different MIDI device'
            ]
          };
          
          setConnectionError(errorInfo.userMessage);
          setErrorDetails(errorInfo);
          setIsLoading(false);
          return { success: false, error: errorInfo };
        }

        if (device.state !== 'connected') {
          const errorInfo = {
            type: 'device_disconnected',
            message: 'MIDI device not connected',
            userMessage: `Device "${device.name}" is not connected. Please check the connection.`,
            canRetry: true,
            fallbackAvailable: true,
            suggestions: [
              'Check USB/MIDI cable connection',
              'Turn the device off and on again',
              'Try a different USB port'
            ]
          };
          
          setConnectionError(errorInfo.userMessage);
          setErrorDetails(errorInfo);
          setIsLoading(false);
          return { success: false, error: errorInfo };
        }

        setConnecting(true);

        // Disconnect from previous device if connected
        if (connectedDeviceRef.current) {
          disconnectFromDevice();
        }

        // Set up MIDI message handler
        device.onmidimessage = handleMIDIMessage;

        // Handle device disconnection
        device.onstatechange = event => {
          if (event.port.state === 'disconnected') {
            handleDeviceDisconnection(true);
          }
        };

        connectedDeviceRef.current = device;
        lastConnectedDeviceIdRef.current = deviceId;
        reconnectionAttemptsRef.current = 0;

        const deviceInfo = availableDevices.find(d => d.id === deviceId);
        setConnected(true, deviceInfo);
        selectDevice(deviceInfo);
        setIsLoading(false);

        console.log(
          `Connected to MIDI device: ${device.name} (${device.manufacturer})`
        );

        // Notify listeners about successful connection
        if (messageHandlersRef.current.onDeviceStateChange) {
          messageHandlersRef.current.onDeviceStateChange({
            type: 'device_connected',
            device: device,
            deviceInfo: deviceInfo,
          });
        }

        return { success: true, error: null };
      } catch (error) {
        console.error('Failed to connect to MIDI device:', error);
        setIsLoading(false);
        setConnecting(false);

        const errorInfo = {
          type: 'connection_failed',
          message: 'MIDI connection failed',
          userMessage: 'Failed to connect to MIDI device. Please try again.',
          canRetry: true,
          fallbackAvailable: true,
          suggestions: [
            'Try connecting again',
            'Check device compatibility',
            'Use the virtual keyboard instead'
          ]
        };

        setConnectionError(errorInfo.userMessage);
        setErrorDetails(errorInfo);

        if (messageHandlersRef.current.onError) {
          messageHandlersRef.current.onError(error);
        }

        return { success: false, error: errorInfo };
      }
    },
    [
      availableDevices,
      setConnecting,
      setConnected,
      setConnectionError,
      selectDevice,
    ]
  );

  /**
   * Disconnect from current MIDI device
   */
  const disconnectFromDevice = useCallback(() => {
    if (connectedDeviceRef.current) {
      console.log(
        `Disconnecting from MIDI device: ${connectedDeviceRef.current.name}`
      );

      // Remove message handlers
      connectedDeviceRef.current.onmidimessage = null;
      connectedDeviceRef.current.onstatechange = null;

      const deviceName = connectedDeviceRef.current.name;
      connectedDeviceRef.current = null;

      storeDisconnect();
      clearActiveNotes();

      // Notify listeners about disconnection
      if (messageHandlersRef.current.onDeviceStateChange) {
        messageHandlersRef.current.onDeviceStateChange({
          type: 'device_disconnected',
          deviceName: deviceName,
        });
      }

      console.log('MIDI device disconnected');
    }
  }, [storeDisconnect, clearActiveNotes]);

  /**
   * Handle unexpected device disconnection with auto-reconnection
   */
  const handleDeviceDisconnection = useCallback(
    (wasUnexpected = true) => {
      if (isConnected) {
        console.warn('MIDI device unexpectedly disconnected');
        const deviceName = connectedDeviceRef.current
          ? connectedDeviceRef.current.name
          : 'Unknown Device';

        connectedDeviceRef.current = null;
        storeDisconnect();
        clearActiveNotes();

        // Notify listeners about unexpected disconnection
        if (messageHandlersRef.current.onDeviceStateChange) {
          messageHandlersRef.current.onDeviceStateChange({
            type: 'device_lost',
            deviceName: deviceName,
            message:
              'MIDI device connection lost. Please reconnect your device.',
          });
        }

        // Attempt auto-reconnection if enabled and this was unexpected
        if (
          wasUnexpected &&
          autoReconnectEnabledRef.current &&
          reconnectionAttemptsRef.current < maxReconnectionAttemptsRef.current
        ) {
          reconnectionAttemptsRef.current++;
          console.log(
            `Attempting auto-reconnection (${reconnectionAttemptsRef.current}/${maxReconnectionAttemptsRef.current})...`
          );

          setTimeout(() => {
            attemptAutoConnection();
          }, 2000 * reconnectionAttemptsRef.current); // Exponential backoff
        }
      }
    },
    [isConnected, storeDisconnect, clearActiveNotes, attemptAutoConnection]
  );

  /**
   * Start message processing loop
   */
  const startMessageProcessing = useCallback(() => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
    }

    processingIntervalRef.current = setInterval(() => {
      processMessageQueue();
    }, 1); // 1ms interval for real-time processing

    console.log('Started MIDI message processing');
  }, []);

  /**
   * Process queued MIDI messages
   */
  const processMessageQueue = useCallback(() => {
    if (messageQueueRef.current.length === 0) return;

    const batchSize = Math.min(10, messageQueueRef.current.length);

    for (let i = 0; i < batchSize; i++) {
      const message = messageQueueRef.current.shift();
      if (message) {
        try {
          processMIDIMessage(message);
        } catch (error) {
          console.error('Error processing MIDI message:', error);
          updateStatistics('error');
        }
      }
    }
  }, []);

  /**
   * Handle incoming MIDI messages
   */
  const handleMIDIMessage = useCallback(messageEvent => {
    try {
      // Add message to processing queue with timestamp
      const enhancedMessage = {
        data: messageEvent.data,
        timeStamp: messageEvent.timeStamp || performance.now(),
        receivedAt: performance.now(),
      };

      messageQueueRef.current.push(enhancedMessage);

      // Prevent queue overflow
      if (messageQueueRef.current.length > 1000) {
        messageQueueRef.current.shift();
      }

      updateStatistics('message_received');
    } catch (error) {
      console.error('Error handling MIDI message:', error);
      updateStatistics('error');
    }
  }, []);

  /**
   * Process individual MIDI message
   */
  const processMIDIMessage = useCallback(message => {
    const parsedMessage = parseMIDIMessage(message.data);
    if (!parsedMessage) return;

    // Handle different message types
    if (isNoteOnMessage(parsedMessage)) {
      handleNoteOn(parsedMessage, message.timeStamp);
      updateStatistics('note_on');
    } else if (isNoteOffMessage(parsedMessage)) {
      handleNoteOff(parsedMessage, message.timeStamp);
      updateStatistics('note_off');
    } else if (parsedMessage.type === 'controlChange') {
      handleControlChange(parsedMessage, message.timeStamp);
      updateStatistics('control_change');
    }
  }, []);

  /**
   * Handle MIDI note on messages
   */
  const handleNoteOn = useCallback(
    (message, timestamp) => {
      const { noteName, velocity } = message;
      const normalizedVelocity = velocityToVolume(velocity);

      addActiveNote(noteName);

      const noteData = {
        note: noteName,
        velocity: normalizedVelocity,
        rawVelocity: velocity,
        channel: message.channel,
        source: 'midi',
        timestamp: timestamp,
        deviceName: selectedDevice ? selectedDevice.name : 'Unknown Device',
      };

      if (messageHandlersRef.current.onNotePressed) {
        messageHandlersRef.current.onNotePressed(noteData);
      }

      console.log(`🎹 MIDI Note ON: ${noteName} vel=${velocity}`);
    },
    [addActiveNote, selectedDevice]
  );

  /**
   * Handle MIDI note off messages
   */
  const handleNoteOff = useCallback(
    (message, timestamp) => {
      const { noteName, velocity } = message;

      removeActiveNote(noteName);

      const noteData = {
        note: noteName,
        velocity: velocityToVolume(velocity),
        rawVelocity: velocity,
        channel: message.channel,
        source: 'midi',
        timestamp: timestamp,
        deviceName: selectedDevice ? selectedDevice.name : 'Unknown Device',
      };

      if (messageHandlersRef.current.onNoteReleased) {
        messageHandlersRef.current.onNoteReleased(noteData);
      }

      console.log(`🎹 MIDI Note OFF: ${noteName} vel=${velocity}`);
    },
    [removeActiveNote, selectedDevice]
  );

  /**
   * Handle MIDI control change messages
   */
  const handleControlChange = useCallback((message, timestamp) => {
    console.log(
      `🎛️ MIDI Control Change: CC${message.controller} = ${message.value}`
    );

    // Handle common control changes (sustain pedal, volume, etc.)
    // This can be extended based on application needs
  }, []);

  /**
   * Update statistics
   */
  const updateStatistics = useCallback(type => {
    setStatistics(prev => ({
      ...prev,
      [type === 'message_received'
        ? 'messagesReceived'
        : type === 'note_on'
          ? 'notesPressed'
          : type === 'note_off'
            ? 'notesReleased'
            : type === 'control_change'
              ? 'controlChanges'
              : type === 'error'
                ? 'errors'
                : type]:
        prev[
          type === 'message_received'
            ? 'messagesReceived'
            : type === 'note_on'
              ? 'notesPressed'
              : type === 'note_off'
                ? 'notesReleased'
                : type === 'control_change'
                  ? 'controlChanges'
                  : type === 'error'
                    ? 'errors'
                    : type
        ] + 1,
      lastActivity: Date.now(),
    }));
  }, []);

  /**
   * Set message handlers
   */
  const setMessageHandlers = useCallback(handlers => {
    messageHandlersRef.current = { ...messageHandlersRef.current, ...handlers };
  }, []);

  /**
   * Reset MIDI system
   */
  const resetMIDISystem = useCallback(() => {
    // Stop message processing
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }

    // Disconnect device
    if (connectedDeviceRef.current) {
      disconnectFromDevice();
    }

    // Clear refs
    midiAccessRef.current = null;
    connectedDeviceRef.current = null;
    messageQueueRef.current = [];
    reconnectionAttemptsRef.current = 0;
    lastConnectedDeviceIdRef.current = null;

    // Reset store
    storeReset();

    // Reset statistics
    setStatistics({
      messagesReceived: 0,
      notesPressed: 0,
      notesReleased: 0,
      controlChanges: 0,
      errors: 0,
      lastActivity: null,
    });

    console.log('MIDI system reset');
  }, [disconnectFromDevice, storeReset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetMIDISystem();
    };
  }, [resetMIDISystem]);

  // Auto-initialize on mount if supported
  useEffect(() => {
    if (!isInitialized && isMIDISupported()) {
      initializeMIDISystem();
    }
  }, [isInitialized, initializeMIDISystem]);

  return {
    // State
    isSupported,
    isInitialized,
    isConnected,
    isConnecting,
    isMIDILoading: isLoading,
    connectionError,
    midiErrorDetails: errorDetails,
    selectedDevice,
    availableDevices,
    activeNotes,
    statistics,

    // Actions
    initializeMIDI: initializeMIDISystem,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
    setMessageHandlers,
    resetMIDI: resetMIDISystem,

    // Utilities
    hasActiveNotes: activeNotes.size > 0,
    isNoteActive: note => activeNotes.has(note),
    getConnectedDeviceName: () => selectedDevice?.name || 'No device connected',
  };
};

export default useMIDI;
