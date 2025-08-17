import React from 'react';
import './DemoNavigation.css';

const DemoNavigation = () => {
  const demos = [
    {
      name: 'Music Staff',
      path: '?demo=music-staff',
      description: 'Interactive music staff with treble clef and staff lines'
    },
    // Add more demos here as they're created
  ];

  return (
    <div className="demo-navigation">
      <h2>Available Component Demos</h2>
      <div className="demo-grid">
        {demos.map((demo) => (
          <a 
            key={demo.name} 
            href={demo.path} 
            className="demo-card"
          >
            <h3>{demo.name}</h3>
            <p>{demo.description}</p>
          </a>
        ))}
      </div>
      <div className="demo-info">
        <p>
          These demos showcase individual components from the Piano Tutor application.
          Each demo is isolated and can be used for development and testing purposes.
        </p>
      </div>
    </div>
  );
};

export default DemoNavigation;