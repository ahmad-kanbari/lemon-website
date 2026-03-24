import React, { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';

/**
 * Simulates fetching available times from an API.
 * Returns a list of time slots for a given date.
 */
export function fetchAPI(date) {
  const times = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  // Seed variation based on day to simulate real API behaviour
  const seed = date ? new Date(date).getDate() : 0;
  return times.filter((_, i) => (i + seed) % 3 !== 0);
}

/**
 * Simulates submitting a booking to an API.
 * Returns true on success, false on failure.
 */
export function submitAPI(formData) {
  // Simulate 95% success rate
  return Math.random() > 0.05;
}

/**
 * Reducer that manages available booking times.
 * Action { type: 'UPDATE_TIMES', date } refreshes available slots for a date.
 * Action { type: 'INIT_TIMES' }          sets the initial slots for today.
 */
export function updateTimes(state, action) {
  switch (action.type) {
    case 'UPDATE_TIMES':
      return fetchAPI(action.date);
    case 'INIT_TIMES':
      return fetchAPI(new Date().toISOString().split('T')[0]);
    default:
      return state;
  }
}

function App() {
  const today = new Date().toISOString().split('T')[0];
  const [availableTimes, dispatch] = useReducer(updateTimes, today, fetchAPI);

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/booking"
            element={
              <BookingPage
                availableTimes={availableTimes}
                dispatch={dispatch}
                submitAPI={submitAPI}
              />
            }
          />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
