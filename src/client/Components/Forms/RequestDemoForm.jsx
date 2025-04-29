import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './RequestDemoForm.css'; // Keep your CSS file

export default function RequestDemoForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    reason: '',
    suggestions: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // NEW

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_ldcvaje',         // <-- your service ID
      'template_aa2hnut',         // <-- internal template ID
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        reason: formData.reason,
        suggestions: formData.suggestions,
      },
      'HQXP8OZKfgUfMhy-D'         // <-- your public key
    )
    .then((response) => {
      console.log('Internal email sent!', response.status, response.text);
      setFormSubmitted(true); 
      setFormData({
        firstName: '',
        lastName: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        reason: '',
        suggestions: '',
      });
    })
    .catch((error) => {
      console.error('FAILED to send internal email...', error);
      alert('Something went wrong. Please try again later.');
    });
  };

  return (
    <div className="request-demo-form-container">
      {formSubmitted ? (
        <div className="success-message">
          Thank you for requesting a demo!  
          <br />
          Our team will reach out to you shortly.
        </div>
      ) : (
        <form className="request-demo-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name*"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name*"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="position"
              placeholder="Position*"
              value={formData.position}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company*"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number*"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            name="reason"
            placeholder="How can Foundra help?*"
            value={formData.reason}
            onChange={handleChange}
            required
          />
          <textarea
            name="suggestions"
            placeholder="Site Improvements? We would love to build you a feature!"
            value={formData.suggestions}
            onChange={handleChange}
          />
          <button type="submit" className="submit-button">Submit Request</button>
        </form>
      )}
    </div>
  );
}


