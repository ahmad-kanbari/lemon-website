import { fetchAPI, submitAPI, updateTimes } from './App';

// ── fetchAPI ──────────────────────────────────────────────────────────────────

describe('fetchAPI', () => {
  test('returns a non-empty array for a valid date', () => {
    const times = fetchAPI('2025-06-15');
    expect(Array.isArray(times)).toBe(true);
    expect(times.length).toBeGreaterThan(0);
  });

  test('returns strings in HH:MM format', () => {
    const times = fetchAPI('2025-06-15');
    times.forEach((t) => {
      expect(t).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  test('returns a subset of the known time slots', () => {
    const all = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    const times = fetchAPI('2025-06-15');
    times.forEach((t) => expect(all).toContain(t));
  });
});

// ── submitAPI ─────────────────────────────────────────────────────────────────

describe('submitAPI', () => {
  test('returns a boolean', () => {
    const result = submitAPI({ date: '2025-06-15', time: '19:00', guests: 2 });
    expect(typeof result).toBe('boolean');
  });
});

// ── updateTimes reducer ───────────────────────────────────────────────────────

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
    const result = updateTimes(state, { type: 'UNKNOWN' });
    expect(result).toBe(state);
  });
});
