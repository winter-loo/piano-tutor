import React, { useState } from 'react';
import { 
  ErrorBoundary, 
  LoadingSpinner, 
  ErrorDisplay, 
  AudioErrorDisplay, 
  MIDIErrorDisplay, 
  LoadingWithError 
} from './index.js';
import { useAudioEngine } from '../../hooks/useAudioEngine.js';
import useMIDI from '../../hooks/useMIDI.js';

// Component that throws an error for testing ErrorBoundary
const ErrorThrowingComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for ErrorBoundary');
  }
  return <div>No error - component working normally</div>;
};

const ErrorHandlingDemo = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [simulateAudioError, setSimulateAudioError] = useState(false);
  const [simulateMIDIError, setSimulateMIDIError] = useState(false);

  // Get real audio and MIDI state for demonstration
  const {
    isAudioLoading,
    audioError,
    audioErrorDetails,
    initializeAudio,
    resumeAudioContext
  } = useAudioEngine();

  const {
    isMIDILoading,
    connectionError: midiError,
    midiErrorDetails,
    initializeMIDI,
    connectToDevice,
    availableDevices
  } = useMIDI();

  // Simulated error states for demonstration
  const simulatedAudioError = simulateAudioError ? {
    type: 'permission_denied',
    message: 'Audio blocked by browser',
    userMessage: 'Audio is blocked by your browser. Click anywhere to enable audio.',
    canRetry: true,
    fallbackAvailable: true,
    suggestions: [
      'Click anywhere on the page to enable audio',
      'Check browser audio permissions',
      'Ensure your device is not muted'
    ]
  } : null;

  const simulatedMIDIError = simulateMIDIError ? {
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
  } : null;

  const handleRetryAudio = async () => {
    setSimulateAudioError(false);
    if (audioError) {
      await resumeAudioContext();
    }
  };

  const handleRetryMIDI = async () => {
    setSimulateMIDIError(false);
    if (midiError) {
      await initializeMIDI();
    }
  };

  const handleDismissError = () => {
    setSimulateAudioError(false);
    setSimulateMIDIError(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Error Handling & Loading States Demo</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Demo Controls</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button 
            onClick={() => setShouldThrowError(!shouldThrowError)}
            style={{ padding: '8px 16px', backgroundColor: shouldThrowError ? '#e74c3c' : '#27ae60', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {shouldThrowError ? 'Stop' : 'Trigger'} Error Boundary
          </button>
          
          <button 
            onClick={() => setShowLoadingSpinner(!showLoadingSpinner)}
            style={{ padding: '8px 16px', backgroundColor: showLoadingSpinner ? '#e74c3c' : '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {showLoadingSpinner ? 'Hide' : 'Show'} Loading Spinner
          </button>
          
          <button 
            onClick={() => setSimulateAudioError(!simulateAudioError)}
            style={{ padding: '8px 16px', backgroundColor: simulateAudioError ? '#e74c3c' : '#f39c12', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {simulateAudioError ? 'Clear' : 'Simulate'} Audio Error
          </button>
          
          <button 
            onClick={() => setSimulateMIDIError(!simulateMIDIError)}
            style={{ padding: '8px 16px', backgroundColor: simulateMIDIError ? '#e74c3c' : '#9b59b6', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {simulateMIDIError ? 'Clear' : 'Simulate'} MIDI Error
          </button>
        </div>
      </div>

      {/* Error Boundary Demo */}
      <section style={{ marginBottom: '30px' }}>
        <h2>1. Error Boundary</h2>
        <p>Catches JavaScript errors in child components and shows a fallback UI:</p>
        <ErrorBoundary>
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <ErrorThrowingComponent shouldThrow={shouldThrowError} />
          </div>
        </ErrorBoundary>
      </section>

      {/* Loading Spinner Demo */}
      <section style={{ marginBottom: '30px' }}>
        <h2>2. Loading Spinner</h2>
        <p>Shows loading states with different sizes and colors:</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <LoadingSpinner size="small" color="primary" text="Small" />
          <LoadingSpinner size="medium" color="success" text="Medium" />
          <LoadingSpinner size="large" color="warning" text="Large" />
          {showLoadingSpinner && <LoadingSpinner text="Demo Loading..." />}
        </div>
      </section>

      {/* Audio Error Display Demo */}
      <section style={{ marginBottom: '30px' }}>
        <h2>3. Audio Error Display</h2>
        <p>Shows audio-specific errors with recovery options:</p>
        
        {/* Real audio state */}
        {isAudioLoading && (
          <LoadingWithError 
            isLoading={true} 
            loadingText="Initializing audio engine..." 
          />
        )}
        
        {(audioError || simulateAudioError) && (
          <AudioErrorDisplay
            audioError={simulateAudioError ? simulatedAudioError.userMessage : audioError}
            audioErrorDetails={simulateAudioError ? simulatedAudioError : audioErrorDetails}
            onRetry={handleRetryAudio}
            onDismiss={handleDismissError}
          />
        )}
        
        {!isAudioLoading && !audioError && !simulateAudioError && (
          <div style={{ padding: '16px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724' }}>
            ✅ Audio system is working normally
          </div>
        )}
      </section>

      {/* MIDI Error Display Demo */}
      <section style={{ marginBottom: '30px' }}>
        <h2>4. MIDI Error Display</h2>
        <p>Shows MIDI-specific errors with fallback options:</p>
        
        {/* Real MIDI state */}
        {isMIDILoading && (
          <LoadingWithError 
            isLoading={true} 
            loadingText="Scanning for MIDI devices..." 
          />
        )}
        
        {(midiError || simulateMIDIError) && (
          <MIDIErrorDisplay
            midiError={simulateMIDIError ? simulatedMIDIError.userMessage : midiError}
            midiErrorDetails={simulateMIDIError ? simulatedMIDIError : midiErrorDetails}
            onRetry={handleRetryMIDI}
            onDismiss={handleDismissError}
          />
        )}
        
        {!isMIDILoading && !midiError && !simulateMIDIError && (
          <div style={{ padding: '16px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724' }}>
            ✅ MIDI system is working normally {availableDevices.length > 0 ? `(${availableDevices.length} devices found)` : '(no devices connected)'}
          </div>
        )}
      </section>

      {/* Generic Error Display Demo */}
      <section style={{ marginBottom: '30px' }}>
        <h2>5. Generic Error Display</h2>
        <p>Flexible error display for various error types:</p>
        
        <ErrorDisplay
          error="This is a sample error message"
          errorDetails={{
            type: 'connection_failed',
            message: 'Network connection failed',
            userMessage: 'Unable to connect to the server. Please check your internet connection.',
            canRetry: true,
            fallbackAvailable: true,
            suggestions: [
              'Check your internet connection',
              'Try refreshing the page',
              'Contact support if the problem persists'
            ]
          }}
          onRetry={() => alert('Retry clicked!')}
          onDismiss={() => alert('Dismiss clicked!')}
          showDetails={true}
          size="medium"
        />
      </section>

      {/* LoadingWithError Demo */}
      <section style={{ marginBottom: '30px' }}>
        <h2>6. Loading with Error Fallback</h2>
        <p>Combines loading and error states in one component:</p>
        
        <LoadingWithError
          isLoading={false}
          error="Sample loading error"
          errorDetails={{
            type: 'timeout',
            message: 'Operation timed out',
            userMessage: 'The operation took too long to complete.',
            canRetry: true,
            suggestions: ['Try again', 'Check your connection']
          }}
          onRetry={() => alert('Retry from LoadingWithError!')}
          loadingText="Processing..."
        >
          <div style={{ padding: '16px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724' }}>
            ✅ Content loaded successfully!
          </div>
        </LoadingWithError>
      </section>

      <section>
        <h2>Implementation Notes</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>ErrorBoundary:</strong> Catches JavaScript errors and prevents app crashes</li>
          <li><strong>LoadingSpinner:</strong> Provides visual feedback during async operations</li>
          <li><strong>ErrorDisplay:</strong> Shows detailed error information with recovery options</li>
          <li><strong>Specialized Displays:</strong> AudioErrorDisplay and MIDIErrorDisplay for domain-specific errors</li>
          <li><strong>LoadingWithError:</strong> Combines loading and error states for cleaner code</li>
          <li><strong>Responsive Design:</strong> All components adapt to different screen sizes</li>
          <li><strong>Accessibility:</strong> Proper ARIA labels and keyboard navigation support</li>
        </ul>
      </section>
    </div>
  );
};

export default ErrorHandlingDemo;