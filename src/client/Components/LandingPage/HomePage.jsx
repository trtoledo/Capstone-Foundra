import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foundraLogo from '../../assets/foundra-logo.png';
import FeatureOverview from './FeatureOverview';
import HiringNewsCarousel from './HiringNewsCarousel';
import MarkerPrompt from './MarkerPrompt';
import LostPrompt from './LostPrompt';

import './Homepage.css';

import AboutUs from './AboutUs';
import VideoInterview from '../Video/VideoInterview';
import TopNav from "./TopNav";

const Homepage = () => {
  const fullText = 'Find Passion. Get Hired.';
  const [typedText, setTypedText] = useState('');
  const [markerTrigger, setMarkerTrigger] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setMarkerTrigger(true), 500); // trigger marker after text done
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-layout">
      <div className="homepage-container">
        <div className="hero-f-container">
          <div className="f-top-stem">
            <img src={foundraLogo} alt="Foundra Logo" className="foundra-logo" />
          </div>

          <div className="f-middle-stem">
            <h1 className="typing-text">{typedText}</h1>
            <p className="subtext">
              Foundra helps hiring teams find the candidate they’ve spent too much time searching for.
            </p>
          </div>

          <div className="f-bottom-row">
            <div className="f-button-group">
              <button className="primary-cta" onClick={() => navigate('/get-found')}>Get Found</button>
              <button className="outline-cta" onClick={() => navigate('/lost-hiring')}>I'm Lost</button>
            </div>
            <MarkerPrompt trigger={markerTrigger} />
            <LostPrompt trigger={true} />
          </div>
        </div>

        <FeatureOverview />
        <HiringNewsCarousel />

      </div>
    </div>
  );
};

export default Homepage;





