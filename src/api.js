/**
 * Simulates fetching available booking times from an API.
 * Returns a filtered list of time slots based on the given date.
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @returns {string[]} Available time slots
 */
export function fetchAPI(date) {
  const times = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  const seed = date ? new Date(date).getDate() : 0;
  return times.filter((_, i) => (i + seed) % 3 !== 0);
}

/**
 * Simulates submitting a booking to an API.
 * @param {Object} formData - The booking form data
 * @returns {boolean} true on success, false on failure
 */
export function submitAPI(formData) {
  // Simulate 95% success rate
  return Math.random() > 0.05;
}

/**
 * Reducer that manages available booking times.
 * @param {string[]} state - Current available times
 * @param {{ type: string, date?: string }} action
 * @returns {string[]} Updated available times
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
