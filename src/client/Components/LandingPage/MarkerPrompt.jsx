import React, { useEffect, useRef, useState } from 'react';
import './MarkerPrompt.css';

const MarkerPrompt = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [drawArrow, setDrawArrow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (trigger) {
      const textTimeout = setTimeout(() => setVisible(true), 2000); 
      const arrowTimeout = setTimeout(() => setDrawArrow(true), 3000); 
      return () => {
        clearTimeout(textTimeout);
        clearTimeout(arrowTimeout);
      };
    }
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className={`marker-container ${visible ? 'visible' : ''}`}
      style={{ marginBottom: '-95px', marginLeft: '-16px' }}
    >
      <svg
        className={`marker-arrow ${drawArrow ? 'draw' : ''}`}
        viewBox="0 0 400 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,90 C100,0 250,110 360,50"
          stroke="#DAFFED"
          strokeWidth="3"
          fill="none"
        />
        <polygon
          points="360,45 375,50 360,55" 
          fill="#DAFFED"
        />
      </svg>
      <p className="marker-text">Are you a perfect applicant? </p>
    </div>
  );
};

export default MarkerPrompt;












