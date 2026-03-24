import React, { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { fetchAPI, submitAPI, updateTimes } from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';

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
