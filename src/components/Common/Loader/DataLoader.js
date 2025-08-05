import React from 'react';
import './DataLoader.scss';  

const DataLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
    </div>
  );
};

export default DataLoader;
