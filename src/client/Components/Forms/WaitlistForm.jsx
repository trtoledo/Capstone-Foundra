import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './WaitlistForm.css'; 


const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const SERVICE_ID = 'service_ldcvaje';
  const TEMPLATE_USER_ID = 'template_cu6btcm';
  const TEMPLATE_ADMIN_ID = 'template_gy7ulw6';
  const PUBLIC_KEY = 'HQXP8OZKfgUfMhy-D';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const templateParams = {
      user_email: email,
      name: name || 'there',
    };

    try {
     
      await emailjs.send(SERVICE_ID, TEMPLATE_USER_ID, templateParams, PUBLIC_KEY);

     
      await emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, templateParams, PUBLIC_KEY);

      setStatus('success');
      setEmail('');
      setName('');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="waitlist-wrapper">
      <h3>One Step Away!</h3>
      <form onSubmit={handleSubmit} className="waitlist-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Join Waitlist'}
        </button>
      </form>

      {status === 'success' && <p className="success-msg">✅ You're on the waitlist! Confirmation email inbound.</p>}
      {status === 'error' && <p className="error-msg">❌ Something went wrong. Please try again.</p>}
    </div>
  );
};

export default WaitlistForm;

