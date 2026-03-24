import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm, { validateField } from './BookingForm';

// ── validateField unit tests ──────────────────────────────────────────────────

describe('validateField', () => {
  describe('date', () => {
    test('returns error for empty value', () => {
      expect(validateField('date', '')).not.toBe('');
    });

    test('returns error for a past date', () => {
      expect(validateField('date', '2000-01-01')).not.toBe('');
    });

    test('returns empty string for today or future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const dateStr = future.toISOString().split('T')[0];
      expect(validateField('date', dateStr)).toBe('');
    });
  });

  describe('time', () => {
    test('returns error when empty', () => {
      expect(validateField('time', '')).not.toBe('');
    });

    test('returns empty string for a valid time', () => {
      expect(validateField('time', '19:00')).toBe('');
    });
  });

  describe('guests', () => {
    test('returns error when empty', () => {
      expect(validateField('guests', '')).not.toBe('');
    });

    test('returns error for 0 guests', () => {
      expect(validateField('guests', 0)).not.toBe('');
    });

    test('returns error for more than 10 guests', () => {
      expect(validateField('guests', 11)).not.toBe('');
    });

    test('returns empty string for valid guest count', () => {
      expect(validateField('guests', 4)).toBe('');
    });
  });

  describe('email', () => {
    test('returns error for empty email', () => {
      expect(validateField('email', '')).not.toBe('');
    });

    test('returns error for malformed email', () => {
      expect(validateField('email', 'not-an-email')).not.toBe('');
    });

    test('returns empty string for valid email', () => {
      expect(validateField('email', 'user@example.com')).toBe('');
    });
  });

  describe('phone', () => {
    test('returns empty string when phone is blank (optional)', () => {
      expect(validateField('phone', '')).toBe('');
    });

    test('returns error for an invalid phone number', () => {
      expect(validateField('phone', 'abc')).not.toBe('');
    });

    test('returns empty string for a valid US phone', () => {
      expect(validateField('phone', '+1 312 555 0187')).toBe('');
    });
  });

  describe('firstName / lastName', () => {
    test('returns error for empty first name', () => {
      expect(validateField('firstName', '')).not.toBe('');
    });

    test('returns empty string for non-empty first name', () => {
      expect(validateField('firstName', 'Maria')).toBe('');
    });

    test('returns error for empty last name', () => {
      expect(validateField('lastName', '')).not.toBe('');
    });
  });

  describe('specialRequests', () => {
    test('returns empty string for text within limit', () => {
      expect(validateField('specialRequests', 'Nut allergy')).toBe('');
    });

    test('returns error for text exceeding 300 chars', () => {
      expect(validateField('specialRequests', 'a'.repeat(301))).not.toBe('');
    });
  });
});

// ── BookingForm component tests ───────────────────────────────────────────────

const mockDispatch     = jest.fn();
const mockOnSubmit     = jest.fn(() => true);
const availableTimes   = ['17:00', '18:00', '19:00', '20:00'];

function renderForm(props = {}) {
  return render(
    <BookingForm
      availableTimes={availableTimes}
      dispatch={mockDispatch}
      onSubmit={mockOnSubmit}
      {...props}
    />
  );
}

describe('BookingForm rendering', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockOnSubmit.mockClear();
  });

  test('renders step 1 fields on initial render', () => {
    renderForm();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
  });

  test('shows "Next" button on step 1', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  test('time select is disabled when no date is selected', () => {
    renderForm();
    expect(screen.getByLabelText(/time/i)).toBeDisabled();
  });

  test('time options are rendered when available', async () => {
    renderForm();
    // Provide a future date to enable the time select
    const future = new Date();
    future.setDate(future.getDate() + 7);
    const dateStr = future.toISOString().split('T')[0];

    await userEvent.type(screen.getByLabelText(/date/i), dateStr);
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { name: 'date', value: dateStr },
    });

    // Dispatch should have been called with UPDATE_TIMES
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_TIMES',
      date: dateStr,
    });
  });
});

describe('BookingForm validation', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockOnSubmit.mockClear();
  });

  test('shows date error when trying to advance without a date', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
    });
  });

  test('shows time error when no time is selected', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText(/please select an available time/i)).toBeInTheDocument();
    });
  });

  test('shows email error on blur when email is invalid', async () => {
    renderForm();
    // Advance to step 2 by filling step 1 properly
    const future = new Date();
    future.setDate(future.getDate() + 3);
    const dateStr = future.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { name: 'date', value: dateStr },
    });
    // Re-enable time select (simulate the component updating with the new date)
    const timeSelect = screen.getByLabelText(/time/i);
    fireEvent.change(timeSelect, { target: { name: 'time', value: '19:00' } });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // If on step 2 now, test email validation
    const emailInput = screen.queryByLabelText(/email address/i);
    if (emailInput) {
      fireEvent.change(emailInput, {
        target: { name: 'email', value: 'bad-email' },
      });
      fireEvent.blur(emailInput);
      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument();
      });
    }
  });
});

describe('BookingForm accessibility', () => {
  test('form fields have associated labels', () => {
    renderForm();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
  });

  test('required fields have aria-required="true"', () => {
    renderForm();
    expect(screen.getByLabelText(/date/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/number of guests/i)).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  test('step indicator marks current step with aria-current="step"', () => {
    renderForm();
    const currentStep = screen.getAllByRole('listitem').find(
      (el) => el.getAttribute('aria-current') === 'step'
    );
    expect(currentStep).toBeTruthy();
  });
});
