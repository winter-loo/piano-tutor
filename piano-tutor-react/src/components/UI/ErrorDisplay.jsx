import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';
import './ErrorDisplay.css';

const ErrorDisplay = ({
  error,
  errorDetails,
  onRetry,
  onDismiss,
  showDetails = false,
  className = '',
  size = 'medium',
  ...props
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  if (!error && !errorDetails) {
    return null;
  }

  const details = errorDetails || {};
  const canRetry = details.canRetry !== false;
  const hasFallback = details.fallbackAvailable !== false;
  const suggestions = details.suggestions || [];

  const sizeClass = `error-display-${size}`;

  return (
    <div className={`error-display ${sizeClass} ${className}`} {...props}>
      <div className="error-content">
        <div className="error-header">
          <div className="error-icon">
            {details.type === 'not_supported' ? '🚫' : 
             details.type === 'permission_denied' ? '🔒' :
             details.type === 'timeout' ? '⏱️' :
             details.type === 'connection_failed' ? '🔌' :
             '⚠️'}
          </div>
          <div className="error-text">
            <h3 className="error-title">
              {details.type === 'not_supported' ? 'Not Supported' :
               details.type === 'permission_denied' ? 'Permission Denied' :
               details.type === 'timeout' ? 'Timeout' :
               details.type === 'connection_failed' ? 'Connection Failed' :
               'Error'}
            </h3>
            <p className="error-message">{error}</p>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="error-suggestions">
            <h4>Try these solutions:</h4>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="error-actions">
          {canRetry && onRetry && (
            <button 
              className="error-button primary" 
              onClick={onRetry}
              type="button"
            >
              Try Again
            </button>
          )}
          
          {hasFallback && (
            <button 
              className="error-button secondary" 
              onClick={onDismiss}
              type="button"
            >
              Continue Anyway
            </button>
          )}

          {showDetails && details.message && (
            <button 
              className="error-button tertiary" 
              onClick={() => setShowFullDetails(!showFullDetails)}
              type="button"
            >
              {showFullDetails ? 'Hide' : 'Show'} Details
            </button>
          )}
        </div>

        {showFullDetails && details.message && (
          <div className="error-details">
            <h4>Technical Details:</h4>
            <pre className="error-technical">
              Type: {details.type || 'unknown'}
              {'\n'}Message: {details.message}
              {'\n'}Can Retry: {canRetry ? 'Yes' : 'No'}
              {'\n'}Fallback Available: {hasFallback ? 'Yes' : 'No'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized error displays for common scenarios
export const AudioErrorDisplay = ({ audioError, audioErrorDetails, onRetry, onDismiss, ...props }) => (
  <ErrorDisplay
    error={audioError}
    errorDetails={audioErrorDetails}
    onRetry={onRetry}
    onDismiss={onDismiss}
    showDetails={process.env.NODE_ENV === 'development'}
    className="audio-error"
    {...props}
  />
);

export const MIDIErrorDisplay = ({ midiError, midiErrorDetails, onRetry, onDismiss, ...props }) => (
  <ErrorDisplay
    error={midiError}
    errorDetails={midiErrorDetails}
    onRetry={onRetry}
    onDismiss={onDismiss}
    showDetails={process.env.NODE_ENV === 'development'}
    className="midi-error"
    {...props}
  />
);

// Loading state with error fallback
export const LoadingWithError = ({ 
  isLoading, 
  error, 
  errorDetails, 
  onRetry, 
  loadingText = 'Loading...', 
  children,
  ...props 
}) => {
  if (isLoading) {
    return (
      <div className="loading-with-error">
        <LoadingSpinner text={loadingText} {...props} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        errorDetails={errorDetails}
        onRetry={onRetry}
        {...props}
      />
    );
  }

  return children;
};

export default ErrorDisplay;