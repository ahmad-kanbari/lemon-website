import React, { useState } from 'react';
import './BookingForm.css';

/**
 * Validate a single field and return an error string, or '' if valid.
 */
export function validateField(name, value, formData = {}) {
  switch (name) {
    case 'date': {
      if (!value) return 'Please select a date.';
      const selected = new Date(value);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) return 'Date cannot be in the past.';
      return '';
    }
    case 'time':
      return value ? '' : 'Please select an available time.';
    case 'guests': {
      const n = Number(value);
      if (!value)    return 'Number of guests is required.';
      if (n < 1)     return 'At least 1 guest is required.';
      if (n > 10)    return 'Maximum 10 guests per booking.';
      if (!Number.isInteger(n)) return 'Must be a whole number.';
      return '';
    }
    case 'occasion':
      return ''; // optional
    case 'firstName':
      return value.trim() ? '' : 'First name is required.';
    case 'lastName':
      return value.trim() ? '' : 'Last name is required.';
    case 'email': {
      if (!value.trim()) return 'Email address is required.';
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRe.test(value) ? '' : 'Please enter a valid email address.';
    }
    case 'phone': {
      if (!value.trim()) return '';
      const phoneRe = /^\+?[\d\s\-().]{7,20}$/;
      return phoneRe.test(value) ? '' : 'Please enter a valid phone number.';
    }
    case 'seatingPreference':
      return '';
    case 'specialRequests':
      return value.length <= 300 ? '' : 'Maximum 300 characters.';
    default:
      return '';
  }
}

const OCCASIONS = ['Birthday', 'Anniversary', 'Business Dinner', 'Date Night', 'Other'];
const SEATING   = ['Indoor', 'Outdoor', 'No preference'];

const INITIAL_STATE = {
  date:              '',
  time:              '',
  guests:            2,
  occasion:          '',
  firstName:         '',
  lastName:          '',
  email:             '',
  phone:             '',
  seatingPreference: 'No preference',
  specialRequests:   '',
};

/**
 * Multi-step booking form for table reservations.
 * Step 1 – Date, time, guests, occasion.
 * Step 2 – Contact details and preferences.
 */
