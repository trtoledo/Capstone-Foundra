import React from 'react';
import RequestDemoForm from '../Forms/RequestDemoForm';
import './RequestDemoPage.css';

export default function RequestDemoPage() {
  return (
    <section className="request-demo-page">
      <div className="left-content">
        <h1 className="page-heading">Find Better Talent, Faster</h1>
        <p className="page-subtext">
          Our platform helps you connect with passionate candidates, humanize the hiring process,
          and make smarter hires — faster.
        </p>
        <ul className="benefits-list">
          <li>✔️ Showcase your company culture</li>
          <li>✔️ Screen candidates faster</li>
          <li>✔️ Build a trusted talent pipeline</li>
          <li>✔️ Save time and hire better</li>
        </ul>
      </div>

      <div className="right-content">
        <RequestDemoForm />
      </div>
    </section>
  );
}
