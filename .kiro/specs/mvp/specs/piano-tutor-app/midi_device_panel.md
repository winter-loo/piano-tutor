## GOAL

Redesign the midi device panel.

In the primary user page, only show a settings icon. When a user clicks the icon, the system SHALL
popup a configuration page. In the configuration page, a user can select the available midi devices.

When the midi device is (auto) connected, the settings icon should change its color to indicate a
midi device is connected.

## Rules

When designing:

- Apply modern UI/UX best practices (spacing, typography, alignment, hierarchy, color balance, accessibility).
- Make sure the layout feels balanced and professional while keeping the same color palette and vision.
- Fix awkward placements, improve component consistency and make sure everything looks professional and polished.
- DO NOT BREAK any functionalities

## MIDI Socket Icon Design Specification

### Concept
Design the settings icon as a realistic MIDI device socket (DIN-5 connector) that appears to be physically attached to the virtual piano, simulating the MIDI socket found on real pianos.

### Visual Design
- **Icon Type**: Realistic MIDI DIN-5 socket (round 5-pin connector)
- **Size**: 20-24px diameter to maintain proportional realism with the piano
- **3D Effect**: Subtle depth and shadow to appear recessed into the piano body
- **Materials**: Metallic appearance with subtle reflections and gradients
- **Label**: Small "MIDI" text positioned near the socket (like real pianos)

### Placement and Integration
- **Position**: Attached to the right side or back edge of the virtual piano keyboard container
- **Visual Integration**: Match the piano's color scheme and aesthetic
- **Realistic Proportions**: Scale appropriately to look like an actual MIDI socket on a piano
- **Depth Simulation**: Use CSS shadows and gradients to create recessed appearance

### Connection Status Visualization
- **Disconnected State**: 
  - Empty socket with dark interior
  - Neutral metallic color
  - No cable visible
- **Connected State**: 
  - Small MIDI cable/plug visually inserted into socket
  - Subtle green glow around the connection
  - Portion of cable extending from socket
- **Connecting State**: 
  - Gentle pulse animation suggesting connection establishment
  - Amber/yellow accent color during transition

### Interaction Design
- **Click Area**: Slightly larger than visual socket for accessibility
- **Hover Effect**: Subtle highlight indicating interactivity
- **Tooltip**: "MIDI Device Connection" on hover
- **Animation**: Brief animation when clicked, suggesting popup emerges from piano
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### User Experience Goals
- **Immersive**: Create feeling of interacting with real piano hardware
- **Intuitive**: Natural place to look for MIDI settings (like physical instruments)
- **Seamless**: Integrate naturally with existing piano interface
- **Discoverable**: Clear but not distracting visual presence
- **Realistic**: Maintain authentic piano aesthetic and proportions
