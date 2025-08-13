import React from 'react';
import StaffNotation from '../StaffNotation';

// Simple test data
const testNotes = [
  { pitch: 'C4', startTime: 0, duration: 1, type: 'quarter', x: 0, y: 100 },
  { pitch: 'D4', startTime: 1, duration: 1, type: 'quarter', x: 50, y: 90 }
];

// Manual testing component - render in browser to verify
const StaffNotationTest = () => {
  console.log('🧪 Testing StaffNotation Component');
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>StaffNotation Component Test</h2>
      
      {/* Test 1: Basic Rendering */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Test 1: Basic Rendering (No Props)</h3>
        <StaffNotation />
      </div>
      
      {/* Test 2: With Notes */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Test 2: With Sample Notes</h3>
        <StaffNotation 
          notes={testNotes}
          currentTime={0}
          isPlaying={false}
          tempo={60}
        />
      </div>
      
      {/* Test 3: Playing State */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Test 3: Playing State</h3>
        <StaffNotation 
          notes={testNotes}
          currentTime={0.5}
          isPlaying={true}
          tempo={90}
          progressPercentage={25}
        />
      </div>
    </div>
  );
};

export default StaffNotationTest;
