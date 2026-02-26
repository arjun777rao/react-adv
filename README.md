# react-adv-repo

A React + Redux Toolkit app for browsing users with search, sorting, pagination, and theme switching.

## Features

- Fetch users from `https://dummyjson.com/users`
- Search by name or email
- Sort by table columns (including nested fields like `address.country`)
- Paginate results with selectable page size
- Light/Dark theme toggle with persistence via `localStorage`

## Tech Stack

- React (Create React App)
- Redux Toolkit + React Redux
- Sass
- Jest + React Testing Library

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

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Open `http://localhost:3000`.

### Build

```bash
npm run build
```

## Testing

```bash
npm test
```

Coverage:

```bash
npm test -- --coverage
```

CI mode:

```bash
CI=true npm test
```

## Scripts

- `npm start` - start development server
- `npm test` - run tests
- `npm run build` - create production build
- `npm run eject` - eject CRA config
