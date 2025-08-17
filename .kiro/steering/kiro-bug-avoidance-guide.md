---
inclusion: always
---

---
inclusion: always
---

# Piano Tutor React Development Guidelines

## Development Server
- Never execute `npm run dev` directly - always ask the user to run this command in their terminal
- Wait for user confirmation and port number (typically 3000) before proceeding with development tasks
- Use Playwright for E2E tests with `npm run test:e2e`

## Architecture Patterns
- **Component Structure**: Feature-based organization (Controls, MIDIControls, Overlays, PianoKeyboard, Staff, StaffContainer, UI)
- **State Management**: Zustand stores in `src/stores/` for global state
- **Custom Hooks**: Use existing hooks for complex logic (`useAudioEngine`, `useGameState`, `useMIDI`, `usePerformanceTracking`, `useTouch`)
- **Error Handling**: Always wrap audio/MIDI components in error boundaries

## Code Standards
- **File Naming**: Components use PascalCase, tests use `ComponentName.test.jsx`
- **Exports**: Each component directory must have an `index.js` export file
- **Demo Components**: Keep `*Demo.jsx` files for development testing
- **Props**: Use TypeScript-style prop validation where possible

## Testing Requirements
- Every component must have corresponding test files in `__tests__/` directories
- Use Jest + React Testing Library for unit tests
- E2E tests go in `/e2e/` directory using Playwright
- Integration tests belong in component `__tests__/` folders
- Tasks are incomplete until all tests pass
- Never create markdown test report files

## Styling Guidelines
- **CSS Organization**: Component-specific styles in `.css` files, globals in `src/styles/`
- **Variables**: Use CSS custom properties from `variables.css`
- **Responsive**: Mobile-first design patterns
- **Naming**: Follow BEM-like conventions for CSS classes

## Audio/MIDI Specifics
- **Audio Library**: Tone.js for audio synthesis and playback
- **MIDI Access**: Always request user permission before accessing MIDI devices
- **Context Handling**: Properly initialize and manage AudioContext lifecycle
- **Error States**: Handle audio/MIDI failures gracefully with user feedback

## File Organization Rules
- `src/components/`: Feature-based component directories
- `src/hooks/`: Custom React hooks
- `src/stores/`: Zustand state management
- `src/utils/`: Pure utility functions
- `src/data/`: Static data and configurations
- `src/styles/`: Global CSS files