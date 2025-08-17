import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = null,
  className = '',
  ...props 
}) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;
  
  return (
    <div className={`loading-spinner-container ${className}`} {...props}>
      <div className={`loading-spinner ${sizeClass} ${colorClass}`} />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
