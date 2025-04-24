import React, { useEffect, useRef, useState } from 'react';
import './MarkerPrompt.css';

const LostPrompt = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [drawArrow, setDrawArrow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (trigger) {
      const textTimeout = setTimeout(() => setVisible(true), 4000); // appears after "perfect candidate"
      const arrowTimeout = setTimeout(() => setDrawArrow(true), 5000); // then draw arrow
      return () => {
        clearTimeout(textTimeout);
        clearTimeout(arrowTimeout);
      };
    }
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className={`marker-container right-side ${visible ? 'visible' : ''}`}
      style={{ marginBottom: '-140px', marginLeft: '550px', right: 0 }}
    >
      <svg
        className={`marker-arrow ${drawArrow ? 'draw' : ''}`}
        viewBox="0 0 400 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M400,90 C300,0 150,110 40,50"
          stroke="#DAFFED"
          strokeWidth="3"
          fill="none"
        />
        <polygon
          points="40,45 25,50 40,55"
          fill="#DAFFED"
        />
      </svg>
      <p className="marker-text" style={{ textAlign: 'right', paddingRight: '1rem' }}>
        Hiring struggles not coming to an end?
      </p>
    </div>
  );
};

export default LostPrompt;