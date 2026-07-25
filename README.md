# Kite portfolio workspace

The application has three independently deployable services:

- `Backend` — Express, MongoDB, bcrypt, and JWT API.
- `dashboard` — authenticated portfolio workspace.
- `frontend` — public marketing site and account registration page.

## Run locally

1. In `Backend`, run `npm start`.
2. In `dashboard`, run `npm start`, then create an account in the dashboard.
3. Optionally run the public site from `frontend` with `npm start` (use a different port if the dashboard is running).

Set `REACT_APP_API_URL` in either React app when the API is not available at `http://localhost:3002`.

## API

`POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me` provide JWT authentication. Authenticated users can use `GET /api/portfolio` and `POST /api/orders`; all portfolio data is scoped to the current account. Admin-only user listing is available at `GET /api/users`.
