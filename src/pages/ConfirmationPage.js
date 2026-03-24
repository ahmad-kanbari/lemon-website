import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ConfirmationPage.css';

/**
 * Shows a summary of the confirmed booking.
 * Booking data is received via React Router location state.
 */
function ConfirmationPage() {
  const { state } = useLocation();
  const booking = state?.booking;

  // Guard: if user lands here directly with no state, show a helpful message
  if (!booking) {
    return (
      <div className="confirmation-page">
        <div className="container confirmation-page__inner">
          <h1>No booking found</h1>
          <p>It looks like you arrived here without a completed booking.</p>
          <Link to="/booking" className="btn btn-primary">
            Make a reservation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page" aria-labelledby="confirmation-heading">
      <div className="container confirmation-page__inner">
        <div className="confirmation-icon" aria-hidden="true">✅</div>

        <h1 id="confirmation-heading" className="confirmation-title">
          Booking Confirmed!
        </h1>
        <p className="confirmation-subtitle">
          Thank you, <strong>{booking.firstName} {booking.lastName}</strong>! Your
          table has been reserved. A confirmation will be sent to{' '}
          <strong>{booking.email}</strong>.
        </p>

        {/* Booking details summary */}
        <section
          className="confirmation-details"
          aria-label="Booking details"
        >
          <h2>Your reservation details</h2>
          <dl>
            <dt>Date</dt>
            <dd>
              <time dateTime={booking.date}>
                {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year:    'numeric',
                  month:   'long',
                  day:     'numeric',
                })}
              </time>
            </dd>

            <dt>Time</dt>
            <dd>{booking.time}</dd>

            <dt>Guests</dt>
            <dd>{booking.guests}</dd>

            {booking.occasion && (
              <>
                <dt>Occasion</dt>
                <dd>{booking.occasion}</dd>
              </>
            )}

            <dt>Seating</dt>
            <dd>{booking.seatingPreference}</dd>

            {booking.specialRequests && (
              <>
                <dt>Special requests</dt>
                <dd>{booking.specialRequests}</dd>
              </>
            )}

            {booking.phone && (
              <>
                <dt>Phone</dt>
                <dd>{booking.phone}</dd>
              </>
            )}
          </dl>
        </section>

        <p className="confirmation-note">
          Need to change or cancel? Call us at{' '}
          <a href="tel:+13125550187">(312) 555-0187</a> at least 2 hours in advance.
        </p>

        <div className="confirmation-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
          <Link to="/booking" className="btn btn-primary">
            Make another booking
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
