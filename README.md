# Little Lemon – Table Booking App

A React web application for the **Little Lemon** restaurant that lets guests reserve a table online.

---

## Features

- **Home page** – hero section, weekly specials, customer testimonials, and an About section
- **Booking page** – two-step reservation form with real-time validation
- **Confirmation page** – booking summary displayed after a successful reservation
- **Accessibility** – ARIA labels, `aria-required`, `aria-invalid`, `aria-live`, keyboard navigation, skip-to-content link
- **Responsive design** – mobile-first CSS with a hamburger navigation menu
- **Unit tests** – 36 tests covering API utilities, form validation, and component behaviour

---

## Tech Stack

| Tool | Version |
|---|---|
| React | 19 |
| React Router DOM | 7 |
| Create React App | 5 |
| Testing Library | 16 |

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
git clone <your-repo-url>
cd lemon_table
npm install
```

### Run the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run tests

```bash
npm test -- --watchAll=false
```

### Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── api.js                       # fetchAPI / submitAPI / updateTimes reducer
├── App.js                       # Root component, routes, useReducer hook
├── App.test.js                  # Tests for API utilities and reducer
├── index.js                     # React entry point (BrowserRouter)
├── App.css / index.css          # Global design tokens, reset, fonts
├── components/
│   ├── Header.js / .css         # Sticky nav with mobile hamburger menu
│   ├── Footer.js / .css         # Links, contact info, opening hours
│   ├── BookingForm.js / .css    # Two-step validated booking form
│   └── BookingForm.test.js      # Component and validation unit tests
└── pages/
    ├── HomePage.js / .css       # Landing page
    ├── BookingPage.js / .css    # Hosts the BookingForm
    └── ConfirmationPage.js/.css # Post-booking confirmation
```

---

## Booking Form Validation

| Field | Rule |
|---|---|
| Date | Required, cannot be in the past |
| Time | Required, chosen from available slots for the date |
| Guests | Required, 1–10 (whole number) |
| First / Last name | Required |
| Email | Required, valid format |
| Phone | Optional – validated if provided |
| Special requests | Optional, max 300 characters |

---

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<address>`)
- Skip-to-content link for keyboard users
- All inputs have associated `<label>` elements
- `aria-required`, `aria-invalid`, `aria-describedby` on form controls
- Error messages use `role="alert"` and `aria-live="polite"`
- Step indicator uses `aria-current="step"`

---

## License

Built as part of the **Meta Front-End Developer Certificate** capstone on Coursera.
