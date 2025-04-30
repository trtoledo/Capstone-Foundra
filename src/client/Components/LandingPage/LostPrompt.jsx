import React, { useEffect, useRef, useState } from 'react';
import './MarkerPrompt.css';

const LostPrompt = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [drawArrow, setDrawArrow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (trigger) {
      const textTimeout = setTimeout(() => setVisible(true), 4000);
      const arrowTimeout = setTimeout(() => setDrawArrow(true), 5000);
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
      style={{
        marginBottom: '-155px',
        marginLeft: '470px',
        marginRight: '200px',
      }}
    >
      {/* Right-pointing mirrored arrow */}
      <svg
  className={`marker-arrow ${drawArrow ? 'draw' : ''}`}
  viewBox="0 0 300 100"
  width="300"
  height="100"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M240,90 C210,0 160,110 120,50"
    stroke="#DAFFED"
    strokeWidth="3"
    fill="none"
  />
  <polygon points="120,45 105,50 120,55" fill="#DAFFED" />
</svg>

      {/* Text fades in independently */}
      <p
        className={`marker-text right ${visible ? 'fade-in' : ''}`}
        style={{ textAlign: 'right' }}
      >
        Looking for a perfect candidate?
      </p>
    </div>
  );
};

export default LostPrompt;
