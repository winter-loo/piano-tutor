import React from 'react';

function AppTest() {
  console.log('🎹 [APP-TEST] Rendering test app');
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Piano Tutor - Test App</h1>
      <p>This is a test to see if basic React rendering works.</p>
      <p>Current URL: {window.location.href}</p>
      <p>Search params: {window.location.search}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Navigation Test</h2>
        <ul>
          <li><a href="/">Main App</a></li>
          <li><a href="?demo">Demo Index</a></li>
          <li><a href="?demo=music-staff">Music Staff Demo</a></li>
        </ul>
      </div>
    </div>
  );
}

export default AppTest;