import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingForm, { validateField } from './BookingForm';

// ── validateField unit tests ──────────────────────────────────────────────────

describe('validateField – date', () => {
  test('returns error for empty value', () => {
    expect(validateField('date', '')).not.toBe('');
  });
  test('returns error for a past date', () => {
    expect(validateField('date', '2000-01-01')).not.toBe('');
  });
  test('returns empty string for a future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    expect(validateField('date', future.toISOString().split('T')[0])).toBe('');
  });
});

describe('validateField – time', () => {
  test('returns error when empty', () => {
    expect(validateField('time', '')).not.toBe('');
  });
  test('returns empty string for a valid time', () => {
    expect(validateField('time', '19:00')).toBe('');
  });
});

describe('validateField – guests', () => {
  test('returns error when empty', () => {
    expect(validateField('guests', '')).not.toBe('');
  });
  test('returns error for 0', () => {
    expect(validateField('guests', 0)).not.toBe('');
  });
  test('returns error for > 10', () => {
    expect(validateField('guests', 11)).not.toBe('');
  });
  test('returns empty string for valid count', () => {
    expect(validateField('guests', 4)).toBe('');
  });
});

describe('validateField – email', () => {
  test('returns error for empty', () => {
    expect(validateField('email', '')).not.toBe('');
  });
  test('returns error for malformed email', () => {
    expect(validateField('email', 'not-an-email')).not.toBe('');
  });
  test('returns empty string for valid email', () => {
    expect(validateField('email', 'user@example.com')).toBe('');
  });
});

describe('validateField – phone', () => {
  test('returns empty string when blank (optional)', () => {
    expect(validateField('phone', '')).toBe('');
  });
  test('returns error for invalid phone', () => {
    expect(validateField('phone', 'abc')).not.toBe('');
  });
  test('returns empty string for valid US number', () => {
    expect(validateField('phone', '+1 312 555 0187')).toBe('');
  });
});

describe('validateField – names', () => {
  test('returns error for empty firstName', () => {
    expect(validateField('firstName', '')).not.toBe('');
  });
  test('returns empty string for non-empty firstName', () => {
    expect(validateField('firstName', 'Maria')).toBe('');
  });
  test('returns error for empty lastName', () => {
    expect(validateField('lastName', '')).not.toBe('');
  });
});

describe('validateField – specialRequests', () => {
  test('returns empty string within limit', () => {
    expect(validateField('specialRequests', 'Nut allergy')).toBe('');
  });
  test('returns error for > 300 chars', () => {
    expect(validateField('specialRequests', 'a'.repeat(301))).not.toBe('');
  });
});

// ── BookingForm rendering & validation ────────────────────────────────────────

const availableTimes = ['17:00', '18:00', '19:00', '20:00'];

function renderForm(overrides = {}) {
  const dispatch  = jest.fn();
  const onSubmit  = jest.fn(() => true);
  const { rerender } = render(
    <BookingForm
      availableTimes={availableTimes}
      dispatch={dispatch}
      onSubmit={onSubmit}
      {...overrides}
    />
  );
  return { dispatch, onSubmit, rerender };
}

describe('BookingForm rendering', () => {
  test('renders step 1 fields on load', () => {
    renderForm();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
  });

  test('time select is disabled before a date is chosen', () => {
    renderForm();
    expect(screen.getByLabelText(/time/i)).toBeDisabled();
  });

  test('available time options are rendered in the select', () => {
    renderForm();
    // Provide a date so the select is enabled
    const future = new Date();
    future.setDate(future.getDate() + 5);
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { name: 'date', value: future.toISOString().split('T')[0] },
    });
    availableTimes.forEach((t) => {
      expect(screen.getByRole('option', { name: t })).toBeInTheDocument();
    });
  });

  test('dispatches UPDATE_TIMES when date changes', () => {
    const { dispatch } = renderForm();
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const dateStr = future.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { name: 'date', value: dateStr },
    });
    expect(dispatch).toHaveBeenCalledWith({ type: 'UPDATE_TIMES', date: dateStr });
  });
});

describe('BookingForm validation', () => {
  test('shows error when trying to advance without a date', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
    });
  });

  test('shows error when no time is selected', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/please select an available time/i)).toBeInTheDocument();
    });
  });

  test('date field shows inline error on blur with empty value', async () => {
    renderForm();
    const dateInput = screen.getByLabelText(/date/i);
    fireEvent.blur(dateInput);
    await waitFor(() => {
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
    });
  });
});

describe('BookingForm accessibility', () => {
  test('required inputs have aria-required="true"', () => {
    renderForm();
    expect(screen.getByLabelText(/date/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/number of guests/i)).toHaveAttribute('aria-required', 'true');
  });

  test('step 1 has aria-current="step"', () => {
    renderForm();
    const steps = screen.getAllByRole('listitem');
    const current = steps.find((el) => el.getAttribute('aria-current') === 'step');
    expect(current).toBeTruthy();
  });
});
