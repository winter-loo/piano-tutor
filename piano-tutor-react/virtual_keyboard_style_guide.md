# Virtual Piano Keyboard Style Guide

This document defines the exact visual styling and behavior of the virtual piano keyboard based on the original HTML implementation.

## 1. Default Virtual Keyboard Appearance (Page Load)

### White Keys
- **Background Color**: `#ffffff` (pure white)
- **Border**: `1px solid #333333` (dark gray)
- **Dimensions**: 87px wide × 200px tall
- **Border Radius**: `0 0 6px 6px` (rounded bottom corners only)
- **Text Color**: `#666` (medium gray)
- **Font Size**: `12px`
- **Font Weight**: `500`
- **Text Position**: Bottom center with `8px` padding from bottom
- **Z-Index**: `1`

### Black Keys
- **Background Color**: `#333333` (dark gray)
- **Border**: `1px solid #000000` (black)
- **Dimensions**: 49px wide × 130px tall
- **Border Radius**: `0 0 3px 3px` (rounded bottom corners only)
- **Text Color**: `#ffffff` (white)
- **Font Size**: `12px`
- **Position**: Absolute, positioned between white keys
- **Right Offset**: `-25px` (half of black key width to center between white keys)
- **Z-Index**: `2` (above white keys)

### Container
- **Background**: `white`
- **Border Radius**: `8px`
- **Box Shadow**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Padding**: `0 5px`
- **Margin Bottom**: `30px`

## 2. Hover Style on Piano Keys

### White Key Hover
- **Background Color**: `#f0f0f0` (light gray)
- **Transition**: `all 0.1s ease`
- **All other properties remain unchanged**

### Black Key Hover
- **Background Color**: `#555555` (medium gray)
- **Transition**: `all 0.1s ease`
- **All other properties remain unchanged**

## 3. Press Style on Piano Keys (Active/Pressed State)

### White Key Press
- **Background Color**: `#e0e0e0` (darker gray than hover)
- **CSS Class**: `.piano-key.white:active` or `.piano-key.white.pressed`
- **No transform or shadow effects**
- **Immediate visual feedback**

### Black Key Press
- **Background Color**: `#666666` (lighter than default black key)
- **CSS Class**: `.piano-key.black:active` or `.piano-key.black.pressed`
- **No transform or shadow effects**
- **Immediate visual feedback**

## 4. Correct Press Style on Piano Keys

When a correct key is pressed, the key receives **note-specific color coding**:

### Note-Specific Colors
- **C Keys**: `#CE82FF` (light purple) - `.piano-key.correct-C`
- **D Keys**: `#FF9602` (orange) - `.piano-key.correct-D`
- **E Keys**: `#57CD03` (green) - `.piano-key.correct-E`
- **F Keys**: `#CC348E` (magenta) - `.piano-key.correct-F`
- **G Keys**: `#7090FF` (blue) - `.piano-key.correct-G`
- **A Keys**: `#FF87D0` (pink) - `.piano-key.correct-A`
- **B Keys**: `#00CE9C` (teal) - `.piano-key.correct-B`

### Correct Key Properties
- **Text Color**: `white` (for all correct keys)
- **Background**: Note-specific color with `!important` priority
- **Duration**: Temporary feedback, removed after note completion
- **CSS Classes**: Both `.correct-{NoteName}` and base note name (e.g., `correct-C`)

## 5. Incorrect Press Style on Piano Keys

### Incorrect Key Visual Feedback
- **CSS Class**: `.piano-key.incorrect-gray`
- **Base styling**: Position relative
- **Overlay Effect**: Uses `::after` pseudo-element
  - **Content**: Empty string `''`
  - **Position**: Absolute covering entire key (`top: 0, left: 0, right: 0, bottom: 0`)
  - **Background**: `rgba(204, 204, 204, 0.2)` (20% opacity gray overlay)
  - **Border Radius**: Inherits from parent key
  - **Pointer Events**: `none`
  - **Z-Index**: `1`

## 6. Staff Visual Feedback for Incorrect Key Press

When an incorrect piano key is pressed, the following visual feedback occurs on the staff:

### Incorrect Note Element Creation
- **Element**: `<div>` with class `note-rectangle incorrect-note`
- **Background Color**: `#cccccc !important` (light gray)
- **Opacity**: `0.8`
- **Dimensions**: 22px height, width based on note duration (typically eighth note width)
- **Border Radius**: `4px`
- **Position**: Absolute positioning on staff
- **Z-Index**: `20` (above other staff elements)
- **Data Attribute**: `data-incorrect-note="{keyNote}"`

### Incorrect Note Positioning
- **Horizontal Position**: Current playback line position (`xPosition`)
- **Vertical Position**: Based on the incorrect note's pitch using staff positioning system
- **Duration**: Temporary element, removed after a delay
- **Visual Effect**: Appears as a gray note on the staff showing what was incorrectly played

### Staff Note Highlighting (Correct Notes)
- **Correct Note Class**: `.note-rectangle.correct-note`
- **Box Shadow**: `0 0 15px rgba(40, 167, 69, 0.8)` (green glow)
- **Z-Index**: `10`
- **Duration**: Maintained until note completion or feedback removal

## 7. Responsive Behavior

### Mobile Breakpoint (≤768px)
- **White Keys**: 37px wide × 120px tall
- **Black Keys**: 22px wide × 80px tall
- **Black Key Offset**: `-11px` (half of 22px width)

## 8. Timing and Animation

### Transitions
- **All Keys**: `transition: all 0.1s ease`
- **Immediate Feedback**: No delays for press/release states
- **Correct Feedback**: Maintained until note completion
- **Incorrect Feedback**: Temporary overlay, removed after interaction

### State Management
- **Multiple States**: Keys can have multiple classes simultaneously
- **Priority Order**: Correct/Incorrect states override press states
- **Cleanup**: All states properly removed when interaction ends

## 9. CSS Class Hierarchy

### State Classes (in order of specificity)
1. `.piano-key.correct-{NoteName}` (highest priority)
2. `.piano-key.incorrect-gray` or `.piano-key.incorrect`
3. `.piano-key.active`
4. `.piano-key.pressed`
5. `.piano-key:hover`
6. Base `.piano-key.white` or `.piano-key.black`

### Important Notes
- Correct and incorrect states use `!important` to override other styles
- Color-specific classes are applied based on the base note name (C, D, E, F, G, A, B)
- Octave numbers are stripped when determining color classes
- Visual feedback is synchronized between keyboard and staff elements