function BookingForm({ availableTimes, dispatch, onSubmit }) {
  const [formData, setFormData]   = useState(INITIAL_STATE);
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [step, setStep]           = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Today in YYYY-MM-DD for the min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  /* ── Helpers ── */
  const setError = (name, msg) =>
    setErrors((prev) => ({ ...prev, [name]: msg }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setError(name, validateField(name, value, formData));
    }
    // When date changes, ask the reducer for fresh times
    if (name === 'date') {
      dispatch({ type: 'UPDATE_TIMES', date: value });
      // Reset selected time if the slot may no longer be available
      setFormData((prev) => ({ ...prev, date: value, time: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setError(name, validateField(name, value, formData));
  };

  /* Validate all fields for a given step; returns true if clean */
  const validateStep = (stepNumber) => {
    const fields =
      stepNumber === 1
        ? ['date', 'time', 'guests']
        : ['firstName', 'lastName', 'email', 'phone', 'specialRequests'];

    const newErrors = {};
    const newTouched = {};
    fields.forEach((f) => {
      newTouched[f] = true;
      newErrors[f] = validateField(f, formData[f], formData);
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(1)) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitting(true);
    // Small delay to mimic network request
    await new Promise((res) => setTimeout(res, 400));
    const success = onSubmit(formData);
    setSubmitting(false);
    if (!success) {
      setErrors((prev) => ({
        ...prev,
        _form: 'Booking failed. Please try again or call us directly.',
      }));
    }
  };

  /* Reusable labelled input helper */
  const Field = ({
    id, label, required, hint, children, error,
  }) => (
    <div className={`form-group${error ? ' form-group--error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <section className="booking-form-wrapper" aria-label="Table booking form">
      {/* Progress indicator */}
      <ol className="stepper" aria-label="Booking steps">
        {['Reservation details', 'Your information'].map((label, i) => (
          <li
            key={label}
            className={`stepper__step${step === i + 1 ? ' stepper__step--active' : ''}${step > i + 1 ? ' stepper__step--done' : ''}`}
            aria-current={step === i + 1 ? 'step' : undefined}
          >
            <span className="stepper__num" aria-hidden="true">{i + 1}</span>
            <span className="stepper__label">{label}</span>
          </li>
        ))}
      </ol>

      {/* Global form error */}
      {errors._form && (
        <p className="form-error-banner" role="alert">
          {errors._form}
        </p>
      )}

      <form
        onSubmit={step === 1 ? handleNext : handleSubmit}
        noValidate
        aria-label={step === 1 ? 'Reservation details' : 'Contact information'}
      >
        {/* ── Step 1 ── */}
        {step === 1 && (
          <fieldset>
            <legend className="fieldset-legend">Reservation Details</legend>

            <Field
              id="date"
              label="Date"
              required
              error={touched.date && errors.date}
            >
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                min={todayStr}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-describedby={errors.date ? 'date-error' : undefined}
                aria-invalid={!!(touched.date && errors.date)}
              />
            </Field>

            <Field
              id="time"
              label="Time"
              required
              error={touched.time && errors.time}
              hint={
                !formData.date
                  ? 'Select a date first to see available times.'
                  : availableTimes.length === 0
                  ? 'No times available for this date.'
                  : undefined
              }
            >
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-describedby={
                  [errors.time ? 'time-error' : '', !formData.date ? 'time-hint' : '']
                    .filter(Boolean)
                    .join(' ') || undefined
                }
                aria-invalid={!!(touched.time && errors.time)}
                disabled={!formData.date || availableTimes.length === 0}
              >
                <option value="">-- Select time --</option>
                {availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="guests"
              label="Number of guests"
              required
              error={touched.guests && errors.guests}
            >
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                min={1}
                max={10}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-describedby={errors.guests ? 'guests-error' : undefined}
                aria-invalid={!!(touched.guests && errors.guests)}
              />
            </Field>

            <Field
              id="occasion"
              label="Occasion"
              error={touched.occasion && errors.occasion}
            >
              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">-- None --</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>

            <button type="submit" className="btn btn-primary btn--full">
              Next: Contact Details →
            </button>
          </fieldset>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <fieldset>
            <legend className="fieldset-legend">Your Information</legend>

            <div className="form-row">
              <Field
                id="firstName"
                label="First name"
                required
                error={touched.firstName && errors.firstName}
              >
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  autoComplete="given-name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  aria-invalid={!!(touched.firstName && errors.firstName)}
                />
              </Field>

              <Field
                id="lastName"
                label="Last name"
                required
                error={touched.lastName && errors.lastName}
              >
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  autoComplete="family-name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  aria-invalid={!!(touched.lastName && errors.lastName)}
                />
              </Field>
            </div>

            <Field
              id="email"
              label="Email address"
              required
              error={touched.email && errors.email}
            >
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                autoComplete="email"
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!(touched.email && errors.email)}
              />
            </Field>

            <Field
              id="phone"
              label="Phone number"
              hint="Optional — include country code if outside the US."
              error={touched.phone && errors.phone}
            >
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                autoComplete="tel"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={[
                  'phone-hint',
                  errors.phone ? 'phone-error' : '',
                ].filter(Boolean).join(' ')}
                aria-invalid={!!(touched.phone && errors.phone)}
              />
            </Field>

            <Field
              id="seatingPreference"
              label="Seating preference"
              error={touched.seatingPreference && errors.seatingPreference}
            >
              <select
                id="seatingPreference"
                name="seatingPreference"
                value={formData.seatingPreference}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {SEATING.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field
              id="specialRequests"
              label="Special requests"
              hint="Allergies, dietary requirements, high chair, wheelchair access, etc. (max 300 characters)"
              error={touched.specialRequests && errors.specialRequests}
            >
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                rows={4}
                maxLength={300}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby="specialRequests-hint"
              />
              <p className="char-count" aria-live="polite">
                {formData.specialRequests.length}/300
              </p>
            </Field>

            {/* Booking summary */}
            <aside className="booking-summary" aria-label="Booking summary">
              <h3>Your booking</h3>
              <dl>
                <dt>Date</dt>      <dd>{formData.date}</dd>
                <dt>Time</dt>      <dd>{formData.time}</dd>
                <dt>Guests</dt>    <dd>{formData.guests}</dd>
                {formData.occasion && <><dt>Occasion</dt><dd>{formData.occasion}</dd></>}
                <dt>Seating</dt>   <dd>{formData.seatingPreference}</dd>
              </dl>
            </aside>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? 'Confirming…' : 'Confirm reservation'}
              </button>
            </div>
          </fieldset>
        )}
      </form>

      <p className="required-note">
        <span aria-hidden="true">*</span> Required fields
      </p>
    </section>
  );
}

export default BookingForm;
