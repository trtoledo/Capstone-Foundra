// src/components/HiringNewsCarousel.jsx
import React, { useEffect, useState } from 'react';
import './HiringNewsCarousel.css';

const CATEGORY_KEYWORDS = {
  Technology: 'software OR cloud OR SaaS OR computer OR business technology OR cybersecurity OR AI OR IT OR digital transformation OR startup OR platform',
  Engineering: 'engineering OR mechanical engineering OR electrical engineering OR robotics OR automation OR CAD OR infrastructure OR industrial design OR manufacturing',
  Healthcare: 'healthcare OR hospital OR nursing OR biotech OR pharmaceutical OR medical OR patient OR diagnostics OR clinical trials OR wellness',
  'Financial Institution': 'bank OR finance OR fintech OR investment OR blockchain OR cryptocurrency OR investing OR stocks OR mergers OR valuation OR venture',
  Insurance: 'insurance OR underwriting OR actuary OR claims OR risk management OR insurtech OR coverage OR premiums',
  Manufacturing: 'manufacturing OR factory OR production OR logistics OR supply chain OR assembly OR industry OR operations OR exports',
  Entertainment: 'entertainment OR media OR gaming OR film OR television OR streaming OR music OR box office OR creative industry',
  Sports: 'sports OR sponsorship OR athlete deals OR stadium ORbmarketing OR tech OR franchise',
  Gaming: 'developer OR video game OR gaming OR esports OR studios OR launch OR online OR development OR virtual',
};

export default function HiringNewsCarousel() {
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState('Technology');

  useEffect(() => {
    const fetchIndustryNews = async () => {
      try {
        const keywords = CATEGORY_KEYWORDS[category] || 'business';
        const query = encodeURIComponent(`(${keywords})`);

        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${query}&lang=en&max=100&token=5f1ecc534b653ae26871697a63a58e24`
        );

        const data = await res.json();
        const articles = data.articles || [];

        const uniqueTitles = new Set();
        const filtered = articles.filter((article) => {
          const isUnique = !uniqueTitles.has(article.title);
          if (isUnique) {
            uniqueTitles.add(article.title);
            return true;
          }
          return false;
        });

        setStories(filtered.slice(0, 30));
      } catch (error) {
        console.error('Error fetching industry news:', error);
      }
    };

    fetchIndustryNews();
  }, [category]);

  return (
    <div className="carousel-border-wrapper">
      <section className="carousel-wrapper">
        <h2 className="carousel-title">{category} News & Trends</h2>

        <div className="category-filter">
          <label htmlFor="category-select">Filter by Industry:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {Object.keys(CATEGORY_KEYWORDS).map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        <div className="carousel-track">
          {stories.map((story, index) => (
            <a
              key={index}
              href={story.url}
              className="news-card"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={story.image || '/assets/placeholder.png'}
                alt={story.title}
              />
              <div className="card-title">{story.title}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}









