import React, { useState } from "react";
import "./FeatureOverview.css";
import { useNavigate } from 'react-router-dom';

const features = [
  {
    id: 1,
    title: "01 Passion-first job matching",
    content: "Foundra uses short intro videos and context-rich profiles to match talent with teams who value their passion as much as their skills.",
    screencap: "/assets/screens/passion-matching.png",
    link: "/how-it-works#matching",
  },
  {
    id: 2,
    title: "02 Curated hiring feeds",
    content: "Hiring managers get curated feeds of energized, qualified candidates who’ve gone the extra mile to stand out.",
    screencap: "/assets/screens/hiring-feeds.png",
    link: "/how-it-works#feeds",
  },
  {
    id: 3,
    title: "03 Built-in screening & discovery",
    content: "Our async video platform pre-screens candidates so you can focus on culture and fit.",
    screencap: "/assets/screens/screening.png",
    link: "/how-it-works#screening",
  },
  {
    id: 4,
    title: "04 Human-centered design",
    content: "Our UI puts people first — not resumes. You see stories, voices, and skills brought to life.",
    screencap: "/assets/screens/ui.png",
    link: "/how-it-works#design",
  },
  {
    id: 5,
    title: "05 Smart tagging",
    content: "Videos, resumes, and interactions are tagged with role relevance and passion indicators for smarter filtering.",
    screencap: "/assets/screens/tagging.png",
    link: "/how-it-works#metadata",
  },
  {
    id: 6,
    title: "06 Modern async communication",
    content: "Video replies and contextual notes make it easy to collaborate across teams and move fast on top talent.",
    screencap: "/assets/screens/async.png",
    link: "/how-it-works#async",
  },
];

export default function FeatureOverview() {
  const [activeFeature, setActiveFeature] = useState(1);
  const navigate = useNavigate();

  const handleClick = () => {
    const link = features.find((f) => f.id === activeFeature)?.link;
    if (link) navigate(link);
  };

  const handleNext = () => {
    setActiveFeature((prev) => (prev < features.length ? prev + 1 : 1));
  };

  const handlePrev = () => {
    setActiveFeature((prev) => (prev > 1 ? prev - 1 : features.length));
  };

  const active = features.find((f) => f.id === activeFeature);

  return (
    <section className="feature-overview-container">
      <div className="text-content">
        <h2>
        <span className="gradient-text">LinkedIn is Broken.</span><br />
  Foundra is a Different & <br />
  Better Way to Align Interviews
        </h2>
        <p className="feature-subtext">
          Everything you need to help passionate job seekers connect with hiring managers — with less friction and more humanity.
        </p>

        <div className="feature-list">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-item ${activeFeature === feature.id ? "active" : ""}`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className="feature-title">{feature.title}</div>
              {activeFeature === feature.id && (
                <div className="feature-content">{feature.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="visual-preview">
        <div className="mock-ui-box feature-image-wrapper">
          <img
            src={active?.screencap}
            alt={`Preview for ${active?.title}`}
            className="mock-image"
          />
         
        </div>
        <div className="feature-nav-right">
            <button className="arrow-btn" onClick={handlePrev}>←</button>
            <button className="arrow-btn" onClick={handleNext}>→</button>
          </div>
      </div>
    </section>
  );
}





