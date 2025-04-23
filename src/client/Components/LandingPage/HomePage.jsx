import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import foundraLogo from '../../assets/foundra-logo.png';
import FeatureOverview from './FeatureOverview';
import HiringNewsCarousel from './HiringNewsCarousel';
import AboutUs from './AboutUs';
import VideoInterview from './VideoInterview';
import TopNav from "./TopNav";

const Homepage = () => {
  const fullText = 'Find Passion. Get Hired.';
  const [typedText, setTypedText] = useState('');
  const navigate = useNavigate(); // 👈 enable navigation

  useEffect(() => {
    let index = 0;

    const type = () => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    };

    const interval = setInterval(type, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-layout">
      <div className="homepage-container">
        <header className="header"></header>

        <div className="centerpiece">
          {/* ✅ Everything inside the translucent box */}
          <div className="logo-wrapper">
            <img src={foundraLogo} alt="Foundra Logo" className="main-logo" />

            <h1 className="headline typing-text">{typedText}</h1>

            <p className="subtext">
              Foundra helps hiring teams find the candidate they’ve spent too much time searching for.
            </p>

            <div className="cta-buttons">
              <button className="primary-cta">Get Found</button>
              <button className="outline-cta" onClick={() => navigate('/lost-hiring')}>
                Lost @ Hiring?
              </button>
            </div>
          </div>
        </div>

        <FeatureOverview />
        <HiringNewsCarousel />
        <AboutUs />
        <VideoInterview />
      </div>
    </div>
  );
};

export default Homepage;


