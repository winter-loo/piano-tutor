# Piano Tutor React

A modern React application for piano learning, refactored from the original HTML implementation.

## Project Structure

```
src/
├── components/          # React components
│   ├── Controls/       # Tempo and progress controls
│   ├── MIDIControls/   # MIDI device management
│   ├── Overlays/       # Start and ending overlays
│   ├── PianoKeyboard/  # Virtual piano keyboard
│   ├── Staff/          # Musical staff notation
│   ├── StaffContainer/ # Staff container components
│   └── UI/             # Common UI components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── utils/              # Utility functions
├── data/               # Song data and content
├── styles/             # Global styles and variables
└── test/               # Test setup and utilities
```

## Development Setup

### Prerequisites

- Node.js 18+ (current version is too old)
- npm 8+

### Installation

```bash
npm install
```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Tone.js** - Audio synthesis
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality and formatting

## Features

- Virtual piano keyboard with audio feedback
- MIDI device support
- Musical staff notation with playback
- Real-time note tracking and scoring
- Responsive design for mobile and desktop

## Development Guidelines

- Follow the established component structure
- Use Zustand for global state management
- Write tests for all new components and hooks
- Follow ESLint and Prettier configurations
- Use semantic commit messages

## Browser Support

- Chrome 88+ (full Web Audio and MIDI support)
- Firefox 85+ (Web Audio support, limited MIDI)
- Safari 14+ (Web Audio support, no MIDI)
- Edge 88+ (full Web Audio and MIDI support)