import { fetchAPI, submitAPI, updateTimes } from './api';

describe('fetchAPI', () => {
  test('returns a non-empty array for a valid date', () => {
    const times = fetchAPI('2025-06-15');
    expect(Array.isArray(times)).toBe(true);
    expect(times.length).toBeGreaterThan(0);
  });

  test('returns strings in HH:MM format', () => {
    fetchAPI('2025-06-15').forEach((t) => {
      expect(t).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  test('returns a subset of the known time slots', () => {
    const all = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    fetchAPI('2025-06-15').forEach((t) => expect(all).toContain(t));
  });
});

describe('submitAPI', () => {
  test('returns a boolean', () => {
    expect(typeof submitAPI({ date: '2025-06-15', guests: 2 })).toBe('boolean');
  });
});

describe('updateTimes', () => {
  test('UPDATE_TIMES returns times for the given date', () => {
    const result = updateTimes([], { type: 'UPDATE_TIMES', date: '2025-07-04' });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('INIT_TIMES returns times based on today', () => {
    const result = updateTimes([], { type: 'INIT_TIMES' });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('unknown action returns state unchanged', () => {
    const state = ['18:00', '20:00'];
    expect(updateTimes(state, { type: 'UNKNOWN' })).toBe(state);
  });
});
