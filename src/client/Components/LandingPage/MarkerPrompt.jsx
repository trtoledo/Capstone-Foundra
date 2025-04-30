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
      style={{ marginBottom: '-95px', marginLeft: '196px' }}
    >
     <svg
  className={`marker-arrow ${drawArrow ? 'draw' : ''}`}
  viewBox="0 0 300 100"
  width="300"
  height="100"
  xmlns="http://www.w3.org/2000/svg"
>

        <path
          d="M60,90 C90,0 140,110 180,50"

          stroke="#DAFFED"
          strokeWidth="3"
          fill="none"
        />
        <polygon
          points="180,45 195,50 180,55"
          fill="#DAFFED"
        />
      </svg>
      <p
  className="marker-text"
  style={{ marginTop: '25px', marginLeft: '-250px' }}
>
  Are you the perfect candidate?
</p>
    </div>
  );
};

export default MarkerPrompt;












