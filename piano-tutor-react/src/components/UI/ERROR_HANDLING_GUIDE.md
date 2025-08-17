# Error Handling & Loading States Guide

This guide explains how to use the comprehensive error handling and loading state components in the Piano Tutor React application.

## Components Overview

### 1. ErrorBoundary
Catches JavaScript errors in child components and prevents the entire app from crashing.

```jsx
import { ErrorBoundary } from './components/UI';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches all JavaScript errors in child components
- Shows user-friendly error message with recovery options
- Displays technical details in development mode
- Provides "Refresh Page" and "Try Again" buttons
- Automatically logs errors to console

### 2. LoadingSpinner
Provides visual feedback during async operations.

```jsx
import { LoadingSpinner } from './components/UI';

<LoadingSpinner 
  size="medium"           // small, medium, large
  color="primary"         // primary, secondary, success, warning, danger, light, dark
  text="Loading..."       // Optional loading text
  className="custom"      // Additional CSS classes
/>
```

### 3. ErrorDisplay
Flexible error display component with detailed error information and recovery options.

```jsx
import { ErrorDisplay } from './components/UI';

<ErrorDisplay
  error="User-friendly error message"
  errorDetails={{
    type: 'connection_failed',
    message: 'Technical error message',
    userMessage: 'User-friendly message',
    canRetry: true,
    fallbackAvailable: true,
    suggestions: ['Try again', 'Check connection']
  }}
  onRetry={() => handleRetry()}
  onDismiss={() => handleDismiss()}
  showDetails={true}      // Show technical details
  size="medium"           // small, medium, large
/>
```

**Error Types:**
- `not_supported` - Feature not supported (🚫)
- `permission_denied` - Permission denied (🔒)
- `timeout` - Operation timeout (⏱️)
- `connection_failed` - Connection failed (🔌)
- `unknown` - Generic error (⚠️)

### 4. AudioErrorDisplay
Specialized error display for audio-related errors.

```jsx
import { AudioErrorDisplay } from './components/UI';

<AudioErrorDisplay
  audioError={audioError}
  audioErrorDetails={audioErrorDetails}
  onRetry={resumeAudioContext}
  onDismiss={dismissAudioError}
/>
```

### 5. MIDIErrorDisplay
Specialized error display for MIDI-related errors.

```jsx
import { MIDIErrorDisplay } from './components/UI';

<MIDIErrorDisplay
  midiError={connectionError}
  midiErrorDetails={midiErrorDetails}
  onRetry={initializeMIDI}
  onDismiss={dismissMIDIError}
/>
```

### 6. LoadingWithError
Combines loading and error states in a single component.

```jsx
import { LoadingWithError } from './components/UI';

<LoadingWithError
  isLoading={isLoading}
  error={error}
  errorDetails={errorDetails}
  onRetry={handleRetry}
  loadingText="Processing..."
>
  <YourContent />
</LoadingWithError>
```

## Usage Patterns

### Basic Error Handling Setup

```jsx
import { ErrorBoundary, LoadingWithError } from './components/UI';
import { useAudioEngine } from './hooks/useAudioEngine';

const App = () => {
  const { 
    isAudioLoading, 
    audioError, 
    audioErrorDetails, 
    resumeAudioContext 
  } = useAudioEngine();

  return (
    <ErrorBoundary>
      <LoadingWithError
        isLoading={isAudioLoading}
        error={audioError}
        errorDetails={audioErrorDetails}
        onRetry={resumeAudioContext}
        loadingText="Initializing audio..."
      >
        <MainAppContent />
      </LoadingWithError>
    </ErrorBoundary>
  );
};
```

### Audio System Error Handling

```jsx
import { AudioErrorDisplay } from './components/UI';
import { useAudioEngine } from './hooks/useAudioEngine';

const AudioComponent = () => {
  const { 
    isAudioLoading,
    audioError, 
    audioErrorDetails, 
    resumeAudioContext 
  } = useAudioEngine();

  if (isAudioLoading) {
    return <LoadingSpinner text="Initializing audio engine..." />;
  }

  if (audioError) {
    return (
      <AudioErrorDisplay
        audioError={audioError}
        audioErrorDetails={audioErrorDetails}
        onRetry={resumeAudioContext}
        onDismiss={() => {
          // Continue in silent mode
          console.log('Continuing without audio');
        }}
      />
    );
  }

  return <AudioControls />;
};
```

### MIDI System Error Handling

```jsx
import { MIDIErrorDisplay } from './components/UI';
import useMIDI from './hooks/useMIDI';

