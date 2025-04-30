import React from 'react';
import './AboutUs.css';

const team = [
  {
    name: 'Isabell Ventouris',
    title: 'Developer',
    frontImage: '/assets/team/isabell-box.png',
    backImage: '/assets/team/isabell-photo.jpg',
    skills: 'Frontend development, UI/UX, React.js',
    linkedin: 'https://www.linkedin.com/in/isabell-sophie-ventouris/'
  },
  {
    name: 'Tomas Toledo',
    title: 'Developer',
    frontImage: '/assets/team/tomas-box.png',
    backImage: '/assets/team/tomas-photo.jpg',
    skills: 'Backend systems, APIs, DevOps, Node.js',
    linkedin: 'https://www.linkedin.com/in/tomas-toledo-00226883/'
  },
  {
    name: 'Dan Sealy',
    title: 'Developer',
    frontImage: '/assets/team/dan-box.png',
    backImage: '/assets/team/dan-photo.jpg',
    skills: 'Cloud architecture, security, database optimization',
    linkedin: 'https://www.linkedin.com/in/dan-sealy/'
  },
  {
    name: 'Cole Whitehurst',
    title: 'Developer',
    frontImage: '/assets/team/cole-box.png',
    backImage: '/assets/team/cole-photo.jpg',
    skills: 'Design systems, motion graphics, branding',
    linkedin: 'https://www.linkedin.com/in/cole-whitehurst/'
  },
  {
    name: 'Jeff Nasser',
    title: 'Developer',
    frontImage: '/assets/team/jeff-box.png',
    backImage: '/assets/team/jeff-photo.jpg',
    skills: 'Go-To-Market and Business Development specialist - Pursuing becoming a Jr. programmer focusing in React.js, Node.js, Express.js, PostgreSQL, Git, and UI/UX Principles.',
    linkedin: 'https://www.linkedin.com/in/jeff-nasser-a2617157/'
  },
];

export default function AboutUs() {
  return (
    <section className="aboutus-section spaced">
      <h2 className="aboutus-title">Meet the Team</h2>
      <div className="aboutus-grid">
        {team.map((member, index) => (
          <div key={index} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={member.frontImage}
                  alt={`${member.name} box art`}
                  className="card-image"
                />
              </div>
              <div className="flip-card-back">
                <img
                  src={member.backImage}
                  alt={`${member.name} portrait`}
                  className="profile-photo"
                />
                <h4>{member.name}</h4>
                <p className="skills">{member.skills}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="linkedin-badge"
                  >
                    <img src="/assets/linkedin-icon.svg" alt="LinkedIn" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


