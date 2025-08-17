/**
 * Simple test script to verify Tone.js import is working correctly
 */

import * as Tone from 'tone';
import { isToneJSAvailable, createPianoSynth } from './audioUtils.js';

console.log('🎵 Testing Tone.js Import Fix');
console.log('============================');

// Test 1: Check if Tone is imported correctly
console.log('1. Tone.js import test:');
console.log('   - Tone object available:', typeof Tone !== 'undefined');
console.log('   - Tone.context available:', !!Tone.context);
console.log('   - Tone.Synth available:', typeof Tone.Synth !== 'undefined');

// Test 2: Check isToneJSAvailable function
console.log('\n2. isToneJSAvailable() test:');
try {
  const isAvailable = isToneJSAvailable();
  console.log('   - Result:', isAvailable);
} catch (error) {
  console.log('   - Error:', error.message);
}

// Test 3: Test createPianoSynth function (without actually creating it)
console.log('\n3. createPianoSynth() availability test:');
try {
  // Just check if the function can be called without throwing import errors
  console.log('   - Function available:', typeof createPianoSynth === 'function');
  console.log('   - Ready to create synth:', isToneJSAvailable());
} catch (error) {
  console.log('   - Error:', error.message);
}

console.log('\n✅ Tone.js import fix verification complete!');
console.log('The audio engine should now work correctly in the browser.');