const MIDIComponent = () => {
  const { 
    isMIDILoading,
    connectionError, 
    midiErrorDetails, 
    initializeMIDI 
  } = useMIDI();

  if (isMIDILoading) {
    return <LoadingSpinner text="Scanning for MIDI devices..." />;
  }

  if (connectionError) {
    return (
      <MIDIErrorDisplay
        midiError={connectionError}
        midiErrorDetails={midiErrorDetails}
        onRetry={initializeMIDI}
        onDismiss={() => {
          // Continue with virtual keyboard
          console.log('Continuing with virtual keyboard');
        }}
      />
    );
  }

  return <MIDIControls />;
};
```

### Custom Error Handling

```jsx
import { ErrorDisplay } from './components/UI';

const CustomComponent = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOperation = async () => {
    try {
      setLoading(true);
      setError(null);
      await someAsyncOperation();
    } catch (err) {
      setError({
        type: 'operation_failed',
        message: err.message,
        userMessage: 'Operation failed. Please try again.',
        canRetry: true,
        fallbackAvailable: false,
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Processing..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error.userMessage}
        errorDetails={error}
        onRetry={handleOperation}
        showDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }

  return <YourContent />;
};
```

## Error Details Structure

The `errorDetails` object should follow this structure:

```typescript
interface ErrorDetails {
  type: 'not_supported' | 'permission_denied' | 'timeout' | 'connection_failed' | 'unknown';
  message: string;           // Technical error message
  userMessage: string;       // User-friendly message
  canRetry: boolean;         // Whether retry is possible
  fallbackAvailable: boolean; // Whether fallback option exists
  suggestions: string[];     // Array of suggested solutions
}
```

## Best Practices

### 1. Always Wrap Your App in ErrorBoundary
```jsx
const App = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        {/* Your routes */}
      </Routes>
    </Router>
  </ErrorBoundary>
);
```

### 2. Use Specific Error Displays for Domain Logic
- Use `AudioErrorDisplay` for audio-related errors
- Use `MIDIErrorDisplay` for MIDI-related errors
- Use generic `ErrorDisplay` for other errors

### 3. Provide Meaningful Error Messages
```jsx
// Good
const errorDetails = {
  type: 'permission_denied',
  userMessage: 'Audio is blocked by your browser. Click anywhere to enable audio.',
  suggestions: [
    'Click anywhere on the page to enable audio',
    'Check browser audio permissions',
    'Ensure your device is not muted'
  ]
};

// Bad
const errorDetails = {
  type: 'unknown',
  userMessage: 'Error occurred',
  suggestions: []
};
```

### 4. Always Provide Fallback Options
```jsx
<AudioErrorDisplay
  audioError={error}
  onRetry={retryAudio}
  onDismiss={() => {
    // Always provide a way to continue
    setContinueWithoutAudio(true);
  }}
/>
```

### 5. Handle Loading States Consistently
```jsx
// Use LoadingWithError for consistent loading/error handling
<LoadingWithError
  isLoading={isLoading}
  error={error}
  errorDetails={errorDetails}
  onRetry={handleRetry}
  loadingText="Loading..."
>
  <Content />
</LoadingWithError>
```

## Styling

All components support custom styling through:
- CSS classes (className prop)
- CSS custom properties for theming
- Responsive design (automatically adapts to screen size)
- Dark mode support (respects prefers-color-scheme)

### Custom Styling Example
```css
.custom-error {
  --error-primary-color: #your-color;
  --error-background: #your-background;
}
```

```jsx
<ErrorDisplay className="custom-error" />
```

## Testing

All error handling components are fully tested. See the test files for examples:
- `ErrorBoundary.test.jsx`
- `ErrorDisplay.test.jsx`
- `LoadingSpinner.test.jsx`
- `ErrorHandling.integration.test.jsx`

### Testing Error States
```jsx
// Test error boundary
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>No error</div>;
};

render(
  <ErrorBoundary>
    <ThrowError shouldThrow={true} />
  </ErrorBoundary>
);
```

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Reduced motion support

## Browser Support

Error handling components work in all modern browsers:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Graceful degradation is provided for older browsers.