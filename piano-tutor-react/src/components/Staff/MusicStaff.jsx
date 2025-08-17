import React from 'react';
import './MusicStaff.css';
import trebleClefSvg from '../../assets/treble-clef.svg';

const MusicStaff = ({ className = '', ...props }) => {
  return (
    <div className={`music-staff ${className}`} {...props}>
      <svg 
        width="631" 
        height="294" 
        viewBox="0 0 631 294"
        className="music-staff__svg"
      >
        {/* Background */}
        <rect width="631" height="294" fill="#FFFFFF" />
        
        {/* Staff Lines */}
        <line x1="59" y1="95.3" x2="577.01" y2="95.3" stroke="#000000" strokeWidth="1" />
        <line x1="59" y1="123.61" x2="577" y2="123.61" stroke="#000000" strokeWidth="1" />
        <line x1="58.99" y1="152.44" x2="577.01" y2="152.44" stroke="#000000" strokeWidth="1" />
        <line x1="58.99" y1="182.31" x2="577.01" y2="182.31" stroke="#000000" strokeWidth="1" />
        <line x1="58.99" y1="211.92" x2="577.01" y2="211.92" stroke="#000000" strokeWidth="1" />
        
        {/* Treble Clef */}
        <image 
          x="59" 
          y="60" 
          width="69.66" 
          height="189.06" 
          href={trebleClefSvg}
        />
      </svg>
    </div>
  );
};

export default MusicStaff;