import React from "react";
import "./GetFound.css";
import lostOffice from "/public/lost-office.png";

export default function GetFound() {
  return (
    <section className="getfound-container">
      <div className="getfound-hero">
        <h1 className="getfound-title">Rethink How You Get Hired</h1>
        <p className="getfound-subtext">
          Traditional ways of initializing interviews with resumes and cover
          letters are outdated. Foundra empowers candidates to record
          personalized videos, showcasing their personality, skills, and
          motivation — all sent directly to decision-makers.
        </p>
      </div>

      <div className="getfound-steps">
        <h2 className="section-heading how-to-get-found-heading">
          How to Get Found
        </h2>
        <div className="steps-container">
          <div className="steps-column">
            <div className="steps-row">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Create Your Profile & Video</h3>
                <p>
                  Create your Profile. Then use Foundra’s built-in video
                  recorder to showcase your strengths, values, and desires. What
                  is the perfect company you would thrive in?
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Submit & Select</h3>
                <p>
                  Choose who your video pitch is seen by. Wether it is a
                  specific company or an industry or field, Foundra gives you
                  another tool to land the interview you most dream of.
                </p>
              </div>
            </div>
            <div className="steps-row">
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Be Seen, and Heard</h3>
                <p>
                  With the ease of applying on online job boards and the
                  increase in AI usage; the initial phase of the hiring process
                  has been disturbed. We aim to humanize the experiance and
                  build trust between applicants and companies.
                </p>
              </div>
              <div className="step-card">
                <div
                  className="step-number"
                  style={{ backgroundColor: "#8E44AD" }}
                >
                  4
                </div>
                <h3 className="step-title">
                  Get Feedback & Land an Interview!
                </h3>
                <p>
                  As your unique talents are showcased in video form, from your
                  profile you can engage with feedback from hiring teams and
                  move towards interview opportunities.
                </p>
              </div>
            </div>
          </div>
          <div className="steps-image">
            <img src={lostOffice} alt="Office Scene" />
            <p className="image-subtext">
              We understand it takes extra time and attention to building your
              video. Foundra provides an outside the box method of getting your
              unique talents and desires noticed when submitting your resume,
              working with recruiters, and DM'ing hiring teams do not work.
            </p>
          </div>
        </div>
      </div>

      {/* 3-column Grid Feature Section */}
      <div className="feature-columns-wrapper">
        <div className="feature-column">
          <h2 className="section-heading">Why It Works</h2>
          <div className="feature-card">
            <div className="feature-title-container">Stand Out Instantly</div>
            <p className="feature-description">
              Resumes blur together. Your video brings your story to life and
              grabs the attention of talent teams.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-title-container">Target Companies</div>
            <p className="feature-description">
              Choose the companies you want to work for. We'll help get your
              video seen by real hiring managers.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-title-container">
              Better Than a Cover Letter
            </div>
            <p className="feature-description">
              Tell your story, explain your passion, and show you're the perfect
              culture fit — faster and more authentically.
            </p>
          </div>
        </div>

        <div className="feature-column">
          <h2 className="section-heading">The Dashboard</h2>
          <div className="feature-card">
            <div className="feature-title-container">Easy to Use</div>
            <p className="feature-description">
              See all your video submissions, track companies you've reached out
              to, and respond to comments on your profile — all in one place.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-title-container">Unified</div>
            <p className="feature-description">
              Our modern interface makes it simple to monitor your engagement
              and tailor your outreach to build trust with employers.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-title-container">Complete Picture</div>
            <p className="feature-description">
              View your impact with insights into views, interactions, and
              messages across companies you're targeting.
            </p>
          </div>
        </div>

        <div className="feature-column">
          <h2 className="section-heading">Privacy & Security</h2>
          <div className="feature-card">
            <div className="feature-title-container">Privacy</div>
            <p className="feature-description">
              Control who sees your content. No video is public or searchable
              without your explicit permission.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-title-container">Encryption</div>
            <p className="feature-description">
              All videos and profile data are securely stored and encrypted to
              keep your story protected.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-title-container">Permissions</div>
            <p className="feature-description">
              Set company-level visibility rules so only approved employers can
              access your profile and recordings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
