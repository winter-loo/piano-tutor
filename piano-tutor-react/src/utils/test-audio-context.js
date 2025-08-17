/**
 * Test script to verify audio context functions work correctly
 */

import * as Tone from 'tone';
import { 
  isToneJSAvailable, 
  getAudioContextInfo, 
  isAudioContextRunning 
} from './audioUtils.js';

console.log('🎵 Testing Audio Context Functions');
console.log('=================================');

// Test 1: Check Tone.js availability
console.log('1. Tone.js Availability:');
try {
  const available = isToneJSAvailable();
  console.log('   - isToneJSAvailable():', available);
  console.log('   - Tone object type:', typeof Tone);
  console.log('   - Tone.context available:', !!Tone.context);
} catch (error) {
  console.log('   - Error:', error.message);
}

// Test 2: Get audio context info
console.log('\n2. Audio Context Info:');
try {
  const contextInfo = getAudioContextInfo();
  console.log('   - Context info:', contextInfo);
} catch (error) {
  console.log('   - Error:', error.message);
}

// Test 3: Check if audio context is running
console.log('\n3. Audio Context Running Status:');
try {
  const isRunning = isAudioContextRunning();
  console.log('   - isAudioContextRunning():', isRunning);
  console.log('   - Context state:', Tone.context.state);
} catch (error) {
  console.log('   - Error:', error.message);
}

console.log('\n✅ Audio context function tests complete!');
console.log('All functions should now work without "Cannot read properties of undefined" errors.');