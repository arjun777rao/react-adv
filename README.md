# Demo App (React + Redux Toolkit)

A user-management demo built with React and Redux Toolkit.  
The app fetches users from `https://dummyjson.com/users` and provides client-side:

- filtering (name/email)
- sorting (including nested fields like `address.country`)
- pagination
- light/dark theme toggle with persistence

## Tech Stack

- React (Create React App)
- Redux Toolkit + React Redux
- Sass
- Jest + React Testing Library

## Features

### 1) User Fetching with Redux Async Thunk

- Users are fetched via `fetchUsers` in `src/features/users/usersSlice.js`
- State machine: `idle -> loading -> succeeded | failed`
- Store is configured in `src/app/store.js`

### 2) User Table Interactions

Implemented in `src/components/features/UserTable/UserTable.js`:

- Search by full name or email (case-insensitive)
- Click-to-sort on all visible columns
- Nested-field sorting for country (`address.country`)
- Adjustable page size (`5, 10, 15, 20`)
- Prev/Next and direct page number navigation

### 3) Theme Context

Implemented in `src/utils/theme.js`:

- Custom `ThemeProvider` + `useTheme` hook
- Light mode and dark mode color palettes
- Theme persisted in `localStorage` under key `theme`

## Project Structure

```txt
src/
  app/
    store.js
  components/
    common/
      Header/
      Footer/
    features/
      UserTable/
  features/
    users/
      usersSlice.js
  utils/
    theme.js
  hooks/
    useSort.js
    usePagination.js
  services/
    api.js
    usersService.js
  constants/
    api.js
    ui.js
    theme.js
```

Note: some helpers under `hooks/`, `services/`, and `constants/` are present for refactor/extension and are not fully wired into the current runtime flow.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm start
```

Open `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## Testing

This project uses Jest + React Testing Library and enforces 90% coverage thresholds (configured in `jest.config.js`).

### Run Tests (watch)

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Once (CI mode)

```bash
CI=true npm test
```

### Main Test Files

- `src/App.test.js`
- `src/components/common/Header/Header.test.js`
- `src/components/common/Footer/Footer.test.js`
- `src/components/features/UserTable/UserTable.test.js`
- `src/features/users/usersSlice.test.js`
- `src/utils/theme.test.js`

## Scripts

- `npm start` - start dev server
- `npm test` - run tests
- `npm run build` - production build
- `npm run eject` - eject CRA config (irreversible)

## Future Improvements

- Wire `services/api.js` into slice thunks for centralized API calls
- Use `constants/*` and custom hooks (`useSort`, `usePagination`) directly in `UserTable`
- Implement the `Add User` button flow (form + create API + optimistic UI)
