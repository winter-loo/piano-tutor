import React from 'react';
import MusicStaff from './MusicStaff';

const MusicStaffDemo = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Music Staff Component Demo</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Default Staff</h3>
        <MusicStaff />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Staff with Custom Class</h3>
        <MusicStaff className="custom-staff" />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Responsive Staff (resize window to test)</h3>
        <div style={{ maxWidth: '400px', border: '1px solid #ccc', padding: '10px' }}>
          <MusicStaff />
        </div>
      </div>
    </div>
  );
};

export default MusicStaffDemo;