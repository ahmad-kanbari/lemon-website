import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import './BookingPage.css';

/**
 * Page that hosts the BookingForm.
 * On successful submission it navigates to the confirmation page,
 * passing the booking details via router state.
 */
function BookingPage({ availableTimes, dispatch, submitAPI }) {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    const success = submitAPI(formData);
    if (success) {
      navigate('/confirmation', { state: { booking: formData } });
    }
    return success;
  };

  return (
    <div className="booking-page">
      <div className="container">
        <header className="booking-page__header">
          <h1 className="section-title">Reserve a Table</h1>
          <p className="section-subtitle">
            Book your perfect table at Little Lemon — we'll take care of the rest.
          </p>
        </header>

        <BookingForm
          availableTimes={availableTimes}
          dispatch={dispatch}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default BookingPage;
