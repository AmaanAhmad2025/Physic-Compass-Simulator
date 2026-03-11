# Compass Physics Simulator - Design Document

## Overview
A mobile physics simulator that demonstrates how a compass works by showing the interaction between a central magnet and a draggable compass needle. Users can toggle the magnetic field on/off to see how the compass responds.

## Screen List

### 1. **Simulator Screen** (Main Screen)
The primary interactive screen where all physics simulation occurs.

## Primary Content and Functionality

### Simulator Screen Layout

**Central Magnet:**
- Positioned at the center of the screen
- Visual representation: A red/blue magnetic dipole icon (N and S poles)
- Non-interactive (fixed position)
- Always visible

**Compass Element:**
- Draggable compass needle that can be placed anywhere on the screen
- Visual representation: A circular compass with a red needle pointing toward the magnet
- Behavior: Needle rotates to align with the magnetic field direction
- Touch interaction: Tap and drag to reposition the compass
- Magnetic field influence: When enabled, the needle points toward the magnet

**Magnetic Field Toggle:**
- Button to enable/disable the magnetic field
- Location: Top of the screen in a control panel
- Visual feedback: Button shows current state (ON/OFF)
- When OFF: Compass needle points north (default direction)
- When ON: Compass needle points toward the magnet

**Visual Feedback:**
- Magnetic field lines (optional): Subtle visual representation of the field when enabled
- Compass needle animation: Smooth rotation as it aligns with the field

## Key User Flows

1. **Initial State:**
   - User launches the app
   - Compass appears at a default position (e.g., bottom-right)
   - Magnetic field is OFF by default
   - Compass needle points north (upward)

2. **Enable Magnetic Field:**
   - User taps the "Magnetic Field ON" button
   - Compass needle rotates to point toward the central magnet
   - Visual field lines appear (optional)

3. **Move Compass:**
   - User taps and drags the compass to a new position
   - Compass follows the touch input
   - Needle continuously updates to point toward the magnet (if field is ON)

4. **Disable Magnetic Field:**
   - User taps the "Magnetic Field OFF" button
   - Compass needle returns to pointing north
   - Field lines disappear (if shown)

## Color Choices

- **Primary Brand Color:** #0a7ea4 (Blue - represents magnetism and technology)
- **Magnet North Pole:** #EF4444 (Red)
- **Magnet South Pole:** #4B5563 (Dark Gray)
- **Compass Needle:** #EF4444 (Red for visibility)
- **Background:** #FFFFFF (Light) / #151718 (Dark)
- **Control Panel Background:** #f5f5f5 (Light) / #1e2022 (Dark)
- **Button Active State:** #0a7ea4 (Primary Blue)
- **Button Inactive State:** #9BA1A6 (Muted Gray)

## Physics Model

- **Magnetic Field Direction:** Calculated as the angle from the compass center to the magnet center
- **Compass Needle Rotation:** Smoothly animates to align with the calculated field direction
- **Dragging:** Uses React Native gesture handlers for smooth, responsive touch interaction
- **Animation:** Uses react-native-reanimated for performant needle rotation

## Technical Considerations

- Use `react-native-gesture-handler` for drag interactions
- Use `react-native-reanimated` for smooth needle animations
- Calculate magnetic field direction using basic trigonometry (atan2)
- Update compass needle position in real-time as user drags
- Ensure animations run on the native thread for smooth performance
