import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/**
 * Landing page: hero, highlights, specials, testimonials, and about section.
 */
function HomePage() {
  const specials = [
    {
      id: 1,
      name: 'Greek Salad',
      price: '$12.99',
      description:
        'The famous salad of crispy lettuce, peppers, olives, and our Chicago-style feta cheese, garnished with crunchy garlic and rosemary croutons.',
      emoji: '🥗',
    },
    {
      id: 2,
      name: 'Bruschetta',
      price: '$5.99',
      description:
        'Our bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil. Topped with tomatoes.',
      emoji: '🍞',
    },
    {
      id: 3,
      name: 'Lemon Dessert',
      price: '$5.00',
      description:
        'This comes straight from grandma's recipe book — every last ingredient has been sourced and is as authentic as can be imagined.',
      emoji: '🍋',
    },
  ];

  const testimonials = [
    { id: 1, name: 'Maria G.',    rating: 5, text: 'Absolutely fantastic food and atmosphere. The bruschetta was divine!' },
    { id: 2, name: 'James K.',    rating: 5, text: 'The best Mediterranean food in Chicago. We come here every anniversary.' },
    { id: 3, name: 'Sophie R.',   rating: 4, text: 'Lovely ambience, attentive staff, and the lemon dessert is a must-try.' },
    { id: 4, name: 'Carlos M.',   rating: 5, text: 'Great for a business dinner. Booking was easy and the table was perfect.' },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1 id="hero-heading" className="hero__title">Little Lemon</h1>
            <p className="hero__location">Chicago</p>
            <p className="hero__desc">
              We are a family-owned Mediterranean restaurant focused on traditional
              recipes served with a modern twist. Come taste the authentic flavours
              of the Mediterranean right here in Chicago.
            </p>
            <Link to="/booking" className="btn btn-primary" aria-label="Reserve a table at Little Lemon">
              Reserve a Table
            </Link>
          </div>
          <div className="hero__image" aria-hidden="true">
            <span className="hero__emoji">🍽️</span>
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="highlights" aria-labelledby="highlights-heading">
        <div className="container">
          <h2 id="highlights-heading" className="section-title">This week's specials!</h2>
          <p className="section-subtitle">
            Fresh, seasonal ingredients prepared with care every day.
          </p>

          <ul className="specials-grid" role="list">
            {specials.map((item) => (
              <li key={item.id} className="special-card">
                <div className="special-card__image" aria-hidden="true">
                  <span>{item.emoji}</span>
                </div>
                <div className="special-card__body">
                  <div className="special-card__header">
                    <h3>{item.name}</h3>
                    <span className="special-card__price">{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                  <a href="#menu" className="special-card__link">
                    Order a delivery →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="container">
          <h2 id="testimonials-heading" className="section-title">What our guests say</h2>
          <ul className="testimonials-grid" role="list">
            {testimonials.map((t) => (
              <li key={t.id} className="testimonial-card">
                <div
                  className="testimonial-card__stars"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {'★'.repeat(t.rating)}
                  {'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <p className="testimonial-card__name">— {t.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="about" aria-labelledby="about-heading">
        <div className="container about__inner">
          <div className="about__text">
            <h2 id="about-heading" className="section-title">About Little Lemon</h2>
            <p>
              Little Lemon is owned by two Italian brothers, Mario and Adrian, who
              moved to the United States to pursue their shared dream of owning a
              restaurant. To craft the menu, Mario relies on family recipes and his
              experience as a chef in Italy. Adrian does all the marketing for the
              restaurant and loves sharing his Italian-Mediterranean heritage through
              the menu.
            </p>
            <p>
              The restaurant opened its doors in 2020 and has been thriving thanks
              to its warm atmosphere, consistent quality, and dedication to fresh
              produce sourced from local Chicago farms.
            </p>
          </div>
          <div className="about__image" aria-hidden="true">
            <span className="about__emoji">👨‍🍳</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
