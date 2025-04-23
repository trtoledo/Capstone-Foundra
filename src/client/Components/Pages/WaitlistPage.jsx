import React from 'react';
import WaitlistForm from '../Forms/WaitlistForm';
import './WaitlistPage.css';

const WaitlistPage = () => {
  return (
    <div className="waitlist-page">
      <div className="waitlist-hero">
        <h1>Join the Foundra Waitlist</h1>
        <p>Get early access to the future of hiring.</p>
      </div>
      <WaitlistForm />
    </div>
  );
};

export default WaitlistPage;
