import React from "react";
import { useNavigate } from 'react-router-dom';
import "./LostHiring.css";
import { Link } from 'react-router-dom';


const industries = [
  { name: "Technology", image: "/assets/industryCards/technology.png" },
  { name: "Engineering (ME, EE, etc)", image: "/assets/industryCards/engineering.png" },
  { name: "Business Functions", image: "/assets/industryCards/business.png" },
  { name: "Healthcare", image: "/assets/industryCards/healthcare.png" },
  { name: "Financial Institution", image: "/assets/industryCards/finance.png" },
  { name: "Manufacturing", image: "/assets/industryCards/manufacturing.png" },
  { name: "Entertainment", image: "/assets/industryCards/entertainment.png" },
  { name: "Sports", image: "/assets/industryCards/sports.png" },
  { name: "Gaming", image: "/assets/industryCards/gaming.png" },
  { name: "Education", image: "/assets/industryCards/education.png" },
  { name: "Nonprofit", image: "/assets/industryCards/nonprofit.png" },
  { name: "Crypto", image: "/assets/industryCards/crypto.png" }
];

const LostHiring = () => {
  const navigate = useNavigate();

  return (
    <div className="lost-page-wrapper">
      {/* Hero Section */}
      <section className="hero-section modern-hero">
        <div className="hero-left">
          <h1>A Modern Way to Find the Perfect Applicant</h1>
          <p>
            Traditional hiring techniques are not working in 2025. We believe that human talent exists and aligns deeply with your mission and brand... the problem is they are not being found. <br /><br /> Welcome to Foundra.
          </p>
          <div className="cta-button-group">
          <button className="cta-button">
  {/* <Link to="/request-demo">Request a Demo</Link> */}
  <a href="/request-demo" class="cta-button">Request Demo</a>

</button>
            <button
              className="cta-button secondary"
              onClick={() => navigate("/waitlist")}
            >
              Join Waitlist
            </button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="/assets/hiring-team.png"
            alt="Hiring Team"
            className="hero-image"
          />
        </div>
      </section>

      {/* Why Section */}
      <section className="why-section">
        <h2>Why Start with Foundra?</h2>
        <div className="why-grid">
          <div className="why-box">
            <img src="/assets/recorder.png" alt="Time-to-Hire" />
            <h3>You Know Who You Want to Interview</h3>
            <p>
              Watch videos candidates have pre-recorded specifically for you to analyze and hopefully build trust with passionate people. Accelerate your time-to-hire by cutting down on bad initial interviews and miscommunication between departments. Our goal is to solve problems where traditional hiring boards and recruiters fall short.
            </p>
          </div>
          <div className="why-box">
            <img src="/assets/save.png" alt="Retention" />
            <h3>Reduce Turnover, Find your Champion</h3>
            <p>
              Align values from day one. Foundra surfaces candidates who stick — not those just hunting for any job. Finding people who show a strong desire and aptitude to be employed by certain companies equates to finding "The Perfect Hire". We aim to get you back to your regular job function and stop wasting time and hiring budget.
            </p>
          </div>
          <div className="why-box">
            <img src="/assets/view.png" alt="Modern Hiring" />
            <h3>See and Hear Achievements and Desires</h3>
            <p>
              With recent advancements in AI, there is less differentiation in resumes and coverletters. On top of this, when thousands of people apply for roles how are HR and Talent teams expected to find the correct candidates? Foundra helps introduce Talent and Hiring Managers with candidates who 'might know more about their company than they do.'
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="industries-section">
        <h2>Industries We Support</h2>
        <p className="industry-subtext">
          Every industry has its own hiring challenges. We focus on the very beginning, allowing candidates to prove to you why they deserve a chance to get an interview.
        </p>
        <div className="industry-grid">
          {industries.map((industry, idx) => (
            <div className="industry-tile" key={idx}>
              <img
                src={industry.image}
                alt={`${industry.name} industry card`}
                className="industry-card-image"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LostHiring;



